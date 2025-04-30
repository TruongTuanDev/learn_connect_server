const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");
const controllerInfor = require("../controllers/userInfor.controller");

module.exports = function(app) {
  const router = require("express").Router();

  router.post(
    "/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );

  router.post("/signin", controller.signin);
  app.post("/api/auth/signout", controller.signout);

  app.post(
    "/api/auth/updateInfor",
    controllerInfor.saveUserInfo
  );
  app.post(
    "/api/auth/updatenewInfor",
    controllerInfor.savenewUserInfo
  );

  router.post("/signout", controller.signout);

  app.use("/api/auth", router);
};

