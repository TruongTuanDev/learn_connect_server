require('dotenv').config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const cookieSession = require("cookie-session");
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const morgan = require('morgan');
const { Server } = require("socket.io");

// Configs
const dbConfig = require("./app/config/db.config");
const authConfig = require("./app/config/auth.config");

// Khởi tạo app
const app = express();
const server = http.createServer(app);

// ======================
// MIDDLEWARES
// ======================

// Bảo mật cơ bản
app.use(helmet());

// CORS Configuration
const allowedOrigins = [
  process.env.WEB_URL || 'http://localhost:8082',
  'capacitor://localhost',
  'http://localhost',
  /\.yourdomain\.com$/, // Regex cho các subdomain
  /^http:\/\/192\.168\.\d+\.\d+(:\d+)?$/ // Local network IPs
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') return origin === allowed;
      return allowed.test(origin);
    })) {
      callback(null, true);
    } else {
      console.warn(`Blocked by CORS: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100,
  message: 'Too many requests, please try again later.'
});

// Session Configuration
app.use(cookieSession({
  name: "amica-session",
  secret: authConfig.secret,
  httpOnly: true,
  sameSite: 'none',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 24 * 60 * 60 * 1000 // 24h
}));

// Logging
app.use(morgan(':date[iso] :method :url :status :response-time ms - :res[content-length]'));
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] IP: ${req.ip} | ${req.method} ${req.url}`);
  next();
});

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Timeout handling
app.use((req, res, next) => {
  req.setTimeout(10000, () => {
    res.status(503).json({ error: 'Request timeout' });
  });
  next();
});

// ======================
// DATABASE CONNECTION
// ======================
const db = require("./app/models");
const Role = db.role;

db.mongoose
  .connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
  })
  .then(() => {
    console.log("Successfully connected to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// ======================
// ROUTES
// ======================
try {
  // Auth routes with rate limiting
  app.use("/api/auth", apiLimiter, require("./app/routes/auth.routes"));
  
  // Other routes
  app.use("/api/posts", require("./app/routes/post.routes"));
  app.use("/api/likes", require("./app/routes/like_comment.routes"));
  app.use("/api/users", require("./app/routes/user.routes"));
  app.use("/api/recommend", require("./app/routes/recommend.routes"));
  app.use("/api/messages", require("./app/routes/message.routes"));
  app.use("/api/flashcards", require("./app/routes/flashcards.routes"));

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      status: "healthy",
      timestamp: new Date(),
      mobileSupport: true,
      environment: process.env.NODE_ENV || 'development'
    });
  });

  console.log("All routes registered successfully");
} catch (err) {
  console.error("Route registration failed:", err);
  process.exit(1);
}

// ======================
// SOCKET.IO CONFIG
// ======================
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000
});

const Message = db.message;
const users = {};

io.on("connection", (socket) => {
  console.log(`New connection: ${socket.id}`);

  // Real IP detection
  const ip = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address;
  console.log(`Client IP: ${ip}`);

  socket.on("join", ({ userId }) => {
    users[userId] = socket.id;
    console.log(`User ${userId} connected with socket ${socket.id}`);
    broadcastOnlineUsers();
  });

  socket.on("send-private-message", async ({ senderId, receiverId, content }) => {
    try {
      const message = new Message({
        senderId,
        receiverId,
        content,
        timestamp: new Date()
      });
      
      const savedMessage = await message.save();
      console.log(`Message saved: ${savedMessage._id}`);

      const receiverSocket = users[receiverId];
      if (receiverSocket) {
        io.to(receiverSocket).emit("receive-private-message", savedMessage);
      }
    } catch (err) {
      console.error("Message save error:", err);
    }
  });

  socket.on("disconnect", () => {
    for (const userId in users) {
      if (users[userId] === socket.id) {
        console.log(`User ${userId} disconnected`);
        delete users[userId];
        break;
      }
    }
    broadcastOnlineUsers();
  });
});

function broadcastOnlineUsers() {
  io.emit("online-users", Object.keys(users));
}

// ======================
// ERROR HANDLING
// ======================
// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.stack}`);
  res.status(500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// ======================
// INITIALIZATION
// ======================
async function initial() {
  try {
    const count = await Role.estimatedDocumentCount();
    if (count === 0) {
      await Role.insertMany([
        { name: "user" },
        { name: "moderator" },
        { name: "admin" }
      ]);
      console.log("Added default roles to database");
    }
  } catch (err) {
    console.error("Role initialization failed:", err);
  }
}

// ======================
// SERVER START
// ======================
const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || '0.0.0.0';

server.listen(PORT, HOST, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`API: http://${HOST}:${PORT}/api`);
  console.log(`WebSocket: ws://${HOST}:${PORT}`);
  console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    db.mongoose.connection.close(false, () => {
      console.log('Server closed. MongoDB connection disconnected.');
      process.exit(0);
    });
  });
});