import React, { useState, useEffect, useRef } from 'react';
import { Mic, Video, VideoOff, MicOff, PhoneOff, Send, MessageSquare, Activity } from 'lucide-react';
import API_BASE_URL from '../api';
import './Consult.css';

export default function Consult() {
  const [stream, setStream] = useState(null);
  const [hasVideo, setHasVideo] = useState(true);
  const [hasAudio, setHasAudio] = useState(true);
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState('');
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [callActive, setCallActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const username = sessionStorage.getItem("username") || "Patient Node";

  const videoRef = useRef(null);
  const chatEndRef = useRef(null);

  // Initialize camera
  useEffect(() => {
    if (callActive) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(mediaStream => {
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
          // Initial greeting from AI
          if (history.length === 0) {
            const greeting = "Hello, I am Med-AI, your virtual physician. I am here to help you. Could you please tell me what symptoms you are experiencing today?";
            setHistory([{ role: 'ai', content: greeting }]);
            speak(greeting);
          }
        })
        .catch(err => {
          console.error("Error accessing media devices.", err);
          alert("Could not access camera/microphone. You can still use the text chat.");
          // Still start call
          if (history.length === 0) {
             const greeting = "Hello, I am Med-AI, your virtual physician. I could not access your camera, but we can chat here. What symptoms are you experiencing?";
             setHistory([{ role: 'ai', content: greeting }]);
          }
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      window.speechSynthesis.cancel();
    };
  }, [callActive]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Try to find a good female/professional voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Samantha') || v.name.includes('Female'));
      if (preferredVoice) utterance.voice = preferredVoice;

      utterance.rate = 0.95; // Slightly slower for medical clarity
      utterance.pitch = 1;

      utterance.onstart = () => setIsAISpeaking(true);
      utterance.onend = () => setIsAISpeaking(false);
      utterance.onerror = () => setIsAISpeaking(false);

      window.speechSynthesis.speak(utterance);
    } else {
      console.warn("Speech Synthesis not supported in this browser.");
    }
  };

  const handleSend = async (e, directMessage = null) => {
    e?.preventDefault();
    const userMessage = directMessage || message.trim();
    if (!userMessage || loading) return;

    setMessage('');
    
    // Add user message to UI immediately
    const newHistory = [...history, { role: 'user', content: userMessage }];
    setHistory(newHistory);
    setLoading(true);

    try {
      // Format history for backend
      const backendHistory = history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        content: msg.content
      }));

      const response = await fetch(`${API_BASE_URL}/api/consult_chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: backendHistory,
          message: userMessage
        })
      });

      const data = await response.json();
      const aiResponseText = data.answer || "I'm sorry, I encountered an error processing that.";
      
      setHistory(prev => [...prev, { role: 'ai', content: aiResponseText }]);
      speak(aiResponseText);
    } catch (error) {
      console.error(error);
      setHistory(prev => [...prev, { role: 'ai', content: "Connection error to AI Node." }]);
    } finally {
      setLoading(false);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks()[0].enabled = !hasVideo;
      setHasVideo(!hasVideo);
    }
  };

  const toggleAudio = () => {
    if (stream && stream.getAudioTracks().length > 0) {
      stream.getAudioTracks()[0].enabled = !hasAudio;
    }
    setHasAudio(!hasAudio);
  };

  const endCall = () => {
    if (stream) stream.getTracks().forEach(track => track.stop());
    window.speechSynthesis.cancel();
    setCallActive(false);
    setHistory([]);
    setStream(null);
  };

  const [isListening, setIsListening] = useState(false);

  const startVoiceInput = () => {
    if (isListening) return;

    // Immediately stop AI speech if user interrupts to provide vocal input
    window.speechSynthesis.cancel();
    setIsAISpeaking(false);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false; // Wait for the user to finish speaking
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      
      // Directly communicate with AI, completely bypassing the input field
      if (transcript.trim()) {
        handleSend(null, transcript.trim());
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  if (!callActive) {
    return (
      <div className="consult-lobby animate-fade-in">
        <div className="lobby-card glass-card">
          <Activity size={64} color="var(--accent-purple)" style={{ marginBottom: '20px' }} />
          <h2>AI Virtual Physician Consult</h2>
          <p>Connect instantly with our advanced diagnostic AI for an interactive interview.</p>
          <div className="lobby-features">
            <span><Video size={18} /> HD Video Secure</span>
            <span><Mic size={18} /> Natural Voice Intel</span>
            <span><Activity size={18} /> Real-time Triage</span>
          </div>
          <button className="start-call-btn" onClick={() => setCallActive(true)}>
            Start Consultation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="consult-container animate-fade-in">
      
      {/* LEFT: Video Area */}
      <div className="video-area">
        {/* Dynamic Background Mesh */}
        <div className="video-bg-mesh"></div>
        <div className="video-bg-glow"></div>
        
        {/* Main AI Avatar Screen */}
        <div className={`ai-avatar-container ${isAISpeaking ? 'speaking' : ''}`}>
           <div className="ai-pulse-ring ring-1"></div>
           <div className="ai-pulse-ring ring-2"></div>
           <div className="ai-pulse-ring ring-3"></div>
           
           <div className="ai-core">
              {isAISpeaking ? (
                <div className="audio-visualizer">
                  <div className="bar"></div><div className="bar"></div>
                  <div className="bar"></div><div className="bar"></div>
                  <div className="bar"></div>
                </div>
              ) : (
                <Activity size={56} color="#fff" strokeWidth={1.5} className="idle-icon" />
              )}
           </div>
           
           <div className="ai-status-panel glass-panel">
             <div className="status-indicator">
               <div className={`status-dot ${loading ? 'loading' : isAISpeaking ? 'speaking' : 'listening'}`}></div>
             </div>
             <span className="status-text">
               {loading ? 'ANALYZING NEURAL DATA...' : isAISpeaking ? 'TRANSMITTING RESPONSE...' : 'AWAITING VOCAL INPUT...'}
             </span>
           </div>
        </div>

        {/* Patient PiP Webcam */}
        <div className="patient-pip group">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className={`webcam-video ${!hasVideo ? 'hidden' : ''}`} 
          />
          {!hasVideo && <div className="no-video-placeholder"><VideoOff size={32} color="var(--text-secondary)"/></div>}
          <div className="pip-overlay">
            <span className="pip-label">{username}</span>
            {hasAudio && <div className="mic-active-dot"></div>}
          </div>
        </div>

        {/* Call Controls */}
        <div className="call-controls glass-panel">
          <button className={`control-btn ${!hasAudio ? 'disabled' : ''}`} onClick={toggleAudio} title={hasAudio ? "Mute" : "Unmute"}>
            {hasAudio ? <Mic size={22} /> : <MicOff size={22} />}
          </button>
          <button className={`control-btn ${!hasVideo ? 'disabled' : ''}`} onClick={toggleVideo} title={hasVideo ? "Stop Video" : "Start Video"}>
            {hasVideo ? <Video size={22} /> : <VideoOff size={22} />}
          </button>
          <button className="control-btn end-call" onClick={endCall} title="End Consult">
            <PhoneOff size={22} />
          </button>
        </div>
      </div>

      {/* RIGHT: Chat Transcript */}
      <div className="chat-area glass-card">
        <div className="chat-header">
          <div className="header-info">
            <h3><MessageSquare size={18} className="header-icon"/> Secure Encrypted Link</h3>
            <span className="connection-status">Live</span>
          </div>
        </div>
        
        <div className="chat-history">
          <div className="encryption-notice">
            <span>End-to-End Encrypted Session</span>
            <div className="divider"></div>
          </div>
          
          {history.map((msg, idx) => (
            <div key={idx} className={`chat-bubble-wrapper ${msg.role === 'user' ? 'user' : 'ai'}`}>
              {msg.role === 'ai' && <div className="avatar-icon ai-icon"><Activity size={14}/></div>}
              <div className="chat-bubble">
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="chat-bubble-wrapper ai">
              <div className="avatar-icon ai-icon"><Activity size={14}/></div>
              <div className="chat-bubble typing">
                <span className="dot"></span><span className="dot"></span><span className="dot"></span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {loading && (
          <div className="neural-processing-orb">
            <div className="orb-inner"></div>
            <div className="orb-waves">
              <div className="wave w1"></div>
              <div className="wave w2"></div>
              <div className="wave w3"></div>
            </div>
          </div>
        )}

        <form className="chat-input-area" onSubmit={handleSend}>
          <div className="input-wrapper">
            <input 
              type="text" 
              placeholder="Describe your symptoms here..." 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={loading}
            />
            {message.length > 0 && <span className="input-glow"></span>}
          </div>
          
          <button 
            type="button" 
            className={`mic-btn ${isListening ? 'listening' : ''}`} 
            onClick={startVoiceInput}
            disabled={loading}
            title="Voice Input"
          >
            <Mic size={18} />
          </button>

          <button type="submit" disabled={loading || !message.trim()} className={`send-btn ${message.trim() ? 'active' : ''}`}>
            <Send size={18} />
          </button>
        </form>
      </div>

    </div>
  );
}
