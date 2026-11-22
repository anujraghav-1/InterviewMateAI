
import { useState } from "react";
import QuestionCard from "../components/QuestionCard";
import AnswerBox from "../components/AnswerBox";
import { evaluateAnswer, generateQuestion } from "../services/InterviewAPI";

const TOTAL_QUESTIONS = 5;

function Interview({ interviewData, onEndInterview }) {
  const [currentQuestion, setCurrentQuestion] = useState(interviewData);
  const [questionNumber, setQuestionNumber] = useState(1);

  const [answer, setAnswer] = useState("");
  const [evaluation, setEvaluation] = useState(null);
  const [evaluations, setEvaluations] = useState([]);

  const [askedQuestions, setAskedQuestions] = useState([
    interviewData.question,
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showFinalSummary, setShowFinalSummary] = useState(false);

  // Submit and evaluate the candidate's answer
  async function handleSubmit() {
    if (!answer.trim() || loading || evaluation) return;

    setLoading(true);
    setError("");

    try {
      const result = await evaluateAnswer(
        currentQuestion.question,
        currentQuestion.topic,
        currentQuestion.difficulty,
        answer
      );

      setEvaluation(result);
      setEvaluations((previous) => [...previous, result]);
    } catch (err) {
      setError(err.message || "Something went wrong during evaluation.");
    } finally {
      setLoading(false);
    }
  }

  // Generate the next question
  async function handleNextQuestion() {
    if (loading || !evaluation) return;

    setLoading(true);
    setError("");

    try {
      const nextQuestion = await generateQuestion(
        currentQuestion.topic,
        currentQuestion.difficulty,
        askedQuestions
      );

      setCurrentQuestion(nextQuestion);
      setAskedQuestions((previous) => [
        ...previous,
        nextQuestion.question,
      ]);

      setQuestionNumber((previous) => previous + 1);
      setAnswer("");
      setEvaluation(null);
    } catch (err) {
      setError(err.message || "Failed to generate the next question.");
    } finally {
      setLoading(false);
    }
  }

  // Prepare the final interview summary
  const totalScore = evaluations.reduce(
    (total, item) => total + item.total_score,
    0
  );

  const averageScore =
    evaluations.length > 0
      ? (totalScore / evaluations.length).toFixed(1)
      : "0.0";

  const overallStrengths = [
    ...new Set(
      evaluations.flatMap((item) => item.strengths || [])
    ),
  ];

  const overallImprovements = [
    ...new Set(
      evaluations.flatMap((item) => item.improvements || [])
    ),
  ];

  const conceptsToPractice = [
    ...new Set(
      evaluations.flatMap((item) => item.missing_concepts || [])
    ),
  ];

  if (showFinalSummary) {
    return (
      <main className="hero">
        <div className="hero-content">
          <div className="eyebrow">INTERVIEW COMPLETED</div>

          <h1>
            Your interview
            <br />
            <span>summary.</span>
          </h1>

          <div className="interview-card">
            <h2>Final Results</h2>

            <h3>
              Overall Score: {totalScore}/100
            </h3>

            <h3>
              Average Score: {averageScore}/20
            </h3>

            <p>
              You completed {evaluations.length} out of{" "}
              {TOTAL_QUESTIONS} questions.
            </p>

            <h2>Individual Question Scores</h2>

            {evaluations.map((item, index) => (
              <div key={index}>
                <strong>
                  Question {index + 1}: {item.total_score}/20
                </strong>
              </div>
            ))}

            <h2>Overall Strengths</h2>

            {overallStrengths.length > 0 ? (
              <ul>
                {overallStrengths.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>No strengths recorded.</p>
            )}

            <h2>Areas for Improvement</h2>

            {overallImprovements.length > 0 ? (
              <ul>
                {overallImprovements.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>No improvement areas recorded.</p>
            )}

            <h2>Concepts to Practice</h2>

            {conceptsToPractice.length > 0 ? (
              <ul>
                {conceptsToPractice.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>No missing concepts recorded.</p>
            )}

            <button
              className="end-button"
              onClick={onEndInterview}
            >
              Finish Interview
            </button>
          </div>
        </div>
      </main>
    );
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
          <h3>
            Question {questionNumber} of {TOTAL_QUESTIONS}
          </h3>

          <QuestionCard
            question={currentQuestion.question}
            topic={currentQuestion.topic}
            difficulty={currentQuestion.difficulty}
          />

          {!evaluation && (
            <AnswerBox
              answer={answer}
              setAnswer={setAnswer}
              onSubmit={handleSubmit}
              loading={loading}
            />
          )}

          {error && (
            <p className="error-message">{error}</p>
          )}

          {evaluation && (
            <div className="evaluation-results">
              <h2>Evaluation Results</h2>

              <h3>
                Total Score: {evaluation.total_score}/20
              </h3>

              <p>{evaluation.summary}</p>

              <h3>Score Breakdown</h3>

              {Object.entries(evaluation.scores || {}).map(
                ([criterion, details]) => (
                  <div key={criterion}>
                    <strong>
                      {criterion.replaceAll("_", " ")}:{" "}
                      {details.score}/5
                    </strong>
                    <p>{details.evidence}</p>
                  </div>
                )
              )}

              <h3>Strengths</h3>
              <ul>
                {(evaluation.strengths || []).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>

              <h3>Areas for Improvement</h3>
              <ul>
                {(evaluation.improvements || []).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>

              <h3>Missing Concepts</h3>
              <ul>
                {(evaluation.missing_concepts || []).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>

              <h3>Follow-up Question</h3>
              <p>{evaluation.follow_up_question}</p>
            </div>
          )}

          {evaluation && questionNumber < TOTAL_QUESTIONS && (
            <button
              className="end-button"
              onClick={handleNextQuestion}
              disabled={loading}
            >
              {loading ? "Generating..." : "Next Question"}
            </button>
          )}

          {evaluation && questionNumber === TOTAL_QUESTIONS && (
            <button
              className="end-button"
              onClick={() => setShowFinalSummary(true)}
            >
              View Final Summary
            </button>
          )}

          <button
            className="end-button"
            onClick={onEndInterview}
            disabled={loading}
          >
            End Interview
          </button>
        </div>
      </div>
    </main>
  );
}

export default Interview;
