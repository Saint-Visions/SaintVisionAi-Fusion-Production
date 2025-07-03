"use client";

import React, { useState } from "react";
import {
  MessageCircle,
  Bot,
  Lock,
  Star,
  Zap,
  ArrowRight,
  Heart,
  Sparkles,
  Crown,
} from "@tabler/icons-react";
import { useAuth } from "@/context/auth-context";
import { motion } from "framer-motion";
import { streamFromAPI } from "@/lib/utils/streaming-utils";
import { BotActivationTransform } from "./bot-activation-transform";
import {
  SaintSalAvatar,
  SaintSalBossAvatar,
} from "../branding/saintsol-headshot";
import { useBossMode, detectBossMode } from "../../lib/utils/boss-mode";

interface CompanionCardProps {
  className?: string;
}

export const CompanionCard = ({ className = "" }: CompanionCardProps) => {
  const { userProfile, updatePlan } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [botActivated, setBotActivated] = useState(false);
  const [activationLevel, setActivationLevel] = useState<
    "idle" | "thinking" | "responding" | "active"
  >("idle");
  const [errorCount, setErrorCount] = useState(0);
  const [hasMultipleErrors, setHasMultipleErrors] = useState(false);
  const { isBoss, activateBoss } = useBossMode();

  const remainingChats = userProfile
    ? Math.max(0, 10 - (userProfile.monthly_chat_count || 0))
    : 10;

  // Real streaming demo for free tier using backend API
  const streamDemoResponse = async () => {
    setIsStreaming(true);
    setStreamingText("");
    setBotActivated(true);
    setActivationLevel("thinking");

    try {
      await streamFromAPI("/api/ai/stream/companion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: "Tell me about your capabilities",
          user_plan: userProfile?.plan || "FREE",
          remaining_chats: remainingChats,
        }),
        streamingOptions: {
          onToken: (content, isComplete) => {
            if (content.length > 0) {
              setActivationLevel("responding");
            }
            setStreamingText(content);
            if (isComplete) {
              setActivationLevel("active");
              // Keep the response visible for 4 seconds then clear
              setTimeout(() => {
                setIsStreaming(false);
                setStreamingText("");
                setActivationLevel("idle");
                setBotActivated(false);
              }, 4000);
            }
          },
          onError: (error) => {
            console.error("Companion streaming error:", error);
            setErrorCount((prev) => {
              const newCount = prev + 1;
              if (newCount >= 3) {
                setHasMultipleErrors(true);
              }
              return newCount;
            });
            // Fallback to basic message
            setActivationLevel("responding");
            setStreamingText(
              "I'm your AI companion, ready to help with basic questions and tasks!",
            );
            setTimeout(() => {
              setIsStreaming(false);
              setStreamingText("");
              setActivationLevel("idle");
              setBotActivated(false);
            }, 3000);
          },
        },
      });
    } catch (error) {
      console.error("Failed to stream companion response:", error);
      // Fallback response
      setActivationLevel("responding");
      setStreamingText(
        "I'm your AI companion, ready to help with basic questions and tasks!",
      );
      setTimeout(() => {
        setIsStreaming(false);
        setStreamingText("");
        setActivationLevel("idle");
        setBotActivated(false);
      }, 3000);
    }
  };

  const handleUpgrade = async () => {
    try {
      await updatePlan("PRO");
      setShowUpgrade(false);
    } catch (error) {
      console.error("Upgrade failed:", error);
    }
  };

  const handleStartChat = () => {
    if (remainingChats > 0) {
      streamDemoResponse();
    } else {
      setShowUpgrade(true);
    }
  };

  return (
    <div className={`companion-card ${className}`}>
      <motion.div
        className="card-content"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ y: -2 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Header */}
        <div className="card-header">
          <div className="companion-avatar">
            <div className="flex gap-2 items-center">
              {isBoss ? (
                <SaintSalBossAvatar
                  size="md"
                  status={
                    hasMultipleErrors
                      ? "offline"
                      : isStreaming
                        ? "busy"
                        : "online"
                  }
                  animated={true}
                />
              ) : (
                <SaintSalAvatar
                  size="md"
                  status={
                    hasMultipleErrors
                      ? "offline"
                      : isStreaming
                        ? "busy"
                        : "online"
                  }
                  animated={true}
                />
              )}
              <BotActivationTransform
                isActivated={botActivated}
                activationLevel={activationLevel}
              />
            </div>
          </div>
          <div className="companion-info">
            <h3 className="companion-name">
              {hasMultipleErrors
                ? "AI Companion - Service Issues"
                : "AI Companion"}
              {hasMultipleErrors ? (
                <span className="text-red-500 ml-2 text-xs">
                  ({errorCount} errors)
                </span>
              ) : (
                <Heart className="w-4 h-4 text-red-400 ml-2" />
              )}
            </h3>
            <p className="companion-status">
              {hasMultipleErrors
                ? "Connection unstable • Free Plan"
                : "Ready to help • Free Plan"}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="usage-stats">
          <div className="stat-item">
            <div className="stat-icon">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div className="stat-content">
              <div className="stat-number">{remainingChats}</div>
              <div className="stat-label">Chats Left</div>
            </div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-icon">
              <Zap className="w-4 h-4" />
            </div>
            <div className="stat-content">
              <div className="stat-number">Basic</div>
              <div className="stat-label">AI Model</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="usage-progress">
          <div className="progress-header">
            <span className="progress-label">Monthly Usage</span>
            <span className="progress-count">
              {userProfile?.monthly_chat_count || 0} / 10
            </span>
          </div>
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min(((userProfile?.monthly_chat_count || 0) / 10) * 100, 100)}%`,
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Features */}
        <div className="companion-features">
          <div className="feature-item available">
            <div className="feature-icon">✅</div>
            <span>Basic conversations</span>
          </div>
          <div className="feature-item available">
            <div className="feature-icon">✅</div>
            <span>Quick responses</span>
          </div>
          <div className="feature-item locked">
            <div className="feature-icon">
              <Lock className="w-3 h-3" />
            </div>
            <span>Advanced AI models</span>
          </div>
          <div className="feature-item locked">
            <div className="feature-icon">
              <Lock className="w-3 h-3" />
            </div>
            <span>Unlimited conversations</span>
          </div>
        </div>

        {/* Streaming Demo Display */}
        {(isStreaming || streamingText) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="streaming-demo"
          >
            <div className="flex gap-2 items-center justify-between mb-3">
              <div className="flex gap-2 items-center">
                <Bot className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 text-sm font-semibold">
                  {isStreaming
                    ? "Request is in progress..."
                    : "AI Companion Demo"}
                </span>
              </div>
              {isStreaming && (
                <div className="flex gap-1">
                  <div
                    className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0s" }}
                  ></div>
                  <div
                    className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              )}
            </div>
            <div className="demo-response">
              <p className="streaming-text">{streamingText}</p>
              {isStreaming && <span className="cursor-blink">|</span>}
            </div>
            {isStreaming && (
              <div className="flex gap-2 items-center justify-center mt-3">
                <button
                  onClick={() => {
                    setIsStreaming(false);
                    setStreamingText("");
                    setActivationLevel("idle");
                    setBotActivated(false);
                  }}
                  className="px-2 py-1 bg-red-100 hover:bg-red-200 border border-red-300 rounded text-red-600 text-xs font-medium transition-colors"
                >
                  Stop
                </button>
                <button
                  onClick={() => setShowUpgrade(true)}
                  className="px-2 py-1 bg-blue-100 hover:bg-blue-200 border border-blue-300 rounded text-blue-600 text-xs font-medium transition-colors"
                >
                  Upgrade
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="card-actions">
          {remainingChats > 0 ? (
            <button onClick={handleStartChat} className="primary-action">
              <MessageCircle className="w-4 h-4" />
              <span>Start Chatting</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setShowUpgrade(true)}
              className="upgrade-action"
            >
              <Crown className="w-4 h-4" />
              <span>Upgrade to Continue</span>
            </button>
          )}

          <button
            onClick={() => setShowUpgrade(true)}
            className="secondary-action"
          >
            <Star className="w-4 h-4" />
            <span>See PRO Features</span>
          </button>
        </div>

        {/* Upgrade Prompt Overlay */}
        {showUpgrade && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="upgrade-overlay"
            onClick={() => setShowUpgrade(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="upgrade-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="upgrade-header">
                <div className="upgrade-icon">
                  <Sparkles className="w-8 h-8 text-yellow-400" />
                </div>
                <h4 className="upgrade-title">Unlock Full AI Power</h4>
                <p className="upgrade-description">
                  Get unlimited conversations with advanced AI models
                </p>
              </div>

              <div className="upgrade-benefits">
                <div className="benefit-item">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>100 conversations/month</span>
                </div>
                <div className="benefit-item">
                  <Bot className="w-4 h-4 text-blue-400" />
                  <span>Premium AI models (GPT-4, Claude)</span>
                </div>
                <div className="benefit-item">
                  <Zap className="w-4 h-4 text-purple-400" />
                  <span>Faster response times</span>
                </div>
                <div className="benefit-item">
                  <Crown className="w-4 h-4 text-orange-400" />
                  <span>Priority support</span>
                </div>
              </div>

              <div className="upgrade-pricing">
                <div className="price-display">
                  <span className="currency">$</span>
                  <span className="amount">29</span>
                  <span className="period">/month</span>
                </div>
                <div className="save-badge">Save 40% annually</div>
              </div>

              <div className="upgrade-actions">
                <button onClick={handleUpgrade} className="upgrade-btn">
                  <Crown className="w-4 h-4" />
                  <span>Upgrade to PRO</span>
                </button>
                <button
                  onClick={() => setShowUpgrade(false)}
                  className="cancel-btn"
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>

      <style jsx>{`
        .companion-card {
          position: relative;
          width: 100%;
          max-width: 400px;
          touch-action: manipulation;
          font-family:
            Inter,
            -apple-system,
            Roboto,
            Helvetica,
            sans-serif;
        }

        .card-content {
          background: linear-gradient(
            135deg,
            rgba(59, 130, 246, 0.1) 0%,
            rgba(147, 51, 234, 0.05) 50%,
            rgba(16, 185, 129, 0.1) 100%
          );
          border: 1px solid rgba(253, 255, 220, 0.2);
          border-radius: 20px;
          padding: 24px;
          backdrop-filter: blur(16px);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .card-content:hover {
          border-color: rgba(253, 255, 220, 0.4);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }

        .card-content::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6, #10b981);
          opacity: 0.6;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }

        .companion-avatar {
          position: relative;
          width: 60px;
          height: 60px;
        }

        .avatar-inner {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .avatar-glow {
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(
            45deg,
            #3b82f6,
            #8b5cf6,
            #10b981,
            #3b82f6
          );
          border-radius: 18px;
          z-index: -1;
          animation: rotate 3s linear infinite;
          opacity: 0.5;
        }

        @keyframes rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .status-indicator {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 20px;
          height: 20px;
          background: #1f2937;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .status-dot {
          width: 12px;
          height: 12px;
          background: #10b981;
          border-radius: 50%;
          animation: pulse 2s infinite;
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

        .companion-info {
          flex: 1;
        }

        .companion-name {
          display: flex;
          align-items: center;
          color: #fdffdc;
          font-size: 18px;
          font-weight: 700;
          margin: 0 0 4px 0;
        }

        .companion-status {
          color: #9ca3af;
          font-size: 14px;
          margin: 0;
        }

        .usage-stats {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
        }

        .stat-icon {
          color: #3b82f6;
        }

        .stat-content {
          display: flex;
          flex-direction: column;
        }

        .stat-number {
          color: #fdffdc;
          font-weight: 700;
          font-size: 16px;
          line-height: 1;
        }

        .stat-label {
          color: #9ca3af;
          font-size: 12px;
        }

        .stat-divider {
          width: 1px;
          height: 32px;
          background: rgba(253, 255, 220, 0.1);
        }

        .usage-progress {
          margin-bottom: 20px;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .progress-label {
          color: #e5e7eb;
          font-size: 14px;
          font-weight: 500;
        }

        .progress-count {
          color: #9ca3af;
          font-size: 12px;
        }

        .progress-bar {
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #10b981);
          border-radius: 3px;
        }

        .companion-features {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 24px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          padding: 4px 0;
        }

        .feature-item.available {
          color: #e5e7eb;
        }

        .feature-item.locked {
          color: #6b7280;
          opacity: 0.7;
        }

        .feature-icon {
          width: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .streaming-demo {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 20px;
          overflow: hidden;
        }

        .demo-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .demo-label {
          color: #3b82f6;
          font-size: 14px;
          font-weight: 600;
        }

        .typing-indicator {
          display: flex;
          gap: 3px;
          margin-left: auto;
        }

        .typing-dot {
          width: 4px;
          height: 4px;
          background: #3b82f6;
          border-radius: 50%;
          animation: typing 1.4s infinite ease-in-out;
        }

        .typing-dot:nth-child(1) {
          animation-delay: 0s;
        }
        .typing-dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        .typing-dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%,
          80%,
          100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .demo-response {
          color: #e5e7eb;
          font-size: 14px;
          line-height: 1.5;
          min-height: 20px;
          display: flex;
          align-items: flex-start;
        }

        .streaming-text {
          margin: 0;
          flex: 1;
        }

        .cursor-blink {
          color: #3b82f6;
          font-weight: bold;
          animation: blink 1s infinite;
          margin-left: 2px;
        }

        @keyframes blink {
          0%,
          50% {
            opacity: 1;
          }
          51%,
          100% {
            opacity: 0;
          }
        }

        .card-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .primary-action,
        .upgrade-action {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 16px;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .upgrade-action {
          background: linear-gradient(135deg, #f59e0b, #d97706);
        }

        .primary-action:hover,
        .upgrade-action:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .upgrade-action:hover {
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        }

        .secondary-action {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 16px;
          background: transparent;
          color: #9ca3af;
          border: 1px solid rgba(156, 163, 175, 0.3);
          border-radius: 10px;
          font-weight: 500;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .secondary-action:hover {
          border-color: #fdffdc;
          color: #fdffdc;
          background: rgba(253, 255, 220, 0.05);
        }

        .upgrade-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .upgrade-modal {
          background: linear-gradient(135deg, #1f2937, #374151);
          border: 1px solid rgba(253, 255, 220, 0.2);
          border-radius: 20px;
          padding: 32px;
          max-width: 400px;
          width: 100%;
          text-align: center;
        }

        .upgrade-header {
          margin-bottom: 24px;
        }

        .upgrade-icon {
          margin: 0 auto 16px;
          width: 64px;
          height: 64px;
          background: rgba(251, 191, 36, 0.1);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .upgrade-title {
          color: #fdffdc;
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 8px 0;
        }

        .upgrade-description {
          color: #9ca3af;
          font-size: 16px;
          margin: 0;
          line-height: 1.5;
        }

        .upgrade-benefits {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
          text-align: left;
        }

        .benefit-item {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #e5e7eb;
          font-size: 14px;
        }

        .upgrade-pricing {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .price-display {
          display: flex;
          align-items: baseline;
          gap: 2px;
        }

        .currency {
          color: #fdffdc;
          font-size: 18px;
          font-weight: 600;
        }

        .amount {
          color: #fdffdc;
          font-size: 36px;
          font-weight: 700;
        }

        .period {
          color: #9ca3af;
          font-size: 16px;
        }

        .save-badge {
          background: linear-gradient(45deg, #10b981, #059669);
          color: white;
          font-size: 12px;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 6px;
        }

        .upgrade-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .upgrade-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 16px 24px;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: #000;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .upgrade-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
        }

        .cancel-btn {
          padding: 12px 24px;
          background: transparent;
          color: #9ca3af;
          border: 1px solid rgba(156, 163, 175, 0.3);
          border-radius: 10px;
          font-weight: 500;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .cancel-btn:hover {
          border-color: #fdffdc;
          color: #fdffdc;
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .companion-card {
            max-width: 100%;
            margin: 0;
          }

          .card-content {
            padding: 20px 16px;
            border-radius: 16px;
          }

          .card-header {
            gap: 12px;
            margin-bottom: 16px;
          }

          .companion-avatar {
            width: 50px;
            height: 50px;
          }

          .companion-name {
            font-size: 16px;
          }

          .companion-status {
            font-size: 13px;
          }

          .usage-stats {
            padding: 12px;
            gap: 12px;
          }

          .stat-number {
            font-size: 14px;
          }

          .stat-label {
            font-size: 11px;
          }

          .primary-action,
          .upgrade-action,
          .secondary-action {
            padding: 14px 16px;
            font-size: 15px;
            min-height: 48px;
            touch-action: manipulation;
          }

          .upgrade-modal {
            margin: 20px 16px;
            max-width: none;
            padding: 24px 20px;
          }

          .streaming-demo {
            padding: 12px;
            margin-bottom: 16px;
          }
        }

        @media (max-width: 480px) {
          .card-content {
            padding: 16px 12px;
          }

          .companion-info h3 {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }

          .usage-stats {
            flex-direction: column;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default CompanionCard;
