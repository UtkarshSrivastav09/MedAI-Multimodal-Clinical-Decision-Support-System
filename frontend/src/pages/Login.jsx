import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Sun,
  Moon,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Activity,
  ShieldCheck,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "../hooks/useAuth";
import "./AuthStyles.css";

const LoginForm = ({ setAuth }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationMsg, setRegistrationMsg] = useState("");

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.getAttribute("data-theme") !== "light";
  });

  const { login, error: authError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("isAuthenticated") === "true") {
      navigate("/");
    }

    if (sessionStorage.getItem("registrationSuccess") === "true") {
      const regUser = sessionStorage.getItem("registeredUsername") || "";
      setRegistrationMsg(`Account ready for ${regUser || "you"}. Please sign in.`);
      if (regUser) setUsername(regUser);
      sessionStorage.removeItem("registrationSuccess");
      sessionStorage.removeItem("registeredUsername");
    }
  }, [navigate]);

  const toggleTheme = () => {
    const nextTheme = isDarkMode ? "light" : "dark";
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) return;

    setIsLoading(true);
    const success = await login(username.trim(), password);
    if (success) {
      sessionStorage.setItem("isAuthenticated", "true");
      sessionStorage.setItem("username", username.trim());
      if (setAuth) setAuth(true);
      navigate("/");
    }
    setIsLoading(false);
  };

  return (
    <div className="dribbble-auth-viewport">
      <div className="dribbble-master-card">
        {/* ================= LEFT SIDE: Form Section ================= */}
        <div className="dribbble-form-section">
          {/* Header Bar: Brand Capsule on Left, Theme & Home on Right */}
          <div className="form-header-bar">
            <div className="dribbble-brand-capsule">
              <span className="brand-dot"></span>
              <span>Med-AI</span>
            </div>
            <div className="form-top-actions">
              <button
                type="button"
                onClick={toggleTheme}
                className="form-icon-pill"
                title="Toggle Light / Dark Mode"
              >
                {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="form-icon-pill"
                title="Home"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div style={{ maxWidth: "400px", margin: "auto 0" }}>
            <div className="dribbble-form-head">
              <h1 className="dribbble-heading">
                Welcome to <span className="gradient-title-accent">MedAI</span>
              </h1>
              <p className="dribbble-subheading">
                Clinical Decision Support & Diagnostic Intelligence System
              </p>
            </div>

            {/* Notifications */}
            <AnimatePresence>
              {registrationMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="dribbble-alert success"
                >
                  <CheckCircle2 size={16} />
                  <span>{registrationMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {authError && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="dribbble-alert error"
                >
                  <AlertCircle size={16} />
                  <span>{authError}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit}>
              {/* Username Field */}
              <div className="dribbble-field">
                <label className="dribbble-field-label">Username</label>
                <div className="dribbble-input-box">
                  <input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="dribbble-pill-input"
                    required
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="dribbble-field">
                <label className="dribbble-field-label">Password</label>
                <div className="dribbble-input-box">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="dribbble-pill-input"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="dribbble-eye-btn"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Primary Pill Submit Button */}
              <button
                type="submit"
                className="dribbble-submit-pill"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="spin-anim" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>
          </div>

          {/* Bottom Footer Links */}
          <div className="dribbble-form-footer">
            <span>
              Don't have an account?{" "}
              <span
                className="dribbble-link"
                onClick={() => navigate("/signup")}
              >
                Sign up
              </span>
            </span>
            <span style={{ fontSize: "0.76rem", opacity: 0.8, display: "flex", alignItems: "center", gap: "4px" }}>
              <ShieldCheck size={13} color="#00e5ff" /> HIPAA Compliant • 256-Bit SSL
            </span>
          </div>
        </div>

        {/* ================= RIGHT SIDE: 20+ LPA Live MedAI Workstation Showcase ================= */}
        <div className="dribbble-showcase-section">
          {/* Top Window HUD Bar - completely clear, zero button collision */}
          <div className="hud-window-header">
            <div className="hud-window-dots">
              <span className="hud-dot red"></span>
              <span className="hud-dot yellow"></span>
              <span className="hud-dot green"></span>
            </div>
            <div className="hud-window-title">
              <span>MED-AI DIAGNOSTIC ENGINE V2.8</span>
              <span className="hud-active-pill">● CORE ONLINE</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#00e5ff", fontSize: "0.75rem", fontFamily: "monospace" }}>
              <Zap size={14} /> 28ms
            </div>
          </div>

          {/* Center Scanner Viewport */}
          <div className="hud-scanner-stage">
            <img
              src="/medical_ai_header_art_1777788008797.png"
              alt="MedAI Neural Radiograph Inference"
              className="hud-scanner-bg"
            />
            <div className="hud-scanner-grid"></div>

            {/* Dynamic Sweeping Laser */}
            <div className="hud-laser-line"></div>

            {/* Region of Interest Targeting Box 1 */}
            <div className="hud-roi-marker roi-1">
              <span className="roi-tag">ROI: RUL [Clear]</span>
            </div>

            {/* Region of Interest Targeting Box 2 */}
            <div className="hud-roi-marker roi-2">
              <span className="roi-tag">CTR: 0.45 [Normal]</span>
            </div>

            {/* Top Floating Badge */}
            <div className="hud-floating-badge">
              <span className="hud-badge-title">
                <Activity size={14} /> Multimodal Radiography
              </span>
              <span className="hud-badge-sub">Sub-4s Gemini Flash Analysis</span>
            </div>

            {/* Bottom Floating Insight Pill */}
            <div className="hud-floating-insight">
              <span className="insight-val">99.4%</span>
              <div className="insight-label">
                <strong>RADS-1 Grade Normal</strong>
                <span>Clinical Panel Concordance</span>
              </div>
            </div>
          </div>

          {/* Bottom Telemetry Dock */}
          <div className="hud-telemetry-dock">
            <div className="telemetry-item">
              <span className="telemetry-label">Heart Rate</span>
              <span className="telemetry-val highlight">72 BPM</span>
            </div>
            <div className="telemetry-item">
              <span className="telemetry-label">SpO2 Oxygen</span>
              <span className="telemetry-val">98% Normal</span>
            </div>
            <div className="telemetry-item">
              <span className="telemetry-label">Blood Pressure</span>
              <span className="telemetry-val">120/80 mmHg</span>
            </div>
            <div className="telemetry-item">
              <span className="telemetry-label">Model Pipeline</span>
              <span className="telemetry-val highlight">Gemini-2.0-Vision</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
