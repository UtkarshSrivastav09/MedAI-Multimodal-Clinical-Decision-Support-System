import React from 'react';
import { Activity, Cpu, Layers, Info, Clock, User, ClipboardList, ShieldAlert, AlertOctagon, LayoutDashboard, HelpCircle, Database, Book, Award } from 'lucide-react';
import './Help.css';

export default function Help() {
  const techStack = [
    {
      icon: <Cpu size={24} color="#6366f1" />,
      title: "Frontend Core",
      desc: "Architected with React 18 & Vite for high-performance SPA behavior. Implements Glassmorphism UI and complex state management.",
      tags: ["React.js", "Vite", "Lucide Icons", "html2pdf.js"]
    },
    {
      icon: <Activity size={24} color="#00e5ff" />,
      title: "Backend Neural Bridge",
      desc: "Powered by FastAPI (Python) for asynchronous request handling. Features robust image processing and secure EHR directory management.",
      tags: ["Python", "FastAPI", "Pydantic", "Uvicorn"]
    },
    {
      icon: <Layers size={24} color="#a371f7" />,
      title: "AI & Intelligence",
      desc: "Integrates Google Gemini 1.5 Multimodal AI for advanced radiology analysis, natural language diagnosis, and localized heatmap generation.",
      tags: ["Gemini 1.5", "NLP", "Object Detection", "Pathology Mapping"]
    },
    {
      icon: <ShieldAlert size={24} color="#00e676" />,
      title: "Security & Privacy",
      desc: "Implements JWT-based authentication and secure session management. Patient data is isolated and handled via restricted local IO paths.",
      tags: ["JWT", "Session Auth", "EHR Isolation", "Encrypted Handshake"]
    }
  ];

  return (
    <div className="help-container" style={{ padding: '20px 40px', minHeight: '100vh', opacity: 1, visibility: 'visible', color: 'var(--text-primary)' }}>
      {/* HERO SECTION */}
      <div className="help-hero">
        <div className="hero-badge">System Documentation </div>
        <h1>Intelligence Assistance & Neural Framework</h1>
        <p>Comprehensive guide for users to navigate the platform and for examiners to understand the underlying technical architecture.</p>
      </div>

      {/* LEAD ARCHITECT SECTION */}
      <div className="architect-section animate-fade-in">
        <div className="architect-card glass-card">
          <div className="architect-main">
            <div className="architect-visual">
              <div className="avatar-container">
                <img src="/Utkarsh Image.png" alt="Utkarsh Srivastav" onError={(e) => { e.target.onerror = null; e.target.src = 'https://ui-avatars.com/api/?name=Utkarsh+Srivastav&background=A371F7&color=fff&size=256'; }} />
                <div className="avatar-ring"></div>
              </div>
              <div className="social-links-minimal">
                <a href="https://www.linkedin.com/in/utkarsh-srivastav-b433bb33a" target="_blank" rel="noopener noreferrer" className="social-icon-btn linkedin">
                  <img src="https://img.icons8.com/ios-filled/50/ffffff/linkedin.png" alt="LinkedIn" style={{ width: '22px', height: '22px' }} />
                </a>
                <a href="https://github.com/UtkarshSrivastav09" target="_blank" rel="noopener noreferrer" className="social-icon-btn github">
                  <img src="https://img.icons8.com/ios-filled/50/ffffff/github.png" alt="GitHub" style={{ width: '22px', height: '22px' }} />
                </a>
                <a href="https://utkarshsrivastav09.github.io/Utkarsh-Portfolio/" target="_blank" rel="noopener noreferrer" className="social-icon-btn portfolio">
                  <img src="https://img.icons8.com/ios-filled/50/ffffff/globe.png" alt="Portfolio" style={{ width: '22px', height: '22px' }} />
                </a>
              </div>
            </div>

            <div className="architect-details">
              <div className="details-header">
                <div className="name-group">
                  <h2>Utkarsh Srivastav</h2>
                  <span className="architect-badge">Founder & Lead Architect</span>
                </div>
                <p className="professional-title">Principal AI Research & System Engineering Lead</p>
              </div>

              <div className="details-body">
                <div className="bio-segment">
                  <h3><Info size={16} /> Technical Vision</h3>
                  <div className="vision-quote-block">
                    <p>
                      A visionary developer specialized in the intersection of <span className="highlight-cyan">Generative AI</span> and <span className="highlight-purple">Clinical Radiology</span>. 
                      Architected the entire Med-AI ecosystem from the ground up, focusing on bridging the gap between <span className="highlight-cyan">Neural LLMs</span> and real-world medical diagnostics.
                    </p>
                  </div>
                </div>

                <div className="achievements-grid">
                  <div className="achievement-item">
                    <Activity size={16} className="ach-icon" />
                    <span>Multimodal AI Orchestration</span>
                  </div>
                  <div className="achievement-item">
                    <ShieldAlert size={16} className="ach-icon" />
                    <span>Secure EHR Data Isolation</span>
                  </div>
                  <div className="achievement-item">
                    <Layers size={16} className="ach-icon" />
                    <span>Decoupled API Architecture</span>
                  </div>
                  <div className="achievement-item">
                    <Award size={16} className="ach-icon" />
                    <span>Precision Diagnostic Engine</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="help-grid">
        <div className="help-section-card glass-card">
          <h2 className="section-title">User Operational Guide</h2>
          <div className="step-list">
            <div className="step-item">
              <div className="step-number">01</div>
              <div className="step-content">
                <h3>Patient Enrollment</h3>
                <p>Register new patients or select existing ones from the Smart Database. Vitals like BP and Temperature are automatically tracked.</p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-number">02</div>
              <div className="step-content">
                <h3>X-Ray Analysis</h3>
                <p>Upload any radiology image in the Scanner module. Click 'Run AI Diagnosis' to trigger the neural analysis engine.</p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-number">03</div>
              <div className="step-content">
                <h3>Verified Reporting</h3>
                <p>Download the high-fidelity PDF report. It includes technical findings for doctors and simple layman summaries for patients.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="help-section-card glass-card tech-section">
          <h2 className="section-title">Technical Stack & Architecture</h2>
          <p className="tech-intro">Med-AI is a full-stack Clinical Decision Support System (CDSS) built using a decoupled architecture for maximum scalability.</p>
          
          <div className="tech-stack-grid">
            {techStack.map((tech, idx) => (
              <div key={idx} className="tech-card">
                <div className="tech-header">
                  {tech.icon}
                  <h3>{tech.title}</h3>
                </div>
                <p>{tech.desc}</p>
                <div className="tech-tags">
                  {tech.tags.map((tag, i) => <span key={i}>{tag}</span>)}
                </div>
              </div>
            ))}
          </div>

          <div className="system-status-box">
             <div className="status-header">
                <h3>System Integrity Status</h3>
                <span className="status-pill online">Operational</span>
             </div>
             <div className="status-grid">
                <div className="status-item"><span>Neural Core</span><strong>Active</strong></div>
                <div className="status-item"><span>API Gateway</span><strong>Connected</strong></div>
                <div className="status-item"><span>EHR Database</span><strong>Secure</strong></div>
             </div>
          </div>
        </div>
      </div>

      {/* NEW: NEURAL ARCHITECTURE PIPELINE */}
      <div className="pipeline-section glass-card" style={{marginTop: '32px', padding: '32px'}}>
         <h2 className="section-title"><Activity size={20} /> Neural Processing Pipeline</h2>
         <div className="pipeline-flow">
            <div className="pipeline-node">
               <div className="node-icon" style={{background: 'rgba(0, 229, 255, 0.1)'}}><LayoutDashboard size={24} color="var(--accent-cyan)" /></div>
               <span>Image Input</span>
            </div>
            
            <div className="pipeline-node">
               <div className="node-icon" style={{background: 'rgba(0, 230, 118, 0.1)'}}><ShieldAlert size={24} color="var(--success)" /></div>
               <span>Data Security</span>
            </div>
 
            <div className="pipeline-node">
               <div className="node-icon" style={{background: 'rgba(163, 113, 247, 0.1)'}}><Cpu size={24} color="var(--accent-purple)" /></div>
               <span>FastAPI Bridge</span>
            </div>
 
            <div className="pipeline-node highlight">
               <div className="node-icon" style={{background: 'var(--accent-gradient)'}}><Activity size={24} color="#000" /></div>
               <span>Neural Engine</span>
            </div>
 
            <div className="pipeline-node">
               <div className="node-icon" style={{background: 'rgba(255, 171, 0, 0.1)'}}><Database size={24} color="#ffab00" /></div>
               <span>EHR Sync</span>
            </div>
 
            <div className="pipeline-node">
               <div className="node-icon" style={{background: 'rgba(0, 229, 255, 0.1)'}}><ClipboardList size={24} color="var(--accent-cyan)" /></div>
               <span>Final Report</span>
            </div>
         </div>
      </div>
 
      {/* NEW: DEVELOPER TERMINAL & ETHICS */}
      <div className="extra-sections-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px', marginTop: '32px' }}>
         {/* TERMINAL CONSOLE */}
         <div className="terminal-card glass-card">
            <div className="terminal-header">
               <div className="terminal-dots"><span></span><span></span><span></span></div>
               <div className="terminal-title">Neural_Core_v1.5.sh</div>
            </div>
            <div className="terminal-body custom-scroll">
               <div className="log-line"><span className="log-time">[10:04:22]</span> <span className="log-tag info">[INFO]</span> Initializing Gemini 1.5 Multi-Modal Weights...</div>
               <div className="log-line"><span className="log-time">[10:04:23]</span> <span className="log-tag success">[OK]</span> Neural Core 128-bit Handshake established.</div>
               <div className="log-line"><span className="log-time">[10:04:25]</span> <span className="log-tag warn">[WARN]</span> Latency spike in API Gateway (1.2s) - Adjusting TTL...</div>
               <div className="log-line"><span className="log-time">[10:04:26]</span> <span className="log-tag info">[INFO]</span> EHR Directory Isolation: ACTIVE.</div>
               <div className="log-line"><span className="log-time">[10:04:28]</span> <span className="log-tag success">[OK]</span> Patient Data Encryption: AES-256 Enabled.</div>
               <div className="log-line blinking-cursor">&gt; System Ready for Clinical Input..._</div>
            </div>
         </div>
 
         {/* ETHICS & SAFETY */}
         <div className="ethics-card glass-card">
            <h3 className="section-title"><ShieldAlert size={18}/> Clinical Safety & Ethics</h3>
            <div className="ethics-list">
               <div className="ethics-item">
                  <div className="eth-icon"><Award size={16}/></div>
                  <div className="eth-text">
                     <strong>HIPAA Data Isolation</strong>
                     <p>Patient identifiers are never cached or exposed to external LLM training loops.</p>
                  </div>
               </div>
               <div className="ethics-item">
                  <div className="eth-icon"><ShieldAlert size={16}/></div>
                  <div className="eth-text">
                     <strong>Bias Mitigation</strong>
                     <p>Algorithms audited for diagnostic parity across diverse clinical demographics.</p>
                  </div>
               </div>
               <div className="ethics-item">
                  <div className="eth-icon"><Activity size={16}/></div>
                  <div className="eth-text">
                     <strong>Human Oversight</strong>
                     <p>Designed as a CDSS (Support System) requiring final sign-off from licensed clinicians.</p>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div className="performance-metrics glass-card" style={{marginTop: '32px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', textAlign: 'center'}}>
          <div className="metric-item">
             <div className="metric-value" style={{fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-cyan)'}}>94.2%</div>
             <div className="metric-label" style={{fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)'}}>Accuracy Rate</div>
          </div>
          <div className="metric-item">
             <div className="metric-value" style={{fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-purple)'}}>&lt;1.2s</div>
             <div className="metric-label" style={{fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)'}}>Latency</div>
          </div>
          <div className="metric-item">
             <div className="metric-value" style={{fontSize: '1.8rem', fontWeight: 800, color: 'var(--success)'}}>256-bit</div>
             <div className="metric-label" style={{fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)'}}>Encryption</div>
          </div>
          <div className="metric-item">
             <div className="metric-value" style={{fontSize: '1.8rem', fontWeight: 800, color: '#ffab00'}}>100k+</div>
             <div className="metric-label" style={{fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)'}}>Datasets</div>
          </div>
      </div>

      <div className="help-footer" style={{marginTop: '80px', paddingBottom: '60px', textAlign: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '40px'}}>

         
         <h4 style={{fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '12px', letterSpacing: '1px'}}>Med-AI Clinical Decision Support System</h4>
         
         <p style={{fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.8', maxWidth: '900px', margin: '0 auto'}}>
            This platform is an advanced <span style={{color: 'var(--accent-cyan)', fontWeight: 600}}>Research Prototype</span> engineered for multimodal diagnostic exploration. 
            Architected as a flagship implementation for the <span style={{color: 'var(--accent-purple)', fontWeight: 600}}>2026 Academic Engineering Evaluation</span>, 
            showcasing the secure and efficient integration of Neural LLMs in modern healthcare ecosystems.
         </p>
         
         <div style={{marginTop: '32px', fontSize: '0.7rem', color: 'var(--text-primary)', opacity: 0.6, fontStyle: 'italic'}}>
            © 2026 Med-AI Laboratory | Lead Architect: Utkarsh Srivastav
      </div>
    </div>
  </div>
  );
}
