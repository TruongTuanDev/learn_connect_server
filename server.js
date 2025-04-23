const express = require("express");
const http = require("http");
const cors = require("cors");
const cookieSession = require("cookie-session");

const dbConfig = require("./app/config/db.config");
const authConfig = require("./app/config/auth.config");

const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST"],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "amica-session",
    secret: authConfig.secret,
    httpOnly: true,
  })
);

// Middleware để log yêu cầu
app.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  next();
});

const db = require("./app/models");
const Role = db.role;

// MongoDB connection
db.mongoose
  .connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

// Routes
try {
  require("./app/routes/post.routes")(app);
  require("./app/routes/like_comment.routes")(app);
  require("./app/routes/auth.routes")(app);
  require("./app/routes/user.routes")(app);
  require("./app/routes/message.routes")(app);
  require("./app/routes/flashcards.routes")(app);
  console.log("Routes registered");
} catch (err) {
  console.error("Error registering routes:", err);
}

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the chat app!" });
});

// Display registered routes
const displayRoutes = (app) => {
  const routes = [];
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods).join(", ").toUpperCase(),
      });
    } else if (middleware.name === 'router' && middleware.handle.stack) {
      let basePath = middleware.regexp.toString()
        .replace('/^\\', '')
        .replace('\\/?(?=\\/|$)/i', '')
        .replace(/^\//, '')
        .replace(/\/$/, '');
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          const path = `/${basePath}${handler.route.path === '/' ? '' : handler.route.path}`;
          routes.push({
            path: path.replace(/\/\//g, '/'),
            methods: Object.keys(handler.route.methods).join(", ").toUpperCase(),
          });
        }
      });
    }
  });
  return routes;
};

console.log("Routes:");
console.log(displayRoutes(app));

// Socket.IO logic
const users = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", ({ userId }) => {
    users[userId] = socket.id;
    console.log(`User ${userId} registered with socket ${socket.id}`);
  });

  // Thêm các sự kiện khác như: "send-message", "disconnect", v.v.
});

// Start server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
