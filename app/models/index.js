const mongoose = require('mongoose');
mongoose.Promise = global.Promise;


const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");

db.FlashcardTopic = require("./flashcardTopic.model");
db.FlashcardItem = require("./flashcardItem.model");
db.UserInfo = require("./userInfor.model");
db.message = require("./message.model");


db.ROLES = ["user","moderator","admin"];

module.exports = db;