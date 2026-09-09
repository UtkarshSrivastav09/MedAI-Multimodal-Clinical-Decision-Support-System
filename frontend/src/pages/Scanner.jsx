import React, { useState, useEffect, useRef } from 'react';
import { UploadCloud, Loader2, User, Thermometer, Activity, ClipboardList } from 'lucide-react';
import ReportViewer from '../components/ReportViewer';
import API_BASE_URL from '../api';
import './Scanner.css';

export default function Scanner() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [error, setError] = useState("");
  const [uploadedImageName, setUploadedImageName] = useState("");

  const [metaDocs, setMetaDocs] = useState([]);
  const [metaPts, setMetaPts] = useState([]);

  const [form, setForm] = useState({
    name: "", age: "", gender: "Male", bloodPressure: "", temperature: "", symptoms: "", doctor: "", phone: "", email: ""
  });

  useEffect(() => {
    const org = sessionStorage.getItem("organization") || "Med-AI Global";
    fetch(`${API_BASE_URL}/api/scanner-meta?org=${encodeURIComponent(org)}`)
      .then(r => r.json())
      .then(d => {
        setMetaDocs(d.doctors);
        setMetaPts(d.patients);
        // Automatically select the first doctor if none is set
        if (d.doctors.length > 0 && !form.doctor) {
            setForm(prev => ({...prev, doctor: d.doctors[0]}));
        }
      });
  }, []);

  const handlePatientSelect = (e) => {
    const pName = e.target.value;
    setForm({...form, name: pName});
    const found = metaPts.find(x => x.name.toLowerCase() === pName.toLowerCase());
    if (found) {
        setForm(prev => ({
            ...prev,
            age: found.age,
            gender: found.gender,
            bloodPressure: found.bloodPressure,
            temperature: found.temperature,
            phone: found.phone,
            email: found.email
        }));
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setReport(null);
      setError("");
    }
  };

  const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value});

  const handleScan = async () => {
    if (!file) { setError("Must upload a medical image first."); return; }
    if (!form.name) { setError("Patient Name is required."); return; }
    
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", form.name);
    formData.append("age", form.age);
    formData.append("gender", form.gender);
    formData.append("bloodPressure", form.bloodPressure);
    formData.append("temperature", form.temperature);
    formData.append("symptoms", form.symptoms);
    formData.append("doctor", form.doctor || "Internal Primary");
    formData.append("phone", form.phone || "N/A");
    formData.append("email", form.email || "N/A");
    formData.append("org", sessionStorage.getItem("organization") || "Med-AI Global");

    try {
      const response = await fetch(`${API_BASE_URL}/api/scan`, {
        method: "POST",
        body: formData,
      });
      
      const data = await response.json();
      if (data.status === "success") {
        setReport(data.report);
        setPatientData({...data.patient, id: data.patient_id});
        setUploadedImageName(data.image_name);
      } else {
        setError("Failed to generate report.");
      }
    } catch (err) {
      setError("Failed to connect to AI engine. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  if (report) {
     return <div className="animate-fade-in"><ReportViewer report={report} patient={patientData} imageName={uploadedImageName} preview={preview} patient_id={patientData.id} onReset={() => { setReport(null); setFile(null); setPreview(null); }} /></div>;
  }

  return (
    <div className="animate-fade-in scanner-container hide-on-print">
      
      <datalist id="patient-list">
        {metaPts.map((p, idx) => <option key={idx} value={p.name} />)}
      </datalist>

      <div className="scanner-header">
        <h1>Clinical Imaging AI</h1>
        <p className="subtitle vibrant-subtitle">
          <span className="gradient-badge">Universal Diagnostics:</span> Securely upload and analyze 
          <span className="text-highlight-cyan"> X-Rays</span>, 
          <span className="text-highlight-purple"> Ultrasounds</span>, 
          and Multi-Modal scans for instantaneous AI-driven clinical insights.
        </p>
      </div>

      <div className="scanner-layout">

        <div className="form-section glass-card">
           <h3 className="section-title"><User size={20}/> Automated Patient Records</h3>
           <div className="form-grid">
              <div className="input-group">
                 <label>Smart Patient Database</label>
                 <input type="text" list="patient-list" name="name" value={form.name} onChange={handlePatientSelect} placeholder="Search existing patient or type new..." />
              </div>
              <div className="input-group"><label>Age</label><input type="number" name="age" value={form.age} onChange={handleChange} placeholder="e.g. 45" /></div>
              <div className="input-group"><label>Biological Gender</label><select name="gender" value={form.gender} onChange={handleChange}><option value="Male" style={{ color: '#000' }}>Male</option><option value="Female" style={{ color: '#000' }}>Female</option><option value="Other" style={{ color: '#000' }}>Other</option></select></div>
              <div className="input-group">
                <label>Ordering Doctor</label>
                <select name="doctor" value={form.doctor} onChange={handleChange}>
                  {metaDocs.length === 0 && <option value="">Loading doctors...</option>}
                  {metaDocs.map((doc, idx) => (
                    <option key={idx} value={doc} style={{ color: '#000' }}>{doc}</option>
                  ))}
                </select>
              </div>
           </div>

           <h3 className="section-title" style={{marginTop: '24px'}}><Thermometer size={20}/> Clinical Vitals</h3>
           <div className="form-grid">
              <div className="input-group"><label>Blood Pressure</label><input type="text" name="bloodPressure" value={form.bloodPressure} onChange={handleChange} placeholder="120/80" /></div>
              <div className="input-group"><label>Temperature (F/C)</label><input type="text" name="temperature" value={form.temperature} onChange={handleChange} placeholder="98.6 F" /></div>
           </div>

           <h3 className="section-title" style={{marginTop: '24px'}}><Activity size={20}/> Emergency Contact Info</h3>
           <div className="form-grid">
              <div className="input-group"><label>Patient Phone</label><input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="(555) 123-4567" /></div>
              <div className="input-group"><label>Patient Email</label><input type="email" name="email" value={form.email} onChange={handleChange} placeholder="patient@example.com" /></div>
           </div>

           <h3 className="section-title" style={{marginTop: '24px'}}><ClipboardList size={20}/> Primary Symptoms</h3>
           <div className="input-group">
              <textarea name="symptoms" value={form.symptoms} onChange={handleChange} placeholder="Shortness of breath, coughing, chest pain..." rows={4}></textarea>
           </div>
        </div>

        <div className="upload-section">
          {loading ? (
            <div className="loading-state glass-card">
              <div className="cyber-scanner-visual">
                <div className="scanner-bar"></div>
                <Loader2 className="large-spinner" size={48} color="var(--accent-purple)" />
              </div>
              <h3>Consulting Medical Knowledge Graph...</h3>
              <p>Analyzing extensive visual progression and symptom data.</p>
              <div className="analysis-progress-container">
                <div className="analysis-progress-bar"></div>
              </div>
              <div className="analysis-steps">
                <span>Preprocessing Image</span>
                <span>Extracting Features</span>
                <span>Matching Patterns</span>
              </div>
            </div>
          ) : (
            <div className="glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <h3 className="section-title"><Activity size={20}/> Medical Imaging Upload</h3>
              <label className="upload-dropzone" style={{ flex: 1, marginTop: '12px', padding: preview ? 0 : '16px' }}>
                <input type="file" accept="image/*" onChange={handleFileChange} hidden />
                {preview ? (
                  <div style={{width:'100%', height:'100%', overflow:'hidden', borderRadius:'12px'}}>
                    <img src={preview} alt="X-ray Preview" className="image-preview" />
                  </div>
                ) : (
                  <div className="dropzone-content">
                    <UploadCloud size={48} color="var(--accent-cyan)" />
                    <p>Click or drag medical image here (X-Ray, Ultrasound, etc.)</p>
                  </div>
                )}
              </label>
              
              <button className="action-btn" style={{ marginTop: '24px' }} onClick={handleScan} disabled={!file || loading}>
                Run AI Diagnosis Verification
              </button>
              {error && <div className="error-message" style={{ marginTop: '12px' }}>{error}</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
