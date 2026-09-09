import os
import warnings
warnings.filterwarnings("ignore", category=FutureWarning, module="google.api_core")
import time
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from database import init_db, log_patient, get_dashboard_stats, get_all_patients, get_scanner_meta, update_triage, update_human_override, get_past_history, register_user, verify_user, delete_patient
from ai_service import analyze_xray, chat_interrogate_xray, simulate_doctor_consult
import shutil
from pydantic import BaseModel
from typing import List, Dict

app = FastAPI(title="Med-AI Clinical Decision Support System API V6 Ultimate")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    init_db()
    os.makedirs("temp_uploads", exist_ok=True)

@app.get("/api/ping")
def ping():
    return {"status": "online", "message": "Neural core initialized"}

@app.get("/", response_class=HTMLResponse)
def read_root():
    return """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Med-AI API Status | System Online</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet">
        <style>
            :root {
                --primary: #6366f1;
                --secondary: #a855f7;
                --success: #22c55e;
                --bg: #0f172a;
                --card-bg: rgba(30, 41, 59, 0.7);
                --text: #f8fafc;
                --text-muted: #94a3b8;
            }

            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: 'Inter', sans-serif;
            }

            body {
                background: radial-gradient(circle at top right, #1e1b4b, #0f172a);
                color: var(--text);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
            }

            .container {
                position: relative;
                width: 100%;
                max-width: 600px;
                padding: 20px;
                z-index: 10;
            }

            .glass-card {
                background: var(--card-bg);
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 24px;
                padding: 40px;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                text-align: center;
                animation: fadeIn 0.8s ease-out;
            }

            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .logo-section {
                margin-bottom: 30px;
            }

            .app-title {
                font-family: 'Outfit', sans-serif;
                font-size: 2rem;
                font-weight: 700;
                margin-bottom: 8px;
                background: linear-gradient(to right, #818cf8, #c084fc);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }

            .status-badge {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                background: rgba(34, 197, 94, 0.1);
                color: var(--success);
                padding: 8px 16px;
                border: 1px solid rgba(34, 197, 94, 0.2);
                border-radius: 9999px;
                font-size: 0.875rem;
                font-weight: 600;
                margin-bottom: 24px;
            }

            .status-pulse {
                width: 10px;
                height: 10px;
                background: var(--success);
                border-radius: 50%;
                box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
                animation: pulse 2s infinite;
            }

            @keyframes pulse {
                0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
                70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
                100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
            }

            .description {
                color: var(--text-muted);
                line-height: 1.6;
                margin-bottom: 32px;
            }

            .action-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 16px;
            }

            .btn {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 20px;
                border-radius: 16px;
                text-decoration: none;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                color: var(--text);
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(255, 255, 255, 0.05);
            }

            .btn:hover {
                transform: translateY(-4px);
                background: rgba(255, 255, 255, 0.08);
                border-color: rgba(255, 255, 255, 0.2);
                box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.3);
            }

            .btn-icon {
                font-size: 1.5rem;
                margin-bottom: 12px;
            }

            .btn-label {
                font-weight: 600;
                font-size: 0.9rem;
            }

            .btn-sub {
                font-size: 0.75rem;
                color: var(--text-muted);
                margin-top: 4px;
            }

            /* Floating dots background */
            .bg-dots {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-image: radial-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px);
                background-size: 40px 40px;
                opacity: 0.5;
                z-index: 1;
            }

            .footer-info {
                margin-top: 40px;
                font-size: 0.75rem;
                color: var(--text-muted);
                letter-spacing: 0.05em;
                text-transform: uppercase;
            }
        </style>
    </head>
    <body>
        <div class="bg-dots"></div>
        <div class="container">
            <div class="glass-card">
                <div class="logo-section">
                    <h1 class="app-title">Med-AI Systems</h1>
                    <p style="color: var(--text-muted); font-weight: 500;">Clinical Decision Support Interface</p>
                </div>

                <div class="status-badge">
                    <span class="status-pulse"></span>
                    SYSTEM ONLINE
                </div>

                <p class="description">
                    The Med-AI Clinical Decision Support System Backend API is running at full capacity. All neural modules and diagnostic services are initialized and ready for processing.
                </p>

                <div class="action-grid">
                    <a href="/docs" class="btn">
                        <span class="btn-icon">⚡</span>
                        <span class="btn-label">Swagger UI</span>
                        <span class="btn-sub">Interactive Specs</span>
                    </a>
                    <a href="/redoc" class="btn">
                        <span class="btn-icon">📚</span>
                        <span class="btn-label">ReDoc</span>
                        <span class="btn-sub">API Reference</span>
                    </a>
                </div>

                <div class="footer-info">
                    API Version 6.0 Ultimate • Secure Diagnostic Node
                </div>
            </div>
        </div>
    </body>
    </html>
    """

class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str
    organization: str

class LoginRequest(BaseModel):
    username: str
    password: str

@app.post("/api/auth/register")
def register(payload: RegisterRequest):
    success = register_user(payload.username, payload.email, payload.password, payload.organization)
    if not success:
        raise HTTPException(status_code=400, detail="Username or email already exists")
    return {"status": "success", "organization": payload.organization, "username": payload.username}

@app.post("/api/auth/login")
def login(payload: LoginRequest):
    data = verify_user(payload.username, payload.password)
    if not data:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    return {"status": "success", "organization": data["organization"], "user_id": data["id"], "username": payload.username}

@app.get("/api/dashboard/stats")
def get_stats(org: str = "Med-AI Global"): 
    return get_dashboard_stats(org)

@app.get("/api/patients")
def get_patients_directory(org: str = "Med-AI Global"): 
    return get_all_patients(org)

@app.get("/api/scanner-meta")
def scanner_meta(org: str = "Med-AI Global"): 
    return get_scanner_meta(org)


class TriageUpdate(BaseModel):
    id: int
    status: str

@app.post("/api/triage/update")
def triage_update(payload: TriageUpdate):
    update_triage(payload.id, payload.status)
    return {"status": "success"}

@app.delete("/api/patients/{patient_id}")
def api_delete_patient(patient_id: int):
    delete_patient(patient_id)
    return {"status": "success"}

class OverrideUpdate(BaseModel):
    id: int
    note: str

@app.post("/api/override")
def override_update(payload: OverrideUpdate):
    update_human_override(payload.id, payload.note)
    return {"status": "success"}

@app.post("/api/chat")
async def ai_chat(image_name: str = Form(...), question: str = Form(...)):
    ans = chat_interrogate_xray(image_name, question)
    return {"answer": ans}

class ConsultRequest(BaseModel):
    history: List[Dict[str, str]]
    message: str

@app.post("/api/consult_chat")
def consult_chat(payload: ConsultRequest):
    ans = simulate_doctor_consult(payload.history, payload.message)
    return {"answer": ans}

@app.post("/api/scan")
async def scan_xray(
    file: UploadFile = File(...),
    name: str = Form("Unknown"),
    age: str = Form("0"),
    gender: str = Form("Unknown"),
    bloodPressure: str = Form("N/A"),
    temperature: str = Form("N/A"),
    symptoms: str = Form("None"),
    doctor: str = Form("Internal Node"),
    phone: str = Form("N/A"),
    email: str = Form("N/A"),
    org: str = Form("Med-AI Global")
):
    temp_path = f"temp_uploads/{file.filename}"
    
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    patient_data = {
        "name": name, "age": age, "gender": gender,
        "bloodPressure": bloodPressure, "temperature": temperature,
        "symptoms": symptoms, "doctor": doctor,
        "phone": phone, "email": email
    }
    
    history_json = get_past_history(name, org)
        
    start_time = time.time()
    report = analyze_xray(temp_path, patient_data, history_json)
    processing_ms = int((time.time() - start_time) * 1000)
    
    pid = log_patient(patient_data, file.filename, report, processing_ms, org)
        
    return {"status": "success", "report": report, "patient": patient_data, "image_name": file.filename, "patient_id": pid}

class TranslateRequest(BaseModel):
    text: str
    target_lang: str

@app.post("/api/translate")
def translate_text(req: TranslateRequest):
    from ai_service import translate_clinical_text
    translated = translate_clinical_text(req.text, req.target_lang)
    return {"translated_text": translated}
