const config = require("../config/auth.config");
const db = require("../models");
const UserInfo = db.UserInfo;

exports.saveUserInfo = async (req, res) => {
  try {
    const {
      username,
      fullName,
      nickname,
      birthDate,
      email,
      phoneCode,
      gender,
      nativeLanguage,
      targetLanguages,
      learningGoals,
      dailyTime,
      interestedCountries,
      culturalPreferences
    } = req.body;

    if (!fullName || !nativeLanguage) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: fullName or nativeLanguage."
      });
    }

    const newUser = new UserInfo({
      username,
      fullName,
      nickname,
      birthDate,
      email,
      phoneCode,
      gender,
      nativeLanguage,
      targetLanguages,
      learningGoals,
      dailyTime,
      interestedCountries,
      culturalPreferences
    });

    const savedUser = await newUser.save();

    res.status(200).json({
      success: true,
      message: "User info saved successfully.",
      user: savedUser
    });
  } catch (error) {
    console.error("Error while saving user info: ", error); // Log thêm chi tiết lỗi
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};
