const express = require("express");
const http = require("http");
const cors = require("cors");
const cookieSession = require("cookie-session");

const dbConfig = require("./app/config/db.config");
const authConfig = require("./app/config/auth.config");

const app = express();
const server = http.createServer(app); // Dùng http để kết hợp với socket.io
const { Server } = require("socket.io");

<<<<<<< HEAD
const corsOptions = {
  origin: function (origin, callback) {
    console.log("CORS origin:", origin);
    callback(null, true); // Cho phép tất cả origin trong môi trường dev
  },
  methods: ['GET', 'POST'],
=======
const io = new Server(server, {
  cors: {
    origin: "*", // địa chỉ frontend (sửa nếu khác)
    methods: ["GET", "POST"],
    credentials: true
  }
});

var corsOptions = {

  origin: "*",
  methods: ["GET", "POST"],
>>>>>>> 8909dd63ecf3cc3669bc2bb6cdd03b2feaddf418
  credentials: true,
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

// Middleware để log tất cả các yêu cầu
app.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  next();
});

const db = require("./app/models");
const Role = db.role;

// Kết nối MongoDB
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

<<<<<<< HEAD
=======
// Routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

//Message API
const messageRoutes = require("./app/routes/message.routes");
app.use("/api", messageRoutes);

>>>>>>> 8909dd63ecf3cc3669bc2bb6cdd03b2feaddf418
// Simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the chat app!" });
});

<<<<<<< HEAD
// Routes
try {
  require("./app/routes/post.routes")(app);
  console.log("Post routes registered");
} catch (err) {
  console.error("Error registering post routes:", err);
}

try {
  require("./app/routes/like_comment.routes")(app);
  console.log("Like/Comment routes registered");
} catch (err) {
  console.error("Error registering like_comment routes:", err);
}

try {
  require("./app/routes/auth.routes")(app);
  console.log("Auth routes registered");
} catch (err) {
  console.error("Error registering auth routes:", err);
}

try {
  require("./app/routes/user.routes")(app);
  console.log("User routes registered");
} catch (err) {
  console.error("Error registering user routes:", err);
}

// Hàm để hiển thị tất cả các route
const displayRoutes = (app) => {
  const routes = [];

  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods).join(", ").toUpperCase(),
      });
    } else if (middleware.name === 'router' && middleware.handle.stack) {
      let basePath = middleware.regexp
        .toString()
        .replace('/^\\', '')
        .replace('\\/?(?=\\/|$)/i', '')
        .replace(/^\//, '')
        .replace(/\/$/, '');

      // Không thêm /api/ vào trước, vì basePath đã chứa /api
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          const path = `/${basePath}${handler.route.path === '/' ? '' : handler.route.path}`;
          routes.push({
            path: path.replace(/\/\//g, '/'), // Loại bỏ các dấu // dư thừa
            methods: Object.keys(handler.route.methods).join(", ").toUpperCase(),
          });
        }
      });
    }
  });

  return routes;
};

// Set port, listen for requests
=======
const Message = db.message; 
// Socket.IO logic
const users = {}; // mapping: userId -> socket.id

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

require('./app/routes/flashcards.routes')(app);
// set port, listen for requests
>>>>>>> 8909dd63ecf3cc3669bc2bb6cdd03b2feaddf418
const PORT = process.env.PORT || 8080;
console.log("Routes registered:");
console.log(displayRoutes(app));
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
require("./app/routes/post.routes")(app);


  // Đăng ký khi user kết nối (server nhận được thông tin userId)
  socket.on("join", ({ userId }) => {
    users[userId] = socket.id;
    console.log(`User ${userId} registered with socket ${socket.id}`);
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
  });
});

<<<<<<< HEAD
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
=======

});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({ name: "user" }).save();
      new Role({ name: "moderator" }).save();
      new Role({ name: "admin" }).save();
    }
  });
}
>>>>>>> 8909dd63ecf3cc3669bc2bb6cdd03b2feaddf418
