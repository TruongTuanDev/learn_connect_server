const { authJwt } = require("../middlewares");
const controller = require("../controllers/flashcards.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept, Authorization"
    );
    next();
  });

  // Yêu cầu phải có token mới gọi được API này
  app.get(
    "/api/flashcard/topics",
    controller.getFlashcardTopics
  );
  app.get(
    "/api/flashcard/topics/:topicId/items",
    controller.getFlashcardsByTopicId
  );
   app.get(
    "/api/words/:userId",
    controller.getWordById
  );
  // POST /api/flashcards/save
   app.post(
    "/api/flashcards/save",
    controller.saveFlashcards
  );
};
