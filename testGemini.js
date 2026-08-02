require("dotenv").config();

const {
  generateInterviewQuestions,
} = require("./services/geminiService");

async function test() {
  const result = await generateInterviewQuestions(
    "MERN Developer",
    "Fresher",
    "React, Node.js, MongoDB",
    5
  );

  console.log(result);
}

test();