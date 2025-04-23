const mongoose = require("mongoose");

const FlashcardItemSchema = new mongoose.Schema(
  {
    topicId: { type: String, required: true }, // ID của chủ đề
    word: { type: String, required: true },
    type: { type: String }, // noun, verb, etc.
    phonetic: { type: String },
    definition: { type: String },
    example_en: { type: String },
    example_vi: { type: String },
    audioUrl: { type: String }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    },
    collection: "FlashcardItem"
  }
);

const FlashcardItem = mongoose.model("FlashcardItem", FlashcardItemSchema);

module.exports = FlashcardItem;
