
import { useState } from "react";
import QuestionCard from "../components/QuestionCard";
import AnswerBox from "../components/AnswerBox";

function Interview({ interviewData, onEndInterview }) {
  const [answer, setAnswer] = useState("");

  function handleSubmit() {
    if (!answer.trim()) return;

    alert("Answer captured! Gemini evaluation will be added next.");

    console.log("Question:", interviewData.question);
    console.log("Candidate answer:", answer);
  }

  return (
    <main className="hero">
      <div className="hero-content">
        <div className="eyebrow">
          INTERVIEW SESSION IN PROGRESS
        </div>

        <h1>
          Let's begin your
          <br />
          <span>interview.</span>
        </h1>

        <div className="interview-card">
          <QuestionCard
            question={interviewData.question}
            topic={interviewData.topic}
            difficulty={interviewData.difficulty}
          />

          <AnswerBox
            answer={answer}
            setAnswer={setAnswer}
            onSubmit={handleSubmit}
            loading={false}
          />

          <button
            className="end-button"
            onClick={onEndInterview}
          >
            End Interview
          </button>
        </div>
      </div>
    </main>
  );
}

export default Interview;
