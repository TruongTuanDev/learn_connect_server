const axios = require('axios');
const AddFriendModel = require('../models/AddFriend');
console.log('AddFriendModel:', AddFriendModel);

async function getRecommendedFriends(req, res) {
  const { id_user } = req.query;

  if (!id_user) {
    return res.status(400).json({ status: 'error', message: 'Missing id_user' });
  }

  try {
    const response = await axios.get(`http://localhost:8000/recommend`, {
      params: { id_user }
    });

    if (response.data.status === 'success') {
      return res.json({ status: 'success', friends: response.data.data });
    } else {
      return res.status(500).json({ status: 'error', message: 'AI server error' });
    }
  } catch (error) {
    console.error('Error calling AI server:', error.message);
    return res.status(500).json({ status: 'error', message: 'Cannot connect to AI server' });
  }
}

async function AddFriend(req, res) {
  console.log("👉 Nhận yêu cầu thêm bạn bè:", req.body);

  const { id_user, id_friend, name_friend, avatar } = req.body;

  if (!id_user || !id_friend || !name_friend) {
    return res.status(400).json({ message: "Thiếu thông tin yêu cầu." });
  }

  try {
    const newFriend = new AddFriendModel({
      id_user,
      id_friend,
      name_friend,
      avatar
    });

    await newFriend.save();

    console.log("✅ Đã lưu thông tin kết bạn:", newFriend);

    res.status(201).json({ message: "Thêm bạn bè thành công!" });
  } catch (error) {
    console.error("❌ Lỗi khi thêm bạn bè:", error);
    res.status(500).json({ message: "Lỗi khi thêm bạn bè: " + error.message });
  }
}
async function RemoveFriend(req, res) {
  console.log("🗑️ Nhận yêu cầu xóa bạn bè:", req.body);

  const { id_user, id_friend } = req.body;

  if (!id_user || !id_friend) {
    return res.status(400).json({ message: "Thiếu thông tin để xóa bạn bè." });
  }

  try {
    const result = await AddFriendModel.findOneAndDelete({
      id_user: id_user,
      id_friend: id_friend
    });

    if (!result) {
      return res.status(404).json({ message: "Không tìm thấy kết bạn để xóa." });
    }

    console.log("✅ Đã xóa lời mời kết bạn:", result);

    res.status(200).json({ message: "Đã xóa lời mời kết bạn thành công." });
  } catch (error) {
    console.error("❌ Lỗi khi xóa bạn bè:", error);
    res.status(500).json({ message: "Lỗi khi xóa bạn bè: " + error.message });
  }
}

module.exports = {
  getRecommendedFriends,
  AddFriend,
  RemoveFriend
};

