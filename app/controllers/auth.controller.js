const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

const UserInfor = db.UserInfo
const addfriend = db.addfriend
console.log("DB loaded:", Object.keys(db));


var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const UserInfo = db.UserInfo; // Đảm bảo rằng bạn đã import đúng mô hình UserInfo từ db

exports.signup = async (req, res) => {
  console.log("signup ok nha");
  try {
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    console.log("user đó là", String(newUser.username));
    await newUser.save();

    if (req.body.roles && req.body.roles.length > 0) {
      
      const roles = await Role.find({ name: { $in: req.body.roles } });
    
      newUser.roles = roles.map(role => role._id);
    } else {
      
      const defaultRole = await Role.findOne({ name: "user" });
      newUser.roles = [defaultRole._id];
    }

    await newUser.save();
    res.send({ message: "User was registered successfully!", username: req.body.username,
      id_user: newUser._id,});
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.signin = async (req, res) => {
  console.log("Dữ liệu nhận được từ client:", req.body.username);

  try {
    // Tìm user trong collection User
    const user = await User.findOne({ username: req.body.username }).populate("roles", "-__v");

    if (!user) {
      return res.status(404).json({ message: "User Not found." + req.body.username });
    }

    // Kiểm tra mật khẩu
    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({ message: "Invalid Password!" });
    }

    // Tạo token
    const token = jwt.sign({ id: user.id }, config.secret, { expiresIn: 86400 });

    const authorities = user.roles.map(role => "ROLE_" + role.name.toUpperCase());

//     const userInfor = await UserInfor.findOne({ id_user: user._id }); // Hoặc user.id nếu bạn dùng _id là ObjectId
//     if (!userInfor) {
//       return res.status(404).json({ message: "UserInfor not found for user_id: " + user._id });
//     }
//     res.status(200).json({
//       user: {
//         id: user._id,
//         username: user.username,
//         email: user.email,
//       },
//       roles: authorities,
//       accessToken: token,
//       userInfor: {
//         fullName: userInfor.fullName || 'Chưa cập nhật',
//         nickname: userInfor.nickname || 'Chưa cập nhật',
//         birthDate: userInfor.birthDate || 'Chưa cập nhật',
//         email: userInfor.email,
//         phoneCode: userInfor.phoneCode || 'Chưa cập nhật',
//         gender: userInfor.gender || 'Khác',
//         nativeLanguage: userInfor.nativeLanguage,
//         targetLanguages: userInfor.targetLanguages,
//         learningGoals: userInfor.learningGoals,
//         dailyTime: userInfor.dailyTime,
//         interestedCountries: userInfor.interestedCountries,
//         culturalPreferences: userInfor.culturalPreferences
//       }
//     });

    // Tìm thông tin user trong collection UserInfo
    const userInfo = await UserInfo.findOne({ id_user: user._id.toString() }).lean();

    if (!userInfo) {
      return res.status(404).json({ message: "User info not found" });
    }
// Lấy danh sách bạn bè đã thêm
    
    const addFriends = await addfriend.find({ id_friend: user._id.toString() });
    console.log("Danh sách bạn bè lấy được:", addFriends);
     if (!addFriends) {
      return res.status(404).json({ message: "User info not found" });
    }
    
   
    // Logic tìm kiếm người dùng phù hợp linh hoạt
    let matchedUsers = [];
    if (userInfo.nativeLanguage && userInfo.targetLanguages) {
      // Lấy danh sách ngôn ngữ mục tiêu của người dùng hiện tại
      
      const targetLanguages = Object.keys(userInfo.targetLanguages);
      console.log("Những thằng có mục tiêu học ", targetLanguages);
      if (targetLanguages.length > 0) {
        // Tìm người dùng có:
        // - nativeLanguage là một trong các ngôn ngữ mục tiêu của người dùng hiện tại
        // - targetLanguages chứa nativeLanguage của người dùng hiện tại
        matchedUsers = await UserInfo.find({
          'nativeLanguage': { $in: targetLanguages },
          [`targetLanguages.${userInfo.nativeLanguage}`]: { $exists: true },
          id_user: { $ne: user._id.toString() } // Loại trừ bản thân
        }).limit(10); // Giới hạn số lượng kết quả
      }
    }
    console.log("Nói tiếng chi ", userInfo.nativeLanguage);
    console.log("Học tiếng chi ", userInfo.targetLanguages);
    console.log("matchedLanguagePartners ", matchedUsers);
    // Kết hợp thông tin trả về
    const responseData = {
      id: user._id,
      username: user.username,
      email: user.email,
      roles: authorities,
      accessToken: token,
      userInfo: userInfo,
      matchedLanguagePartners: matchedUsers,
      addFriends: addFriends
    };
    
    res.status(200).json(responseData);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({ message: "You've been signed out!" });
  } catch (err) {
    this.next(err);
  }
};
