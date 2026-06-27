import os
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

PROMPT = """
You are a civic issue detection AI.

Return ONLY JSON:

{
  "issue_type": "pothole | water leakage | broken streetlight | garbage | road damage | other",
  "severity": "Low | Medium | High",
  "description": "short clear description",
  "confidence": 0-100
}
"""

def analyze_image_with_gemini(image_bytes: bytes):

    image_part = types.Part.from_bytes(
        data=image_bytes,
        mime_type="image/jpeg"
    )

    models_to_try = [
        "gemini-2.5-flash",
        "gemini-2.5-flash-lite",
        "gemini-2.0-flash"
    ]

    last_error = None

    for model in models_to_try:
        try:
            response = client.models.generate_content(
                model=model,
                contents=[PROMPT, image_part]
            )
            return response.text

        except Exception as e:
            last_error = str(e)
            continue

    return f"All models failed. Last error: {last_error}"