const mongoose = require("mongoose");

const FlashcardTopicSchema = new mongoose.Schema(
  {
    enabled: { type: Boolean, default: true },
    status: { type: String, default: "available" },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    language: { type: String, default: "Korean" }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    },
    collection: "FlashcardTopic" // 👈 Vẫn giữ đúng collection này
  }
);

const FlashcardTopic = mongoose.model("FlashcardTopic", FlashcardTopicSchema);

module.exports = FlashcardTopic;
