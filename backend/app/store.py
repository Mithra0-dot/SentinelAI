from app.database import db, cursor


def add_issue(issue):
    sql = """
    INSERT INTO issues
    (issue, description, severity, confidence,
     latitude, longitude, votes, status, image_path)
    VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)
    """

    values = (
        issue["issue"],
        issue["description"],
        issue["severity"],
        issue["confidence"],
        issue["latitude"],   # FIXED (was lat/lng mismatch risk)
        issue["longitude"],
        issue["votes"],
        issue["status"],
        issue["image_path"]
    )

    try:
        cursor.execute(sql, values)
        db.commit()
    except Exception as e:
        print("❌ MySQL Error:", e)
        db.rollback()


def get_issues():
    cursor.execute("SELECT * FROM issues ORDER BY id DESC")
    issues = cursor.fetchall()

    for issue in issues:
        issue["priority"] = calculate_priority(issue)

    return issues


def get_issue(issue_id):
    cursor.execute(
        "SELECT * FROM issues WHERE id=%s",
        (issue_id,)
    )
    return cursor.fetchone()


def vote_issue(issue_id):
    cursor.execute(
        "UPDATE issues SET votes=votes+1 WHERE id=%s",
        (issue_id,)
    )
    db.commit()

    return get_issue(issue_id)


def update_status(issue_id, status):
    cursor.execute(
        "UPDATE issues SET status=%s WHERE id=%s",
        (status, issue_id)
    )
    db.commit()

    return get_issue(issue_id)


def calculate_priority(issue):
    severity_score = {
        "High": 50,
        "Medium": 30,
        "Low": 10
    }.get(issue["severity"], 0)

    return severity_score + issue["confidence"] + issue["votes"]
def save_recommendation(issue_id, recommendation):
    cursor.execute("""
        UPDATE issues
        SET ai_recommendation = %s
        WHERE id = %s
    """, (recommendation, issue_id))
    db.commit()
       