
import { useState } from "react";
import { generateQuestion } from "../services/InterviewAPI";

function Home({ onStartInterview }) {
  const [topic, setTopic] = useState("DSA");
  const [difficulty, setDifficulty] = useState("Easy");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function startInterview() {
    setLoading(true);
    setError("");

    try {
      const data = await generateQuestion(topic, difficulty);

      onStartInterview({
        topic: data.topic,
        difficulty: data.difficulty,
        question: data.question,
      });
    } catch (err) {
      setError(err.message || "Unable to connect to the backend.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="hero">
      <div className="hero-content">
        <div className="eyebrow">
          YOUR PERSONAL AI INTERVIEW COACH
        </div>

        <h1>
          Practice smarter.
          <br />
          <span>Interview better.</span>
        </h1>

        <p className="description">
          Prepare for technical interviews with AI-powered
          questions, personalized feedback, and adaptive learning.
        </p>

        <div className="interview-card">
          <h2>Configure your interview</h2>
          <p>Customize your practice session to get started.</p>

          <label htmlFor="topic">Interview Topic</label>
          <select
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          >
            <option value="DSA">Data Structures & Algorithms</option>
            <option value="OOP">Object-Oriented Programming</option>
            <option value="DBMS">Database Management Systems</option>
          </select>

          <label htmlFor="difficulty">Difficulty Level</label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <button
            className="start-button"
            onClick={startInterview}
            disabled={loading}
          >
            {loading ? "Generating question..." : "Start Interview →"}
          </button>

          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    </main>
  );
}

export default Home;
