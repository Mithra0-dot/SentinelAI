import os
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)
RECOMMENDATION_PROMPT = """
You are a civic infrastructure expert AI.

Given a civic issue, return ONLY valid JSON:

{
  "department": "string (e.g., Municipal Corporation, Electricity Board, Water Authority)",
  "recommended_action": "short actionable fix",
  "urgency": "Low | Medium | High",
  "estimated_time": "e.g., 2 hours / 2 days / 1 week",
  "citizen_advice": "what citizens should do in the meantime"
}

Keep it practical, realistic, and short.
"""

def generate_ai_recommendation(issue: dict):
    prompt = f"""
Issue Type: {issue.get('issue')}
Severity: {issue.get('severity')}
Description: {issue.get('description')}
Confidence: {issue.get('confidence')}
"""

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[RECOMMENDATION_PROMPT, prompt]
        )
        return response.text

    except Exception as e:
        return f"AI_ERROR: {str(e)}"

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
VERIFY_PROMPT = """
You are an AI civic repair inspector.

You will receive TWO images.

Image 1 = BEFORE repair
Image 2 = AFTER repair

Compare them carefully.

Return ONLY valid JSON.

{
  "repair_status": "Resolved | Partially Resolved | Not Resolved",
  "confidence": 0,
  "reason": "Short explanation"
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
def verify_repair_with_gemini(before_bytes: bytes, after_bytes: bytes):

    before = types.Part.from_bytes(
        data=before_bytes,
        mime_type="image/jpeg"
    )

    after = types.Part.from_bytes(
        data=after_bytes,
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
                contents=[
                    VERIFY_PROMPT,
                    before,
                    after
                ]
            )

            return response.text

        except Exception as e:
            last_error = str(e)

    return f"All models failed. Last error: {last_error}"    