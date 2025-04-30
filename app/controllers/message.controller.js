const mongoose = require("mongoose");
const User = require("../models/user.model");
const Message = require("../models/message.model");

exports.getMessages = async (req, res) => {
  try {
    const { senderId, receiverId } = req.query;

    if (!senderId || !receiverId) {
      return res.status(400).json({ message: "senderId và receiverId là bắt buộc" });
    }

    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (error) {
    console.error("Lỗi khi lấy tin nhắn:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.getChatList = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "userId không hợp lệ hoặc thiếu" });
    }

    const objectUserId = new mongoose.Types.ObjectId(userId);

    // Lấy tất cả user trừ chính nó
    const allUsers = await mongoose.model("User").find({ _id: { $ne: objectUserId } });

    // Lấy danh sách chat hiện tại có tin nhắn
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId: objectUserId },
            { receiverId: objectUserId }
          ]
        }
      },
      {
        $addFields: {
          conversationId: {
            $cond: [
              { $gt: ["$senderId", "$receiverId"] },
              { $concat: [{ $toString: "$senderId" }, "_", { $toString: "$receiverId" }] },
              { $concat: [{ $toString: "$receiverId" }, "_", { $toString: "$senderId" }] }
            ]
          }
        }
      },
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: "$conversationId",
          lastMessage: { $first: "$$ROOT" }
        }
      }
    ]);

    // Map từ userId còn lại và gán tin nhắn nếu có
    const chatList = allUsers.map(user => {
      const matchedMessage = messages.find(m => {
        const sender = m.lastMessage.senderId.toString();
        const receiver = m.lastMessage.receiverId.toString();
        return (sender === userId && receiver === user._id.toString()) ||
               (receiver === userId && sender === user._id.toString());
      });

      return {
        otherUserId: user._id,
        username: user.username,
        lastMessage: matchedMessage ? matchedMessage.lastMessage.content : null,
        timestamp: matchedMessage ? matchedMessage.lastMessage.timestamp : null
      };
    });

    // Sắp xếp giảm dần theo thời gian, những người chưa nhắn tin ở cuối
    chatList.sort((a, b) => {
      if (!a.timestamp) return 1;
      if (!b.timestamp) return -1;
      return new Date(b.timestamp) - new Date(a.timestamp);
    });

    res.json(chatList);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách chat:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};