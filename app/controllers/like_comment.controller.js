const db = require("../models");
const Like = db.like;
const Comment = db.comment;

exports.likePost = async (req, res) => {
  const { postId } = req.params;
  const { action } = req.body;

  if (!postId) {
    return res.status(400).json({ message: "postId is required" });
  }

  if (!action || !["like", "unlike"].includes(action)) {
    return res.status(400).json({ message: "action must be 'like' or 'unlike'" });
  }

  try {
    const update = action === "like" ? { $inc: { count: 1 } } : { $inc: { count: -1 } };
    const like = await Like.findOneAndUpdate(
      { postId },
      update,
      { new: true, upsert: true }
    );

    if (like.count < 0) {
      await Like.updateOne({ postId }, { count: 0 });
      like.count = 0;
    }

    console.log(`Updated like for postId: ${postId}, action: ${action}, count: ${like.count}`);
    res.status(200).json({ message: action === "like" ? "Liked!" : "Unliked!", likeCount: like.count });
  } catch (err) {
    console.error("Error updating like:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.getLikeStatus = async (req, res) => {
  const { postId } = req.params;

  if (!postId) {
    return res.status(400).json({ message: "postId is required" });
  }

  try {
    const like = await Like.findOne({ postId });
    const likeCount = like ? like.count : 0;
    console.log(`Fetched like status for postId: ${postId}, count: ${likeCount}`);
    res.status(200).json({ likeCount });
  } catch (err) {
    console.error("Error fetching like status:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.addComment = async (req, res) => {
  const { postId } = req.params;
  const { username, content } = req.body;

  if (!postId || !username || !content) {
    return res.status(400).json({ message: "postId, username, and content are required" });
  }

  try {
    const newComment = new Comment({ postId, username, content });
    await newComment.save();
    console.log(`Saved comment to database for postId: ${postId}, comment: ${content}`);
    res.status(201).json(newComment);
  } catch (err) {
    console.error("Error saving comment:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.getComments = async (req, res) => {
  const { postId } = req.params;

  if (!postId) {
    return res.status(400).json({ message: "postId is required" });
  }

  try {
    const comments = await Comment.find({ postId }).sort({ time: -1 });
    console.log(`Fetched comments for postId: ${postId}, count: ${comments.length}`);
    res.status(200).json(comments);
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ message: err.message });
  }
};