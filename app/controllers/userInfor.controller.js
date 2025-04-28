const config = require("../config/auth.config");
const db = require("../models");
const fs = require('fs');
const path = require('path');
const UserInfo = db.UserInfo;

exports.saveUserInfo = async (req, res) => {
  try {
    const {
      id_user,
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

    if (!nativeLanguage) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: fullName or nativeLanguage."
      });
    }

    // Gọi lưu file CSV trước khi lưu database
    appendToCSV({
      id_user,
      username,
      nativeLanguage,
      targetLanguages,
      learningGoals,
      dailyTime,
      interestedCountries,
      culturalPreferences
    });

    const newUser = new UserInfo({
      id_user,
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
    console.error("Error while saving user info: ", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

const appendToCSV = (userData) => {
  const dirPath = path.join(__dirname, '../dataset');
  const csvFilePath = path.join(dirPath, 'users_dataset.csv');
  
  // Nếu folder chưa có thì tạo
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }

  const headers = [
    "id_user",
    "username",
    "nativeLanguage",
    "targetLanguages",
    "learningGoals",
    "dailyTime",
    "interestedCountries",
    "culturalPreferences"
  ];

  const values = [
    userData.id_user || '',
    userData.username || '',
    userData.nativeLanguage || '',
    Object.entries(userData.targetLanguages).map(entry => `${entry[0]}:${entry[1]}`).join('|'),
    userData.learningGoals || '',
    userData.dailyTime || '',
    Array.isArray(userData.interestedCountries) ? userData.interestedCountries.join('|') : '',
    Array.isArray(userData.culturalPreferences) ? userData.culturalPreferences.join('|') : ''
  ];

  const line = values.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',') + '\n';

  const fileExists = fs.existsSync(csvFilePath);

  if (!fileExists) {
    const headerLine = headers.join(',') + '\n';
    fs.writeFileSync(csvFilePath, headerLine, 'utf8');
  }

  fs.appendFileSync(csvFilePath, line, 'utf8');
};
