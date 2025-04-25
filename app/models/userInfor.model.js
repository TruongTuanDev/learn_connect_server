const mongoose = require("mongoose");

const UserInfoSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    fullName: { type: String },
    nickname: { type: String },
    birthDate: { type: String }, // hoặc dùng Date nếu muốn
    email: { type: String },
    phoneCode: { type: String },
    gender: { type: String }, // Nam / Nữ / Khác

    nativeLanguage: { type: String },
    targetLanguages: {
      type: Map,
      of: String // ví dụ: { en: 'basic', ko: 'advanced' }
    },
    learningGoals: [{ type: String }], // Ví dụ: ['giao tiếp', 'du học']
    dailyTime: { type: String }, // ví dụ: '30 phút mỗi ngày'
    interestedCountries: [{ type: String }], // ví dụ: ['Hàn Quốc', 'Nhật Bản']
    culturalPreferences: [{ type: String }] // ví dụ: ['ẩm thực', 'âm nhạc']
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    },
    collection: "UserInfo"
  }
);

const UserInfo = mongoose.model("UserInfo", UserInfoSchema);

module.exports = UserInfo;
