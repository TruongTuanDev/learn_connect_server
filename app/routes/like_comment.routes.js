module.exports = (app) => {
  const like_comment = require("../controllers/like_comment.controller.js");

  var router = require("express").Router();

  router.post("/like/:postId", like_comment.likePost);
  router.get("/like/:postId", like_comment.getLikeStatus); // Thêm route để lấy trạng thái Like
  router.post("/comment/:postId", like_comment.addComment);
  router.get("/comment/:postId", like_comment.getComments);

  app.use("/api", router);
};