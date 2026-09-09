import React, { useEffect, useState } from 'react';
import { Users, Search, AlertTriangle, DownloadCloud, Activity, Calendar, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import API_BASE_URL from '../api';
import './PatientDatabase.css';

// Helper to escape CSV fields safely
const escapeCSV = (val) => {
  if (val === null || val === undefined) return '""';
  const str = String(val);
  return '"' + str.replace(/"/g, '""') + '"';
};

export default function PatientDatabase() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPatient, setExpandedPatient] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const getSeverityScore = (severity) => {
    const scores = { 'Critical': 100, 'High': 75, 'Medium': 50, 'Low': 25 };
    return scores[severity] || 0;
  };

  const getSeverityClass = (severity) => {
    if (severity === 'Critical') return 'pill-critical';
    if (severity === 'High') return 'pill-high';
    if (severity === 'Medium') return 'pill-medium';
    return 'pill-low';
  };

  const renderExpandedContent = (p, history) => (
    <div className="expanded-details-grid">
       <div className="patient-mini-card">
          <h4 style={{margin: '0 0 12px 0', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px'}}>Clinical Profile</h4>
          <p style={{fontSize: '0.9rem', marginBottom: '8px'}}><strong>Email:</strong> {p.email}</p>
          <p style={{fontSize: '0.9rem', marginBottom: '8px'}}><strong>Phone:</strong> {p.phone}</p>
          <p style={{fontSize: '0.9rem', marginBottom: '16px'}}><strong>Symptoms:</strong> {p.symptoms}</p>
          <div style={{background: 'rgba(163, 113, 247, 0.05)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(163, 113, 247, 0.2)'}}>
             <p style={{fontSize: '0.8rem', color: 'var(--accent-purple)', margin: 0}}><strong>AI Recommendation:</strong></p>
             <p style={{fontSize: '0.85rem', margin: '4px 0 0'}}>{p.report?.clinical_assessment?.differential_diagnosis || 'Standard observational routing.'}</p>
          </div>
       </div>
       <div className="history-chart-wrapper">
          <h4 style={{margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px'}}>
            <TrendingUp size={18} color="var(--accent-purple)"/> Severity History
          </h4>
          <div style={{width: '100%', height: '180px'}}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="date" stroke="var(--text-secondary)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} hide />
                <Tooltip 
                   contentStyle={{background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px'}}
                   itemStyle={{color: 'var(--accent-purple)'}}
                />
                <Line type="monotone" dataKey="severity" stroke="var(--accent-purple)" strokeWidth={3} dot={{fill: 'var(--accent-purple)', r: 4}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
       </div>
    </div>
  );

  useEffect(() => {
    const org = sessionStorage.getItem("organization") || "Med-AI Global";
    fetch(`${API_BASE_URL}/api/patients?org=${encodeURIComponent(org)}`)
      .then(res => res.json())
      .then(data => {
        setPatients(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch patients", err);
        setLoading(false);
      });
  }, []);

  const downloadCSV = () => {
    const headers = ["ID", "Scan Date", "Patient Name", "Age", "Gender", "Phone", "Email", "Symptoms", "Follow-up Required"];
    const rows = patients.map(p => [
      p.id, 
      p.date, 
      p.name, 
      p.age, 
      p.gender, 
      p.phone, 
      p.email, 
      escapeCSV(p.symptoms), 
      p.requires_followup ? "YES" : "NO"
    ]);
    
    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "patient_ehr_export.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-fade-in dashboard-container">
      <div className="page-header">
        <h1>Patient Directory</h1>
        <p className="subtitle">Historical archive of all patient Electronic Health Records (EHR) and AI Analyses.</p>
      </div>

      <div className="glass-card directory-panel">
        <div className="directory-tools">
           <div className="search-bar">
              <Search size={18} color="var(--text-secondary)" />
              <input 
                type="text" 
                placeholder="Search patients..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
           </div>
           <button onClick={downloadCSV} className="action-btn export-btn">
              <DownloadCloud size={18}/> Export EHR CSV
           </button>
        </div>

        {/* Desktop View */}
        <div className="desktop-table">
          <div className="table-responsive-wrapper">
            <table className="patient-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Patient Identity</th>
                  <th>Severity</th>
                  <th>AI Detected Anomalies</th>
                  <th>Follow Up Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" style={{textAlign: 'center', padding: '40px'}}>Fetching records...</td></tr>
                ) : filteredPatients.length === 0 ? (
                  <tr><td colSpan="6" style={{textAlign: 'center', padding: '40px'}}>No records found.</td></tr>
                ) : (
                  filteredPatients.map((p) => {
                      const isExpanded = expandedPatient === p.id;
                      const history = patients
                        .filter(h => h.name === p.name)
                        .sort((a, b) => new Date(a.date) - new Date(b.date))
                        .map(h => ({
                          date: new Date(h.date).toLocaleDateString(),
                          severity: getSeverityScore(h.report?.clinical_assessment?.severity)
                        }));

                      return (
                        <React.Fragment key={p.id}>
                          <tr 
                            className="patient-row-card"
                            onClick={() => setExpandedPatient(isExpanded ? null : p.id)}
                            style={{ 
                              background: p.requires_followup ? 'rgba(255, 82, 82, 0.03)' : 'transparent',
                              cursor: 'pointer'
                            }}
                          >
                            <td data-label="ID">{isExpanded ? <ChevronUp size={16}/> : <ChevronDown size={16}/>} #{p.id}</td>
                            <td data-label="Date">{new Date(p.date).toLocaleString()}</td>
                            <td data-label="Patient Identity">
                              <strong>{p.name}</strong><br/>
                              <small>{p.age} yrs | {p.gender}</small>
                            </td>
                            <td data-label="Severity">
                              <div className={`severity-pill ${getSeverityClass(p.report?.clinical_assessment?.severity)}`}>
                                <Activity size={14} /> {p.report?.clinical_assessment?.severity || 'Low'}
                              </div>
                            </td>
                            <td data-label="AI Detected Anomalies">
                              {p.diseases && p.diseases.length > 0 ? (
                                p.diseases.map((d, i) => <span key={i} className="disease-badge" style={{display: 'inline-block', margin: '2px'}}>{d}</span>)
                              ) : (
                                <span className="healthy-badge" style={{background: 'rgba(0, 230, 118, 0.1)', color: 'var(--success)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem'}}>Healthy</span>
                              )}
                            </td>
                            <td data-label="Follow Up Status">
                              {p.requires_followup ? (
                                <span style={{ color: 'var(--danger)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                                  <AlertTriangle size={16} /> Urgent Follow Up
                                </span>
                              ) : ( <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem'}}>Standard Routing</span>)}
                            </td>
                          </tr>
                          {isExpanded && (
                            <tr className="expanded-details-row">
                              <td colSpan="6" style={{background: 'rgba(0,0,0,0.15)', padding: '24px'}}>
                                {renderExpandedContent(p, history)}
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile View */}
        <div className="mobile-cards">
          {loading ? (
            <div style={{padding: '40px', textAlign: 'center'}}>Fetching records...</div>
          ) : filteredPatients.length === 0 ? (
            <div style={{padding: '40px', textAlign: 'center'}}>No records found.</div>
          ) : (
            filteredPatients.map(p => {
               const isExpanded = expandedPatient === p.id;
               const history = patients
                 .filter(h => h.name === p.name)
                 .sort((a, b) => new Date(a.date) - new Date(b.date))
                 .map(h => ({
                    date: new Date(h.date).toLocaleDateString(),
                    severity: getSeverityScore(h.report?.clinical_assessment?.severity)
                 }));

               return (
                 <div key={p.id} className="patient-mobile-card" onClick={() => setExpandedPatient(isExpanded ? null : p.id)}>
                    <div className="pm-header">
                       <span className="pm-id">#{p.id}</span>
                       <span className="pm-date">{new Date(p.date).toLocaleDateString()}</span>
                    </div>
                    <div className="pm-body">
                       <h3>{p.name}</h3>
                       <p>{p.age} yrs | {p.gender}</p>
                       <div className="pm-stats">
                          <div className={`severity-pill ${getSeverityClass(p.report?.clinical_assessment?.severity)}`}>
                             <Activity size={14} /> {p.report?.clinical_assessment?.severity || 'Low'}
                          </div>
                          {p.requires_followup && <span className="urgent-badge"><AlertTriangle size={14}/> Urgent</span>}
                       </div>
                    </div>
                    {isExpanded && (
                       <div className="pm-expanded" onClick={(e) => e.stopPropagation()}>
                          {renderExpandedContent(p, history)}
                       </div>
                    )}
                 </div>
               );
            })
          )}
        </div>
      </div>
    </div>
  );
}
