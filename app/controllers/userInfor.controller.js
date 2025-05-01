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
      culturalPreferences,
      imageBytes
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
      culturalPreferences,
      imageBytes
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
exports.savenewUserInfo = async (req, res) => {
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
      culturalPreferences,
      imageBytes
    } = req.body;

    if (!id_user) {
      return res.status(400).json({
        success: false,
        message: "Missing required field: id_user"
      });
    }

    // Tìm người dùng theo id_user
    const user = await UserInfo.findOne({ id_user });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Cập nhật thông tin
    user.username = username || user.username;
    user.fullName = fullName || user.fullName;
    user.nickname = nickname || user.nickname;
    user.birthDate = birthDate || user.birthDate;
    user.email = email || user.email;
    user.phoneCode = phoneCode || user.phoneCode;
    user.gender = gender || user.gender;
    user.nativeLanguage = nativeLanguage || user.nativeLanguage;
    user.targetLanguages = targetLanguages || user.targetLanguages;
    user.learningGoals = learningGoals || user.learningGoals;
    user.dailyTime = dailyTime || user.dailyTime;
    user.interestedCountries = interestedCountries || user.interestedCountries;
    user.culturalPreferences = culturalPreferences || user.culturalPreferences;
    user.imageBytes = imageBytes || user.imageBytes;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "User info updated successfully.",
      user: updatedUser
    });
  } catch (error) {
    console.error("Error while updating user info: ", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

