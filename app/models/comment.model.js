module.exports = (mongoose) => {
  const Comment = mongoose.model(
    'Comment',
    mongoose.Schema({
      postId: { type: String, required: true },
      username: { type: String, required: true },
      content: { type: String, required: true },
      time: { type: Date, default: Date.now },
    })
  );
  return Comment;
};