import sqlite3
import os
import json
import hashlib
from datetime import datetime

DB_FILE = "pathology.db"

HOSPITAL_STAFF = [
    "Dr. Harish (Cardiology)",
    "Dr. Puneet (Pulmonology)",
    "Dr. Manisha (Orthopedics)",
    "Dr. Sundeep (General)",
    "Dr. Naveen (Oncology)"
]

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
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
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            email TEXT UNIQUE,
            password_hash TEXT,
            created_at TEXT,
            organization TEXT DEFAULT 'Med-AI Global'
        )
    ''')
    
    try:
        cursor.execute("ALTER TABLE patients ADD COLUMN organization TEXT DEFAULT 'Med-AI Global'")
    except sqlite3.OperationalError:
        pass
    try:
        cursor.execute("ALTER TABLE users ADD COLUMN organization TEXT DEFAULT 'Med-AI Global'")
    except sqlite3.OperationalError:
        pass

    conn.commit()
    conn.close()
    
    try:
        register_user("admin", "admin@hospital.org", "1234", "Med-AI Global")
    except Exception:
        pass

def register_user(username: str, email: str, password: str, organization: str) -> bool:
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    try:
        cursor.execute("INSERT INTO users (username, email, password_hash, created_at, organization) VALUES (?, ?, ?, ?, ?)",
                       (username, email, hash_password(password), datetime.now().isoformat(), organization))
        conn.commit()
        return True
    except sqlite3.IntegrityError:
        return False
    finally:
        conn.close()

def verify_user(username: str, password: str):
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("SELECT id, password_hash, organization FROM users WHERE username = ?", (username,))
    row = cursor.fetchone()
    conn.close()
    if row and row[1] == hash_password(password):
        return {"id": row[0], "organization": row[2]}
    return None

def log_patient(patient_data: dict, image_name: str, report: dict, processing_time: int, organization: str):
    clinical = report.get("clinical_assessment", {})
    severity = clinical.get("severity", "Low")
    requires_followup = True if severity in ["High", "Critical"] else False
    
    dept = report.get("referrals", "General")
    if "cardio" in dept.lower(): dept = "Cardiology"
    elif "pulmon" in dept.lower(): dept = "Pulmonology"
    elif "ortho" in dept.lower(): dept = "Orthopedics"
    elif "onc" in dept.lower(): dept = "Oncology"
    else: dept = "General/Primary"

    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO patients (scan_date, patient_name, age, gender, blood_pressure, temperature, symptoms, referring_doctor, image_name, report_json, requires_followup, processing_time_ms, department, triage_status, human_override_note, phone, email, organization)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        datetime.now().isoformat(),
        patient_data.get('name', 'Unknown'),
        int(patient_data.get('age', 0) or 0),
        patient_data.get('gender', '-'),
        patient_data.get('bloodPressure', '-'),
        patient_data.get('temperature', '-'),
        patient_data.get('symptoms', '-'),
        patient_data.get('doctor', 'Internal Node'),
        image_name,
        json.dumps(report),
        requires_followup,
        processing_time,
        dept,
        "Waiting Room",
        "",
        patient_data.get('phone', 'N/A'),
        patient_data.get('email', 'N/A'),
        organization
    ))
    pid = cursor.lastrowid
    conn.commit()
    conn.close()
    return pid

def get_dashboard_stats(organization: str):
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('SELECT COUNT(*) FROM patients WHERE organization = ?', (organization,))
    total_scans = cursor.fetchone()[0]
    cursor.execute('SELECT scan_date, patient_name, image_name, report_json, requires_followup FROM patients WHERE organization = ? ORDER BY id DESC LIMIT 5', (organization,))
    recent_rows = cursor.fetchall()
    
    cursor.execute('SELECT scan_date, patient_name, report_json FROM patients WHERE requires_followup = 1 AND triage_status != "Discharged" AND organization = ? ORDER BY id DESC LIMIT 5', (organization,))
    alert_rows = cursor.fetchall()
    critical_alerts = []
    for a in alert_rows:
       try:
           disease = json.loads(a[2]).get("clinical_assessment", {}).get("diseases", ["Unknown"])[0]
           critical_alerts.append({"date": a[0], "patient": a[1], "issue": disease})
       except: pass

    cursor.execute('SELECT referring_doctor, COUNT(*) as c FROM patients WHERE organization = ? GROUP BY referring_doctor ORDER BY c DESC LIMIT 3', (organization,))
    doctors = [{"name": row[0], "count": row[1]} for row in cursor.fetchall()]

    cursor.execute('SELECT department, COUNT(*) as c FROM patients WHERE organization = ? GROUP BY department ORDER BY c DESC LIMIT 4', (organization,))
    departments = [{"dept": row[0], "count": row[1]} for row in cursor.fetchall()]

    cursor.execute('SELECT AVG(processing_time_ms) FROM patients WHERE organization = ?', (organization,))
    avg_proc = cursor.fetchone()[0]
    avg_time_ms = int(avg_proc) if avg_proc else 0

    recent_scans = []
    total_diseases = 0
    for r in recent_rows:
        try:
            report = json.loads(r[3])
            diseases = report.get("clinical_assessment", {}).get("diseases", [])
            total_diseases += len(diseases)
            recent_scans.append({
                "date": r[0], "patient": r[1], "image": r[2], "diseases": diseases, "requires_followup": r[4]
            })
        except: pass
            
    cursor.execute('SELECT COUNT(*) FROM patients WHERE requires_followup = 1 AND organization = ?', (organization,))
    total_severe = cursor.fetchone()[0]
    
    cursor.execute('SELECT username, email FROM users WHERE organization = ? ORDER BY id DESC', (organization,))
    org_users = [{"username": row[0], "email": row[1]} for row in cursor.fetchall()]
    
    conn.commit()
    conn.close()
    
    return {
        "total_scans": total_scans, "total_severe": total_severe, "total_healthy": total_scans - total_severe,
        "avg_processing_time_ms": avg_time_ms, "top_doctors": doctors, "departments": departments, "critical_alerts": critical_alerts,
        "recent_scans": recent_scans, "total_diseases_detected": total_diseases, "org_users": org_users
    }

def get_all_patients(organization: str):
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('SELECT id, scan_date, patient_name, age, gender, symptoms, report_json, requires_followup, department, referring_doctor, triage_status, human_override_note, phone, email FROM patients WHERE organization = ? ORDER BY id DESC', (organization,))
    rows = cursor.fetchall()
    conn.close()
    result = []
    for r in rows:
        try:
            report = json.loads(r[6])
            diseases = report.get("clinical_assessment", {}).get("diseases", [])
            result.append({
                "id": r[0], "date": r[1], "name": r[2], "age": r[3], "gender": r[4], 
                "symptoms": r[5], "diseases": diseases, "requires_followup": r[7], "department": r[8], "doctor": r[9],
                "triage_status": r[10], "human_override_note": r[11],
                "phone": r[12], "email": r[13],
                "report": report
            })
        except: pass
    return result

def get_scanner_meta(organization: str):
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('SELECT DISTINCT referring_doctor FROM patients WHERE organization = ?', (organization,))
    existing_docs = [r[0] for r in cursor.fetchall()]
    
    # Clean and merge existing doctors with official staff, ensuring no duplicates like "Dr. Dr. "
    cleaned_docs = []
    for d in (HOSPITAL_STAFF + existing_docs):
        if not d: continue
        
        # ONLY keep doctors that have a specialty in parentheses, per user request
        if "(" not in d or ")" not in d:
            continue
            
        # Strip all variations of Dr. prefix to get the raw name
        raw_name = d.replace("Dr. Dr. ", "").replace("Dr. ", "").replace("Dr ", "").strip()
        cleaned_docs.append(f"Dr. {raw_name}")
        
    all_docs = list(set(cleaned_docs))
    all_docs.sort()
    
    cursor.execute('SELECT MAX(id), patient_name, age, gender, blood_pressure, temperature, phone, email FROM patients WHERE organization = ? GROUP BY patient_name', (organization,))
    pts = [{"name": r[1], "age": r[2], "gender": r[3], "bloodPressure": r[4], "temperature": r[5], "phone": r[6], "email": r[7]} for r in cursor.fetchall()]
    conn.close()
    return {"doctors": all_docs, "patients": pts}

def update_triage(patient_id: int, status: str):
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('UPDATE patients SET triage_status = ? WHERE id = ?', (status, patient_id))
    conn.commit()
    conn.close()

def update_human_override(patient_id: int, note: str):
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('UPDATE patients SET human_override_note = ? WHERE id = ?', (note, patient_id))
    conn.commit()
    conn.close()

def get_past_history(patient_name: str, organization: str):
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('SELECT report_json FROM patients WHERE patient_name = ? AND organization = ? ORDER BY id DESC LIMIT 1', (patient_name, organization))
    row = cursor.fetchone()
    conn.close()
    if row:
        return row[0]
    return None

def delete_patient(patient_id: int):
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('DELETE FROM patients WHERE id = ?', (patient_id,))
    conn.commit()
    conn.close()
