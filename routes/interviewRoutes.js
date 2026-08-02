const express = require("express");
const router = express.Router();

const {
  createInterview,
  getInterviews,
  getInterviewById,
  submitInterview,
  deleteInterview,
} = require("../controllers/interviewController");

const protect = require("../middleware/authMiddleware");

router.post("/", protect, createInterview);
router.get("/", protect, getInterviews);
router.get("/:id", protect, getInterviewById);
router.post("/:id/submit", protect, submitInterview);
router.delete("/:id", protect, deleteInterview);

module.exports = router;