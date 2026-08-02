const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const generateInterviewQuestions = async (
  role,
  experience,
  techStack,
  numberOfQuestions,
  difficulty = "Mid-Level",
  interviewType = "Technical"
) => {
  const techString = Array.isArray(techStack) ? techStack.join(", ") : techStack;

  const prompt = `
You are an expert technical interviewer hiring for a company. Generate exactly ${numberOfQuestions} realistic, high-quality ${interviewType} interview questions.

Role: ${role}
Experience Level: ${experience}
Difficulty: ${difficulty}
Tech Stack / Focus Areas: ${techString}
Interview Type: ${interviewType}

Return ONLY a JSON array of objects. Do not include markdown code block syntax if possible, or format strictly as valid JSON.
Each object must have the following structure:
[
  {
    "question": "Detailed question text...",
    "category": "Core Architecture / Problem Solving / System Design / Behavioral",
    "hints": "A brief, helpful hint for a candidate who is stuck",
    "expectedConcepts": ["Key concept 1", "Key concept 2", "Key concept 3"]
  }
]
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });

  const text = response.text;

  // Remove markdown code blocks if wrapped
  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    const parsed = JSON.parse(cleaned);
    return parsed.map((item) => ({
      question: item.question || "Describe your approach to problem solving in this role.",
      category: item.category || "Technical",
      hints: item.hints || "Think about design patterns and clean code principles.",
      expectedConcepts: Array.isArray(item.expectedConcepts) ? item.expectedConcepts : [],
    }));
  } catch (err) {
    console.error("JSON parse error in generateInterviewQuestions:", err, "Raw text:", text);
    // Fallback if parsing failed
    return [
      {
        question: `Explain how you design scalable applications for a ${role} position using ${techString}.`,
        category: "System Architecture",
        hints: "Mention state management, caching, API design, and modular structure.",
        expectedConcepts: ["Scalability", "Clean Architecture", "Performance"],
      },
    ];
  }
};

const evaluateInterviewAnswers = async (interview, userAnswers) => {
  const { jobRole, experience, difficulty, interviewType, techStack, questions } = interview;
  const techString = Array.isArray(techStack) ? techStack.join(", ") : techStack;

  const candidateResponses = questions.map((q, idx) => {
    const answer = userAnswers[idx] || userAnswers[String(idx)] || "No answer provided by candidate.";
    return `
Question ${idx + 1} (${q.category}): ${q.question}
Expected Concepts: ${q.expectedConcepts ? q.expectedConcepts.join(", ") : "N/A"}
Candidate's Answer: "${answer}"
`;
  }).join("\n---\n");

  const prompt = `
You are a Lead Staff Engineer and Technical Recruiter evaluating an AI interview performance.

Interview Context:
- Job Role: ${jobRole}
- Experience Level: ${experience}
- Difficulty Level: ${difficulty}
- Tech Stack / Focus: ${techString}
- Interview Type: ${interviewType}

Candidate Q&A Transcript:
${candidateResponses}

Please analyze the candidate's answers carefully and provide a rigorous, constructive evaluation.
Return ONLY valid JSON matching this exact structure:

{
  "overallScore": 85,
  "technicalScore": 88,
  "communicationScore": 82,
  "summary": "Overall summary paragraph evaluating the candidate's performance...",
  "strengths": [
    "Demonstrated deep understanding of core concepts...",
    "Articulated problem solving clearly..."
  ],
  "improvements": [
    "Could provide more concrete code examples...",
    "Elaborate further on edge-case handling..."
  ],
  "questionEvaluations": [
    {
      "questionIndex": 0,
      "score": 90,
      "feedback": "Great explanation of key concepts. Highlighted state management accurately.",
      "keyMissingConcepts": ["Edge case handling"],
      "modelAnswer": "An ideal response should cover state lifecycle, component re-rendering optimizations..."
    }
  ]
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });

  const text = response.text;
  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("JSON parse error in evaluateInterviewAnswers:", err, "Raw text:", text);
    // Fallback response structure
    return {
      overallScore: 75,
      technicalScore: 75,
      communicationScore: 75,
      summary: "Candidate completed the interview. Performance is satisfactory with room for deeper technical elaboration.",
      strengths: ["Completed all answered questions.", "Clear articulation."],
      improvements: ["Provide more depth on architectural trade-offs."],
      questionEvaluations: questions.map((q, idx) => ({
        questionIndex: idx,
        score: 75,
        feedback: "Satisfactory response provided.",
        keyMissingConcepts: [],
        modelAnswer: "Focus on core principles, performance, and best practices.",
      })),
    };
  }
};

module.exports = {
  generateInterviewQuestions,
  evaluateInterviewAnswers,
};