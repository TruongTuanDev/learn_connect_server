// models/AddFriend.js
const mongoose = require('mongoose');

const addFriendSchema = new mongoose.Schema({
  id_user: { type: String, required: true },
  id_friend: { type: String, required: true },
  name_friend: { type: String, required: true },
  avatar: { type: String },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AddFriend', addFriendSchema);
