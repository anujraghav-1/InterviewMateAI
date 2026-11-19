
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random
from backend.services.evaluation_service import evaluate_answer

app = FastAPI(title="InterviewMate AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class QuestionRequest(BaseModel):
    topic: str
    difficulty: str


class EvaluationRequest(BaseModel):
    question: str
    topic: str
    difficulty: str
    answer: str


QUESTIONS = {
    "DSA": {
        "Easy": [
            "What is an array, and how is it different from a linked list?",
            "What is the time complexity of linear search?"
        ],
        "Medium": [
            "Explain the two-pointer technique with an example.",
            "How does a hash map help solve the Two Sum problem?"
        ],
        "Hard": [
            "Explain how you would find the largest rectangle in a histogram.",
            "How would you find the shortest path in an unweighted graph?"
        ]
    },
    "OOP": {
        "Easy": [
            "What is a class and an object?",
            "What is encapsulation in object-oriented programming?"
        ],
        "Medium": [
            "Explain inheritance and method overriding with an example.",
            "What is the difference between an abstract class and an interface?"
        ],
        "Hard": [
            "Explain the Liskov Substitution Principle with an example.",
            "How would you design a flexible notification system using OOP?"
        ]
    },
    "DBMS": {
        "Easy": [
            "What is a primary key?",
            "What is the difference between SQL and a database?"
        ],
        "Medium": [
            "Explain database normalization and why it is useful.",
            "What is the difference between INNER JOIN and LEFT JOIN?"
        ],
        "Hard": [
            "Explain transaction isolation levels and possible anomalies.",
            "How would you investigate and optimize a slow SQL query?"
        ]
    }
}


@app.get("/")
def home():
    return {
        "message": "Welcome to InterviewMate AI!",
        "status": "Backend is running"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.post("/interview/question")
def generate_question(request: QuestionRequest):
    topic = request.topic.strip().upper()
    difficulty = request.difficulty.strip().title()

    if topic not in QUESTIONS:
        return {
            "error": "Unsupported topic",
            "supported_topics": list(QUESTIONS.keys())
        }

    if difficulty not in QUESTIONS[topic]:
        return {
            "error": "Unsupported difficulty",
            "supported_difficulties": list(QUESTIONS[topic].keys())
        }

    question = random.choice(QUESTIONS[topic][difficulty])

    return {
        "topic": topic,
        "difficulty": difficulty,
        "question": question,
        "prompt_version": "static_v1"
    }

@app.post("/interview/evaluate")
def evaluate_interview_answer(request: EvaluationRequest):

    if not request.answer.strip():
        return {"error": "Answer cannot be empty."}

    try:
        evaluation = evaluate_answer(
            question=request.question,
            topic=request.topic,
            difficulty=request.difficulty,
            answer=request.answer
        )

        return evaluation

    except Exception as e:
        print("Evaluation error:", str(e))
        return {
            "error": "Unable to evaluate answer. Please try again."
        }
