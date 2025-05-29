const mongoose = require('mongoose');

const WordSchema = new mongoose.Schema({
  userId: String,
  response: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Word = mongoose.model("Word", WordSchema);

module.exports = Word;

