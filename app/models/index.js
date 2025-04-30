const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;
db.user = require("./user"); // <-- thêm (mongoose)
db.role = require("./role.model")(mongoose);
db.like = require("./like.model");
db.comment = require("./comment.model")(mongoose);
db.message = require("./message.model");
db.UserInfo = require("./userInfor.model");

db.ROLES = ["user", "moderator", "admin"];

module.exports = db;
