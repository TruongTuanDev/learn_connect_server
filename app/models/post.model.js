const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  username:   { type: String, required: true },
  timeAgo:    { type: String, required: true },
  content:    { type: String, required: true },
  avatarUrl:  { type: String },
  likes:      { type: Number, default: 0 },
  comments:   { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);
