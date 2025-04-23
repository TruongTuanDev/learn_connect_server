const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  const router = require("express").Router();

  router.get("/all", controller.allAccess);

  router.get("/user", [authJwt.verifyToken], controller.userBoard);

  router.get(
    "/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  router.get(
    "/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );

  app.use("/api/test", router);
};