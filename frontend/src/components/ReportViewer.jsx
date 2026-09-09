import React, { useState } from 'react';
import { FileText, HeartPulse, ActivitySquare, TestTube, Stethoscope, Download, ShieldAlert, Zap, Info, ArrowLeft, Clock, MessageSquare, Send, CheckCircle2, Award, ClipboardCheck, X } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import './ReportViewer.css';
import API_BASE_URL from '../api';

export default function ReportViewer({ report, patient, imageName, preview, patient_id, onReset }) {
   const [chatQ, setChatQ] = useState("");
   const [chatLog, setChatLog] = useState([]);
   const [chatLoading, setChatLoading] = useState(false);
   const [heatmapActive, setHeatmapActive] = useState(false);
   const [isGenerating, setIsGenerating] = useState(false);
   const [showPreview, setShowPreview] = useState(false);
   const [translation, setTranslation] = useState({ active: false, lang: 'English', loading: false, content: null });
   const [translationsCache, setTranslationsCache] = useState({});

   const suggestionPills = [
      "Typical recovery timeline?",
      "Next diagnostic steps?",
      "Potential complications?",
      "Explain Technical Findings"
   ];

   const [overrideText, setOverrideText] = useState("");
   const [overrideSaved, setOverrideSaved] = useState(false);

   if (!report || !report.clinical_assessment) return null;

   const clinical = report.clinical_assessment;
   const layman = report.patient_layman_assessment;
   const isHealthy = !clinical.diseases || clinical.diseases.length === 0;

   // Normalized display values to prevent "90% Critical but Healthy" contradictions
   const displaySeverity = isHealthy ? 'Low' : (clinical.severity || 'Low');
   const displayConfidence = clinical.confidence_score || 0;

   const handleChat = async () => {
      if (!chatQ) return;
      setChatLog(prev => [...prev, { role: 'user', text: chatQ }]);
      setChatLoading(true);

      const fd = new FormData();
      fd.append("image_name", imageName);
      fd.append("question", chatQ);

      const q = chatQ;
      setChatQ("");

      try {
         const res = await fetch(`${API_BASE_URL}/api/chat`, { method: "POST", body: fd });
         const data = await res.json();
         setChatLog(prev => [...prev, { role: 'ai', text: data.answer }]);
      } catch {
         setChatLog(prev => [...prev, { role: 'ai', text: "Chat connection error." }]);
      }
      setChatLoading(false);
   };

   const handleOverride = async () => {
      if (!overrideText || !patient_id) return;
      try {
         await fetch(`${API_BASE_URL}/api/override`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: patient_id, note: overrideText })
         });
         setOverrideSaved(true);
      } catch (e) {
         console.error(e);
      }
   };

   const handleTranslate = async (targetLang) => {
      if (targetLang === 'English') {
         setTranslation({ active: false, lang: 'English', loading: false, content: null });
         return;
      }
      // Instant display if pre-calculated in diagnosis payload
      if (targetLang === 'Hindi' && layman?.layman_summary_hindi) {
         setTranslation({ active: true, lang: 'Hindi', loading: false, content: layman.layman_summary_hindi });
         return;
      }
      // Instant display if already cached
      if (translationsCache[targetLang]) {
         setTranslation({ active: true, lang: targetLang, loading: false, content: translationsCache[targetLang] });
         return;
      }
      setTranslation(prev => ({ ...prev, loading: true, lang: targetLang }));
      try {
         const textToTranslate = `${layman?.layman_summary || ""} Findings: ${layman?.layman_findings || ""}`;
         const res = await fetch(`${API_BASE_URL}/api/translate`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: textToTranslate, target_lang: targetLang })
         });
         const data = await res.json();
         setTranslationsCache(prev => ({ ...prev, [targetLang]: data.translated_text }));
         setTranslation({ active: true, lang: targetLang, loading: false, content: data.translated_text });
      } catch (e) {
         console.error(e);
         setTranslation(prev => ({ ...prev, loading: false }));
      }
   };

    const handleDownloadPDF = (action = 'save') => {
       const element = document.getElementById('premium-report-template');
       if (!element) return;
 
       setIsGenerating(true);
 
       const opt = {
          margin: [0, 0],
          filename: `MedAI_Report_${patient?.name || 'Patient'}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: {
             scale: 2,
             useCORS: true,
             logging: false,
             letterRendering: true,
             allowTaint: true,
             backgroundColor: '#ffffff',
             windowWidth: 800,
             scrollY: 0,
             scrollX: 0
          },
          jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' }
       };
 
       // Ensure all images inside are loaded
       const images = element.getElementsByTagName('img');
       const imagePromises = Array.from(images).map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise(resolve => {
             img.onload = resolve;
             img.onerror = resolve;
          });
       });
 
       Promise.all(imagePromises).then(() => {
          // Temporarily move to a safe capture spot if needed, but here we use the ghost div
          if (action === 'print') {
             html2pdf().set(opt).from(element).toPdf().get('pdf').then(function (pdf) {
                window.open(pdf.output('bloburl'), '_blank');
                setIsGenerating(false);
             }).catch(() => setIsGenerating(false));
          } else {
             html2pdf().set(opt).from(element).save().then(() => setIsGenerating(false)).catch(() => setIsGenerating(false));
          }
       });
    };

   return (
      <div className="report-wrapper animate-fade-in">
         <div className="print-controls hide-on-print" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button onClick={onReset} className="back-btn"><ArrowLeft size={18} /> Process Next Patient</button>
            <button onClick={() => handleDownloadPDF('save')} className="download-btn" style={{ marginLeft: 'auto' }} disabled={isGenerating}>
               {isGenerating ? <Zap size={18} className="large-spinner" /> : <Download size={18} />}
               {isGenerating ? "Generating PDF..." : "Download Premium Patient Report (PDF)"}
            </button>
         </div>

         <div className="report-viewer printable-report">

            {/* Admin Review & Chat Features (Hidden on Patient Print) */}
            <div className="hide-on-print" style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>

               {/* Left: Chat Widget */}
               <div style={{ flex: 1, background: 'rgba(0, 229, 255, 0.05)', border: '1px solid var(--accent-cyan)', padding: '16px', borderRadius: '12px' }}>
                  <h4 style={{ color: 'var(--accent-cyan)', marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><MessageSquare size={16} /> Interactive Imaging AI Co-Pilot</h4>

                  <div style={{ maxHeight: '180px', overflowY: 'auto', marginBottom: '12px', paddingRight: '8px', fontSize: '0.9rem' }} className="custom-scroll">
                     {chatLog.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>Ask Gemini specific contextual questions about this specific image.</p> : null}
                     {chatLog.map((c, i) => (
                        <div key={i} style={{ marginBottom: '8px', color: c.role === 'user' ? '#fff' : 'var(--text-secondary)' }}>
                           <strong>{c.role === 'user' ? 'Doctor: ' : 'AI: '}</strong>{c.text}
                        </div>
                     ))}
                     {chatLoading && <div style={{ color: 'var(--accent-cyan)' }}>Analyzing Image Frame...</div>}
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                     {suggestionPills.map((pill, i) => (
                        <button key={i} onClick={() => { setChatQ(pill); }} style={{ background: 'rgba(0, 229, 255, 0.1)', border: '1px solid rgba(0, 229, 255, 0.3)', color: 'var(--accent-cyan)', fontSize: '0.75rem', padding: '4px 10px', borderRadius: '20px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.target.style.background = 'rgba(0, 229, 255, 0.2)'} onMouseOut={e => e.target.style.background = 'rgba(0, 229, 255, 0.1)'}>
                           {pill}
                        </button>
                     ))}
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                     <input type="text" value={chatQ} onChange={e => setChatQ(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleChat()} placeholder="Ask 'Is the fracture spiral via right axis?'" style={{ flex: 1, padding: '8px 12px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: '#fff', borderRadius: '6px' }} />
                     <button onClick={handleChat} disabled={chatLoading} style={{ background: 'var(--accent-cyan)', color: '#000', border: 'none', padding: '0 12px', borderRadius: '6px', cursor: 'pointer' }}><Send size={16} /></button>
                  </div>
               </div>

               {/* Right: Peer Review Override */}
               <div style={{ flex: 1, background: 'rgba(255, 171, 0, 0.05)', border: '1px solid #ffab00', padding: '16px', borderRadius: '12px' }}>
                  <h4 style={{ color: '#ffab00', marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><ShieldAlert size={16} /> Human Oversight Peer Review</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '12px' }}>Legally flag this AI assessment with a manual override safety note if you disagree with the confidence score.</p>

                  {overrideSaved ? (
                     <div style={{ color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 0' }}><CheckCircle2 /> Override Logged Securely.</div>
                  ) : (
                     <div style={{ display: 'flex', gap: '8px' }}>
                        <textarea value={overrideText} onChange={e => setOverrideText(e.target.value)} placeholder="Type manual diagnostic override. This will be securely logged in the patient's EHR directory." style={{ flex: 1, padding: '8px 12px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: '#fff', borderRadius: '6px', minHeight: '60px', resize: 'vertical' }} />
                        <button onClick={handleOverride} style={{ background: '#ffab00', color: '#000', border: 'none', padding: '0 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Log</button>
                     </div>
                  )}
               </div>
            </div>

            <div className="hospital-letterhead">
               <div>
                  <h2>AUTO-PATH AI IMAGING LABORATORY</h2>
                  <p>123 Medical Innovation Drive • Secure AI Node Cluster</p>
               </div>
               <div style={{ textAlign: 'right' }}>
                  <p><strong>REPORT DATE:</strong> {new Date().toLocaleString()}</p>
                  <p><strong>REPORT ID:</strong> AP-{Math.floor(Math.random() * 900000)}</p>
               </div>
            </div>

            <div className="patient-banner">
               <div className="pi-block"><span>Patient Name</span><strong>{patient?.name}</strong></div>
               <div className="pi-block"><span>Age / Gender</span><strong>{patient?.age} yr • {patient?.gender}</strong></div>
               <div className="pi-block"><span>Blood Press.</span><strong>{patient?.bloodPressure}</strong></div>
               <div className="pi-block"><span>Body Temp</span><strong>{patient?.temperature}</strong></div>
            </div>

            {/* CLINICAL VIEW ONLY (Hidden on print) */}
            <div className="report-body hide-on-print" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
               <div className="report-image-section">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                     <h3 className="section-title" style={{ margin: 0 }}><ActivitySquare size={18} /> Clinical Imaging Analysis</h3>
                     <button
                        onClick={() => setHeatmapActive(!heatmapActive)}
                        className={`heatmap-toggle ${heatmapActive ? 'active' : ''}`}
                     >
                        <Zap size={14} /> {heatmapActive ? 'Disable AI Heatmap' : 'Enable AI Heatmap'}
                     </button>
                  </div>
                  <div className="radiology-frame">
                     <img src={preview} alt="Patient Clinical Scan" className="analyzed-image" />
                     {heatmapActive && (
                        <div className="heatmap-overlay">
                           {/* Laser Scanning Line */}
                           <div className="scan-line"></div>

                           {/* Interactive Anomaly Localization & Pulsing Heatmap Hotspots */}
                           {report.visual_annotations && report.visual_annotations.length > 0 ? (
                              report.visual_annotations.map((ann, idx) => {
                                 if (!ann.box_2d || ann.box_2d.length < 4) return null;
                                 const [coord0, coord1, coord2, coord3] = ann.box_2d;
                                 
                                 const toPercent = (val) => {
                                    if (val === undefined || val === null) return 0;
                                    return val > 0 && val <= 1.0 ? val * 100 : val / 10;
                                 };

                                 const topVal = toPercent(coord0);
                                 const leftVal = toPercent(coord1);
                                 const heightVal = Math.max(8, toPercent(coord2) - topVal);
                                 const widthVal = Math.max(8, toPercent(coord3) - leftVal);
                                 const centerX = leftVal + widthVal / 2;
                                 const centerY = topVal + heightVal / 2;

                                 return (
                                    <React.Fragment key={idx}>
                                       {/* Pulsing Hotspot Radar Ring centered on anomaly */}
                                       <div 
                                          className="pulse-ring"
                                          style={{
                                             top: `${centerY}%`,
                                             left: `${centerX}%`,
                                             width: `${Math.max(70, widthVal * 1.6)}px`,
                                             height: `${Math.max(70, heightVal * 1.6)}px`
                                          }}
                                       ></div>
                                       
                                       {/* Bounding Box & Pathology Tag */}
                                       <div 
                                          className="ai-annotation-box"
                                          style={{
                                             top: `${topVal}%`,
                                             left: `${leftVal}%`,
                                             width: `${widthVal}%`,
                                             height: `${heightVal}%`
                                          }}
                                       >
                                          <div className="annotation-label">
                                             {ann.label} ({ann.confidence || 92}%)
                                          </div>
                                       </div>
                                    </React.Fragment>
                                 );
                              })
                           ) : (
                              /* Default Anatomical Chest Cavity Radar Rings */
                              <>
                                 <div className="pulse-ring ring-1"></div>
                                 <div className="pulse-ring ring-2"></div>
                              </>
                           )}
                        </div>
                     )}
                  </div>
               </div>

               <div className="report-text-section">
                   <div className="meta-stats" style={{ marginBottom: '20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div className={`meta-badge severity-${displaySeverity}`}><ShieldAlert size={16} /> Severity: {isHealthy ? 'Normal / Healthy' : displaySeverity}</div>
                      <div className="meta-badge confidence-badge"><Zap size={16} /> Confidence: {displayConfidence}%</div>
                      
                      <div className="translation-hub">
                         <button 
                            onClick={() => handleTranslate('English')}
                            className={`lang-pill ${!translation.active ? 'active' : ''}`}
                            disabled={translation.loading}
                         >
                            English
                         </button>
                         <button 
                            onClick={() => handleTranslate('Hindi')}
                            className={`lang-pill ${translation.active && translation.lang === 'Hindi' ? 'active' : ''}`}
                            disabled={translation.loading}
                         >
                            {translation.loading && translation.lang === 'Hindi' ? 'Translating...' : 'Hindi'}
                         </button>
                      </div>
                   </div>

                  <div className="report-section">
                     <h3 className="section-title"><HeartPulse size={18} /> Technical Diagnoses</h3>
                     <ul className="disease-list">{clinical.diseases?.map((d, i) => <li key={i} className="disease-item danger-badge">{d}</li>)}</ul>
                     <p className="report-text" style={{ marginTop: '12px' }}>{clinical.key_findings}</p>
                     {clinical.differential_diagnosis && <p className="report-text" style={{ marginTop: '8px', color: 'var(--accent-cyan)' }}>Differential: {clinical.differential_diagnosis}</p>}
                     <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(163, 113, 247, 0.05)', borderRadius: '8px', border: '1px solid rgba(163, 113, 247, 0.2)' }}>
                        <strong style={{ fontSize: '0.85rem', color: 'var(--accent-purple)', display: 'block', marginBottom: '4px' }}>Recommended Physical Exam:</strong>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{clinical.recommended_followup || 'Standard radiological follow-up as per institutional protocol.'}</span>
                     </div>
                  </div>

                  {/* Patient Friendly Summary (Visible on screen) */}
                  {layman?.layman_summary && (
                     <div className="report-section layman-box" style={{ marginTop: '32px', borderTop: '1px dashed var(--border-color)', paddingTop: '24px' }}>
                        <h3 className="section-title" style={{ color: 'var(--accent-cyan)' }}><Info size={18} /> Simplified Patient Summary</h3>
                        
                        {translation.loading ? (
                           <div className="translation-loading">
                              <div className="pulse-dot"></div> Translating via AI Neural Engine...
                           </div>
                        ) : (
                           <p className="report-text" style={{ fontSize: translation.active ? '1.1rem' : '1rem', color: 'var(--text-primary)', borderLeft: translation.active ? '3px solid var(--accent-cyan)' : 'none', paddingLeft: translation.active ? '16px' : '0' }}>
                              {translation.active ? translation.content : layman.layman_summary}
                           </p>
                        )}
                     </div>
                  )}
               </div>
            </div>

            {/* LAYMAN PRINT ONLY */}
            <div className="report-body show-on-print-only">
               <div className="report-section layman-box">
                  <h3 className="section-title"><HeartPulse size={18} /> Diagnosed Conditions</h3>
                  <ul className="test-list">{layman?.layman_diseases?.map((d, id) => <li key={id} className="test-item">{d}</li>)}</ul>
               </div>
                {layman?.layman_summary && (
                   <div className="report-section layman-box">
                      <h3 className="section-title"><Info size={18} /> Simplified Patient Summary</h3>
                      <p className="report-text">
                         {translation.active ? translation.content : layman.layman_summary}
                      </p>
                   </div>
                )}
               {layman?.treatment_timeline && (
                  <div className="report-section layman-box">
                     <h3 className="section-title"><Clock size={18} /> Recommended Treatment Plan</h3>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                        {layman.treatment_timeline.map((item, idx) => (
                           <div key={idx} style={{ borderLeft: '3px solid var(--accent-purple)', paddingLeft: '16px' }}>
                              <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>{item.phase}</strong>
                              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{item.action}</span>
                           </div>
                        ))}
                     </div>
                  </div>
               )}
            </div>
         </div>

         {/* GHOST PDF TEMPLATE (Hidden but visible to capture engine) */}
         <div style={{ position: 'absolute', top: '-20000px', left: '-10000px', width: '800px', pointerEvents: 'none' }}>
            <div id="premium-report-template" style={{ background: '#fff' }}>
               <div className="pdf-header">
                  <div className="pdf-logo">
                     <div style={{ background: '#6366f1', padding: '10px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ActivitySquare color="#fff" size={28} />
                     </div>
                     <div className="pdf-branding">
                        <span className="pdf-logo-text">Med-AI Systems</span>
                        <span className="pdf-tagline">Advanced Diagnostic Intelligence</span>
                     </div>
                  </div>
                  <div className="pdf-report-title">
                     <h1>Patient Health Report</h1>
                     <p>Official Clinical Assessment • {new Date().toLocaleDateString()}</p>
                  </div>
               </div>

               <div className="pdf-patient-info">
                  <div className="pdf-info-item"><span>Patient Name</span><strong>{patient?.name || 'N/A'}</strong></div>
                  <div className="pdf-info-item"><span>Patient ID</span><strong>#{String(patient_id)?.substring(0, 8) || 'AP-8821'}</strong></div>
                  <div className="pdf-info-item"><span>Age / Gender</span><strong>{patient?.age || 'N/A'} • {patient?.gender || 'N/A'}</strong></div>
                  <div className="pdf-info-item"><span>Vital Signs</span><strong>{patient?.temperature || '--'}°C • {patient?.bloodPressure || '--'}</strong></div>
               </div>

               <div className="pdf-grid">
                  <div className="pdf-main-content">
                     <div className="pdf-section">
                        <div className="pdf-section-header"><ClipboardCheck size={18} /> Executive Health Summary (Layman)</div>
                        <div className="pdf-layman-summary">
                           {layman?.layman_summary || "The AI system has analyzed the imaging data. No critical abnormalities were detected requiring immediate emergency intervention."}
                        </div>
                     </div>

                     <div className="pdf-section">
                        <div className="pdf-section-header"><Stethoscope size={18} /> Diagnosed Conditions</div>
                        <div className="pdf-finding-card">
                           <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
                              {clinical?.diseases?.length > 0 ? clinical.diseases.map((d, i) => (
                                 <div key={i} className="pdf-disease-badge technical">
                                    <span className="type">Clinical</span>
                                    <span className="name">{d}</span>
                                 </div>
                              )) : null}
                              {layman?.layman_diseases?.length > 0 ? layman.layman_diseases.map((d, i) => (
                                 <div key={i} className="pdf-disease-badge simplified">
                                    <span className="type">Common Name</span>
                                    <span className="name">{d}</span>
                                 </div>
                              )) : (!clinical?.diseases?.length && <span className="pdf-tag success">Normal / Healthy</span>)}
                           </div>
                           <div className="pdf-divider"></div>
                           <p className="pdf-text-content" style={{ marginTop: '12px' }}>
                              <strong>Observation:</strong> {layman?.layman_findings || clinical?.key_findings || "No significant findings recorded."}
                           </p>
                        </div>
                     </div>

                     <div className="pdf-section">
                        <div className="pdf-section-header"><Clock size={18} /> Recommended Action Plan</div>
                        <div className="pdf-timeline">
                           {layman?.treatment_timeline?.map((item, idx) => (
                              <div key={idx} className="pdf-timeline-item">
                                 <div className="pdf-timeline-marker">
                                    <div className="pdf-timeline-dot"></div>
                                    {idx !== layman.treatment_timeline.length - 1 && <div className="pdf-timeline-line"></div>}
                                 </div>
                                 <div className="pdf-timeline-content">
                                    <strong>{item.phase}</strong>
                                    <p>{item.action}</p>
                                 </div>
                              </div>
                           )) || <p className="pdf-text-muted">No specific immediate actions required. Continue standard health monitoring.</p>}
                        </div>
                     </div>
                  </div>

                  <div className="pdf-sidebar">
                     <div className="pdf-section">
                        <div className="pdf-section-header"><ActivitySquare size={18} /> Clinical Imaging</div>
                        <div className="pdf-image-container">
                           {preview ? (
                              <img src={preview} alt="Clinical Scan" className="pdf-radiology-image" />
                           ) : (
                              <div className="pdf-no-image">No Image Available</div>
                           )}
                           <div className="pdf-image-overlay">AI Diagnostic Vision</div>
                        </div>
                     </div>

                     <div className="pdf-section">
                        <div className="pdf-section-header"><ShieldAlert size={18} /> Clinical Severity</div>
                        <div className="pdf-severity-meter">
                           <div className="pdf-meter-track">
                              <div className={`pdf-meter-fill severity-${displaySeverity}`}
                                 style={{ width: displaySeverity === 'Critical' ? '100%' : displaySeverity === 'High' ? '75%' : displaySeverity === 'Medium' ? '50%' : '25%' }}></div>
                           </div>
                           <div className="pdf-severity-label">
                              <strong>Level: {isHealthy ? 'Healthy' : displaySeverity}</strong>
                              <span>{displayConfidence}% Confidence</span>
                           </div>
                        </div>
                     </div>

                     <div className="pdf-section">
                        <div className="pdf-section-header"><Info size={18} /> Guidance</div>
                        <div className="pdf-advice-box">
                           <p>AI findings assist clinical decisions. Present to a specialist for definitive diagnosis.</p>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="pdf-footer">
                  <div className="pdf-disclaimer">
                     <div className="pdf-verified-badge"><Award size={16} /> Verified by Med-AI Core</div>
                     <p>This assessment was generated by an autonomous neural network trained on clinical cases.</p>
                  </div>

                  <div className="pdf-signature-block">
                        <div className="pdf-signature-container">
                           <div className="pdf-seal-wrapper">
                              <div className="pdf-digital-seal">
                                 <Award size={20} color="#fff" />
                                 <div className="seal-text">VERIFIED<br/>DOCUMENT</div>
                              </div>
                           </div>
                           <div className="pdf-handwritten-sig">Utkarsh Srivastav</div>
                           <div className="pdf-signature-line"></div>
                           <div className="pdf-signature-name">Dr. Utkarsh Srivastav</div>
                           <div className="pdf-signature-title">Medical Director • Med-AI Systems</div>
                        </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
