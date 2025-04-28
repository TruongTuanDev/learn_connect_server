module.exports = (app) => {
  require("./post.routes")(app);
  require("./like_comment.routes")(app);
  require("./auth.routes")(app);
  require("./user.routes")(app);
  require("./recommend.routes")(app); // Chú ý format lại đường dẫn
  require("./message.routes")(app);
  require("./flashcards.routes")(app);
};
