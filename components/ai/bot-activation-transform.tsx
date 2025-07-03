"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Zap,
  Sparkles,
  Brain,
  Eye,
  Cpu,
  Activity,
  Radio,
} from "@tabler/icons-react";

interface BotActivationTransformProps {
  isActivated: boolean;
  activationLevel?: "idle" | "thinking" | "responding" | "active";
  children?: React.ReactNode;
  className?: string;
}

export const BotActivationTransform: React.FC<BotActivationTransformProps> = ({
  isActivated,
  activationLevel = "idle",
  children,
  className = "",
}) => {
  const [pulseIntensity, setPulseIntensity] = useState(0);
  const [particleCount, setParticleCount] = useState(0);

  // Generate particle effects based on activation level
  useEffect(() => {
    const intensities = {
      idle: 0,
      thinking: 3,
      responding: 6,
      active: 10,
    };

    setPulseIntensity(intensities[activationLevel]);
    setParticleCount(isActivated ? intensities[activationLevel] * 2 : 0);
  }, [isActivated, activationLevel]);

  // Create floating particles
  const particles = Array.from({ length: particleCount }, (_, i) => (
    <motion.div
      key={i}
      className="floating-particle"
      initial={{
        opacity: 0,
        scale: 0,
        x: Math.random() * 200 - 100,
        y: Math.random() * 200 - 100,
      }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1, 0],
        x: [
          Math.random() * 200 - 100,
          Math.random() * 400 - 200,
          Math.random() * 200 - 100,
        ],
        y: [
          Math.random() * 200 - 100,
          Math.random() * 400 - 200,
          Math.random() * 200 - 100,
        ],
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        repeat: Infinity,
        delay: Math.random() * 2,
      }}
      style={{
        background: `hsl(${200 + Math.random() * 160}, 70%, 60%)`,
      }}
    />
  ));

  const getActivationIcon = () => {
    switch (activationLevel) {
      case "thinking":
        return <Brain className="activation-icon" />;
      case "responding":
        return <Activity className="activation-icon" />;
      case "active":
        return <Radio className="activation-icon" />;
      default:
        return <Bot className="activation-icon" />;
    }
  };

  const getGlowColor = () => {
    switch (activationLevel) {
      case "thinking":
        return "#f59e0b"; // Amber
      case "responding":
        return "#10b981"; // Green
      case "active":
        return "#3b82f6"; // Blue
      default:
        return "#6b7280"; // Gray
    }
  };

  return (
    <div className={`bot-activation-transform ${className}`}>
      <div className="transform-container">
        {/* Background Energy Field */}
        <motion.div
          className="energy-field"
          animate={{
            opacity: isActivated ? 0.6 : 0,
            scale: isActivated ? [1, 1.2, 1] : 1,
          }}
          transition={{
            opacity: { duration: 0.5 },
            scale: { duration: 2, repeat: Infinity },
          }}
          style={{
            background: `radial-gradient(circle, ${getGlowColor()}20 0%, transparent 70%)`,
          }}
        />

        {/* Orbital Rings */}
        <AnimatePresence>
          {isActivated && (
            <>
              <motion.div
                className="orbital-ring ring-1"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{
                  opacity: 0.4,
                  scale: 1,
                  rotate: 360,
                }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{
                  opacity: { duration: 0.5 },
                  scale: { duration: 0.5 },
                  rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                }}
                style={{ borderColor: getGlowColor() }}
              />

              <motion.div
                className="orbital-ring ring-2"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{
                  opacity: 0.3,
                  scale: 1.5,
                  rotate: -360,
                }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{
                  opacity: { duration: 0.5 },
                  scale: { duration: 0.5 },
                  rotate: { duration: 12, repeat: Infinity, ease: "linear" },
                }}
                style={{ borderColor: getGlowColor() }}
              />

              <motion.div
                className="orbital-ring ring-3"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{
                  opacity: 0.2,
                  scale: 2,
                  rotate: 360,
                }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{
                  opacity: { duration: 0.5 },
                  scale: { duration: 0.5 },
                  rotate: { duration: 16, repeat: Infinity, ease: "linear" },
                }}
                style={{ borderColor: getGlowColor() }}
              />
            </>
          )}
        </AnimatePresence>

        {/* Central Bot Avatar */}
        <motion.div
          className="bot-avatar"
          animate={{
            scale: isActivated ? [1, 1.1, 1] : 1,
            boxShadow: isActivated
              ? `0 0 ${20 + pulseIntensity * 5}px ${getGlowColor()}60`
              : "0 0 0px transparent",
          }}
          transition={{
            scale: { duration: 1.5, repeat: Infinity },
            boxShadow: { duration: 0.5 },
          }}
          style={{
            background: isActivated
              ? `linear-gradient(135deg, ${getGlowColor()}20, ${getGlowColor()}10)`
              : "#f9fafb",
          }}
        >
          <motion.div
            animate={{
              rotate: isActivated ? 360 : 0,
              color: getGlowColor(),
            }}
            transition={{
              rotate: { duration: 4, repeat: Infinity, ease: "linear" },
              color: { duration: 0.5 },
            }}
          >
            {getActivationIcon()}
          </motion.div>

          {/* Pulse Effect */}
          <AnimatePresence>
            {isActivated && (
              <motion.div
                className="pulse-effect"
                initial={{ scale: 0, opacity: 0.8 }}
                animate={{
                  scale: 3,
                  opacity: 0,
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
                style={{
                  background: getGlowColor(),
                }}
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Status Indicators */}
        <motion.div
          className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col gap-2 items-center"
          animate={{
            opacity: isActivated ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex gap-2 items-center bg-white px-2 py-1 rounded-xl border border-gray-200 shadow-sm">
            <div
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: getGlowColor() }}
            />
            <div className="text-xs font-semibold text-gray-700 tracking-wide uppercase">
              {activationLevel === "thinking" && "Request is in progress..."}
              {activationLevel === "responding" && "Generating response..."}
              {activationLevel === "active" && "Response complete"}
              {activationLevel === "idle" && "Ready"}
            </div>
          </div>
          {activationLevel !== "idle" && (
            <div className="flex gap-1">
              <button className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded text-gray-600 text-xs font-medium transition-colors">
                Pause
              </button>
              <button className="px-2 py-0.5 bg-blue-100 hover:bg-blue-200 border border-blue-300 rounded text-blue-600 text-xs font-medium transition-colors">
                Details
              </button>
            </div>
          )}
        </motion.div>

        {/* Neural Network Lines */}
        <AnimatePresence>
          {isActivated && activationLevel !== "idle" && (
            <motion.div
              className="neural-network"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="neural-line"
                  style={{
                    background: `linear-gradient(${i * 60}deg, ${getGlowColor()}, transparent)`,
                    transform: `rotate(${i * 60}deg)`,
                  }}
                  animate={{
                    opacity: [0.2, 0.6, 0.2],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Particles */}
        <div className="particles-container">{particles}</div>

        {/* Content Overlay */}
        <div className="content-overlay">{children}</div>
      </div>

      <style jsx>{`
        .bot-activation-transform {
          position: relative;
          display: inline-block;
        }

        .transform-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 120px;
          height: 120px;
          touch-action: manipulation;
        }

        @media (max-width: 768px) {
          .transform-container {
            width: 80px;
            height: 80px;
          }

          .bot-avatar {
            width: 40px;
            height: 40px;
          }

          .activation-icon {
            width: 16px;
            height: 16px;
          }

          .ring-1 {
            width: 70px;
            height: 70px;
          }

          .ring-2 {
            width: 100px;
            height: 100px;
          }

          .ring-3 {
            width: 130px;
            height: 130px;
          }

          .neural-line {
            width: 60px;
          }

          .floating-particle {
            width: 3px;
            height: 3px;
          }
        }

        .energy-field {
          position: absolute;
          inset: -20px;
          border-radius: 50%;
          pointer-events: none;
        }

        .orbital-ring {
          position: absolute;
          border: 2px solid;
          border-radius: 50%;
          opacity: 0.4;
          pointer-events: none;
        }

        .ring-1 {
          width: 100px;
          height: 100px;
          border-style: dashed;
        }

        .ring-2 {
          width: 140px;
          height: 140px;
          border-style: dotted;
        }

        .ring-3 {
          width: 180px;
          height: 180px;
          border-style: solid;
          border-width: 1px;
        }

        .bot-avatar {
          position: relative;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #e5e7eb;
          background: #f9fafb;
          overflow: hidden;
          z-index: 10;
        }

        .activation-icon {
          width: 24px;
          height: 24px;
          z-index: 2;
        }

        .pulse-effect {
          position: absolute;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          pointer-events: none;
        }

        .neural-network {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .neural-line {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 80px;
          height: 1px;
          transform-origin: 0 0;
        }

        .particles-container {
          position: absolute;
          inset: -100px;
          pointer-events: none;
          overflow: visible;
        }

        .floating-particle {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          top: 50%;
          left: 50%;
        }

        .content-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 5;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
};
