const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// GET USERS CONTROLLER
const getUsers = (req, res) => {
  res.json({
    success: true,
    message: "Users API working from Controller"
  });
};

// REGISTER USER
const registerUser = async (req, res) => {
  try {
    // Get data from request body
    const { name, email, password } = req.body;

    // Check if email already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }
    

// Hash Password
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);

// Create User
const user = await User.create({
  name,
  email,
  password: hashedPassword
});

res.status(201).json({
  success: true,
  message: "User Registered Successfully"
});

    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// LOGIN USER
const loginUser = async (req, res) => {
  try {

    const { email, password } = req.body;

    // Check user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email"
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password"
      });
    }

    // Generate JWT Token
const token = jwt.sign(
  {
    id: user._id
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "7d"
  }
);

res.status(200).json({
  success: true,
  message: "Login Successful",
  token
});

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};  

// USER PROFILE
const getProfile = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Protected Profile Access",
    user: req.user
  });
};
// GET CURRENT USER
const getCurrentUser = async (req, res) => {
  try {

    const user = await User.findById(req.user).select("-password");

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
module.exports = {
  getUsers,
  registerUser,
  loginUser,
  getProfile,
  getCurrentUser
};