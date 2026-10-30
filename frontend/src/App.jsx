
import { useState } from "react";
import "./App.css";

function App() {
  const [topic, setTopic] = useState("DSA");
  const [difficulty, setDifficulty] = useState("Easy");

  return (
    <div className="app">
      <nav className="navbar">
        <h2>InterviewMate<span> AI</span></h2>
        <div className="nav-tag">AI Interview Preparation</div>
      </nav>

      <main className="hero">
        <div className="hero-content">
          <div className="eyebrow">
            YOUR PERSONAL AI INTERVIEW COACH
          </div>

          <h1>
            Practice smarter.<br />
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

            <button className="start-button">
              Start Interview →
            </button>
          </div>
        </div>
      </main>

      <footer>
        Built to help you become interview-ready.
      </footer>
    </div>
  );
}

export default App;
