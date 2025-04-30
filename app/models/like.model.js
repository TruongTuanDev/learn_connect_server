const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema({


  postId: { type: String, required: true },
  count: { type: Number, default: 0 },

});
const Like = mongoose.model("Like", LikeSchema);

module.exports = Like;