
function AnswerBox({ answer, setAnswer, onSubmit, loading }) {
  return (
    <div className="answer-section">
      <label htmlFor="candidate-answer">Your Answer</label>

      <textarea
        id="candidate-answer"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Explain your approach and write your answer here..."
        rows={7}
      />

      <button
        className="start-button"
        onClick={onSubmit}
        disabled={loading || !answer.trim()}
      >
        {loading ? "Submitting..." : "Submit Answer →"}
      </button>
    </div>
  );
}

export default AnswerBox;
