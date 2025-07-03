"use client";

import React, { useState, useEffect } from "react";
import { X, Zap, Star, ArrowRight, Sparkles } from "@tabler/icons-react";
import { useAuth, useUpgradeCheck } from "@/context/auth-context";
import { motion, AnimatePresence } from "framer-motion";

interface FloatingUpgradePromptProps {
  showOnlyForFree?: boolean;
  autoShow?: boolean;
  delayMs?: number;
  position?: "bottom-right" | "bottom-left" | "bottom-center";
}

export const FloatingUpgradePrompt = ({
  showOnlyForFree = true,
  autoShow = true,
  delayMs = 10000, // Show after 10 seconds
  position = "bottom-right",
}: FloatingUpgradePromptProps) => {
  const { userProfile, updatePlan } = useAuth();
  const { needsUpgrade, urgency } = useUpgradeCheck();

  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [hasAutoShown, setHasAutoShown] = useState(false);

  // Check if we should show the prompt
  const shouldShow = () => {
    if (isDismissed) return false;
    if (showOnlyForFree && userProfile?.plan !== "FREE") return false;
    return true;
  };

  // Auto-show logic
  useEffect(() => {
    if (!autoShow || hasAutoShown || !shouldShow()) return;

    const timer = setTimeout(() => {
      setIsVisible(true);
      setHasAutoShown(true);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [autoShow, delayMs, hasAutoShown, shouldShow]);

  // Show on usage limits
  useEffect(() => {
    if (needsUpgrade && urgency === "high" && shouldShow()) {
      setIsVisible(true);
    }
  }, [needsUpgrade, urgency, shouldShow]);

  const handleUpgrade = async () => {
    try {
      // In a real implementation, this would open the billing flow
      console.log("Initiating upgrade flow...");

      // For demo purposes, simulate the upgrade
      await updatePlan("PRO");
      setIsVisible(false);

      // Show success message
      showSuccessMessage();
    } catch (error) {
      console.error("Upgrade failed:", error);
    }
  };

  const showSuccessMessage = () => {
    // You could implement a toast notification here
    console.log("Upgrade successful!");
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);

    // Store dismissal in localStorage to persist across sessions
    localStorage.setItem("upgrade-prompt-dismissed", Date.now().toString());
  };

  const getPositionClasses = () => {
    switch (position) {
      case "bottom-left":
        return "bottom-6 left-6";
      case "bottom-center":
        return "bottom-6 left-1/2 transform -translate-x-1/2";
      default:
        return "bottom-6 right-6";
    }
  };

  if (!shouldShow()) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 100 }}
          transition={{ type: "spring", duration: 0.6 }}
          className={`fixed z-50 ${getPositionClasses()}`}
        >
          <div
            className={`floating-upgrade-prompt ${isExpanded ? "expanded" : "collapsed"}`}
          >
            {/* Collapsed State */}
            {!isExpanded && (
              <motion.div
                className="prompt-collapsed"
                onClick={() => setIsExpanded(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="collapse-content">
                  <div className="glow-icon">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div className="collapse-text">
                    <div className="collapse-title">Upgrade to PRO</div>
                    <div className="collapse-subtitle">Unlock all features</div>
                  </div>
                </div>
                <div className="pulse-indicator"></div>
              </motion.div>
            )}

            {/* Expanded State */}
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="prompt-expanded"
              >
                <div className="expanded-header">
                  <div className="header-icon">
                    <Sparkles className="w-8 h-8 text-yellow-400" />
                  </div>
                  <button onClick={handleDismiss} className="close-button">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="expanded-content">
                  <h3 className="expanded-title">🚀 Ready to level up?</h3>
                  <p className="expanded-description">
                    Unlock the full power of SaintSal™ with PRO features
                  </p>

                  <div className="feature-highlights">
                    <div className="feature-item">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span>100 conversations/month</span>
                    </div>
                    <div className="feature-item">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span>Premium AI models</span>
                    </div>
                    <div className="feature-item">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span>Chrome extension</span>
                    </div>
                  </div>

                  <div className="pricing-info">
                    <div className="price">
                      <span className="currency">$</span>
                      <span className="amount">29</span>
                      <span className="period">/month</span>
                    </div>
                    <div className="discount-badge">Save 40% annually</div>
                  </div>

                  <div className="action-buttons">
                    <button onClick={handleUpgrade} className="upgrade-button">
                      <span>Upgrade Now</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                    <button
                      onClick={() => setIsExpanded(false)}
                      className="minimize-button"
                    >
                      Maybe Later
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <style jsx>{`
            .floating-upgrade-prompt {
              max-width: 320px;
              background: linear-gradient(
                135deg,
                rgba(0, 0, 0, 0.95) 0%,
                rgba(24, 24, 27, 0.95) 100%
              );
              backdrop-filter: blur(16px);
              border: 1px solid rgba(253, 255, 220, 0.2);
              border-radius: 16px;
              box-shadow:
                0 20px 40px rgba(0, 0, 0, 0.3),
                0 0 0 1px rgba(253, 255, 220, 0.1);
              overflow: hidden;
              font-family:
                Inter,
                -apple-system,
                Roboto,
                Helvetica,
                sans-serif;
            }

            .floating-upgrade-prompt.collapsed {
              cursor: pointer;
            }

            .prompt-collapsed {
              position: relative;
              padding: 16px;
              display: flex;
              align-items: center;
              gap: 12px;
              transition: all 0.3s ease;
            }

            .prompt-collapsed:hover {
              background: rgba(253, 255, 220, 0.05);
            }

            .collapse-content {
              display: flex;
              align-items: center;
              gap: 12px;
              flex: 1;
            }

            .glow-icon {
              width: 40px;
              height: 40px;
              background: linear-gradient(135deg, #fbbf24, #f59e0b);
              border-radius: 10px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #000;
              box-shadow: 0 0 20px rgba(251, 191, 36, 0.4);
            }

            .collapse-text {
              flex: 1;
            }

            .collapse-title {
              font-size: 16px;
              font-weight: 700;
              color: #fdffdc;
              margin-bottom: 2px;
            }

            .collapse-subtitle {
              font-size: 12px;
              color: #a1a1aa;
            }

            .pulse-indicator {
              width: 8px;
              height: 8px;
              background: #22c55e;
              border-radius: 50%;
              animation: pulse 2s infinite;
            }

            @keyframes pulse {
              0% {
                opacity: 1;
                transform: scale(1);
              }
              50% {
                opacity: 0.7;
                transform: scale(1.2);
              }
              100% {
                opacity: 1;
                transform: scale(1);
              }
            }

            .prompt-expanded {
              padding: 20px;
            }

            .expanded-header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 16px;
            }

            .header-icon {
              width: 48px;
              height: 48px;
              background: linear-gradient(
                135deg,
                rgba(251, 191, 36, 0.2),
                rgba(147, 51, 234, 0.2)
              );
              border-radius: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .close-button {
              background: none;
              border: none;
              color: #9ca3af;
              cursor: pointer;
              padding: 4px;
              border-radius: 6px;
              transition: all 0.2s ease;
            }

            .close-button:hover {
              color: #fdffdc;
              background: rgba(255, 255, 255, 0.1);
            }

            .expanded-content {
              text-align: center;
            }

            .expanded-title {
              font-size: 20px;
              font-weight: 700;
              color: #fdffdc;
              margin-bottom: 8px;
            }

            .expanded-description {
              font-size: 14px;
              color: #a1a1aa;
              margin-bottom: 20px;
              line-height: 1.5;
            }

            .feature-highlights {
              display: grid;
              gap: 8px;
              margin-bottom: 20px;
              text-align: left;
            }

            .feature-item {
              display: flex;
              align-items: center;
              gap: 8px;
              font-size: 14px;
              color: #e5e7eb;
            }

            .pricing-info {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 12px;
              margin-bottom: 24px;
            }

            .price {
              display: flex;
              align-items: baseline;
              gap: 2px;
            }

            .currency {
              font-size: 18px;
              font-weight: 600;
              color: #fdffdc;
            }

            .amount {
              font-size: 32px;
              font-weight: 700;
              color: #fdffdc;
            }

            .period {
              font-size: 14px;
              color: #9ca3af;
            }

            .discount-badge {
              background: linear-gradient(45deg, #22c55e, #16a34a);
              color: white;
              font-size: 12px;
              font-weight: 600;
              padding: 4px 8px;
              border-radius: 6px;
            }

            .action-buttons {
              display: grid;
              gap: 12px;
            }

            .upgrade-button {
              background: linear-gradient(135deg, #fbbf24, #f59e0b);
              color: #000;
              border: none;
              padding: 14px 20px;
              border-radius: 10px;
              font-weight: 600;
              font-size: 14px;
              cursor: pointer;
              transition: all 0.3s ease;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
            }

            .upgrade-button:hover {
              transform: translateY(-1px);
              box-shadow: 0 8px 25px rgba(251, 191, 36, 0.4);
            }

            .minimize-button {
              background: none;
              border: 1px solid rgba(255, 255, 255, 0.2);
              color: #9ca3af;
              padding: 12px 20px;
              border-radius: 10px;
              font-weight: 500;
              font-size: 14px;
              cursor: pointer;
              transition: all 0.3s ease;
            }

            .minimize-button:hover {
              border-color: rgba(255, 255, 255, 0.3);
              color: #fdffdc;
            }

            /* Mobile responsiveness */
            @media (max-width: 640px) {
              .floating-upgrade-prompt {
                max-width: calc(100vw - 32px);
                margin: 0 16px;
              }
            }

            /* Glow effect */
            .floating-upgrade-prompt::before {
              content: "";
              position: absolute;
              top: -2px;
              left: -2px;
              right: -2px;
              bottom: -2px;
              background: linear-gradient(
                45deg,
                transparent,
                rgba(251, 191, 36, 0.1),
                transparent,
                rgba(147, 51, 234, 0.1),
                transparent
              );
              border-radius: 18px;
              z-index: -1;
              animation: rotate 4s linear infinite;
              opacity: 0.7;
            }

            @keyframes rotate {
              0% {
                transform: rotate(0deg);
              }
              100% {
                transform: rotate(360deg);
              }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Hook for controlling the floating prompt
export function useFloatingUpgrade() {
  const [isPromptVisible, setIsPromptVisible] = useState(false);
  const { userProfile } = useAuth();

  const showPrompt = () => {
    setIsPromptVisible(true);
  };

  const hidePrompt = () => {
    setIsPromptVisible(false);
  };

  const shouldAutoShow = () => {
    return userProfile?.plan === "FREE";
  };

  return {
    isPromptVisible,
    showPrompt,
    hidePrompt,
    shouldAutoShow,
  };
}
