const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  console.log("signup ok nha");
  try {
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    console.log("user đó là", String(user.username));
    await user.save();

    if (req.body.roles && req.body.roles.length > 0) {
      
      const roles = await Role.find({ name: { $in: req.body.roles } });
  
    
      user.roles = roles.map(role => role._id);
    } else {
      
      const defaultRole = await Role.findOne({ name: "user" });
      user.roles = [defaultRole._id];
    }

    await user.save();
    res.send({ message: "User was registered successfully!", username: req.body.username,
      id_user: user._id,});
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.signin = async (req, res) => {
  console.log("Dữ liệu nhận được từ client:", req.body.username); 
  console.log("Dữ liệu nhận được từ client2:", req.body.user); 

  try {
    const user = await User.findOne({ username: req.body.username }).populate("roles", "-__v");

    if (!user) {
      return res.status(404).json({ message: "User Not found ."+req.body.username });
    }

    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({ message: "Invalid Password!" });
    }

    const token = jwt.sign({ id: user.id }, config.secret, { expiresIn: 86400 });

    const authorities = user.roles.map(role => "ROLE_" + role.name.toUpperCase());
 
    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      roles: authorities,
      accessToken: token,
    });

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
