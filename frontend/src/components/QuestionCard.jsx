
function QuestionCard({ question, topic, difficulty }) {
  return (
    <div className="question-box">
      <span className="question-label">
        YOUR INTERVIEW QUESTION
      </span>

      <h3>{question}</h3>

      <p>
        Topic: {topic} | Difficulty: {difficulty}
      </p>
    </div>
  );
}

export default QuestionCard;
