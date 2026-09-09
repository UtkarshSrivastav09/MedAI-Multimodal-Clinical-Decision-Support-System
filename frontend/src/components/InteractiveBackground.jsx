import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const InteractiveBackground = ({ colorTheme = "cyan" }) => {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Motion values to track absolute cursor positions
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for premium, fluid lag-effect tracing
  const springConfig = { damping: 28, stiffness: 100 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return; // Skip mouse listener setup on mobile
    const container = containerRef.current;
    if (!container) return;

    const parent = container.parentNode;
    if (!parent) return;

    const handleMouseMove = (event) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      mouseX.set(x);
      mouseY.set(y);
      setIsHovered(true);
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => {
      setIsHovered(false);
      // Smoothly return spotlight to the center of the card
      const rect = container.getBoundingClientRect();
      mouseX.set(rect.width / 2);
      mouseY.set(rect.height / 2);
    };

    // Track cursor coordinates across the entire card container
    parent.addEventListener("mousemove", handleMouseMove);
    parent.addEventListener("mouseenter", handleMouseEnter);
    parent.addEventListener("mouseleave", handleMouseLeave);

    // Initial spotlight centered in the card
    const rect = container.getBoundingClientRect();
    mouseX.set(rect.width / 2);
    mouseY.set(rect.height / 2);

    return () => {
      parent.removeEventListener("mousemove", handleMouseMove);
      parent.removeEventListener("mouseenter", handleMouseEnter);
      parent.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mouseX, mouseY, isMobile]);

  const isPurple = colorTheme === "purple";
  
  // Custom glowing radial gradients matching the themes
  const glowColor = isPurple
    ? "radial-gradient(circle, rgba(179, 136, 255, 0.32) 0%, rgba(138, 43, 226, 0.08) 55%, rgba(0,0,0,0) 80%)"
    : "radial-gradient(circle, rgba(0, 229, 255, 0.28) 0%, rgba(0, 168, 204, 0.05) 55%, rgba(0,0,0,0) 80%)";

  return (
    <div
      ref={containerRef}
      className="mountain-bg-container"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(7, 10, 18, 0.8)",
        overflow: "hidden",
        zIndex: 0,
      }}
    >
      {/* 1. Cyber Interface Digital Mesh Layer */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `
            radial-gradient(rgba(255, 255, 255, 0.02) 1.5px, transparent 1.5px),
            linear-gradient(rgba(255, 255, 255, 0.006) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.006) 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px, 48px 48px, 48px 48px",
          backgroundPosition: "center center",
          opacity: 0.85,
          zIndex: 3,
          pointerEvents: "none",
        }}
      />

      {/* 2. Slow Floating Ambient Background Orb - Omitted on Mobile */}
      {!isMobile && (
        <motion.div
          animate={{
            x: [0, 50, -40, 0],
            y: [0, -60, 50, 0],
            scale: [1, 1.12, 0.9, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            top: "15%",
            left: "20%",
            width: "360px",
            height: "360px",
            borderRadius: "50%",
            background: glowColor,
            filter: "blur(60px)",
            zIndex: 1,
            pointerEvents: "none",
            opacity: 0.6,
          }}
        />
      )}

      {/* 3. Interactive Spring-Follow Spotlight Orb - Static layout on mobile to prevent paint lag */}
      {!isMobile ? (
        <motion.div
          style={{
            position: "absolute",
            left: smoothX,
            top: smoothY,
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: glowColor,
            transform: "translate(-50%, -50%)",
            filter: "blur(45px)",
            zIndex: 2,
            pointerEvents: "none",
            opacity: isHovered ? 1 : 0.45,
            transition: "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      ) : (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: "100%",
            height: "100%",
            background: isPurple
              ? "radial-gradient(circle at center, rgba(179, 136, 255, 0.16) 0%, transparent 70%)"
              : "radial-gradient(circle at center, rgba(0, 229, 255, 0.14) 0%, transparent 70%)",
            transform: "translate(-50%, -50%)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
      )}

      {/* 4. Scanning Clinical Beam animation - Omitted on Mobile */}
      {!isMobile && (
        <motion.div
          animate={{
            top: ["-20%", "120%"],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            position: "absolute",
            left: 0,
            width: "100%",
            height: "8px",
            background: `linear-gradient(90deg, transparent, ${isPurple ? "rgba(179,136,255,0.06)" : "rgba(0,229,255,0.06)"}, transparent)`,
            boxShadow: `0 0 10px ${isPurple ? "rgba(179,136,255,0.03)" : "rgba(0,229,255,0.03)"}`,
            zIndex: 3,
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
};

export default InteractiveBackground;
