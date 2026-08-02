const express = require("express");

const router = express.Router();

// Controllers
const {
  getUsers,
  registerUser,
  loginUser,
  getProfile,
  getCurrentUser
} = require("../controllers/userController");

// Middleware
const protect = require("../middleware/authMiddleware");

// Routes
router.get("/", getUsers);

router.post("/register", registerUser);

router.post("/login", loginUser);

// Protected Route
router.get("/profile", protect, getProfile);

router.get("/me", protect, getCurrentUser);

module.exports = router;