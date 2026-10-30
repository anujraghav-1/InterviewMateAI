
const API_URL = "http://127.0.0.1:8000";

export async function generateQuestion(topic, difficulty) {
  const response = await fetch(`${API_URL}/interview/question`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      topic,
      difficulty,
    }),
  });

  const data = await response.json();

  if (!response.ok || data.error) {
    throw new Error(data.error || "Failed to generate question.");
  }

  return data;
}
