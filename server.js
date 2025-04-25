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
 
  //Message API
  const messageRoutes = require("./app/routes/message.routes");
  app.use("/api", messageRoutes);

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
const Message = db.message; 
const users = {};

io.on("connection", (socket) => {
console.log("User connected:", socket.id);

  socket.on("join", ({ userId }) => {
    users[userId] = socket.id;
    console.log(`User ${userId} registered with socket ${socket.id}`);
    broadcastOnlineUsers();
  });
  // Nhận sự kiện gửi tin nhắn riêng từ client
  socket.on("send-private-message", async({ senderId, receiverId, content }) => {
    const message = {
      senderId,
      receiverId,
      content,
      timestamp: new Date(),
    };

    try {
      const savedMessage = await new Message(message).save();
      console.log("Message saved:", savedMessage);
    } catch (err) {
      console.error("Error saving message:", err);
    }

    console.log(`Forwarding private message from ${senderId} to ${receiverId}:`, message);
    const receiverSocket = users[receiverId];
    if (receiverSocket) {
      // Gửi tin nhắn chỉ đến socket của người nhận
      io.to(receiverSocket).emit("receive-private-message", message);
    } else {
      console.log(`User ${receiverId} is not online.`);
    }
  });

  // Khi mất kết nối, xoá user khỏi mapping
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    for (const userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
        break;
      }
    }
    broadcastOnlineUsers();
  });
  // Thêm các sự kiện khác như: "send-message", "disconnect", v.v.
});
function broadcastOnlineUsers() {
  const onlineUserIds = Object.keys(users); // users là mapping: { userId: socketId }
  io.emit("online-users", onlineUserIds);
}


// Start server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
async function initial() {
  try {
    if (typeof Role.countDocuments !== 'function') {
      throw new Error("Role is not a valid Mongoose model. Check role.model.js and index.js");
    }

    const count = await Role.countDocuments();
    if (count === 0) {
      await new Role({ name: "user" }).save();
      console.log("added 'user' to roles collection");

      await new Role({ name: "moderator" }).save();
      console.log("added 'moderator' to roles collection");

      await new Role({ name: "admin" }).save();
      console.log("added 'admin' to roles collection");
    } else {
      console.log("Roles already exist in the collection");
    }
  } catch (err) {
    console.error("Error in initial function:", err);
  }
}