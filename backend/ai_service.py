import os
import json
import warnings
warnings.filterwarnings("ignore")
import google.generativeai as genai
try:
    from google.generativeai.generative_models import GenerativeModel
    if not hasattr(genai, "GenerativeModel"):
        genai.GenerativeModel = GenerativeModel
except Exception:
    pass
from PIL import Image
from dotenv import load_dotenv

load_dotenv()

def get_keys():
    # Read the .env file directly from disk to bypass OS environment cache/override issues
    keys_dict = {}
    try:
        dotenv_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
        if os.path.exists(dotenv_path):
            with open(dotenv_path, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if not line or line.startswith("#"):
                        continue
                    if "=" in line:
                        k, v = line.split("=", 1)
                        k, v = k.strip(), v.strip()
                        # Strip inline comments (e.g. key_val # comment)
                        if "#" in v:
                            v = v.split("#", 1)[0].strip()
                        # Strip quotes if any
                        if v.startswith(('"', "'")) and v.endswith(('"', "'")):
                            v = v[1:-1]
                        keys_dict[k] = v
    except Exception as e:
        print(f"System Warning: Direct .env read failed: {e}")

    # Fall back to os.getenv if key not found in file
    key1 = keys_dict.get("GEMINI_API_KEY") or os.getenv("GEMINI_API_KEY")
    key2 = keys_dict.get("GEMINI_API_KEY_2") or os.getenv("GEMINI_API_KEY_2")
    key3 = keys_dict.get("GEMINI_API_KEY_3") or os.getenv("GEMINI_API_KEY_3")

    # Sync back to os.environ so other modules/packages can access them
    if key1: os.environ["GEMINI_API_KEY"] = key1
    if key2: os.environ["GEMINI_API_KEY_2"] = key2
    if key3: os.environ["GEMINI_API_KEY_3"] = key3

    keys = [key1, key2, key3]
    return [k for k in keys if k]

current_key_index = 0
_last_keys_list = []

CANDIDATE_MODELS = [
    "gemini-2.5-flash",
    "gemini-3.1-flash-lite",
    "gemini-3.5-flash-lite",
    "gemini-flash-latest",
    "gemini-3.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-3.8-flash"
]

def get_rotated_model(model_name="gemini-2.5-flash", generation_config=None):
    global current_key_index, _last_keys_list
    keys = get_keys()
    if not keys:
        raise Exception("No API keys found in .env file")
    
    # Reset to index 0 if keys on disk changed (e.g. user pasted new keys)
    if keys != _last_keys_list:
        print("System: Detected change in API keys on disk. Resetting active key index to 1.")
        current_key_index = 0
        _last_keys_list = keys.copy()
        
    if current_key_index >= len(keys):
        current_key_index = 0
        
    active_key = keys[current_key_index]
    masked_key = active_key[:8] + "..." + active_key[-4:]
    print(f"System: Using API Key {current_key_index + 1}/{len(keys)} ({masked_key}) with model {model_name}")
    
    genai.configure(api_key=active_key)
    if generation_config:
        return genai.GenerativeModel(model_name, generation_config=generation_config)
    return genai.GenerativeModel(model_name)

def switch_to_next_key():
    global current_key_index
    keys = get_keys()
    if len(keys) > 1:
        current_key_index = (current_key_index + 1) % len(keys)
        print(f"System: Rotating to next key. New active index: {current_key_index}")
    else:
        print("System: No more keys to rotate.")

def analyze_xray(image_path: str, context: dict = {}, past_history_json: str = None) -> dict:
    # Try each available API key and model if quota is hit
    keys = get_keys()
    json_config = {"response_mime_type": "application/json", "temperature": 0.2}
    
    for attempt in range(len(keys)):
        for target_model in CANDIDATE_MODELS:
            try:
                model = get_rotated_model(target_model, generation_config=json_config)
                img = Image.open(image_path).convert("RGB")
                img.thumbnail((600, 600))
                
                prompt = f"""
                You are an expert radiologist and clinical AI assistant. Analyze this chest X-ray in detail.
                Patient Context: Age {context.get('age')}, Gender {context.get('gender')}, Symptoms {context.get('symptoms')}, Blood Pressure {context.get('bloodPressure')}, Temperature {context.get('temperature')}.
                
                Return a comprehensive diagnostic report strictly in the following JSON schema:
                {{
                    "clinical_assessment": {{
                        "diseases": ["Disease/Finding 1", "Disease/Finding 2"],
                        "severity": "Low/Medium/High/Critical",
                        "confidence_score": 92,
                        "key_findings": "Precise radiographic and clinical findings...",
                        "differential_diagnosis": "Differential possibilities...",
                        "recommended_followup": "Actionable next steps and confirmatory tests..."
                    }},
                    "patient_layman_assessment": {{
                        "layman_diseases": ["Simplified Finding Name 1"],
                        "layman_findings": "Clear, compassionate explanation in simple terms...",
                        "layman_summary": "A reassuring 2-sentence summary for the patient.",
                        "treatment_timeline": [
                            {{"phase": "Immediate (Day 1)", "action": "Consult attending physician / start prescribed care"}},
                            {{"phase": "Follow-up (Week 1-2)", "action": "Re-evaluate symptoms or repeat imaging if needed"}}
                        ]
                    }},
                    "visual_annotations": [
                        {{"box_2d": [150, 200, 450, 500], "label": "Area of Interest / Opacity", "confidence": 90}}
                    ],
                    "referrals": "Recommended Specialist (e.g., Pulmonologist / Cardiologist / General Physician)"
                }}
                
                Note: box_2d is [ymin, xmin, ymax, xmax] in normalized coordinates (0-1000). Return ONLY the JSON object.
                """
                response = model.generate_content([prompt, img])
                
                raw_text = ""
                if hasattr(response, "text"):
                    try: raw_text = response.text
                    except: pass
                if not raw_text and hasattr(response, "candidates") and response.candidates:
                    parts = response.candidates[0].content.parts
                    raw_text = "".join([p.text for p in parts if hasattr(p, "text") and not getattr(p, "thought", False)])
                    
                cleaned_response = raw_text.strip().replace("```json", "").replace("```", "")
                
                # Robust JSON cleaning: Remove trailing commas before closing braces/brackets
                import re
                cleaned_response = re.sub(r',\s*([\]}])', r'\1', cleaned_response)
                
                parsed = json.loads(cleaned_response)
                # Ensure visual_annotations is always present and strictly validated
                if parsed.get("visual_annotations") and isinstance(parsed["visual_annotations"], list):
                    clean_ann = []
                    for ann in parsed["visual_annotations"]:
                        if isinstance(ann, dict) and "box_2d" in ann and isinstance(ann["box_2d"], list) and len(ann["box_2d"]) == 4:
                            clean_ann.append(ann)
                    parsed["visual_annotations"] = clean_ann

                if not parsed.get("visual_annotations"):
                    diseases = parsed.get("clinical_assessment", {}).get("diseases", [])
                    main_finding = diseases[0] if (diseases and diseases[0] not in ["Normal", "Healthy", "None"]) else "Thoracic / Pulmonary ROI"
                    parsed["visual_annotations"] = [
                        {"box_2d": [200, 180, 750, 820], "label": main_finding, "confidence": parsed.get("clinical_assessment", {}).get("confidence_score", 92)}
                    ]
                return parsed

            except Exception as e:
                error_msg = str(e)
                print(f"DEBUG: Key {current_key_index + 1} Model {target_model} Error -> {error_msg[:100]}")
                
                if "finish_reason: SAFETY" in error_msg or "HARM" in error_msg:
                    return {
                        "clinical_assessment": { "diseases": ["Safety Filter Blocked"] },
                        "patient_layman_assessment": { "layman_summary": "The AI declined to analyze this image due to safety filters. This usually happens if the image is detected as non-medical or sensitive." }
                    }
                continue
        
        print(f"System: Key {current_key_index + 1} all models failed or quota reached. Trying next key...")
        switch_to_next_key()
    
    # If all keys fail
    return { 
        "clinical_assessment": { "diseases": ["System Error / Quota Exhausted"] }, 
        "patient_layman_assessment": { "layman_summary": "All API keys failed or exceeded their quota. Please check your API keys in the .env file." } 
    }

def chat_interrogate_xray(image_name: str, question: str) -> str:
    keys = get_keys()
    for attempt in range(len(keys)):
        for target_model in CANDIDATE_MODELS:
            try:
                model = get_rotated_model(target_model, generation_config={"temperature": 0.3})
                image_path = os.path.join("temp_uploads", image_name)
                if not os.path.exists(image_path):
                    return f"Error: Image '{image_name}' not found."
                    
                img = Image.open(image_path).convert("RGB")
                img.thumbnail((600, 600))
                prompt = f"You are a radiologist. Answer clearly and concisely: {question}"
                response = model.generate_content([prompt, img])
                return response.text.strip()
            except Exception as e:
                print(f"DEBUG: Chat Key {current_key_index + 1} Model {target_model} Error -> {str(e)[:100]}")
                continue
        switch_to_next_key()
    return "All API keys failed or quota exceeded. Please check your API keys."

def translate_clinical_text(text: str, target_lang: str) -> str:
    keys = get_keys()
    for attempt in range(len(keys)):
        for target_model in CANDIDATE_MODELS:
            try:
                model = get_rotated_model(target_model, generation_config={"temperature": 0.2})
                prompt = f"""
                Translate the following clinical text strictly into {target_lang}. 
                REQUIREMENTS:
                1. The ENTIRE response must be in {target_lang} only. 
                2. Use a professional, empathetic, and clear clinical tone (suitable for a patient).
                3. Do not include any English words or explanations in the response.
                4. DO NOT use markdown bolding, asterisks, or special characters.
                
                TEXT TO TRANSLATE:
                {text}
                """
                response = model.generate_content(prompt)
                return response.text.strip()
            except Exception as e:
                print(f"DEBUG: Translate Key {current_key_index + 1} Model {target_model} Error -> {str(e)[:100]}")
                continue
        switch_to_next_key()
            
    # Final Fallback if all keys exhausted
    return "The translation service is currently unavailable. Please verify API keys or try again in a moment."

def simulate_doctor_consult(history: list, latest_message: str) -> str:
    keys = get_keys()
    for attempt in range(len(keys)):
        for target_model in CANDIDATE_MODELS:
            try:
                model = get_rotated_model(target_model, generation_config={"temperature": 0.3})
                
                # Professional System Prompt
                system_intro = """
                You are 'Med-AI', a senior virtual physician conducting a clinical tele-consultation.
                1. Provide a direct, professional, and clear clinical assessment based on the patient's symptoms.
                2. If the patient mentions critical or severe symptoms (such as high fever combined with low blood pressure), immediately address the combination of these symptoms (which can indicate serious conditions like sepsis or severe systemic infection) and provide clear, direct instructions on what to do next.
                3. DO NOT ask repetitive, redundant, or basic clarifying questions if the patient has already provided the details (e.g., if they say their blood pressure is low, do not ask "what is your blood pressure?").
                4. If more information is genuinely needed for non-emergency symptoms, ask up to 2 precise clinical questions, but prioritize direct guidance.
                5. Keep the tone clinical, professional, and reassuring.
                6. DO NOT use asterisks (*) or markdown bolding.
                7. Always put the standard Emergency Disclaimer at the bottom.
                """

                formatted_history = []
                for msg in history:
                    role = "user" if msg["role"] == "user" else "model"
                    formatted_history.append({"role": role, "parts": [msg["content"]]})

                chat = model.start_chat(history=formatted_history)
                prompt = f"{system_intro}\n\nPatient: {latest_message}"
                response = chat.send_message(prompt)
                return response.text.strip()
            except Exception as e:
                print(f"DEBUG: Consult Key {current_key_index + 1} Model {target_model} Error -> {str(e)[:100]}")
                continue
        switch_to_next_key()
    return "All system nodes busy or API keys failed. Please retry later."
