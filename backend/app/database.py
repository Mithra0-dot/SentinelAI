import mysql.connector

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="password",
    database="sentinel_ai"
)

cursor = db.cursor(dictionary=True)