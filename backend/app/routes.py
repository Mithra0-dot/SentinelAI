from fastapi import APIRouter, UploadFile, File, Form
import os
import uuid
import json

from app.gemini_service import (
    analyze_image_with_gemini,
    verify_repair_with_gemini,
    generate_ai_recommendation,
)

from app.store import (
    add_issue,
    get_issues,
    vote_issue,
    update_status,
    get_issue,
)

router = APIRouter()


@router.post("/verify-repair/{issue_id}")
async def verify_repair(
    issue_id: int,
    file: UploadFile = File(...)
):

    filename = f"{uuid.uuid4()}.jpg"

    upload_dir = os.path.join(
        os.path.dirname(os.path.dirname(__file__)),
        "uploads",
        "after"
    )

    os.makedirs(upload_dir, exist_ok=True)

    repair_path = os.path.join(upload_dir, filename)

    image_bytes = await file.read()

    with open(repair_path, "wb") as f:
        f.write(image_bytes)

    issue = get_issue(issue_id)

    if not issue:
        return {
            "success": False,
            "message": "Issue not found"
        }

    before_image = issue["image_path"]
    if not before_image:
        return {
        "success": False,
        "message": "No original image found for this issue."
                }

    before_path = os.path.join(
        os.path.dirname(os.path.dirname(__file__)),
        before_image
    )

    with open(before_path, "rb") as f:
        before_bytes = f.read()

    with open(repair_path, "rb") as f:
        after_bytes = f.read()

    print("Original image:", before_path)
    print("Repair image:", repair_path)

    result = verify_repair_with_gemini(
        before_bytes,
        after_bytes
    )

    cleaned = (
        result.replace("```json", "")
        .replace("```", "")
        .strip()
    )

    try:
        ai_result = json.loads(cleaned)
    except Exception:
        ai_result = {
            "repair_status": "Unknown",
            "confidence": 0,
            "reason": result
        }

    return {
        "success": True,
        "analysis": ai_result
    }
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
    "latitude": lat,
    "longitude": lng,
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
@router.get("/recommendation/{issue_id}")
async def get_recommendation(issue_id: int):

    issue = get_issue(issue_id)

    if not issue:
        return {
            "success": False,
            "message": "Issue not found"
        }

    print("ISSUE SENT TO AI:", issue)

    ai_response = generate_ai_recommendation(issue)

    cleaned = (
        ai_response.replace("```json", "")
        .replace("```", "")
        .strip()
    )

    try:
        parsed = json.loads(cleaned)
    except Exception:
        parsed = {
            "raw_response": ai_response
        }

    return {
        "success": True,
        "issue_id": issue_id,
        "recommendation": parsed
    }