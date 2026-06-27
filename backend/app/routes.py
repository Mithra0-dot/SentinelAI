import os
import uuid
from fastapi import APIRouter, UploadFile, File, Form
from app.gemini_service import analyze_image_with_gemini
from app.store import (
    add_issue,
    get_issues,
    vote_issue,
    update_status,
)
import json

router = APIRouter()


@router.post("/analyze-image")
async def analyze_image(
    file: UploadFile = File(...),
    lat: float = Form(...),
    lng: float = Form(...)
):
    try:
        image_bytes = await file.read()
        filename = f"{uuid.uuid4()}.jpg"

        os.makedirs("uploads/before", exist_ok=True)

        image_path = f"uploads/before/{filename}"

        with open(image_path, "wb") as f:
            f.write(image_bytes)

        result = analyze_image_with_gemini(image_bytes)

        cleaned = (
            result.replace("```json", "")
            .replace("```", "")
            .strip()
        )

        try:
            data = json.loads(cleaned)
        except Exception:
            data = {
                "issue_type": "Unknown Issue",
                "severity": "Low",
                "description": result,
                "confidence": 50
            }

        issue = {
    "issue": data["issue_type"],
    "description": data["description"],
    "severity": data["severity"],
    "confidence": data["confidence"],
    "lat": lat,
    "lng": lng,
    "votes": 0,
    "status": "Reported",
    "image_path": image_path
}

        add_issue(issue)

        return {
            "success": True,
            "analysis": json.dumps(data),
            "location": issue
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }


@router.get("/issues")
async def fetch_issues():
    return get_issues()


@router.post("/vote/{issue_id}")
async def vote(issue_id: int):
    updated = vote_issue(issue_id)

    if updated:
        return {
            "success": True,
            "issue": updated
        }

    return {
        "success": False,
        "message": "Issue not found"
    }


@router.post("/status/{issue_id}/{status}")
async def change_status(issue_id: int, status: str):
    updated = update_status(issue_id, status)

    if updated:
        return {
            "success": True,
            "issue": updated
        }

    return {
        "success": False
    }