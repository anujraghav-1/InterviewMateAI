
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// Generate a question while excluding previously asked questions
export async function generateQuestion(
  topic,
  difficulty,
  excludeQuestions = []
) {
  const response = await fetch(`${API_URL}/interview/question`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      topic,
      difficulty,
      exclude_questions: excludeQuestions,
    }),
  });

  const data = await response.json();

  if (!response.ok || data.error) {
    throw new Error(data.error || "Failed to generate question.");
  }

  return data;
}

// Evaluate the candidate's answer
export async function evaluateAnswer(
  question,
  topic,
  difficulty,
  answer
) {
  const response = await fetch(`${API_URL}/interview/evaluate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question,
      topic,
      difficulty,
      answer,
    }),
  });

  const data = await response.json();

  if (!response.ok || data.error) {
    throw new Error(data.error || "Failed to evaluate answer.");
  }

  return data;
}
