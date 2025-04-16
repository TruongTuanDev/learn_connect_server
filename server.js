const express = require("express");
const http = require("http");
const cors = require("cors");
const cookieSession = require("cookie-session");

const dbConfig = require("./app/config/db.config");
const authConfig = require("./app/config/auth.config");

const app = express();
const server = http.createServer(app); // Dùng http để kết hợp với socket.io
const { Server } = require("socket.io");

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

const db = require("./app/models");
const Role = db.role;

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
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

//Message API
const messageRoutes = require("./app/routes/message.routes");
app.use("/api", messageRoutes);

// Simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the chat app!" });
});

const Message = db.message; 
// Socket.IO logic
const users = {}; // mapping: userId -> socket.id

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

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

// Start server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
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
