import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Key, LogIn, ShieldAlert, Building, Loader2, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "../hooks/useAuth";
import InteractiveBackground from "../components/InteractiveBackground";
import './AuthStyles.css';

const RegisterForm = ({ setAuth }) => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { register, error: authError } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrorMsg(""); // Clear local error on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      return setErrorMsg("Passwords do not match");
    }

    setIsLoading(true);

    const success = await register(form.username, form.email, form.password, form.role);

    if (success) {
      sessionStorage.setItem("registrationSuccess", "true");
      sessionStorage.setItem("registeredEmail", form.email);
      sessionStorage.setItem("registeredUsername", form.username);
      navigate("/login");
    }

    setIsLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-blob blob-1" style={{ background: 'linear-gradient(135deg, var(--accent-cyan), var(--success))' }}></div>
      <div className="auth-blob blob-2" style={{ background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))' }}></div>
      <div className="auth-blob blob-3"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="glass-card auth-container"
      >

        {/* Left Side: Brand Info */}
        <div className="auth-brand">
          <InteractiveBackground colorTheme="purple" />
          {/* Glowing Neural Visualizer Core */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="neural-core-wrapper"
          >
            <div className="neural-grid"></div>
            <motion.div 
              className="neural-ring ring-outer"
              animate={{ rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              style={{ borderColor: 'rgba(179, 136, 255, 0.4)' }}
            />
            <motion.div 
              className="neural-ring ring-inner"
              animate={{ rotate: -360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            />
            <div className="scanner-laser" style={{ background: 'linear-gradient(90deg, transparent, var(--accent-purple), transparent)', boxShadow: '0 0 10px var(--accent-purple), 0 0 20px var(--accent-purple)' }}></div>
            <motion.div 
              className="neural-orb"
              whileHover={{ scale: 1.1, boxShadow: "0 0 40px rgba(179, 136, 255, 0.5)" }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <ShieldAlert size={30} color="var(--accent-purple)" className="pulse-icon" />
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}
            className="logo-badge"
            style={{ backgroundColor: 'rgba(179, 136, 255, 0.08)', borderColor: 'rgba(179, 136, 255, 0.2)' }}
          >
            <span className="shimmer-text">Welcome to Med-AI</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.5, duration: 0.6 }}
            className="brand-title"
          >
            AI-Powered <br />
            <span className="gradient-text-purple">Clinical Support</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.6, duration: 0.5 }}
            className="brand-subtitle"
          >
            Join our AI-driven system to upload, analyze, and manage clinical data efficiently.
          </motion.p>

          {/* Diagnostic Status Indicator */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="brand-stats"
          >
            <div className="stat-pill">
              <span className="stat-dot green"></span>
              <span>Core Online</span>
            </div>
            <div className="stat-pill">
              <span className="stat-dot purple"></span>
              <span>HIPAA Secure</span>
            </div>
            <div className="stat-pill">
              <span className="stat-dot cyan"></span>
              <span>v2.8-Neural</span>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Form */}
        <div className="auth-form-wrapper">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
            style={{ fontSize: '1.85rem', fontWeight: 700, marginBottom: '24px' }}
          >
            Request Access
          </motion.h2>

          <form onSubmit={handleSubmit}>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35, duration: 0.5 }} className="auth-input-group">
              <input
                name="username"
                placeholder="Institutional ID (Username)"
                onChange={handleChange}
                className="auth-input"
                required
              />
              <User size={18} />
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.5 }} className="auth-input-group">
              <input
                name="email"
                type="email"
                placeholder="Work Email"
                onChange={handleChange}
                className="auth-input"
                required
              />
              <Mail size={18} />
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45, duration: 0.5 }} className="auth-input-group">
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="auth-input"
                style={{ appearance: 'none', cursor: 'pointer' }}
                required
              >
                <option value="" style={{ color: '#000' }}>Select Role</option>
                <option value="Doctor" style={{ color: '#000' }}>Doctor</option>
                <option value="Patient" style={{ color: '#000' }}>Patient</option>
                <option value="Admin" style={{ color: '#000' }}>Admin</option>
                <option value="Nurse" style={{ color: '#000' }}>Nurse</option>
              </select>
              <User size={18} />
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.5 }} className="auth-input-group" style={{ marginBottom: '12px' }}>
              <input
                name="password"
                type="password"
                placeholder="Security Password"
                onChange={handleChange}
                className="auth-input"
                required
              />
              <Key size={18} />
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.55, duration: 0.5 }} className="auth-input-group">
              <input
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                onChange={handleChange}
                className="auth-input"
                required
              />
              <Key size={18} />
            </motion.div>

            <AnimatePresence>
              {(errorMsg || authError) && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}
                  style={{ color: 'var(--danger)', fontSize: '0.9rem', marginBottom: '16px', padding: '10px', background: 'rgba(255,82,82,0.1)', borderRadius: '8px' }}
                >
                  {errorMsg || authError}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65, duration: 0.5 }}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              type="submit" className="auth-btn" disabled={isLoading} style={{ background: 'var(--accent-cyan)', color: 'var(--bg-primary)' }}
            >
              {isLoading ? <Loader2 size={18} className="spin-anim" /> : <><LogIn size={18} /> Submit Credentials</>}
            </motion.button>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75, duration: 0.5 }} className="switch-text">
              Already Have an Account?
              <span onClick={() => navigate('/login')}>Sign In</span>
            </motion.div>
          </form>
        </div>

      </motion.div>
    </div>
  );
};

export default RegisterForm;