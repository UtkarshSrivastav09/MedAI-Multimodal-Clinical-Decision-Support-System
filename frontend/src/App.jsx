import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Stethoscope, Activity, Database, LayoutDashboard, Layers, LogOut, Video, Menu, X, Sun, Moon, HelpCircle, Loader2, PieChart } from 'lucide-react';
import Preloader from './components/Preloader';
import API_BASE_URL from './api';
import "./index.css";
import "./App.css";

// Lazy load pages for code splitting (Faster initial load)
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Scanner = lazy(() => import('./pages/Scanner'));
const PatientDatabase = lazy(() => import('./pages/PatientDatabase'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Triage = lazy(() => import('./pages/Triage'));
const Consult = lazy(() => import('./pages/Consult'));
const Help = lazy(() => import('./pages/Help'));
const Analytics = lazy(() => import('./pages/Analytics'));

function NavLinks({ setAuth, isOpen, setIsOpen }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'active' : '';
  const username = sessionStorage.getItem("username");

  const handleLogout = () => {
    sessionStorage.clear();
    setAuth(false);
  };

  const handleNavClick = () => {
    if (window.innerWidth <= 900) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)}></div>}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="logo" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Stethoscope color="var(--accent-cyan)" />
            <h2>Med-AI</h2>
          </div>
          <button className="mobile-close-btn" onClick={() => setIsOpen(false)}>
            <X size={24} color="var(--text-primary)" />
          </button>
        </div>
        <div className="nav-links">
          <Link to="/" onClick={handleNavClick} className={`nav-item ${isActive('/')}`}><LayoutDashboard size={18} /> Admin Dashboard</Link>
          <Link to="/analytics" onClick={handleNavClick} className={`nav-item ${isActive('/analytics')}`}><PieChart size={18} /> Analytics & Insights</Link>
          <Link to="/consult" onClick={handleNavClick} className={`nav-item ${isActive('/consult')}`}><Video size={18} /> AI TeleConsult</Link>
          <Link to="/scanner" onClick={handleNavClick} className={`nav-item ${isActive('/scanner')}`}><Activity size={18} /> Clinical Imaging</Link>
          {username === 'admin' && (
            <Link to="/triage" onClick={handleNavClick} className={`nav-item ${isActive('/triage')}`}><Layers size={18} /> Clinical Workflow</Link>
          )}
          <Link to="/database" onClick={handleNavClick} className={`nav-item ${isActive('/database')}`}><Database size={18} /> Patient Records</Link>
          <Link to="/help" onClick={handleNavClick} className={`nav-item ${isActive('/help')}`} style={{ color: 'var(--accent-cyan)' }}><HelpCircle size={18} /> About & Help</Link>
        </div>
        <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
          <button onClick={handleLogout} className="nav-item" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', color: 'var(--danger)', background: 'rgba(255,82,82,0.05)' }}>
            <LogOut size={18} /> Secure Logout
          </button>
        </div>
      </aside>
    </>
  );
}

function AppContent() {
  const [isAppLoading, setIsAppLoading] = useState(() => {
    // Skip preloader on mobile devices (width <= 900px) for instant load
    return window.innerWidth > 900;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("isAuthenticated") === "true";
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLightMode, setIsLightMode] = useState(
    document.documentElement.getAttribute('data-theme') === 'light'
  );
  const location = useLocation();

  useEffect(() => {
    // 1. Warm up backend in the background (non-blocking cold-start mitigation)
    console.log("🚀 Warming up neural core in background...");
    fetch(`${API_BASE_URL}/api/ping`)
      .then(res => {
        if (res.ok) console.log("✅ Neural core online!");
      })
      .catch(e => {
        console.warn("⚠️ Neural core background warm-up failed or timed out.");
      });
    
    // 2. Hide preloader after a fixed branding delay (1.5 seconds) on desktop only
    if (window.innerWidth > 900) {
      const timer = setTimeout(() => {
        setIsAppLoading(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !isLightMode;
    setIsLightMode(newMode);
    document.documentElement.setAttribute('data-theme', newMode ? 'light' : 'dark');
  };

  // Determine if the current page is an authentication page
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <>
      {isAppLoading && <Preloader />}
      <div className="app-container" style={{ display: isAppLoading ? 'none' : 'flex' }}>
        {/* Sidebar only shows if authenticated AND not on login/signup pages */}
      {!isAuthPage && isAuthenticated && <NavLinks setAuth={setIsAuthenticated} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />}

      <main className={isAuthPage ? "auth-main" : "main-content"}>
        {!isAuthPage && isAuthenticated && (
          <div className="top-bar">
            <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <button 
              className="theme-toggle-btn" 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleTheme();
              }} 
              title="Toggle Theme"
            >
              {isLightMode ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>
        )}
        
        <Suspense fallback={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100%', background: 'var(--bg-primary)' }}>
            <div style={{ textAlign: 'center' }}>
              <Loader2 className="spin-anim" size={40} color="var(--accent-cyan)" />
              <p style={{ marginTop: '16px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Synchronizing Neural Pathways...</p>
            </div>
          </div>
        }>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={!isAuthenticated ? <Login setAuth={setIsAuthenticated} /> : <Navigate to="/" />} />
            <Route path="/signup" element={!isAuthenticated ? <Signup setAuth={setIsAuthenticated} /> : <Navigate to="/" />} />

            {/* Protected Routes - Redirect to Login if not authenticated */}
            <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/analytics" element={isAuthenticated ? <Analytics /> : <Navigate to="/login" />} />
            <Route path="/consult" element={isAuthenticated ? <Consult /> : <Navigate to="/login" />} />
            <Route path="/scanner" element={isAuthenticated ? <Scanner /> : <Navigate to="/login" />} />
            <Route 
              path="/triage" 
              element={
                isAuthenticated && sessionStorage.getItem("username") === 'admin' 
                  ? <Triage /> 
                  : <Navigate to="/" />
              } 
            />
            <Route path="/database" element={isAuthenticated ? <PatientDatabase /> : <Navigate to="/login" />} />
            <Route path="/help" element={isAuthenticated ? <Help /> : <Navigate to="/login" />} />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
          </Routes>
        </Suspense>

        {!isAuthPage && location.pathname !== '/help' && (
          <footer className="global-footer">
            © 2026 Med-AI Laboratory | Lead Architect: Utkarsh Srivastav
          </footer>
        )}
      </main>
    </div>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}