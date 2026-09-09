import React, { useEffect, useState } from 'react';
import { Activity, Stethoscope, AlertOctagon, HeartPulse, ShieldAlert, Cpu, Building, Users, Sun, Moon, Clock, User, ClipboardList } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import API_BASE_URL from '../api';
import './Dashboard.css';

const COLORS = ['#00E5FF', '#A371F7', '#FF5252', '#00E676', '#FF9800'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip" style={{ padding: '10px', background: 'var(--bg-glass)', border: '1px solid var(--border-color)', borderRadius: '8px', backdropFilter: 'blur(10px)' }}>
        <p style={{ color: 'var(--text-primary)', margin: 0, fontWeight: 600 }}>{`${label}`}</p>
        <p style={{ color: 'var(--accent-cyan)', margin: '5px 0 0', fontWeight: 500 }}>{`Referrals: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const CustomDonutTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip" style={{ padding: '10px', background: 'var(--bg-glass)', border: '1px solid var(--border-color)', borderRadius: '8px', backdropFilter: 'blur(10px)' }}>
        <p style={{ color: 'var(--text-primary)', margin: 0, fontWeight: 600 }}>{`${payload[0].name}`}</p>
        <p style={{ color: payload[0].payload.fill, margin: '5px 0 0', fontWeight: 500 }}>{`Count: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const organization = sessionStorage.getItem("organization") || "Med-AI Global";
  const username = sessionStorage.getItem("username") || "Clinician";

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/dashboard/stats?org=${encodeURIComponent(organization)}`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error(err));
  }, []);

  if (!stats) return <div className="loading" style={{padding: '40px', color: 'var(--text-secondary)'}}>Loading Telemetry...</div>;

  const healthyRatio = stats.total_scans > 0 ? Math.round((stats.total_healthy / stats.total_scans) * 100) : 0;
  const severeRatio = stats.total_scans > 0 ? Math.round((stats.total_severe / stats.total_scans) * 100) : 0;

  return (
    <div className="dashboard-container animate-fade-in">
      <div className="page-header header-with-art">
        <div className="user-welcome-container">
          <div className="welcome-text">Diagnostic Commander</div>
          <h1 className="username-highlight">
            {username}
          </h1>
          <div className="role-badge">
             <Building size={14} /> {organization}
          </div>
          <p className="subtitle" style={{ fontSize: '1rem', marginTop: '12px', opacity: 0.8 }}>
            Real-time telemetry, routing, and clinical access logs.
          </p>
        </div>

        <div className="header-art-container">
          <div className="dna-spiral-wrapper">
            <div className="dna-spiral">
              {[...Array(24)].map((_, i) => (
                <div key={i} className="dna-dot" style={{ '--i': i }}></div>
              ))}
            </div>
            <div className="dna-label"></div>
          </div>
        </div>
      </div>

      {/* TOP ROW: Core Metrics */}
      <div className="stats-row" style={{marginBottom: '24px'}}>
        <div className="stat-card glass-card">
          <div className="stat-icon" style={{ background: 'rgba(0, 229, 255, 0.1)' }}>
            <Activity color="var(--accent-cyan)" />
          </div>
          <div className="stat-content">
            <h3>Total Lifetime Scans</h3>
            <div className="stat-value">{stats.total_scans}</div>
          </div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-icon" style={{ background: 'rgba(255, 82, 82, 0.1)' }}>
            <HeartPulse color="var(--danger)" />
          </div>
          <div className="stat-content">
            <h3>Diseases Identified</h3>
            <div className="stat-value">{stats.total_diseases_detected}</div>
          </div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-icon" style={{ background: 'rgba(163, 113, 247, 0.1)' }}>
            <Cpu color="var(--accent-purple)" />
          </div>
          <div className="stat-content">
            <h3>Avg Token Processing</h3>
            <div className="stat-value">{stats.avg_processing_time_ms} ms</div>
            <span style={{fontSize: '0.8rem', color: 'var(--success)'}}>Human equivalent: 48 hrs</span>
          </div>
        </div>
      </div>

      {/* MIDDLE ROW: The 3 Massive Features */}
      <div className="dashboard-grid">
         
         {/* Feature 1: Top Doctors (Bar Chart) */}
         <div className="glass-card chart-card">
            <h3><Stethoscope size={18} style={{marginRight:'8px', verticalAlign:'middle'}}/> Top Referring Network</h3>
            <div className="chart-wrapper">
               {stats.top_doctors?.length > 0 ? (
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={stats.top_doctors} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                     <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                     <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={11} tickLine={false} axisLine={false} />
                     <YAxis stroke="var(--text-secondary)" fontSize={11} tickLine={false} axisLine={false} />
                     <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                     <Bar dataKey="count" fill="var(--accent-cyan)" radius={[4, 4, 0, 0]} />
                   </BarChart>
                 </ResponsiveContainer>
               ) : <div style={{color:'var(--text-secondary)', marginTop: '16px'}}>Awaiting data...</div>}
            </div>
         </div>

         {/* Feature 2: Department Burden (Donut Chart) */}
         <div className="glass-card chart-card">
            <h3><Activity size={18} style={{marginRight:'8px', verticalAlign:'middle'}}/> Department Routing Burden</h3>
            <div className="chart-wrapper">
               {stats.departments?.length > 0 ? (
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie
                       data={stats.departments}
                       cx="50%"
                       cy="45%"
                       innerRadius={60}
                       outerRadius={80}
                       paddingAngle={5}
                       dataKey="count"
                       nameKey="dept"
                       stroke="none"
                     >
                       {stats.departments.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                     </Pie>
                     <Tooltip content={<CustomDonutTooltip />} />
                     <Legend 
                       verticalAlign="bottom" 
                       height={36} 
                       iconType="circle"
                       wrapperStyle={{ fontSize: '11px', color: 'var(--text-primary)', paddingTop: '10px' }} 
                     />
                   </PieChart>
                 </ResponsiveContainer>
               ) : <div style={{color:'var(--text-secondary)', marginTop: '16px'}}>Awaiting data...</div>}
            </div>
         </div>

         {/* Feature 3: Live Alerts Array */}
         <div className="glass-card" style={{border: '1px solid rgba(255, 82, 82, 0.3)'}}>
            <h3 style={{color: 'var(--danger)'}}><AlertOctagon size={18} style={{marginRight:'8px', verticalAlign:'middle'}}/> Critical Priority Inbox</h3>
            <ul className="admin-list alerts-list" style={{marginTop: '16px'}}>
               {stats.critical_alerts?.length > 0 ? stats.critical_alerts.map((al, i) => (
                  <li key={i} style={{background: 'rgba(255,82,82,0.08)', flexDirection: 'column', gap: '8px', padding: '16px'}}>
                     <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                       <div className="doc-name">{al.patient}</div>
                       <div className="doc-count" style={{color: 'var(--danger)'}}>{al.issue}</div>
                     </div>
                  </li>
               )) : <li style={{color:'var(--success)'}}>No critical cases pending.</li>}
            </ul>
         </div>

         {/* Feature 4: Active Network Personnel */}
         <div className="glass-card">
            <h3><Users size={18} style={{marginRight:'8px', verticalAlign:'middle', color:'var(--success)'}}/> Network Clinicians ({stats.org_users?.length || 0})</h3>
            <ul className="admin-list" style={{marginTop: '16px'}}>
               {stats.org_users?.length > 0 ? stats.org_users.slice(0, 5).map((u, i) => (
                  <li key={i}>
                     <div className="doc-name" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }}></div> {u.username}</div>
                     <div className="doc-count" style={{color: 'var(--text-secondary)', fontWeight: 'normal', fontSize: '0.85rem'}}>{u.email}</div>
                  </li>
               )) : <li style={{color:'var(--text-secondary)'}}>No clinicians found.</li>}
            </ul>
         </div>
      </div>

      {/* BOTTOM SECTION: Global System Feed */}
      <div className="glass-card feed-container">
        <div className="feed-header-minimal">
          <div className="feed-title-group">
            <div className="live-indicator-dot"></div>
            <h3>Recent Live Scans <span className="feed-tag">Global Feed</span></h3>
          </div>
          <div className="feed-stats">
            <Clock size={14} /> Real-time Monitoring
          </div>
        </div>

        <div className="feed-content">
          <table className="modern-feed-table">
            <thead>
              <tr>
                <th><Clock size={14} /> Time</th>
                <th><User size={14} /> Patient</th>
                <th><ClipboardList size={14} /> Diagnosis Assessment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recent_scans?.length > 0 ? stats.recent_scans.map((scan, idx) => (
                <tr key={idx} className={scan.requires_followup ? 'row-priority' : 'row-normal'}>
                  <td className="cell-time">
                    <span className="time-val">{new Date(scan.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="date-val">{new Date(scan.date).toLocaleDateString()}</span>
                  </td>
                  <td className="cell-patient">
                    <div className="patient-flex">
                      <div className="patient-initial">{scan.patient.charAt(0)}</div>
                      <span className="name-val">{scan.patient}</span>
                    </div>
                  </td>
                  <td className="cell-diagnosis">
                    <div className="pills-container">
                      {scan.diseases.length === 0 ? (
                        <span className="pill pill-healthy">Healthy / Normal</span>
                      ) : (
                        scan.diseases.map((d, i) => (
                          <span key={i} className="pill pill-disease">{d}</span>
                        ))
                      )}
                    </div>
                  </td>
                  <td className="cell-status">
                    {scan.requires_followup ? (
                      <div className="status-indicator critical">
                        <ShieldAlert size={14} /> Critical
                      </div>
                    ) : (
                      <div className="status-indicator stable">
                        AI Verified
                      </div>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="empty-msg">Waiting for incoming clinical data...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
