import React, { useEffect, useState } from 'react';
import { Loader2, ArrowRight, X, Search } from 'lucide-react';
import API_BASE_URL from '../api';
import './Triage.css';

export default function Triage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPatients = () => {
    const org = sessionStorage.getItem("organization") || "Med-AI Global";
    fetch(`${API_BASE_URL}/api/patients?org=${encodeURIComponent(org)}`)
      .then(res => res.json())
      .then(data => {
        setPatients(data);
        setLoading(false);
      });
  };

  useEffect(() => { fetchPatients(); }, []);

  const moveStatus = (id, status) => {
    fetch(`${API_BASE_URL}/api/triage/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status })
    }).then(() => fetchPatients());
  };

  const deletePatient = (id) => {
    fetch(`${API_BASE_URL}/api/patients/${id}`, {
      method: 'DELETE'
    }).then(() => fetchPatients());
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.diseases && p.diseases.some(d => d.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const getCol = (status) => filteredPatients.filter(p => p.triage_status === status);

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const renderCard = (p) => (
    <div className="triage-card" key={p.id} style={{borderLeft: p.requires_followup ? '3px solid var(--danger)' : '3px solid var(--success)'}}>
       <div className="card-header-flex">
         <div className="patient-avatar">{getInitials(p.name)}</div>
         <div className="patient-info">
           <h4>{p.name}</h4>
           <p className="subtext">{p.age} yr | {p.doctor}</p>
         </div>
         {p.requires_followup && <div className="critical-pulse" title="High Priority / Follow-up Required"></div>}
       </div>
       <div className="triage-tags">
         {p.diseases.slice(0, 2).map((d, i) => <span key={i} className="mini-tag">{d}</span>)}
       </div>
       {p.human_override_note && ( <div className="override-badge">Human Oversight Logged</div> )}
       <div className="card-actions">
         {p.triage_status === "Waiting Room" && <button onClick={() => moveStatus(p.id, "Doctor Review")}>Send to Review <ArrowRight size={14}/></button>}
         {p.triage_status === "Doctor Review" && <button onClick={() => moveStatus(p.id, "Discharged")}>Discharge Patient <ArrowRight size={14}/></button>}
         {p.triage_status === "Discharged" && (
           <>
             <button onClick={() => moveStatus(p.id, "Waiting Room")}>Re-admit</button>
             <button className="delete-btn" onClick={() => deletePatient(p.id)} title="Remove Patient Record"><X size={14}/></button>
           </>
         )}
       </div>
    </div>
  );

  return (
    <div className="triage-container animate-fade-in">
       <div className="triage-top-section">
         <div className="page-header">
           <h1>Physical Triage Kanban Board</h1>
           <p className="subtitle">Manage real-time hospital flow by transitioning patients out of the waiting room.</p>
         </div>
         
         <div className="search-wrapper">
           <Search size={18} className="search-icon" />
           <input 
             type="text" 
             className="triage-search" 
             placeholder="Search by name, doctor, or disease..."
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
           />
         </div>
       </div>

      <div className="mobile-swipe-hint">
        Swipe horizontally to view more <ArrowRight size={14} />
      </div>
      
      {loading ? <Loader2 className="spinning" /> : (
        <div className="kanban-board">
          <div className="kanban-column">
             <h3 className="kb-header waiting">Waiting Room ({getCol("Waiting Room").length})</h3>
             <div className="kb-body">{getCol("Waiting Room").map(renderCard)}</div>
          </div>
          <div className="kanban-column">
             <h3 className="kb-header review">Doctor Review ({getCol("Doctor Review").length})</h3>
             <div className="kb-body">{getCol("Doctor Review").map(renderCard)}</div>
          </div>
          <div className="kanban-column">
             <h3 className="kb-header discharged">Discharged ({getCol("Discharged").length})</h3>
             <div className="kb-body">{getCol("Discharged").map(renderCard)}</div>
          </div>
        </div>
      )}
    </div>
  );
}
