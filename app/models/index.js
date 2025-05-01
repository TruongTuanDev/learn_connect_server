const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;
<<<<<<< HEAD
db.user = require("./user.model"); // <-- thêm (mongoose)
=======


db.user = require("./user.model");



>>>>>>> d210c31c54bc6ebb58fcf302ae5a064f3a6bc815
db.role = require("./role.model")(mongoose);
db.like = require("./like.model");
db.comment = require("./comment.model")(mongoose);
db.message = require("./message.model");
db.UserInfo = require("./userInfor.model");

db.ROLES = ["user", "moderator", "admin"];

module.exports = db;
