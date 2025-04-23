module.exports = (mongoose) => {
  const Like = mongoose.model(
    'Like',
    mongoose.Schema({
      postId: { type: String, required: true },
      count: { type: Number, default: 0 },
    })
  );
  return Like;
};