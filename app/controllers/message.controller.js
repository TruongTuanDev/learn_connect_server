const mongoose = require("mongoose");
const User = require("../models/user");
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

    const chats = await Message.aggregate([
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
      },
      {
        $addFields: {
          otherUserId: {
            $cond: [
              { $eq: ["$lastMessage.senderId", objectUserId] },
              "$lastMessage.receiverId",
              "$lastMessage.senderId"
            ]
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "otherUserId",
          foreignField: "_id",
          as: "otherUser"
        }
      },
      { $unwind: "$otherUser" },
      {
        $project: {
          _id: 0,
          otherUserId: 1,
          username: "$otherUser.username",
          lastMessage: "$lastMessage.content",
          timestamp: "$lastMessage.timestamp"
        }
      },
      { $sort: { timestamp: -1 } }
    ]);

    res.json(chats);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách chat:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};