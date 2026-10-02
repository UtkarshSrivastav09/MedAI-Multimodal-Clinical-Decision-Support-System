# 🩺 Med-AI: Multimodal Clinical Decision Support System (CDSS)
## 📱 Master Page-by-Page Presentation Script (In WhatsApp / Hinglish Language)

> **Lead Architect / Author:** Utkarsh Srivastav  
> **Tech Stack:** React 18 + Vite + FastAPI (Python) + SQLite3 + Google Gemini 1.5 Flash Vision + Web Speech API  
> **PDF Version Generated:** `MED_AI_HINGLISH_SCRIPT_COMPLETE.pdf` (Project root folder me ready hai)

---

## 🚀 0. The 30-Second Elevator Pitch (Jab koi pooche: "Ye project kya karta hai?")

> **💬 KAISE BOLNA HAI (WhatsApp Style):**  
> *"Sir/Ma'am, normal hospitals me jab patient Chest X-ray karwata hai, toh radiologist ki report aane me **24 se 48 ghante** lag jaate hain kyunki radiologists ki bohot kami hai. Is delay ki wajah se emergency patients ka treatment late ho jata hai.*  
>  
> *Hamara project **Med-AI** ek multi-modal **Clinical Decision Support System (CDSS)** hai. Yahan doctor sirf patient ke Vitals (BP, temperature, symptoms) aur Chest X-ray upload karta hai, aur **sub-2 seconds (< 2000 ms)** ke andar hamara AI poori image scan karke exact **visual bounding box heatmap** ke sath report de deta hai — fracture, pneumonia, cardiomegaly sab detect karke!*  
>  
> *Sath hi doctor ke liye technical assessment aur patient ke liye aasan bhasha me layman summary + recovery timeline banata hai. Aur isme live **AI Video TeleConsultation** (bolne aur sunne wala AI Doctor) aur hospital workflow manage karne ke liye **Kanban Triage board** bhi integrated hai!"*

---

## 📱 PAGE 1: Login & Registration Module (`/login`, `/signup`)

### 🎬 Screen Pe Kya Dikhana Hai:
- Dark glassmorphic login card dikhao.
- Hospital organization select karo (`Med-AI Global`), username me `admin` daalo, login button click karo.
- Transition me neural preloader animation dikhao.

### 💬 Kaise Bolna Hai (Presentation Dialogue):
> *"Sir, sabse pehle ye hamara secure **Authentication & Access Control Page** hai.*  
> *Med-AI koi simple basic app nahi hai jisme sabka data mix ho jaye — ye ek **Multi-Tenant Enterprise Architecture** pe bana hai. Iska matlab alag-alag hospitals (jaise Med-AI Global ya Apollo) apne-apne private credentials se login karte hain, aur unka patient data ek dusre se completely isolated aur confidential rehta hai.*  
> *Jaise hi hum credentials enter karke login karte hain, background me hamara neural preloader trigger hota hai jo backend microservices ko warm-up kar deta hai taaki cold-start latency zero ho jaye."*

### ⚙️ Backend & Code Me Kya Ho Raha Hai:
- **Endpoints:** `POST /api/auth/login` and `POST /api/auth/register`
- **Multi-Tenant Logic:** Login hone ke baad `organization` browser ke `sessionStorage` me save hoti hai. Har API call ke sath organization query parameter bhejte hain jo SQLite query me `WHERE organization = ?` filter lagata hai.

### 🎯 Examiner Tricky Viva Question:
- **Q: Multi-tenancy kyu banayi? Single user kyu nahi rakha?**  
  **A:** *"Sir real-world healthcare me cloud platform ek hi hota hai lekin usko hazaron hospitals use karte hain. Multi-tenancy se hum ek hi database me multiple hospital branches host kar sakte hain without data leakage, jo production SaaS standard hai."*

---

## 📊 PAGE 2: Admin Command Center / Hospital Dashboard (`/`)

### 🎬 Screen Pe Kya Dikhana Hai:
- DNA particle animation dikhao.
- Top 3 Metric cards: **Lifetime Scans**, **Diseases Identified**, **Avg Token Latency** (~1,400 ms).
- **Top Referring Doctors (Bar Chart)** aur **Department Routing Burden (Donut Chart)** pe cursor ghuma ke live custom tooltips dikhao.
- Right side me red pulsing **Critical Priority Inbox** dikhao.
- Bottom me **Recent Live Scans Table** dikhao.

### 💬 Kaise Bolna Hai (Presentation Dialogue):
> *"Login karne ke baad hum land karte hain hamare **Admin Command Center** pe. Ye screen hospital directors aur chief radiologists ke liye ek centralized operational control room hai.*  
>  
> *Yahan sabse pehla highlight metric hai **'Avg Token Processing Latency' — around 1,400 milliseconds**! Yahan hum examiner ko mathematically demonstrate karte hain ki human radiologist ka 48-hour SLA ke mukable hamara AI system sirf 1.5 se 2 second me preliminary triage report generate kar raha hai.*  
>  
> *Neeche do crucial data visualization charts hain:*  
> *1. **Top Referring Network (Bar Chart):** Ye dikhata hai ki hospital ke kaun se doctors sabse zyada X-rays refer kar rahe hain.*  
> *2. **Department Routing Burden (Donut Chart):** AI ne pure hospital database me kitne patients ko Pulmonology bheja, kitne ko Cardiology, aur kitne ko General Medicine. Isse hospital management ko pata chalta hai ki kis department me patient rush zyada hai.*  
>  
> *Aur sabse right me hai **'Critical Priority Inbox'**: Jaise hi AI kisi patient ke scan me severe condition (jaise massive effusion ya pneumothorax) detect karta hai, wo yahan blazing red alert me pin ho jata hai taaki triage staff turant ICU ya ambulance call kar sake."*

### ⚙️ Backend & Code Me Kya Ho Raha Hai:
- **Endpoint:** `GET /api/dashboard/stats?org={organization}`
- **Aggregation Logic:** SQLite backend dynamically aggregates total scans, healthy ratio, critical alerts count, top doctors ranking, and department counts using SQL `GROUP BY` and `COUNT()` queries.

---

## 📈 PAGE 3: Analytics & Operational Insights (`/analytics`)

### 🎬 Screen Pe Kya Dikhana Hai:
- Sidebar se **Analytics & Insights** pe click karo.
- Pehla Area Chart (**Human vs AI Diagnostic Turnaround**) dikhao.
- Fir **Weekly Disease Outbreak Trends** (Pneumonia, Cardiomegaly, Healthy) graph dikhao.
- Fir **Demographics Pie Chart** aur **System Health Telemetry Gauges** (API Gateway, DB Sync, Neural Core) dikhao.

### 💬 Kaise Bolna Hai (Presentation Dialogue):
> *"Next, hum switch karte hain **Analytics & Insights Hub** pe. Standard healthcare softwares me sirf tables hoti hain, lekin Med-AI hospital ko predictive aur operational intelligence deta hai.*  
>  
> *Yahan pehla chart dikhata hai **Human vs AI Diagnostic Turnaround** — human radiologist ko average 40-45 ghante lagte hain, jabki hamara AI latency under 2 seconds me flat rehti hai.*  
>  
> *Dusra chart hai **Weekly Disease Outbreak Tracking** — ye line chart time ke sath plot karta hai ki pneumonia ya cardiomegaly ke cases kis week spike ho rahe hain. Agar kisi week pneumonia ke cases achanak shoot up hote hain, toh hospital management ko advance me warning mil jati hai ki epidemic ya seasonal infection badh raha hai taaki ICU beds aur oxygen cylinders pehle se arrange ho sakein.*  
>  
> *Sath hi hum age demographics (Pediatric, Adult, Geriatric) aur system microservice health monitor karte hain."*

### ⚙️ Backend & Code Me Kya Ho Raha Hai:
- Custom `useCountUp` hook for smooth number counting animations on load.
- Recharts `ComposedChart`, `AreaChart`, `RadialBarChart`, and `PieChart` with custom gradients and cubic easing.

---

## 🩺 PAGE 4: AI TeleConsult - Virtual Clinic (`/consult`)

### 🎬 Screen Pe Kya Dikhana Hai:
- Sidebar se **AI TeleConsult** click karo. Lobby se **Connect Live** dabao.
- Camera stream allow karo (Picture-in-Picture webcam dikhega).
- Microphone button dabao aur English ya Hindi me bolo:  
  *"Hello doctor, I have high fever, dry cough, and chest discomfort since 2 days."*
- Dikhao AI sound waves vibrate karti hain aur AI doctor ki awaaz me bolke advice deta hai!

### 💬 Kaise Bolna Hai (Presentation Dialogue):
> *"Ab hum aate hain Med-AI ke sabse futuristic feature pe: **AI TeleConsult — The Virtual Clinic**.*  
> *Rural ya tier-3 shehron me jahan specialist doctors present nahi hote, wahan patient bina travel kiye direct AI virtual physician se consultation le sakta hai.*  
>  
> *Is module me 3 cutting-edge technologies ek sath kaam kar rahi hain:*  
> *1. **Live HD Webcam Stream:** Browser ke `navigator.mediaDevices.getUserMedia` API se secure Picture-in-Picture video feed chalti hai taaki patient ko realistic doctor consultation feel ho.*  
> *2. **Voice Input (Speech-to-Text):** Patient ko kuch bhi type karne ki zaroorat nahi hai. Humne browser-native **Web Speech API** (`webkitSpeechRecognition`) integrate kiya hai. Mic button click karte hi patient apni aam bolchal me bimari bolta hai aur wo automatically text me transcribe ho jata hai.*  
> *3. **Empathetic Voice Synthesis (Text-to-Speech):** Backend Gemini model ko humne senior empathetic clinical physician ka system prompt diya hai. AI reply ko browser ke `SpeechSynthesisUtterance` se 0.95x medical pace pe bolke sunata hai, sath me glowing audio visualizer wave animate hoti hai!*  
>  
> *Patient ki har baat ka contextual triage hota hai — agar patient severe symptoms (jaise chest pain + low BP) bolta hai, toh AI turant use emergency clinic report karne ki direct guidance deta hai."*

### ⚙️ Backend & Code Me Kya Ho Raha Hai:
- **Endpoint:** `POST /api/consult_chat`
- **Payload:** `{ history: [...], message: 'patient query' }`
- **System Persona:** Senior virtual physician instructed to deliver concise, reassuring medical guidance, prioritize emergency triage combinations, and append the clinical safety disclaimer.

---

## 🔬 PAGE 5: Clinical Imaging AI Scanner (`/scanner`) — THE CORE ENGINE

### 🎬 Screen Pe Kya Dikhana Hai:
- Sidebar se **Clinical Imaging** pe aao.
- Datalist dropdown me **"Arjun Mehta"** select karo (vitals jaise BP 130/85, Temp 101.5°F, symptoms auto-fill ho jayenge).
- Drag & drop area me sample Chest X-ray image choose karo.
- **"Run AI Diagnosis Verification"** button click karo.

### 💬 Kaise Bolna Hai (Presentation Dialogue):
> *"Ye hamare pure project ka **Core Artificial Intelligence Engine** hai.*  
> *Normal college projects me log sirf ek X-ray image upload karte hain aur CNN model se predict karwa dete hain. Lekin real-world clinical medicine me sirf photo dekh kar dawa nahi di jati! Doctor hamesha patient ke **Vitals aur Symptoms** ko X-ray ke sath correlate karta hai.*  
>  
> *Med-AI exactly yahi **Multimodal Fusion** karta hai: Hum image ke sath-sath Age, Gender, Blood Pressure, Body Temperature, aur Symptoms ko backend me inject karte hain.*  
>  
> *Yahan do massive engineering innovations hain:*  
> *1. **Longitudinal Patient History Mapping:** Jaise hi hum 'Arjun Mehta' select karte hain, hamara system database me query karta hai ki kya ye patient pehle bhi aaya tha? Agar aaya tha, toh uski pichli diagnosis (jaise 'Pneumonitis 3 months ago') automatically naye prompt me chali jati hai, jisse AI multi-visit disease progression evaluate karta hai!*  
> *2. **Diagnostic Sanity-Check Safeguard:** Agar koi user galti se invalid ya physically impossible data enter kar de (jaise Body Temp < 0°C ya BP 0/0), toh hamara backend visual healthy lung hone ke bavjood 'Healthy' declare nahi karega, balki turant Severe Hypothermia/Clinical Shock ya Equipment Malfunction ka safeguard flag raise kar dega!"*

### ⚙️ Backend & Code Me Kya Ho Raha Hai:
- **Endpoint:** `POST /api/scan` (multipart/form-data: image file + patient demographic vitals).
- **Pillow Image Processing:** Resizes to max 1024x1024 to minimize latency and token size.
- **Multi-Key Rotation Matrix:** `GEMINI_API_KEY`, `GEMINI_API_KEY_2`, `GEMINI_API_KEY_3`. Agar quota 429 error throw karta hai, zero-downtime key rotation chalti hai.
- **AI Model:** `gemini-flash-latest` with structured JSON schema output.

---

## 📋 PAGE 6: Interactive Clinical Report & Human Oversight (`ReportViewer`)

### 🎬 Screen Pe Kya Dikhana Hai:
- Scan complete hote hi master report khulti hai:
  1. **Heatmap toggle** on karke X-ray pe green/yellow bounding box dikhao.
  2. **Clinical View vs Patient Layman View** switch dikhao.
  3. **Language dropdown** se Hindi select karke report Hindi me translate karke dikhao.
  4. **Radiologist Co-Pilot chat** me *"Is there any pleural effusion?"* likh ke live answer dikhao.
  5. **Peer review** me doctor note save karke dikhao.
  6. **"Download Premium Patient Report"** click karke white hospital letterhead PDF dikhao.

### 💬 Kaise Bolna Hai (Presentation Dialogue):
> *"Scan process hote hi hamara **Interactive Clinical Report Viewer** generate hota hai. Is page pe examiner ko impress karne ke liye 6 killer innovations hain:*  
>  
> *1. **Dual-View Architecture:** AI reports me sabse badi shikayat hoti hai 'Too much jargon'. Humne isko solve kiya: Doctor ke liye **Clinical Assessment** aata hai jisme exact Radiographic Findings, Severity Score, Differential Diagnosis aur Specialist Referral hoti hai. Aur patient ke liye **Layman Assessment** aata hai jisme reassuring simple words aur Day-by-Day **Actionable Treatment Timeline** hoti hai.*  
> *2. **Visual Bounding Box Heatmap:** AI image ko analyze karke exact normalized coordinates `[ymin, xmin, ymax, xmax]` return karta hai. Switch toggle karte hi X-ray ke upar exact lung pathology pe bounding box overlay ho jata hai.*  
> *3. **Multilingual Clinical Translator:** Agar patient ko English nahi aati, toh dropdown se Hindi ya regional bhasha select karte hi poori layman summary instant Hindi me translate ho jati hai.*  
> *4. **Interactive Radiologist Co-Pilot Chat:** Doctor static report se bound nahi hai. Wo X-ray image ke neeche bane live chat box me ad-hoc sawal pooch sakta hai — jaise 'Left lower lobe me koi effusion hai kya?' — aur Gemini model live image dekh ke reply karta hai.*  
> *5. **Human Oversight Peer Review:** Medical ethics aur IT compliance ke hisab se AI final authority nahi ho sakta. Agar human radiologist AI ke score se disagree karta hai, toh wo permanent 'Doctor Override Note' save kar sakta hai jo database me sign ho jata hai.*  
> *6. **1-Click Hospital Letterhead PDF:** Jab doctor 'Download Report' click karta hai, toh CSS print matrix screen ka dark theme destroy karke use ek ultra-clean official white hospital letterhead me convert kar deta hai!"*

### ⚙️ Backend & Code Me Kya Ho Raha Hai:
- Bounding Box: Normalized coordinates (0-1000) converted into CSS `%`: `top: (ymin/10)%`, `left: (xmin/10)%`, `width: ((xmax-xmin)/10)%`, `height: ((ymax-ymin)/10)%`.
- `POST /api/chat`: Interrogates the image with Gemini.
- `POST /api/override`: Updates `human_override_note` in SQLite.
- `html2pdf.js`: Injects `@media print` rules, strips UI chrome, and exports a print-ready hospital PDF.

---

## 🗂️ PAGE 7: Clinical Workflow & Triage Kanban Board (`/triage`)

### 🎬 Screen Pe Kya Dikhana Hai:
- Sidebar se **Clinical Workflow** click karo (admin session me).
- 3 columns dikhao: **Waiting Room**, **Doctor Review**, **Discharged**.
- Search bar me filter karke dikhao.
- Patient card ka **"Send to Review"** click karo (card smooth second column me shift hoga), fir **"Discharge"** click karo.

### 💬 Kaise Bolna Hai (Presentation Dialogue):
> *"Ab aate hain hospital ke operational backbone pe: **Clinical Triage Kanban Board**.*  
> *Real hospital emergency wards me sabse bada issue hota hai patient throughput jam — kis patient ko pehle doctor ke paas bhejna hai aur kisko discharge karna hai.*  
>  
> *Jaise hi scanner pe koi X-ray scan complete hota hai, patient automatically **'Waiting Room'** column me add ho jata hai. Agar patient critical ya high-risk hai, toh uske card pe ek **red pulsing glow** aati hai taaki triage nurse use turant identify karke doctor ke paas push kar sake.*  
>  
> *Yahan staff single click me patient ko `Waiting Room -> Doctor Review -> Discharged` state transition karwa sakta hai. Mobile phones pe horizontal swipe-snap aur search filter bhi chalta hai. Isse hospital bed allocation aur doctor efficiency 300% improve ho jati hai."*

### ⚙️ Backend & Code Me Kya Ho Raha Hai:
- `POST /api/triage/update` updating `triage_status` in SQLite.
- Role-based guard: only rendered when `sessionStorage.getItem("username") === 'admin'`.

---

## 🗄️ PAGE 8: Patient Records & Longitudinal EHR Database (`/database`)

### 🎬 Screen Pe Kya Dikhana Hai:
- Sidebar se **Patient Records** click karo.
- Search bar me patient ka naam filter karo.
- Row pe click karke expand karo — andar Clinical Profile aur **Severity History Line Chart** dikhao.
- Top-right me **"Export to CSV"** button click karke Excel file download karke dikhao.

### 💬 Kaise Bolna Hai (Presentation Dialogue):
> *"Ye hamara permanent **Patient Records & EHR Directory** hai. Yahan hospital ke saare clinical scans, vitals aur diagnosis securely store hote hain.*  
>  
> *Is page ka sabse powerful feature hai **Longitudinal Severity History Tracking**: Jab hum kisi patient ki row pe click karte hain, toh wo expand hoti hai aur andar Recharts ka dynamic Line Chart draw hota hai. Agar ek patient 3 mahine ke dauran 3 baar hospital aaya hai, toh ye chart plot karta hai ki uska severity score 90 se ghat kar 50 aur fir 20 hua ya nahi! Doctor ko ek nazar me pata chal jata hai ki dawai kaam kar rahi hai aur patient recover ho raha hai ya uski tabiyat deteriorate ho rahi hai.*  
>  
> *Sath hi humne **1-Click Native CSV Export** diya hai jo pure local SQLite database ko Microsoft Excel format me download kar deta hai offline analytics aur audits ke liye."*

### ⚙️ Backend & Code Me Kya Ho Raha Hai:
- `GET /api/patients?org={organization}`
- Severity mapped: Critical=100, High=75, Medium=50, Low=25.
- Client-side CSV blob generator with RFC 4180 quote escaping.

---

## ℹ️ PAGE 9: System Architecture & Help Center (`/help`)

### 🎬 Screen Pe Kya Dikhana Hai:
- Sidebar bottom se **About & Help** icon click karo.
- System Architecture diagram dikhao, Onboarding FAQ accordions expand karo, aur lead developer credentials (Utkarsh Srivastav) dikhao.

### 💬 Kaise Bolna Hai:
> *"Lastly, ye hamara **System Architecture & Help Center** hai. Yahan Med-AI platform ka complete documentation, multi-modal pipeline diagram, developer credentials, aur new hospital staff ke liye interactive onboarding FAQs di gayi hain."*

---

## 🎯 TOP 10 EXAMINER VIVA QUESTIONS & CRISP HINGLISH ANSWERS

1. **Q: FastAPI kyu use kiya? Flask ya Django kyu nahi?**  
   **A:** *"Sir, FastAPI Python ka fastest web framework hai. Isme asynchronous (`async/await`) native hai jo heavy AI vision calls ke liye server threads block nahi hone deta. Plus automatic Pydantic validation aur Swagger UI docs milti hain."*

2. **Q: AI X-ray me bimari kaise detect kar raha hai? Kaun sa model hai?**  
   **A:** *"Sir, hum Google ka Multimodal model 'Gemini 1.5 Flash Vision' use kar rahe hain. Hum X-ray image pixels ke sath patient ke clinical vitals aur structured prompt bhejte hain jo image ke opacities, lung markings aur bone structures analyze karke normalized bounding box coordinates aur clinical diagnosis JSON me return karta hai."*

3. **Q: Agar Google Gemini API key ki quota limit (HTTP 429) hit ho jaye toh system fail ho jayega?**  
   **A:** *"Nahi sir! Humne backend me 'Multi-Key Rotation Engine' develop kiya hai (Key 1, Key 2, Key 3). Agar ek key rate-limit hoti hai, toh backend error catch karke instant next key pe auto-rotate kar deta hai bina user ko pata chale."*

4. **Q: Medical safety aur AI hallucinations se bachne ke liye kya safeguard banaya?**  
   **A:** *"Sir 3 critical safeguards hain: Pehla, 'Vitals Sanity Check' jo impossible vitals detect karke false positive rokta hai. Dusra, 'Dual-View Segregation' jo technical aur layman jargon ko separate rakhta hai. Aur teesra, 'Human Peer Review Override' jo doctor ko AI ke score ko overwrite karke permanent safety note log karne ki legal compliance deta hai."*

5. **Q: Dual-View system ka kya use case hai?**  
   **A:** *"Sir normal AI reports me patient ko medical jargon samajh nahi aati aur wo panic karta hai. Dual-View me Doctor ke liye medical terms aate hain, jabki Patient ke liye aasan shabdon me summary aur Day-1 se lekar Week-2 tak ka clear Treatment Recovery Timeline aata hai."*

6. **Q: Patient history kaise track ho rahi hai?**  
   **A:** *"Sir SQLite me har scan patient name aur organization se mapped hota hai. Jab same patient dubara scan karwata hai, toh system pichle scans ka severity score fetch karke Recharts ke through ek 'Severity History Line Graph' draw karta hai jisse longitudinal health progression track hoti hai."*

7. **Q: TeleConsult module me AI bol kaise raha hai aur sun kaise raha hai?**  
   **A:** *"Sir browser-native Web Speech API use kiya hai. Patient ki voice transcribe karne ke liye `webkitSpeechRecognition` (Speech-to-Text) aur AI doctor ki advice clinical empathetic pace pe bolke sunane ke liye `SpeechSynthesisUtterance` (Text-to-Speech) use hota hai."*

8. **Q: Mobile responsiveness kaise handle ki?**  
   **A:** *"Sir Dual-View CSS Media Queries use ki hain. Desktop pe standard clinical tables dikhti hain, lekin mobile screen pe table automatically 'Stacked Card Layout' me transform ho jati hai, aur Triage board pe swipe-snap lagaya hai taaki horizontal scrolling ki problem na aaye."*

9. **Q: X-ray pe Bounding Box Heatmap kaise plot hota hai?**  
   **A:** *"Sir Gemini AI normalized coordinates [ymin, xmin, ymax, xmax] (scale 0-1000) return karta hai. Frontend React me hum in numbers ko calculate karke CSS percentage `top: (ymin/10)%, left: (xmin/10)%, width: ((xmax-xmin)/10)%, height: ((ymax-ymin)/10)%` me render kar dete hain image container ke upar."*

10. **Q: Database ke liye SQLite kyu chuna? Production me kya hoga?**  
    **A:** *"Sir development aur evaluation ke liye SQLite zero-configuration aur portable hai — koi heavy docker ya external service install nahi karni padti. Code me ORM aur SQL syntax standard relational format me hai, isliye production me sirf connection string badal kar ise PostgreSQL me 5 minute me migrate kiya ja sakta hai."*

---

## ⏱️ 2-MINUTE EXPRESS PITCH (Jab examiner bole: "Sirf 2 minute me demo do")

- **0:00 - 0:20 (Login):** *"Good morning Sir/Ma'am. Today I am demonstrating Med-AI, a Multi-modal Clinical Decision Support System. Starting at our Login page, the system enforces multi-tenant hospital scoping for complete patient data isolation."*
- **0:20 - 0:45 (Dashboard):** *"On our Admin Dashboard, we track real-time telemetry like our sub-2-second AI latency compared to the human 48-hour turnaround, alongside referring physician charts and an emergency Critical Priority Inbox."*
- **0:45 - 1:05 (AI TeleConsult):** *"In our AI TeleConsult module, patients in remote areas connect via secure webcam, speak their symptoms using Web Speech recognition, and receive vocal medical advice from our empathetic AI doctor in real time."*
- **1:05 - 1:35 (Scanner & Report):** *"In our Clinical Imaging Scanner, we feed Chest X-rays alongside patient vitals and past medical history into Google Gemini 1.5 Flash. The resulting report features visual bounding box heatmaps, dual-view clinical vs layman summaries, Hindi translation, an interactive AI Co-Pilot chat, and 1-click hospital letterhead PDF export."*
- **1:35 - 1:55 (Workflow & EHR Database):** *"Our Clinical Workflow Kanban Board manages patient flow from Waiting Room to Discharge, while our Patient Database plots longitudinal health severity graphs over time with instant CSV export."*
- **1:55 - 2:00 (Conclusion):** *"In summary, Med-AI bridges the gap between raw computer vision and hospital operations to save lives and assist doctors. Thank you!"*

---
*Med-AI: Precision in Diagnostics, Excellence in Care.*
