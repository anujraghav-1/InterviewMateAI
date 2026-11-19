
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
    exclude_questions: list[str] = []


class EvaluationRequest(BaseModel):
    question: str
    topic: str
    difficulty: str
    answer: str



QUESTIONS = {
    "DSA": {
        "Easy": [
            "What is an array, and how is it different from a linked list?",
            "What is the time complexity of linear search?",
            "What is binary search, and what condition must be satisfied to use it?",
            "What is a stack, and explain its LIFO principle?",
            "What is a queue, and how does it differ from a stack?"
        ],
        "Medium": [
            "Explain the two-pointer technique with an example.",
            "How does a hash map help solve the Two Sum problem?",
            "Explain binary search on a sorted array with an example.",
            "What is the difference between a stack and a queue in terms of operations?",
            "How does the sliding window technique help solve array problems?"
        ],
        "Hard": [
            "Explain how you would find the largest rectangle in a histogram.",
            "How would you find the shortest path in an unweighted graph?",
            "Explain dynamic programming and how it differs from recursion.",
            "How would you detect a cycle in a linked list?",
            "Explain Dijkstra's shortest-path algorithm and its working."
        ]
    },
    "OOP": {
        "Easy": [
            "What is a class and an object?",
            "What is encapsulation in object-oriented programming?",
            "What is inheritance in object-oriented programming?",
            "What is polymorphism, and why is it useful?",
            "What is a constructor, and when is it called?"
        ],
        "Medium": [
            "Explain inheritance and method overriding with an example.",
            "What is the difference between an abstract class and an interface?",
            "Explain the difference between method overloading and method overriding.",
            "What is abstraction, and how is it different from encapsulation?",
            "What is the difference between composition and inheritance?"
        ],
        "Hard": [
            "Explain the Liskov Substitution Principle with an example.",
            "How would you design a flexible notification system using OOP?",
            "Explain the SOLID principles of object-oriented design.",
            "How does dependency injection improve software design?",
            "Explain the Factory Design Pattern and when you would use it."
        ]
    },
    "DBMS": {
        "Easy": [
            "What is a primary key?",
            "What is the difference between SQL and a database?",
            "What is a foreign key, and why is it used?",
            "What is a database index?",
            "What is a database schema?"
        ],
        "Medium": [
            "Explain database normalization and why it is useful.",
            "What is the difference between INNER JOIN and LEFT JOIN?",
            "Explain the ACID properties of database transactions.",
            "What is the difference between DELETE and TRUNCATE?",
            "How does a database index improve query performance?"
        ],
        "Hard": [
            "Explain transaction isolation levels and possible anomalies.",
            "How would you investigate and optimize a slow SQL query?",
            "What is a database deadlock, and how can it be handled?",
            "Explain how query optimization works in a relational database.",
            "What is database sharding, and how does it differ from replication?"
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

    available_questions = [
        q for q in QUESTIONS[topic][difficulty]
        if q not in request.exclude_questions
    ]

    if not available_questions:
        return {"error": "No more unique questions available."}

    question = random.choice(available_questions)

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
