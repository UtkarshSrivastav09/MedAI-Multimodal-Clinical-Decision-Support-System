import React, { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';
import './Preloader.css';

export default function Preloader() {
  const [loadingText, setLoadingText] = useState('Initializing Med-AI Core...');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const texts = [
      'Initializing Med-AI Core...',
      'Loading Neural Pathways...',
      'Connecting to Clinical Database...',
      'Securing Patient Encryption...',
      'System Ready.'
    ];
    
    let textIndex = 0;
    const textInterval = setInterval(() => {
      textIndex++;
      if (textIndex < texts.length) {
        setLoadingText(texts[textIndex]);
      }
    }, 250);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 4;
      });
    }, 40);

    return () => {
      clearInterval(textInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="preloader-container">
      <div className="preloader-mesh-bg"></div>
      
      <div className="preloader-content">
        <div className="hexagon-wrapper">
          <div className="hexagon">
            <Activity className="pulse-icon" size={48} color="var(--accent-cyan)" />
          </div>
          <div className="hex-ring ring-1"></div>
          <div className="hex-ring ring-2"></div>
        </div>

        <h1 className="system-title">MED-AI CLINICAL</h1>
        
        <div className="creator-badge">
          <span>Developed By</span>
          <h2>Utkarsh Srivastav</h2>
        </div>

        <div className="loading-bar-container">
          <div className="loading-bar" style={{ width: `${progress}%` }}>
            <div className="loading-glow"></div>
          </div>
        </div>
        
        <p className="loading-text">{loadingText}</p>
        <div className="loading-percentage">{progress}%</div>
      </div>
    </div>
  );
}
