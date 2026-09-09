import sqlite3
import random
from datetime import datetime
import json

conn = sqlite3.connect("pathology.db")
cursor = conn.cursor()

# Drop existing to wipe clean for the demo
cursor.execute("DROP TABLE IF EXISTS patients")

cursor.execute('''
    CREATE TABLE IF NOT EXISTS patients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        scan_date TEXT,
        patient_name TEXT,
        age INTEGER,
        gender TEXT,
        blood_pressure TEXT,
        temperature TEXT,
        symptoms TEXT,
        referring_doctor TEXT,
        image_name TEXT,
        report_json TEXT,
        requires_followup BOOLEAN,
        processing_time_ms INTEGER,
        department TEXT,
        triage_status TEXT, 
        human_override_note TEXT,
        phone TEXT,
        email TEXT,
        organization TEXT DEFAULT 'Med-AI Global'
    )
''')

docs = ["Dr. Harish", "Dr. Puneet", "Dr. Manisha", "Dr. Sundeep", "Dr. Naveen"]
depts = ["Cardiology", "Pulmonology", "Orthopedics", "General", "Oncology"]

mock_patients = [
    {"name": "Aarti Shukla", "age": 45, "gender": "Female", "bp": "120/80", "temp": "98.6", "sym": "Mild chest pain", "time": 1200, "tr": "Discharged", "phone": "(555) 123-4567", "email": "alice@example.com"},
    {"name": "Ramesh Gupta", "age": 62, "gender": "Male", "bp": "140/90", "temp": "99.1", "sym": "Shortness of breath, severe cough", "time": 3500, "tr": "Doctor Review", "phone": "(555) 987-6543", "email": "bob.j@example.com"},
    {"name": "Monika Patel", "age": 28, "gender": "Female", "bp": "110/70", "temp": "98.2", "sym": "Routine checkup", "time": 800, "tr": "Waiting Room", "phone": "N/A", "email": "cwoods@gmail.com"},
    {"name": "David Sharma", "age": 55, "gender": "Male", "bp": "150/95", "temp": "100.4", "sym": "Persistent fever, wheezing", "time": 4200, "tr": "Doctor Review", "phone": "206-555-0192", "email": "dmiller@work.net"},
    {"name": "Navya Sharma", "age": 71, "gender": "Female", "bp": "135/85", "temp": "98.8", "sym": "Joint pain", "time": 1500, "tr": "Discharged", "phone": "N/A", "email": "eva71@aol.com"},
    {"name": "Krishna Yadav", "age": 34, "gender": "Male", "bp": "125/82", "temp": "98.6", "sym": "Back ache after fall", "time": 1100, "tr": "Waiting Room", "phone": "555-010-0101", "email": "frankw@example.com"},
    {"name": "Priya Vishwakarma", "age": 49, "gender": "Female", "bp": "130/80", "temp": "99.5", "sym": "Heart palpitations", "time": 2800, "tr": "Waiting Room", "phone": "(111) 222-3333", "email": "glee@company.co"}
]

for p in mock_patients:
    scan_date = datetime.now().isoformat()
    requires_followup = p["time"] > 2000
    mock_report = {
        "clinical_assessment": {
            "diseases": ["Pneumonia", "Cardiomegaly"] if requires_followup else ["Healthy"],
            "severity": "High" if requires_followup else "Low"
        }
    }
    
    cursor.execute('''
        INSERT INTO patients (scan_date, patient_name, age, gender, blood_pressure, temperature, symptoms, referring_doctor, image_name, report_json, requires_followup, processing_time_ms, department, triage_status, human_override_note, phone, email, organization)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        scan_date, p["name"], p["age"], p["gender"], p["bp"], p["temp"], p["sym"],
        random.choice(docs), "mock_image.jpg", json.dumps(mock_report),
        requires_followup, p["time"], random.choice(depts), p["tr"], "",
        p["phone"], p["email"], "Med-AI Global"
    ))

conn.commit()
conn.close()
print("Initialized Pathology Database with V5 Deep Mock Data Architecture successfully!")
