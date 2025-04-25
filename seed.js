/*const mongoose = require("mongoose");

// Kết nối database
mongoose.connect("mongodb://root:root@localhost:27017/learn_connect_server?authSource=admin", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ Đã kết nối MongoDB"))
  .catch((err) => console.error("❌ Lỗi kết nối MongoDB:", err));

// Khai báo schema User & Message
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String
});

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);
const Message = mongoose.model("Message", messageSchema);

async function seed() {
  try {
    await User.deleteMany({});
    await Message.deleteMany({});

    const [alice, bob, charlie] = await User.insertMany([
      { username: "alice", email: "alice@example.com", password: "123" },
      { username: "bob", email: "bob@example.com", password: "123" },
      { username: "charlie", email: "charlie@example.com", password: "123" }
    ]);

    const messages = [
      {
        senderId: alice._id,
        receiverId: bob._id,
        content: "Hi Bob!",
        timestamp: new Date("2025-04-24T10:00:00Z")
      },
      {
        senderId: bob._id,
        receiverId: alice._id,
        content: "Hello Alice!",
        timestamp: new Date("2025-04-24T10:01:00Z")
      },
      {
        senderId: alice._id,
        receiverId: charlie._id,
        content: "Hey Charlie!",
        timestamp: new Date("2025-04-24T11:00:00Z")
      },
      {
        senderId: charlie._id,
        receiverId: alice._id,
        content: "Yo Alice!",
        timestamp: new Date("2025-04-24T11:05:00Z")
      },
      {
        senderId: bob._id,
        receiverId: charlie._id,
        content: "What's up Charlie?",
        timestamp: new Date("2025-04-24T12:00:00Z")
      }
    ];

    await Message.insertMany(messages);

    console.log("🎉 Seed thành công!");
    console.log("🔑 userId của alice:", alice._id.toString());
    console.log("🔑 userId của bob:", bob._id.toString());
    console.log("🔑 userId của charlie:", charlie._id.toString());
  } catch (error) {
    console.error("❌ Seed lỗi:", error);
  } finally {
    mongoose.disconnect();
  }
}

seed();
*/