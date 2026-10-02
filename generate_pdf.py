# -*- coding: utf-8 -*-
"""
Med-AI Presentation Script Generator in ReportLab
Generates MED_AI_HINGLISH_SCRIPT_COMPLETE.pdf with professional styling,
page numbers, custom headers, callout boxes, and complete Hinglish/WhatsApp language script.
"""

import os
import sys
import hashlib

# Fix for Python 3.8 hashlib issue in reportlab on Windows
_orig_md5 = hashlib.md5
def _safe_md5(*args, **kwargs):
    kwargs.pop('usedforsecurity', None)
    return _orig_md5(*args, **kwargs)
hashlib.md5 = _safe_md5

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        # Skip header and footer on cover page if desired, or draw on all pages
        self.saveState()
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.setFont("Helvetica-Bold", 8)
            self.setFillColor(colors.HexColor("#4338CA")) # Indigo 700
            self.drawString(36, 812, "MED-AI : MULTIMODAL CLINICAL DECISION SUPPORT SYSTEM")
            self.setFont("Helvetica", 8)
            self.setFillColor(colors.HexColor("#64748B")) # Slate 500
            self.drawRightString(559, 812, "Complete Page-by-Page Master Script (Hinglish / WhatsApp)")
            
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(36, 806, 559, 806)

        # Footer (all pages)
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.5)
        self.line(36, 38, 559, 38)

        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        self.drawString(36, 26, "Lead Architect: Utkarsh Srivastav | BCA Final Year Project / SIH Ready")
        
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(559, 26, page_str)
        self.restoreState()


def build_pdf(filename="MED_AI_HINGLISH_SCRIPT_COMPLETE.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        leftMargin=36,
        rightMargin=36,
        topMargin=46,
        bottomMargin=46
    )

    styles = getSampleStyleSheet()
    content_width = 523  # A4 width (595.27) - 72

    # Custom styles
    # Colors
    c_primary = colors.HexColor("#1E1B4B")     # Indigo 950
    c_accent = colors.HexColor("#0284C7")      # Sky 600
    c_cyan = colors.HexColor("#0891B2")        # Cyan 600
    c_whatsapp = colors.HexColor("#059669")    # Emerald 600
    c_whatsapp_bg = colors.HexColor("#ECFDF5") # Emerald 50
    c_tech_bg = colors.HexColor("#F8FAFC")     # Slate 50
    c_warn_bg = colors.HexColor("#FEF2F2")     # Red 50
    c_text = colors.HexColor("#0F172A")        # Slate 900
    c_muted = colors.HexColor("#475569")       # Slate 600

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor("#1E1B4B"),
        alignment=1 # Center
    )

    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor("#0284C7"),
        alignment=1
    )

    h1_style = ParagraphStyle(
        'Header1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=colors.HexColor("#1E1B4B"),
        spaceBefore=12,
        spaceAfter=4
    )

    h2_style = ParagraphStyle(
        'Header2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=colors.HexColor("#0369A1"),
        spaceBefore=8,
        spaceAfter=3
    )

    body_style = ParagraphStyle(
        'NormalBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=c_text,
        spaceBefore=2,
        spaceAfter=3
    )

    body_bold = ParagraphStyle(
        'NormalBodyBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=12,
        textColor=c_text
    )

    dialogue_style = ParagraphStyle(
        'DialogueText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12.5,
        textColor=colors.HexColor("#065F46") # Emerald 800
    )

    dialogue_title = ParagraphStyle(
        'DialogueTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor("#047857") # Emerald 700
    )

    tech_text = ParagraphStyle(
        'TechText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.2,
        leading=11.5,
        textColor=colors.HexColor("#334155")
    )

    tech_title = ParagraphStyle(
        'TechTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.8,
        leading=12,
        textColor=colors.HexColor("#1E293B")
    )

    qa_q = ParagraphStyle(
        'QAQuestion',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#991B1B") # Red 800
    )

    qa_a = ParagraphStyle(
        'QAAnswer',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#1E293B")
    )

    story = []

    def make_box(title, text, bg_color, border_color, title_style_use, text_style_use):
        p_title = Paragraph(title, title_style_use)
        p_text = Paragraph(text, text_style_use)
        tbl_data = [[p_title], [Spacer(1, 2)], [p_text]]
        t = Table(tbl_data, colWidths=[content_width])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), bg_color),
            ('BOX', (0,0), (-1,-1), 1, border_color),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('RIGHTPADDING', (0,0), (-1,-1), 8),
            ('TOPPADDING', (0,0), (-1,-1), 6),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ]))
        return t

    def make_chat_box(title, speech_dialogue):
        return make_box(
            f"<b>💬 [KAISE BOLNA HAI - WHATSAPP DIALOGUE]</b> — <i>{title}</i>",
            speech_dialogue,
            c_whatsapp_bg,
            colors.HexColor("#10B981"),
            dialogue_title,
            dialogue_style
        )

    def make_tech_box(title, tech_explanation):
        return make_box(
            f"<b>⚙️ [UNDER THE HOOD / BACKEND CODE LOGIC]</b> — <i>{title}</i>",
            tech_explanation,
            c_tech_bg,
            colors.HexColor("#94A3B8"),
            tech_title,
            tech_text
        )

    def make_qa_box(question, answer):
        content = f"<b>Q: {question}</b><br/><br/><b>Answer (Hinglish me):</b> {answer}"
        return make_box(
            "<b>🎯 [EXAMINER VIVA QUESTION & SMART ANSWER]</b>",
            content,
            colors.HexColor("#FFFBEB"), # Amber 50
            colors.HexColor("#F59E0B"), # Amber 500
            ParagraphStyle('QATitle', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=8.8, leading=12, textColor=colors.HexColor("#B45309")),
            body_style
        )

    # -------------------------------------------------------------
    # COVER / HEADER
    # -------------------------------------------------------------
    story.append(Paragraph("🩺 MED-AI : MULTIMODAL CLINICAL DECISION SUPPORT SYSTEM", title_style))
    story.append(Spacer(1, 3))
    story.append(Paragraph("MASTER PRESENTATION & VIVA SCRIPT IN WHATSAPP / HINGLISH LANGUAGE", subtitle_style))
    story.append(Spacer(1, 2))
    story.append(Paragraph("<b>Author / Lead Architect:</b> Utkarsh Srivastav &nbsp;|&nbsp; <b>Framework:</b> React 18 + FastAPI + SQLite + Gemini 1.5 Flash &nbsp;|&nbsp; <b>Status:</b> Complete End-to-End Walkthrough", ParagraphStyle('MetaSub', parent=styles['Normal'], fontName='Helvetica', fontSize=7.8, alignment=1, textColor=c_muted)))
    story.append(Spacer(1, 6))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#4338CA"), spaceBefore=2, spaceAfter=8))

    # -------------------------------------------------------------
    # SECTION 0: ELEVATOR PITCH
    # -------------------------------------------------------------
    story.append(Paragraph("🚀 30-Second Elevator Pitch (Jab koi pooche: 'Ye project kya karta hai?')", h1_style))
    elevator_text = (
        "&quot;<b>Bhai seedha ye bolna:</b> Sir/Ma'am, aaj ke time pe hospitals me radiologist aur doctor shortage ek massive problem hai. "
        "Normal hospital me jab patient Chest X-ray karwata hai, toh radiologist ki verified report aane me <b>24 se 48 ghante</b> lag jaate hain. "
        "Is delay ki wajah se emergency cases (jaise severe pneumonia ya cardiomegaly) me treatment late ho jata hai.<br/><br/>"
        "<b>Med-AI hamara banaya hua ek complete Full-Stack Clinical Decision Support System (CDSS) hai</b> jo multi-modal AI use karta hai. "
        "Yahan doctor sirf patient ke Vitals (BP, temperature, symptoms) aur Chest X-ray upload karta hai, aur <b>sub-2 seconds (&lt;2000 ms)</b> ke andar "
        "AI poori image scan karke exact <b>visual bounding box heatmap</b> ke sath report de deta hai! "
        "Sath hi doctor ke liye technical assessment aur patient ke liye aasan bhasha me layman summary + recovery timeline banata hai. "
        "Iske alawa isme live <b>AI Video TeleConsultation</b> (bolne aur sunne wala AI Doctor) aur hospital workflow manage karne ke liye <b>Kanban Triage board</b> bhi integrated hai!&quot;"
    )
    story.append(make_chat_box("The Ultimate 30-Second Pitch", elevator_text))
    story.append(Spacer(1, 10))

    # -------------------------------------------------------------
    # SECTION 1: ARCHITECTURE OVERVIEW
    # -------------------------------------------------------------
    story.append(Paragraph("🏗️ Complete System Architecture (Mota-Moti Flow Kaise Chalta Hai)", h1_style))
    arch_summary = (
        "<b>1. Frontend (Client):</b> React 18 + Vite + Recharts + Vanilla Glassmorphism CSS. Super fast, responsive, mobile-first dual-view layout.<br/>"
        "<b>2. Backend (Server):</b> Python FastAPI + Uvicorn. Asynchronous (async/await) REST API architecture with Pydantic schema validation.<br/>"
        "<b>3. Artificial Intelligence Engine:</b> Google Gemini 1.5 Flash Vision (`gemini-flash-latest`). Multimodal vision analysis + prompt engineering.<br/>"
        "<b>4. Safeguards & Key Rotation:</b> Multi-Key Rotation Matrix (Key 1 -> Key 2 -> Key 3) taaki API quota limit kabhi na ruke, plus Vitals Sanity-Check.<br/>"
        "<b>5. Database (EHR):</b> SQLite3 (`pathology.db`). Zero-configuration, relational storage with multi-tenancy organization filtering.<br/>"
        "<b>6. TeleConsult Core:</b> HTML5 MediaDevices (Webcam) + Web Speech API (Speech-to-Text) + SpeechSynthesis (Empathetic AI voice back)."
    )
    story.append(make_tech_box("Full-Stack Tech Architecture", arch_summary))
    story.append(Spacer(1, 12))

    # -------------------------------------------------------------
    # PAGE 1: LOGIN & SIGNUP
    # -------------------------------------------------------------
    story.append(Paragraph("📱 PAGE 1: Login & Registration Module (/login, /signup)", h1_style))
    story.append(Paragraph("<b>🎬 Screen Pe Kya Dikhana Hai:</b> Login screen pe sleek dark glassmorphic card dikhao. 'Med-AI Global' organization select karo, username me `admin` ya doctor ka naam daalo, login button click karo aur global preloader transition dikhao.", body_style))
    story.append(Spacer(1, 3))
    
    p1_dialogue = (
        "&quot;Sir, sabse pehle ye hamara secure <b>Authentication &amp; Access Control Page</b> hai. "
        "Med-AI koi simple basic toy-project nahi hai jisme sabka data mix ho jaye — ye ek <b>Multi-Tenant Enterprise System</b> hai. "
        "Iska matlab alag-alag hospitals (jaise Med-AI Global, City Care, ya Apollo) apne-apne private login credentials se aate hain, "
        "aur unka patient record ek dusre se completely isolated rehta hai taaki patient privacy aur medical compliance 100% maintain rahe.<br/>"
        "Jaise hi hum credentials enter karke login karte hain, background me hamara neural preloader trigger hota hai jo cold-start latency ko "
        "hide karta hai aur backend microservices ko warm-up kar deta hai.&quot;"
    )
    story.append(make_chat_box("Login & Multi-Tenancy Explanation", p1_dialogue))
    story.append(Spacer(1, 4))
    
    p1_tech = (
        "• <b>Endpoint:</b> <code>POST /api/auth/login</code> and <code>POST /api/auth/register</code><br/>"
        "• <b>Session State:</b> Login hone ke baad username aur hospital organization <code>sessionStorage</code> me store hoti hai. "
        "Har API request ke sath organization query parameter bhejte hain jo SQLite query me <code>WHERE organization = ?</code> filter lagata hai."
    )
    story.append(make_tech_box("Auth & Multi-Tenancy Logic", p1_tech))
    story.append(Spacer(1, 4))

    p1_qa = (
        "Agar examiner pooche: <i>'Multi-tenancy kyu banayi? Single user kyu nahi rakha?'</i><br/>"
        "<b>Jawab:</b> 'Sir real-world healthcare me cloud platform ek hi hota hai lekin usko hazaron hospitals use karte hain. "
        "Multi-tenancy se hum ek hi database me multiple hospital branches host kar sakte hain without data leakage, jo production SaaS standard hai.'"
    )
    story.append(make_qa_box("Multi-Tenancy Viva Question", p1_dialogue if False else p1_qa))
    story.append(Spacer(1, 14))

    # -------------------------------------------------------------
    # PAGE 2: ADMIN DASHBOARD
    # -------------------------------------------------------------
    story.append(Paragraph("📊 PAGE 2: Admin Command Center / Hospital Dashboard (/)", h1_style))
    story.append(Paragraph("<b>🎬 Screen Pe Kya Dikhana Hai:</b> Dashboard pe DNA particle animation dikhao. Top 3 metric cards dikhao (Total Lifetime Scans, Diseases Identified, Avg Token Processing Time ms). Fir 'Top Referring Network' Bar chart aur 'Department Routing Burden' Donut chart pe cursor ghuma ke live custom tooltips dikhao. Last me red pulsing 'Critical Priority Inbox' dikhao.", body_style))
    story.append(Spacer(1, 3))

    p2_dialogue = (
        "&quot;Login karne ke baad hum land karte hain hamare <b>Admin Command Center</b> pe. "
        "Ye screen hospital directors aur chief radiologists ke liye ek centralized operational control room hai.<br/>"
        "Yahan sabse pehla highlight metric hai <b>'Avg Token Processing Latency' — around 1,400 milliseconds</b>! "
        "Yahan hum examiner ko mathematically demonstrate karte hain ki human radiologist ka 48-hour SLA ke mukable hamara AI system sirf 1.5 se 2 second me preliminary triage report generate kar raha hai.<br/>"
        "Neeche do crucial data visualization charts hain: "
        "Pehla <b>Top Referring Network (Bar Chart)</b> — ye dikhata hai ki hospital ke kaun se doctors sabse zyada scans refer kar rahe hain. "
        "Dusra <b>Department Routing Burden (Donut Chart)</b> — AI ne pure hospital database me kitne patients ko Pulmonology bheja, kitne ko Cardiology, aur kitne ko General Medicine. Isse hospital management ko pata chalta hai ki kis department me patient rush zyada hai.<br/>"
        "Aur sabse right me hai <b>'Critical Priority Inbox'</b> — jaise hi AI kisi patient ke scan me severe condition (jaise massive effusion ya pneumothorax) detect karta hai, wo yahan blazing red alert me pin ho jata hai taaki triage staff turant ICU ya ambulance call kar sake.&quot;"
    )
    story.append(make_chat_box("Admin Dashboard Walkthrough", p2_dialogue))
    story.append(Spacer(1, 4))

    p2_tech = (
        "• <b>Endpoint:</b> <code>GET /api/dashboard/stats?org={organization}</code><br/>"
        "• <b>Metrics Engine:</b> SQLite backend dynamically aggregates total scans, healthy ratio, critical alerts count, top doctors ranking, and department counts using SQL <code>GROUP BY</code> and <code>COUNT()</code> queries.<br/>"
        "• <b>UI Rendering:</b> Built using <code>Recharts</code> library with responsive containers and custom glassmorphism SVG tooltips."
    )
    story.append(make_tech_box("Dashboard Analytics Aggregation", p2_tech))
    story.append(Spacer(1, 14))

    # -------------------------------------------------------------
    # PAGE 3: ANALYTICS & INSIGHTS HUB
    # -------------------------------------------------------------
    story.append(Paragraph("📈 PAGE 3: Analytics & Operational Insights (/analytics)", h1_style))
    story.append(Paragraph("<b>🎬 Screen Pe Kya Dikhana Hai:</b> Sidebar se 'Analytics & Insights' pe click karo. Pehla Area Chart (Human vs AI Latency) dikhao, fir 'Weekly Disease Outbreak Trends' graph dikhao, fir Demographics Pie Chart aur Neural Microservice Health bars dikhao.", body_style))
    story.append(Spacer(1, 3))

    p3_dialogue = (
        "&quot;Next, hum switch karte hain <b>Analytics &amp; Insights Hub</b> pe. "
        "Standard healthcare softwares me sirf tables hoti hain, lekin Med-AI hospital ko predictive aur operational intelligence deta hai.<br/>"
        "Yahan sabse pehla chart hai <b>Human vs AI Diagnostic Turnaround</b> — human radiologist ko average 40-45 ghante lagte hain, jabki hamara AI latency under 2 seconds me flat rehti hai.<br/>"
        "Dusra chart hai <b>Weekly Disease Outbreak Tracking</b> — ye line chart time ke sath plot karta hai ki pneumonia ya cardiomegaly ke cases kis week spike ho rahe hain. Agar kisi week pneumonia ke cases achanak shoot up hote hain, toh hospital management ko advance me warning mil jati hai ki epidemic ya seasonal infection badh raha hai taaki ICU beds aur oxygen cylinders pehle se arrange ho sakein.<br/>"
        "Sath hi hum age demographics (Pediatric, Adult, Geriatric) aur <b>System Health telemetry</b> (API Gateway, DB Sync, Neural Core) ko live monitor karte hain.&quot;"
    )
    story.append(make_chat_box("Analytics & Epidemic Intelligence", p3_dialogue))
    story.append(Spacer(1, 4))

    p3_tech = (
        "• <b>Telemetry Animation:</b> Custom <code>useCountUp</code> hook for smooth number counting animations on load.<br/>"
        "• <b>Charts Used:</b> <code>ComposedChart</code>, <code>AreaChart</code>, <code>RadialBarChart</code>, and <code>PieChart</code> with custom gradients and cubic easing."
    )
    story.append(make_tech_box("Recharts Data Visualization Engine", p3_tech))
    story.append(Spacer(1, 14))

    # -------------------------------------------------------------
    # PAGE 4: AI TELECONSULT / VIRTUAL CLINIC
    # -------------------------------------------------------------
    story.append(Paragraph("🩺 PAGE 4: AI TeleConsult - Virtual Clinic (/consult)", h1_style))
    story.append(Paragraph("<b>🎬 Screen Pe Kya Dikhana Hai:</b> Sidebar se 'AI TeleConsult' click karo. Lobby se 'Connect Live' dabao. Camera stream allow karo (Picture-in-Picture webcam dikhega). Fir Microphone button dabao aur English ya Hindi me bolo: <i>'Hello doctor, I have high fever, dry cough, and chest discomfort since 2 days'</i>. Dikhao AI sound waves vibrate karti hain aur AI doctor ki awaaz me bolke advice deta hai!", body_style))
    story.append(Spacer(1, 3))

    p4_dialogue = (
        "&quot;Ab hum aate hain Med-AI ke sabse futuristic feature pe: <b>AI TeleConsult — The Virtual Clinic</b>. "
        "Rural ya tier-3 shehron me jahan specialist doctors present nahi hote, wahan patient bina travel kiye direct AI virtual physician se consultation le sakta hai.<br/>"
        "Is module me 3 cutting-edge technologies ek sath kaam kar rahi hain:<br/>"
        "<b>1. Real-Time HD Webcam Stream:</b> Browser ke <code>navigator.mediaDevices.getUserMedia</code> API se secure Picture-in-Picture video feed chalti hai taaki patient ko realistic doctor consultation feel ho.<br/>"
        "<b>2. Voice Input (Speech-to-Text):</b> Patient ko kuch bhi type karne ki zaroorat nahi hai. Humne browser-native <b>Web Speech API</b> integrate kiya hai. Mic button click karte hi patient apni aam bolchal me bimari bolta hai aur wo automatically text me transcribe ho jata hai.<br/>"
        "<b>3. Empathetic Voice Synthesis (Text-to-Speech):</b> Backend Gemini model ko humne senior empathetic clinical physician ka system prompt diya hai. AI reply ko browser ke <code>SpeechSynthesisUtterance</code> se 0.95x medical pace pe bolke sunata hai, sath me glowing audio visualizer wave animate hoti hai!<br/>"
        "Patient ki har baat ka contextual triage hota hai — agar patient severe symptoms (jaise chest pain + low BP) bolta hai, toh AI turant use emergency clinic report karne ki direct guidance deta hai.&quot;"
    )
    story.append(make_chat_box("TeleConsult Virtual Doctor Pitch", p4_dialogue))
    story.append(Spacer(1, 4))

    p4_tech = (
        "• <b>Endpoint:</b> <code>POST /api/consult_chat</code><br/>"
        "• <b>Payload:</b> <code>{ history: [...], message: 'patient query' }</code><br/>"
        "• <b>System Persona Prompt:</b> Senior virtual physician instructed to deliver concise, reassuring medical guidance, prioritize emergency triage combinations, and append the clinical safety disclaimer.<br/>"
        "• <b>Audio APIs:</b> <code>window.SpeechRecognition</code> / <code>webkitSpeechRecognition</code> for input, <code>window.speechSynthesis</code> for vocal output."
    )
    story.append(make_tech_box("Web Speech API & Conversational AI Node", p4_tech))
    story.append(Spacer(1, 14))

    # -------------------------------------------------------------
    # PAGE 5: CLINICAL IMAGING SCANNER
    # -------------------------------------------------------------
    story.append(Paragraph("🔬 PAGE 5: Clinical Imaging AI Scanner (/scanner) — THE CORE ENGINE", h1_style))
    story.append(Paragraph("<b>🎬 Screen Pe Kya Dikhana Hai:</b> Sidebar se 'Clinical Imaging' pe aao. Datalist dropdown me 'Arjun Mehta' select karo (vitals jaise BP 130/85, Temp 101.5°F, symptoms auto-fill ho jayenge). Fir drag & drop area me sample Chest X-ray image choose karo. Fir 'Run AI Diagnosis Verification' button click karo.", body_style))
    story.append(Spacer(1, 3))

    p5_dialogue = (
        "&quot;Ye hamare pure project ka <b>Core Artificial Intelligence Engine</b> hai. "
        "Normal college projects me log kya karte hain? Sirf ek X-ray image upload karte hain aur CNN model se predict karwa dete hain. "
        "Lekin real-world clinical medicine me sirf photo dekh kar dawa nahi di jati! Doctor hamesha patient ke <b>Vitals aur Symptoms</b> ko X-ray ke sath correlate karta hai.<br/>"
        "Med-AI exactly yahi <b>Multimodal Fusion</b> karta hai: "
        "Hum image ke sath-sath Age, Gender, Blood Pressure, Body Temperature, aur Symptoms ko backend me inject karte hain.<br/>"
        "Yahan do massive engineering innovations hain:<br/>"
        "<b>1. Longitudinal Patient History Mapping:</b> Jaise hi hum 'Arjun Mehta' select karte hain, hamara system database me query karta hai ki kya ye patient pehle bhi aaya tha? Agar aaya tha, toh uski pichli diagnosis (jaise 'Pneumonitis 3 months ago') automatically naye prompt me chali jati hai, jisse AI multi-visit disease progression evaluate karta hai!<br/>"
        "<b>2. Diagnostic Sanity-Check Safeguard:</b> Agar koi user galti se invalid ya physically impossible data enter kar de (jaise Body Temp &lt; 0°C ya BP 0/0), toh hamara backend visual healthy lung hone ke bavjood 'Healthy' declare nahi karega, balki turant Severe Hypothermia/Clinical Shock ya Equipment Malfunction ka safeguard flag raise kar dega!&quot;"
    )
    story.append(make_chat_box("Core Multimodal Scanner Pitch", p5_dialogue))
    story.append(Spacer(1, 4))

    p5_tech = (
        "• <b>Endpoint:</b> <code>POST /api/scan</code> (multipart/form-data: image file + patient demographic vitals).<br/>"
        "• <b>Image Optimization:</b> Python <code>Pillow (PIL)</code> image buffer ko read karke RGB convert karti hai aur max 1024x1024 thumbnailing karti hai taaki token footprint aur latency minimize ho.<br/>"
        "• <b>Multi-Key Rotation Engine:</b> <code>GEMINI_API_KEY</code>, <code>GEMINI_API_KEY_2</code>, <code>GEMINI_API_KEY_3</code>. Agar Google quota HTTP 429 error throw karta hai, toh internal switcher zero-downtime ke sath next active key pe seamlessly switch kar jata hai.<br/>"
        "• <b>AI Model:</b> <code>gemini-flash-latest</code> with structured JSON response schema enforcement."
    )
    story.append(make_tech_box("Multimodal Vision Pipeline & Key Rotation", p5_tech))
    story.append(Spacer(1, 14))

    # -------------------------------------------------------------
    # PAGE 6: REPORT VIEWER
    # -------------------------------------------------------------
    story.append(Paragraph("📋 PAGE 6: Interactive Clinical Report & Human Oversight (ReportViewer)", h1_style))
    story.append(Paragraph("<b>🎬 Screen Pe Kya Dikhana Hai:</b> Scan complete hote hi master report khulti hai. 1. Heatmap overlay button toggle karke X-ray pe green/yellow bounding box dikhao. 2. Clinical View vs Patient Layman View switch dikhao. 3. Language dropdown se Hindi select karke report Hindi me translate karke dikhao. 4. Radiologist Co-Pilot chat me 'Is there any pleural effusion?' likh ke bhejo. 5. Peer review me doctor note save karke dikhao. 6. 'Download Premium Patient Report' click karke white hospital letterhead PDF dikhao.", body_style))
    story.append(Spacer(1, 3))

    p6_dialogue = (
        "&quot;Scan process hote hi hamara <b>Interactive Clinical Report Viewer</b> generate hota hai. "
        "Is page pe examiner ko impress karne ke liye 6 killer innovations hain:<br/>"
        "<b>1. Dual-View Architecture:</b> AI reports me sabse badi shikayat hoti hai 'Too much jargon'. Humne isko solve kiya: Doctor ke liye <b>Clinical Assessment</b> aata hai jisme exact Radiographic Findings, Severity Score, Differential Diagnosis aur Specialist Referral hoti hai. Aur patient ke liye <b>Layman Assessment</b> aata hai jisme reassuring simple words aur Day-by-Day <b>Actionable Treatment Timeline</b> hoti hai.<br/>"
        "<b>2. Visual Bounding Box Heatmap:</b> AI image ko analyze karke exact normalized coordinates <code>[ymin, xmin, ymax, xmax]</code> return karta hai. Switch toggle karte hi X-ray ke upar exact lung pathology pe bounding box overlay ho jata hai.<br/>"
        "<b>3. Multilingual Clinical Translator:</b> Agar patient ko English nahi aati, toh dropdown se Hindi ya regional bhasha select karte hi poori layman summary instant Hindi me translate ho jati hai.<br/>"
        "<b>4. Interactive Radiologist Co-Pilot Chat:</b> Doctor static report se bound nahi hai. Wo X-ray image ke neeche bane live chat box me ad-hoc sawal pooch sakta hai — jaise 'Left lower lobe me koi effusion hai kya?' — aur Gemini model live image dekh ke reply karta hai.<br/>"
        "<b>5. Human Oversight Peer Review:</b> Medical ethics aur IT compliance ke hisab se AI final authority nahi ho sakta. Agar human radiologist AI ke score se disagree karta hai, toh wo permanent 'Doctor Override Note' save kar sakta hai jo database me sign ho jata hai.<br/>"
        "<b>6. 1-Click Hospital Letterhead PDF:</b> Jab doctor 'Download Report' click karta hai, toh CSS print matrix screen ka dark theme destroy karke use ek ultra-clean official white hospital letterhead me convert kar deta hai!&quot;"
    )
    story.append(make_chat_box("Master Diagnostic Report Walkthrough", p6_dialogue))
    story.append(Spacer(1, 4))

    p6_tech = (
        "• <b>Bounding Box CSS:</b> Normalized coordinates (0-1000) are mapped to percentage positions <code>top: (ymin/10)%, left: (xmin/10)%, width: ((xmax-xmin)/10)%, height: ((ymax-ymin)/10)%</code>.<br/>"
        "• <b>Co-Pilot Endpoint:</b> <code>POST /api/chat</code> passing stored image filename + doctor query back to Gemini.<br/>"
        "• <b>Override Endpoint:</b> <code>POST /api/override</code> updating <code>human_override_note</code> column in SQLite.<br/>"
        "• <b>PDF Generation:</b> <code>html2pdf.js</code> with custom <code>@media print</code> stylesheet hiding navigation buttons and forcing clean medical layout."
    )
    story.append(make_tech_box("ReportViewer Engineering Architecture", p6_tech))
    story.append(Spacer(1, 14))

    # -------------------------------------------------------------
    # PAGE 7: KANBAN TRIAGE BOARD
    # -------------------------------------------------------------
    story.append(Paragraph("🗂️ PAGE 7: Clinical Workflow & Triage Kanban Board (/triage)", h1_style))
    story.append(Paragraph("<b>🎬 Screen Pe Kya Dikhana Hai:</b> Sidebar se 'Clinical Workflow' click karo (ye tab admin login pe dikhta hai). 3 columns dikhao: <b>Waiting Room</b>, <b>Doctor Review</b>, <b>Discharged</b>. Real-time search bar me filter karo. Patient card ka 'Send to Review' click karo — dekho card second column me chala gaya. Fir 'Discharge' click karo.", body_style))
    story.append(Spacer(1, 3))

    p7_dialogue = (
        "&quot;Ab aate hain hospital ke operational backbone pe: <b>Clinical Triage Kanban Board</b>. "
        "Real hospital emergency wards me sabse bada issue hota hai patient throughput jam — kis patient ko pehle doctor ke paas bhejna hai aur kisko discharge karna hai.<br/>"
        "Jaise hi scanner pe koi X-ray scan complete hota hai, patient automatically <b>'Waiting Room'</b> column me add ho jata hai. "
        "Agar patient critical ya high-risk hai, toh uske card pe ek <b>red pulsing glow</b> aati hai taaki triage nurse use turant identify karke doctor ke paas push kar sake.<br/>"
        "Yahan staff single click me patient ko <code>Waiting Room -&gt; Doctor Review -&gt; Discharged</code> state transition karwa sakta hai. "
        "Mobile phones pe horizontal swipe-snap aur search filter bhi chalta hai. Isse hospital bed allocation aur doctor efficiency 300% improve ho jati hai.&quot;"
    )
    story.append(make_chat_box("Kanban Triage Workflow Pitch", p7_dialogue))
    story.append(Spacer(1, 4))

    p7_tech = (
        "• <b>Endpoint:</b> <code>POST /api/triage/update</code> updating <code>triage_status</code> field in SQLite.<br/>"
        "• <b>Security Rule:</b> Role-based access control — Triage board tab navigation me strictly tabhi render hota hai jab active session me <code>username === 'admin'</code> ho.<br/>"
        "• <b>Responsive Layout:</b> CSS <code>scroll-snap-type: x mandatory</code> on mobile screens with interactive swipe-hints."
    )
    story.append(make_tech_box("Kanban State Machine Logic", p7_tech))
    story.append(Spacer(1, 14))

    # -------------------------------------------------------------
    # PAGE 8: PATIENT RECORDS DATABASE
    # -------------------------------------------------------------
    story.append(Paragraph("🗄️ PAGE 8: Patient Records & Longitudinal EHR Database (/database)", h1_style))
    story.append(Paragraph("<b>🎬 Screen Pe Kya Dikhana Hai:</b> Sidebar se 'Patient Records' click karo. Search bar me patient ka naam filter karo. Kisi row pe click karke expand karo — andar Clinical Profile aur <b>Severity History Line Chart</b> dikhao. Fir top-right me 'Export to CSV' button click karke dikhao ki Excel file turant download ho gayi!", body_style))
    story.append(Spacer(1, 3))

    p8_dialogue = (
        "&quot;Ye hamara permanent <b>Patient Records &amp; EHR Directory</b> hai. "
        "Yahan hospital ke saare clinical scans, vitals aur diagnosis securely store hote hain.<br/>"
        "Is page ka sabse powerful aur research-grade feature hai <b>Longitudinal Severity History Tracking</b>: "
        "Jab hum kisi patient ki row pe click karte hain, toh wo expand hoti hai aur andar Recharts ka ek dynamic Line Chart draw hota hai. "
        "Agar ek patient 3 mahine ke dauran 3 baar hospital aaya hai, toh ye chart plot karta hai ki uska severity score 90 se ghat kar 50 aur fir 20 hua ya nahi! "
        "Doctor ko ek nazar me pata chal jata hai ki dawai kaam kar rahi hai aur patient recover ho raha hai ya uski tabiyat deteriorate ho rahi hai.<br/>"
        "Sath hi humne <b>1-Click Native CSV Export</b> diya hai jo pure local SQLite database ko Microsoft Excel format me download kar deta hai offline analytics aur audits ke liye.&quot;"
    )
    story.append(make_chat_box("EHR Database & History Tracking Pitch", p8_dialogue))
    story.append(Spacer(1, 4))

    p8_tech = (
        "• <b>Endpoint:</b> <code>GET /api/patients?org={organization}</code> returning parsed JSON EHR records.<br/>"
        "• <b>Longitudinal Mapping:</b> Severity labels are mapped numerically (Critical=100, High=75, Medium=50, Low=25) to render smooth SVG line charts.<br/>"
        "• <b>Offline CSV Generator:</b> Browser-based data URI blob generation (<code>data:text/csv;charset=utf-8</code>) with automated quote escaping."
    )
    story.append(make_tech_box("EHR Schema & Longitudinal Charting", p8_tech))
    story.append(Spacer(1, 14))

    # -------------------------------------------------------------
    # PAGE 9: ABOUT & HELP CENTER
    # -------------------------------------------------------------
    story.append(Paragraph("ℹ️ PAGE 9: System Architecture & Help Center (/help)", h1_style))
    story.append(Paragraph("<b>🎬 Screen Pe Kya Dikhana Hai:</b> Sidebar bottom se 'About & Help' icon click karo. System Architecture diagram dikhao, Onboarding FAQ accordions click karke expand karo, aur lead developer credentials (Utkarsh Srivastav) dikhao.", body_style))
    story.append(Spacer(1, 3))

    p9_dialogue = (
        "&quot;Lastly, ye hamara <b>System Architecture &amp; Help Center</b> hai. "
        "Yahan Med-AI platform ka complete documentation, multi-modal pipeline diagram, developer credentials, aur new hospital staff ke liye "
        "interactive onboarding FAQs di gayi hain taaki koi bhi naya clinician bina kisi technical training ke system ko turant adopt kar sake.&quot;"
    )
    story.append(make_chat_box("Help & Architecture Center", p9_dialogue))
    story.append(Spacer(1, 14))

    # -------------------------------------------------------------
    # SECTION: TOP 10 VIVA QUESTIONS
    # -------------------------------------------------------------
    story.append(Paragraph("🎯 TOP 10 EXAMINER VIVA QUESTIONS & CRISP HINGLISH ANSWERS", h1_style))
    story.append(Paragraph("Exam me examiner ya viva professor ye 10 sawal zaroor poochenge. Inka exact smart Hinglish answer yaad kar lo:", body_style))
    story.append(Spacer(1, 4))

    viva_qa = [
        (
            "Q1: FastAPI kyu use kiya? Flask ya Django kyu nahi?",
            "Sir, FastAPI is waqt Python ka fastest web framework hai. Isme asynchronous (async/await) support native hai jo heavy AI vision calls ke liye perfect hai taaki server thread block na ho. Plus Pydantic ki automatic schema validation milti hai aur Swagger UI documentation bina kisi extra code ke mil jata hai."
        ),
        (
            "Q2: AI X-ray me bimari kaise detect kar raha hai? Kaun sa model hai?",
            "Sir, hum Google ka Multimodal model 'Gemini 1.5 Flash Vision' use kar rahe hain. Hum X-ray image pixels ke sath patient ke clinical vitals aur precise structured prompt bhejte hain. AI model image ke opacities, lung markings aur bone structures analyze karke normalized bounding box coordinates aur clinical diagnosis JSON me return karta hai."
        ),
        (
            "Q3: Agar Google Gemini API key ki quota limit (HTTP 429) hit ho jaye toh system fail ho jayega?",
            "Nahi sir! Humne backend me 'Multi-Key Rotation Engine' develop kiya hai. System me humne multiple API keys (Key 1, Key 2, Key 3) configure ki hain. Agar ek key rate-limit hoti hai, toh backend error catch karke instant next key pe auto-rotate kar deta hai bina user ko pata chale."
        ),
        (
            "Q4: Medical safety aur AI hallucinations se bachne ke liye kya safeguard banaya?",
            "Sir 3 critical safeguards hain: Pehla, 'Vitals Sanity Check' jo physically impossible vitals detect karke false positive rokta hai. Dusra, 'Dual-View Segregation' jo technical aur layman jargon ko separate rakhta hai. Aur teesra, 'Human Peer Review Override' jo doctor ko AI ke score ko overwrite karke permanent safety note log karne ki legal compliance deta hai."
        ),
        (
            "Q5: Dual-View system ka kya use case hai?",
            "Sir normal AI reports me patient ko medical jargon samajh nahi aati aur wo panic karta hai. Dual-View me Doctor ke liye medical terms (cardiomegaly, pleural effusion) aate hain, jabki Patient ke liye aasan shabdon me summary aur Day-1 se lekar Week-2 tak ka clear Treatment Recovery Timeline aata hai."
        ),
        (
            "Q6: Patient history kaise track ho rahi hai?",
            "Sir SQLite me har scan patient ke name aur organization se mapped hota hai. Jab same patient dubara scan karwata hai, toh system pichle scans ka severity score fetch karke Recharts ke through ek 'Severity History Line Graph' draw karta hai jisse longitudinal health progression track hoti hai."
        ),
        (
            "Q7: TeleConsult module me AI bol kaise raha hai aur sun kaise raha hai?",
            "Sir humne browser-native Web Speech API use kiya hai. Patient ki voice ko transcribe karne ke liye 'webkitSpeechRecognition' use hota hai (Speech-to-Text), aur AI doctor ki advice ko clinical empathetic pace pe bolke sunane ke liye 'SpeechSynthesisUtterance' (Text-to-Speech) use hota hai."
        ),
        (
            "Q8: Mobile responsiveness kaise handle ki?",
            "Sir humne Dual-View CSS Media Queries use ki hain. Desktop pe standard clinical tables dikhti hain, lekin mobile screen pe table automatically 'Stacked Card Layout' me transform ho jati hai, aur Triage board pe swipe-snap lagaya hai taaki horizontal scrolling ki problem na aaye."
        ),
        (
            "Q9: X-ray pe Bounding Box Heatmap kaise plot hota hai?",
            "Sir Gemini AI normalized coordinates [ymin, xmin, ymax, xmax] (scale 0-1000) return karta hai. Frontend React me hum in numbers ko calculate karke CSS percentage `top: (ymin/10)%, left: (xmin/10)%, width: ((xmax-xmin)/10)%, height: ((ymax-ymin)/10)%` me render kar dete hain image container ke upar."
        ),
        (
            "Q10: Database ke liye SQLite kyu chuna? Production me kya hoga?",
            "Sir development aur evaluation ke liye SQLite zero-configuration aur portable hai — koi heavy docker ya external service install nahi karni padti. Code me ORM aur SQL syntax standard relational format me hai, isliye production me sirf connection string badal kar ise PostgreSQL me 5 minute me migrate kiya ja sakta hai."
        )
    ]

    for q, a in viva_qa:
        content = f"<b>{q}</b><br/><br/><b>Answer:</b> &quot;{a}&quot;"
        box = make_box(
            "<b>🎯 VIVA QUESTION &amp; ANSWER</b>",
            content,
            colors.HexColor("#FFFBEB"),
            colors.HexColor("#F59E0B"),
            ParagraphStyle('QATitle', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=8.5, leading=11, textColor=colors.HexColor("#B45309")),
            qa_a
        )
        story.append(box)
        story.append(Spacer(1, 6))

    story.append(Spacer(1, 10))

    # -------------------------------------------------------------
    # SECTION: TIMED PITCH SCRIPTS
    # -------------------------------------------------------------
    story.append(Paragraph("⏱️ TIMED DEMO CHEAT-SHEETS (2-Minute & 5-Minute Guides)", h1_style))
    
    p2m = (
        "<b>0:00 - 0:20 (Login & Architecture):</b> 'Good morning Sir/Ma'am. Today I am demonstrating Med-AI, a Multi-modal Clinical Decision Support System. Starting at our Login page, the system enforces multi-tenant hospital scoping for complete patient data isolation.'<br/>"
        "<b>0:20 - 0:45 (Dashboard & Telemetry):</b> 'On our Admin Dashboard, we track real-time telemetry like our sub-2-second AI latency compared to the human 48-hour turnaround, alongside referring physician charts and an emergency Critical Priority Inbox.'<br/>"
        "<b>0:45 - 1:05 (AI TeleConsult):</b> 'In our AI TeleConsult module, patients in remote areas connect via secure webcam, speak their symptoms using Web Speech recognition, and receive vocal medical advice from our empathetic AI doctor in real time.'<br/>"
        "<b>1:05 - 1:35 (Scanner & Interactive Report):</b> 'In our Clinical Imaging Scanner, we feed Chest X-rays alongside patient vitals and past medical history into Google Gemini 1.5 Flash. The resulting report features visual bounding box heatmaps, dual-view clinical vs layman summaries, Hindi translation, an interactive AI Co-Pilot chat, and 1-click hospital letterhead PDF export.'<br/>"
        "<b>1:35 - 1:55 (Workflow & EHR Database):</b> 'Our Clinical Workflow Kanban Board manages patient flow from Waiting Room to Discharge, while our Patient Database plots longitudinal health severity graphs over time with instant CSV export.'<br/>"
        "<b>1:55 - 2:00 (Conclusion):</b> 'In summary, Med-AI bridges the gap between raw computer vision and hospital operations to save lives and assist doctors. Thank you!'"
    )
    story.append(make_chat_box("The 2-Minute Express Presentation Script", p2m))
    story.append(Spacer(1, 6))

    p5m = (
        "<b>Agar aapke paas 5 minute hain:</b><br/>"
        "1. <b>Minute 1:</b> Problem statement samjhao (Radiologist shortage + 48 hr delay). Login karke Multi-tenancy aur Preloader warm-up explain karo.<br/>"
        "2. <b>Minute 2:</b> Dashboard pe jao — Bar chart aur Donut chart dikhao, Critical red inbox explain karo. Phir TeleConsult me jao aur mic dabake AI doctor se live baat karke dikhao.<br/>"
        "3. <b>Minute 3:</b> Scanner page pe jao — 'Arjun Mehta' select karo taaki examiner ko history mapping dikhe. X-ray upload karo aur Scan click karo.<br/>"
        "4. <b>Minute 4:</b> Report viewer pe Heatmap on karo, Co-Pilot chat me sawal pooch ke live answer dikhao, Hindi translation dikhao, Doctor override note save karo, aur Download Report click karke Hospital PDF dikhao.<br/>"
        "5. <b>Minute 5:</b> Triage board pe card drag/move karke dikhao aur Patient database me expand karke Longitudinal Severity Line Chart dikhao. Viva questions ke liye open kar do!"
    )
    story.append(make_tech_box("The 5-Minute In-Depth Master Demo Plan", p5m))

    # Build PDF
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated PDF: {filename}")

if __name__ == "__main__":
    out_pdf = os.path.join(os.getcwd(), "MED_AI_HINGLISH_SCRIPT_COMPLETE.pdf")
    build_pdf(out_pdf)
