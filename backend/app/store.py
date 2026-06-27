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
    issue["lat"],
    issue["lng"],
    issue["votes"],
    issue["status"],
    issue["image_path"]
)

    print("Issue received:", issue)
    print("Values:", values)

    try:
        cursor.execute(sql, values)
        db.commit()

        print("✅ Rows inserted:", cursor.rowcount)
        print("✅ Last ID:", cursor.lastrowid)

    except Exception as e:
        print("❌ MySQL Error:", e)
        db.rollback()

def get_issues():
    cursor.execute("SELECT * FROM issues ORDER BY id DESC")
    return cursor.fetchall()


def vote_issue(issue_id):

    cursor.execute(
        "UPDATE issues SET votes=votes+1 WHERE id=%s",
        (issue_id,)
    )

    db.commit()

    cursor.execute(
        "SELECT * FROM issues WHERE id=%s",
        (issue_id,)
    )

    return cursor.fetchone()


def update_status(issue_id, status):

    cursor.execute(
        "UPDATE issues SET status=%s WHERE id=%s",
        (status, issue_id)
    )

    db.commit()

    cursor.execute(
        "SELECT * FROM issues WHERE id=%s",
        (issue_id,)
    )

    return cursor.fetchone()