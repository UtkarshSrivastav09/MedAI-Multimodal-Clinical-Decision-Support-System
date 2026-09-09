import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, AreaChart, Area, ComposedChart, Line, PieChart, Pie, Cell,
  RadialBarChart, RadialBar, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { Activity, Clock, Users, ShieldAlert, TrendingUp, TrendingDown, Target, Terminal, Cpu } from 'lucide-react';
import './Analytics.css';

// --- CUSTOM HOOKS ---
const useCountUp = (end, duration = 2000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCount(progress === 1 ? end : end * easeProgress);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return count;
};

// --- MOCK TELEMETRY DATA ---
const efficiencyData = [
  { month: 'Jan', humanTime: 45, aiTime: 2.1 },
  { month: 'Feb', humanTime: 42, aiTime: 1.8 },
  { month: 'Mar', humanTime: 44, aiTime: 1.5 },
  { month: 'Apr', humanTime: 40, aiTime: 1.2 },
  { month: 'May', humanTime: 41, aiTime: 1.1 },
  { month: 'Jun', humanTime: 38, aiTime: 0.8 },
];

const diseaseTrendsData = [
  { week: 'W1', pneumonia: 120, cardiomegaly: 45, healthy: 800 },
  { week: 'W2', pneumonia: 132, cardiomegaly: 48, healthy: 850 },
  { week: 'W3', pneumonia: 250, cardiomegaly: 42, healthy: 820 },
  { week: 'W4', pneumonia: 280, cardiomegaly: 55, healthy: 810 },
  { week: 'W5', pneumonia: 180, cardiomegaly: 50, healthy: 900 },
  { week: 'W6', pneumonia: 140, cardiomegaly: 52, healthy: 950 },
];

const demographicData = [
  { name: 'Pediatric (0-12)', value: 15 },
  { name: 'Adolescent (13-18)', value: 10 },
  { name: 'Adult (19-50)', value: 35 },
  { name: 'Senior (51-70)', value: 25 },
  { name: 'Geriatric (71+)', value: 15 },
];

const systemHealthData = [
  { name: 'API Gateway', value: 72, fill: '#FF9800' },
  { name: 'Image Proc.', value: 85, fill: '#A371F7' },
  { name: 'DB Sync', value: 92, fill: '#00E676' },
  { name: 'Neural Core', value: 98, fill: '#00E5FF' }
];

const COLORS = ['#00E5FF', '#A371F7', '#FF5252', '#00E676', '#FF9800'];

// --- COMPONENTS ---
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-recharts-tooltip">
        <div className="tooltip-title">{label}</div>
        {payload.map((entry, index) => (
          <div key={index} className="tooltip-item">
            <div className="tooltip-color-box" style={{ background: entry.color || entry.fill }}></div>
            <span style={{ color: entry.color || entry.fill }}>{entry.name}:</span>
            <span style={{ color: 'var(--text-primary)' }}>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const NeuralCoreHealthHUD = () => {
  const [activeNode, setActiveNode] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const systems = [
    { 
      id: 'core', 
      name: 'Neural Core', 
      health: 98, 
      color: '#00E5FF', 
      latency: '14ms', 
      load: '12%', 
      status: 'Nominal',
      desc: 'Synaptic inference matrix & classification engine.'
    },
    { 
      id: 'db', 
      name: 'DB Sync', 
      health: 92, 
      color: '#00E676', 
      latency: '42ms', 
      load: '38%', 
      status: 'Active',
      desc: 'Real-time patient records synchronization and indexing.'
    },
    { 
      id: 'img', 
      name: 'Image Proc.', 
      health: 85, 
      color: '#A371F7', 
      latency: '124ms', 
      load: '64%', 
      status: 'Active',
      desc: 'DICOM formatting and neural feature extraction pipeline.'
    },
    { 
      id: 'api', 
      name: 'API Gateway', 
      health: 72, 
      color: '#FF9800', 
      latency: '18ms', 
      load: '82%', 
      status: 'Warning',
      desc: 'Load balancer & token authentication controller.'
    }
  ];

  const currentNode = activeNode !== null ? systems[activeNode] : systems[0];

  return (
    <div className="neural-hud-container">
      <div className="reactor-visualizer-wrapper">
        <svg viewBox="0 0 200 200" className="reactor-svg">
          <defs>
            <filter id="glow-heavy" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <circle 
            cx="100" 
            cy="100" 
            r="28" 
            fill="rgba(5, 10, 20, 0.9)" 
            stroke="rgba(255, 255, 255, 0.05)" 
            strokeWidth="2" 
          />
          <circle 
            cx="100" 
            cy="100" 
            r="24" 
            fill={currentNode.color} 
            className="reactor-core-pulse"
            style={{
              filter: `drop-shadow(0 0 10px ${currentNode.color})`,
              transition: 'all 0.5s ease',
              opacity: 0.15 + (currentNode.health / 150)
            }}
          />
          <circle 
            cx="100" 
            cy="100" 
            r="8" 
            fill="#ffffff" 
            style={{
              filter: `drop-shadow(0 0 8px ${currentNode.color})`,
              transition: 'all 0.5s ease'
            }}
          />

          {systems.map((sys, idx) => {
            const radius = 42 + idx * 14;
            const circumference = 2 * Math.PI * radius;
            const strokeDashoffset = circumference - (sys.health / 100) * circumference;
            const rotation = idx * 45;
            const isHovered = activeNode === idx;

            return (
              <g 
                key={sys.id} 
                className="reactor-arc-group"
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setActiveNode(idx)}
                onMouseLeave={() => setActiveNode(null)}
                onClick={() => setActiveNode(idx)}
                onTouchStart={(e) => {
                  setActiveNode(idx);
                }}
              >
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.03)"
                  strokeWidth="5"
                />
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="none"
                  stroke={sys.color}
                  strokeWidth={isHovered ? "7" : "5"}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  transform={`rotate(${-90 + rotation} 100 100)`}
                  style={{
                    filter: isHovered ? 'url(#glow-heavy)' : 'none',
                    opacity: activeNode === null || isHovered ? 1 : 0.35,
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                />
              </g>
            );
          })}
        </svg>

        <div className="reactor-core-readout">
          <div className="readout-health" style={{ color: currentNode.color }}>
            {currentNode.health}%
          </div>
          <div className="readout-label">SYSTEM HEALTH</div>
        </div>
      </div>

      <div className="hud-panel-grid">
        {systems.map((sys, idx) => {
          const isHovered = activeNode === idx;
          return (
            <div
              key={sys.id}
              className={`hud-card ${isHovered ? 'active' : ''}`}
              style={{ 
                '--accent-color': sys.color,
                borderColor: isHovered ? sys.color : 'var(--border-color)',
                boxShadow: isHovered ? `0 0 15px ${sys.color}25` : 'none'
              }}
              onMouseEnter={() => setActiveNode(idx)}
              onMouseLeave={() => setActiveNode(null)}
              onClick={() => setActiveNode(idx)}
              onTouchStart={() => {
                setActiveNode(idx);
              }}
            >
              <div className="hud-card-header">
                <span className="hud-node-dot" style={{ backgroundColor: sys.color }}></span>
                <span className="hud-node-name">{sys.name}</span>
                <span className="hud-node-percent" style={{ color: sys.color }}>{sys.health}%</span>
              </div>
              
              <div className="hud-card-details">
                <div className="hud-stat">
                  <span className="hud-stat-lbl">LATENCY</span>
                  <span className="hud-stat-val">{sys.latency}</span>
                </div>
                <div className="hud-stat">
                  <span className="hud-stat-lbl">LOAD</span>
                  <span className="hud-stat-val">{sys.load}</span>
                </div>
              </div>

              <div className="hud-node-desc">
                {sys.desc}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const LiveTelemetryConsole = () => {
  const [logs, setLogs] = useState([
    { id: 1, type: 'info', msg: 'Neural Core initialized. Connecting to remote PACS...' },
    { id: 2, type: 'succ', msg: 'Connection established. Handshake verified.' }
  ]);

  useEffect(() => {
    const scanTypes = ['Chest X-Ray', 'Brain MRI', 'CT Scan', 'Dermatology Image'];
    const results = ['Normal', 'Pneumonia Detected', 'Tumor Suspected', 'Benign', 'Cardiomegaly'];
    
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      
      const randScan = scanTypes[Math.floor(Math.random() * scanTypes.length)];
      const randRes = results[Math.floor(Math.random() * results.length)];
      const conf = (Math.random() * (99.9 - 85.0) + 85.0).toFixed(1);
      
      let type = 'info';
      if (randRes !== 'Normal' && randRes !== 'Benign') type = 'warn';
      if (conf < 88) type = 'crit';
      if (randRes === 'Normal') type = 'succ';

      const newLog = {
        id: Date.now(),
        type,
        time: timeStr,
        msg: `INBOUND [${randScan}] -> Conf: ${conf}% -> Verdict: ${randRes}`
      };

      setLogs(prev => {
        const next = [...prev, newLog];
        return next.slice(-7); // Keep only last 7 logs to fit in console
      });
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="chart-card full-width glass-card">
      <div className="chart-header">
        <h3><Terminal size={18} color="var(--accent-cyan)"/> Live Neural Core Telemetry</h3>
        <div className="live-indicator">
          <div className="live-dot"></div>
          STREAMING
        </div>
      </div>
      <div className="console-container">
        <div className="console-output">
          {logs.map(log => (
            <div key={log.id} className="console-line">
              {log.time && <span className="console-time">[{log.time}]</span>}
              <span className={`console-type-${log.type}`}>{log.msg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function Analytics() {
  const avgTime = useCountUp(0.8, 2000);
  const accuracy = useCountUp(94.2, 2500);
  const criticalFlags = useCountUp(142, 3000);
  const hoursSaved = useCountUp(1420, 3500);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h1>Analytics & Insights Command Center</h1>
        <p>Real-time population health telemetry, AI efficiency metrics, and live stream analysis.</p>
      </div>

      {/* KPI Row */}
      <div className="kpi-row">
        <div className="kpi-card glass-card">
          <div className="kpi-title"><Clock size={16} color="var(--accent-cyan)"/> Avg Diagnosis Time</div>
          <div className="kpi-value">{avgTime.toFixed(1)}s</div>
          <div className="kpi-trend trend-up"><TrendingDown size={14}/> 98% faster than human baseline</div>
        </div>
        
        <div className="kpi-card glass-card">
          <div className="kpi-title"><Target size={16} color="var(--success)"/> Diagnostic Accuracy</div>
          <div className="kpi-value">{accuracy.toFixed(1)}%</div>
          <div className="kpi-trend trend-up"><TrendingUp size={14}/> +2.4% this quarter</div>
        </div>

        <div className="kpi-card glass-card">
          <div className="kpi-title"><Activity size={16} color="var(--danger)"/> Critical Flags</div>
          <div className="kpi-value">{Math.floor(criticalFlags)}</div>
          <div className="kpi-trend trend-down"><ShieldAlert size={14}/> Pneumonia surge detected W3</div>
        </div>

        <div className="kpi-card glass-card">
          <div className="kpi-title"><Users size={16} color="var(--accent-purple)"/> Clinical Hours Saved</div>
          <div className="kpi-value">{Math.floor(hoursSaved).toLocaleString()}</div>
          <div className="kpi-trend trend-up"><TrendingUp size={14}/> $120k operational ROI</div>
        </div>
      </div>

      <div className="charts-grid">
        
        {/* LIVE CONSOLE (Full Width) */}
        <LiveTelemetryConsole />

        {/* CHART: Epidemiological Heatmap (Composed) */}
        <div className="chart-card glass-card">
          <div className="chart-header">
            <h3><Activity size={18} color="var(--danger)"/> Disease Detection Trends (Weekly)</h3>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={diseaseTrendsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" height={36} wrapperStyle={{fontSize: '0.85rem'}}/>
                <Bar dataKey="healthy" name="Healthy Scans" barSize={20} fill="var(--success)" radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="pneumonia" name="Pneumonia Cases" stroke="var(--danger)" strokeWidth={3} dot={{r: 4, fill: "var(--danger)", strokeWidth: 2}} />
                <Line type="monotone" dataKey="cardiomegaly" name="Cardiomegaly Cases" stroke="var(--accent-purple)" strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART: Neural Core Health HUD */}
        <div className="chart-card glass-card">
          <div className="chart-header">
            <h3><Cpu size={18} color="#00E5FF"/> Neural Core Health HUD</h3>
          </div>
          <NeuralCoreHealthHUD />
        </div>

        {/* CHART: AI vs Human Efficiency */}
        <div className="chart-card glass-card">
          <div className="chart-header">
            <h3><Clock size={18} color="var(--accent-cyan)"/> Turnaround Time: AI vs Human (Minutes)</h3>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={efficiencyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHuman" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A371F7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#A371F7" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00E5FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" height={36} wrapperStyle={{fontSize: '0.85rem'}}/>
                <Area type="monotone" dataKey="humanTime" name="Human MD (Mins)" stroke="#A371F7" fillOpacity={1} fill="url(#colorHuman)" />
                <Area type="monotone" dataKey="aiTime" name="Med-AI Core (Mins)" stroke="#00E5FF" fillOpacity={1} fill="url(#colorAi)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART: Demographics */}
        <div className="chart-card glass-card">
          <div className="chart-header">
            <h3><Users size={18} color="var(--accent-purple)"/> Patient Demographics Distribution</h3>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={demographicData}
                  cx="50%"
                  cy="50%"
                  innerRadius={isMobile ? 50 : 80}
                  outerRadius={isMobile ? 80 : 110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {demographicData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  layout={isMobile ? "horizontal" : "vertical"} 
                  verticalAlign={isMobile ? "bottom" : "middle"} 
                  align={isMobile ? "center" : "right"} 
                  wrapperStyle={{ fontSize: '0.85rem', marginTop: isMobile ? '10px' : '0' }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
