const db = require("../models");
const Word = require("../models/Flashcard");
const FlashcardTopic = db.FlashcardTopic;
const FlashcardItem = db.FlashcardItem;
const Flashcard = db.Flashcard;
exports.getFlashcardTopics = async (req, res) => {
  console.log("👉 Yêu cầu lấy đầy đủ thông tin các chủ đề flashcard...");

  try {
    // Tìm tất cả chủ đề (không giới hạn fields nữa)
    const topics = await FlashcardTopic.find(
      { enabled: true, status: "available" } // 👈 Vẫn lọc enabled + available
    );

    if (!Array.isArray(topics) || topics.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy chủ đề nào." });
    }
    const formattedTopics = topics.map(topic => ({
      id: topic._id,
      enabled: topic.enabled,
      status: topic.status,
      title: topic.title,
      description: topic.description,
      language: topic.language,
      created_at: topic.created_at,
      updated_at: topic.updated_at
    }));
    

    console.log("✅ Danh sách đầy đủ chủ đề:", topics);

    res.status(200).json(topics);

  } catch (err) {
    console.error("❌ Lỗi khi lấy chủ đề:", err);
    res.status(500).json({ message: "Lỗi khi lấy chủ đề: " + err.message });
  }
};
// POST /api/flashcards/save
exports.saveFlashcards = async (req, res) => { 
try {
    const { userId, response } = req.body;

    const newRes = new Word({ userId, response });
    await newRes.save();
    res.status(200).json(newRes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving flashcards' });
  }
}
exports.getWordById = async (req, res) => {
   const { userId } = req.params;
  console.log("👉 Yêu cầu lấy từ mới nhất của người dùng:", userId);
   try {
    const latestWord = await Word.find({ userId: userId }).sort({ createdAt: -1 }).limit(1);
    console.log("👉 Từ cuối :", latestWord);

    res.json(latestWord);
  } catch (error) {
    console.log("👉 Lỗi tele :", error);

    res.status(500).json({ message: 'Error fetching words', error });
  }
}


exports.getFlashcardsByTopicId = async (req, res) => {
  const { topicId } = req.params;

  console.log("👉 Yêu cầu lấy flashcard trong chủ đề:", topicId);

  try {
    // Tìm tất cả flashcard có topicId được yêu cầu
    const flashcards = await FlashcardItem.find({ topicId });

    if (!Array.isArray(flashcards) || flashcards.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy flashcard nào trong chủ đề này." });
    }

    // Định dạng lại nếu cần (ở đây giữ nguyên full object)
    const formattedFlashcards = flashcards.map(card => ({
      id: card._id,
      word: card.word,
      type: card.type,
      phonetic: card.phonetic,
      definition: card.definition,
      example_en: card.example_en,
      example_vi: card.example_vi,
      audioUrl: card.audioUrl
    }));

    console.log("✅ Danh sách flashcards:", formattedFlashcards);

    res.status(200).json(formattedFlashcards);

  } catch (err) {
    console.error("❌ Lỗi khi lấy flashcards:", err);
    res.status(500).json({ message: "Lỗi khi lấy flashcards: " + err.message });
  }
};
