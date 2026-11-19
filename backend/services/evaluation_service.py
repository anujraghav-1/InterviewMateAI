
import os
import json
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types


# Find the project root
BASE_DIR = Path(__file__).resolve().parents[2]

# Load environment variables
load_dotenv(BASE_DIR / ".env")


def evaluate_answer(question, topic, difficulty, answer):

    api_key = os.getenv("GEMINI_API_KEY")
    model_name = os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite")

    if not api_key:
        raise ValueError("GEMINI_API_KEY is missing.")

    # Load evaluation prompt
    prompt_path = BASE_DIR / "backend" / "prompts" / "evaluation_v1.txt"

    if not prompt_path.exists():
        raise FileNotFoundError("Evaluation prompt file not found.")

    prompt = prompt_path.read_text(encoding="utf-8")

    # Insert candidate details into the prompt
    prompt = prompt.replace("{question}", question)
    prompt = prompt.replace("{topic}", topic)
    prompt = prompt.replace("{difficulty}", difficulty)
    prompt = prompt.replace("{answer}", answer)

    # Connect to Gemini
    client = genai.Client(api_key=api_key)

    # Generate evaluation in JSON format
    response = client.models.generate_content(
        model=model_name,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json"
        )
    )

    if not response.text:
        raise ValueError("Gemini returned an empty response.")

    # Convert JSON response into Python dictionary
    evaluation = json.loads(response.text)

    # Validate the scores
    score_categories = [
        "technical_accuracy",
        "completeness",
        "clarity",
        "practical_application"
    ]

    scores = evaluation.get("scores", {})

    total_score = 0

    for category in score_categories:
        if category not in scores:
            raise ValueError(f"Missing score: {category}")

        score = scores[category].get("score")

        if type(score) is not int or not 0 <= score <= 5:
            raise ValueError(f"Invalid score for {category}")

        total_score += score

    # Calculate total score in Python
    evaluation["total_score"] = total_score

    return evaluation
