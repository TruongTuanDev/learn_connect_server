const config = require("../config/auth.config");
const db = require("../models");
const fs = require('fs');
const path = require('path');
const UserInfo = db.UserInfo;
const User = db.user;
// let users = [
//   {
//       "_id": "651255d3c34d3c5514431071",
//       "learningGoals": ["Giao tiếp", "Xem phim không phụ đề"],
//       "interestedCountries": ["Hàn Quốc"],
//       "culturalPreferences": ["Phim ảnh", "Âm nhạc", "Thời trang"],
//       "id_user": "651255adc34d3c5514431001",
//       "username": "kpop_fan",
//       "email": "kpopfan@example.com",
//       "nativeLanguage": "Tiếng Việt",
//       "targetLanguages": { "Tiếng Hàn": "Trung cấp" },
//       "dailyTime": "30 phút",
//       "avatarUrl": "assets/images/Ava"
//   },
// ];

exports.match = async (req, res) => {
  try {
    const users = await User.find({});
    const user = await User.findOne({ username: req.body.username }).populate("roles", "-__v");
    const userInfo = await UserInfo.findOne({ id_user: user._id.toString() }).lean();

    const { userId } = user._id.toString();
    
    const options = {
        mode: 'json',
        pythonOptions: ['-u'],
        scriptPath: "../",
        args: [JSON.stringify({
            action: 'get_matches',
            userId: userId,
            users: users,
            limit: 5
        })]
    };
    
    PythonShell.run('user_matcher.py', options, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results[0]);
    });
} catch (error) {
    res.status(500).json({ error: error.message });
}
};
exports.ecanalytics = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const options = {
        mode: 'json',
        pythonOptions: ['-u'],
        scriptPath: './ml',
        args: [JSON.stringify({
            action: 'get_analytics',
            userId: userId,
            users: users
        })]
    };
    
    PythonShell.run('user_matcher.py', options, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results[0]);
    });
} catch (error) {
    res.status(500).json({ error: error.message });
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


