const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    jobRole: {
      type: String,
      required: true,
    },

    experience: {
      type: String,
      required: true,
    },

    difficulty: {
      type: String,
      default: "Mid-Level",
    },

    interviewType: {
      type: String,
      default: "Technical",
    },

    techStack: {
      type: [String],
      required: true,
    },

    numberOfQuestions: {
      type: Number,
      default: 5,
    },

    questions: [
      {
        question: {
          type: String,
          required: true,
        },
        category: {
          type: String,
          default: "General Technical",
        },
        hints: {
          type: String,
          default: "",
        },
        expectedConcepts: {
          type: [String],
          default: [],
        },
      },
    ],

    submission: {
      userAnswers: {
        type: Map,
        of: String,
        default: {},
      },
      evaluation: {
        overallScore: { type: Number, default: 0 },
        technicalScore: { type: Number, default: 0 },
        communicationScore: { type: Number, default: 0 },
        summary: { type: String, default: "" },
        strengths: [{ type: String }],
        improvements: [{ type: String }],
        questionEvaluations: [
          {
            questionIndex: { type: Number },
            score: { type: Number },
            feedback: { type: String },
            keyMissingConcepts: [{ type: String }],
            modelAnswer: { type: String },
          },
        ],
      },
      status: {
        type: String,
        enum: ["pending", "completed"],
        default: "pending",
      },
      completedAt: {
        type: Date,
      },
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Interview", interviewSchema);