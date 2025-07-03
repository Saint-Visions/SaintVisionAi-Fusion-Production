"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { UserPlan, getUserPlanFeatures } from "@/types/user-plans";
import {
  AIChatSection,
  SmartLeadsSection,
  ChromeExtensionSection,
  PricingHighlightsSection,
} from "../dashboard/plan-sections";
import { DualAIAssistant } from "../ai/dual-ai-assistant";
import { CompanionCard } from "../ai/companion-card";

interface PlanAwareWrapperProps {
  children?: React.ReactNode;
  fallbackPlan?: UserPlan;
  showUpgradePrompts?: boolean;
  className?: string;
}

export const PlanAwareWrapper = ({
  children,
  fallbackPlan = "FREE",
  showUpgradePrompts = true,
  className = "",
}: PlanAwareWrapperProps) => {
  const { userProfile, isAuthenticated, isLoading } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<UserPlan>(fallbackPlan);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Real-time plan detection
  useEffect(() => {
    if (userProfile?.plan && userProfile.plan !== currentPlan) {
      setIsTransitioning(true);

      // Smooth transition when plan changes
      const timer = setTimeout(() => {
        setCurrentPlan(userProfile.plan);
        setIsTransitioning(false);
      }, 300);

      return () => clearTimeout(timer);
    } else if (!userProfile && isAuthenticated) {
      setCurrentPlan(fallbackPlan);
    }
  }, [userProfile, currentPlan, isAuthenticated, fallbackPlan]);

  // Loading state
  if (isLoading) {
    return (
      <div className={`plan-aware-wrapper loading ${className}`}>
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p>Loading your personalized experience...</p>
        </div>
        <style jsx>{`
          .plan-aware-wrapper.loading {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 400px;
            padding: 40px;
          }

          .loading-content {
            text-align: center;
            color: #a1a1aa;
          }

          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(253, 255, 220, 0.1);
            border-top: 3px solid #fdffdc;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 16px;
          }

          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  const planFeatures = getUserPlanFeatures(currentPlan);

  return (
    <div
      className={`plan-aware-wrapper plan-${currentPlan.toLowerCase()} ${className}`}
    >
      {/* Plan Status Banner */}
      <div className="plan-status-banner">
        <div className="plan-info">
          <div className="plan-badge">
            <span className="plan-icon">{getPlanIcon(currentPlan)}</span>
            <span className="plan-name">{currentPlan}</span>
          </div>
          <div className="plan-description">
            {getPlanDescription(currentPlan)}
          </div>
        </div>
        {currentPlan !== "ENTERPRISE" && showUpgradePrompts && (
          <div className="quick-upgrade">
            <button className="upgrade-quick-btn">
              {currentPlan === "FREE" ? "Upgrade to PRO" : "Go Enterprise"}
            </button>
          </div>
        )}
      </div>

      {/* AI Assistant Section - Conditional based on plan tier */}
      <div className="ai-assistant-section">
        {currentPlan === "FREE" ? (
          <CompanionCard className="ai-component" />
        ) : (
          <DualAIAssistant />
        )}
      </div>

      {/* Plan-Based Content Sections */}
      <div
        className={`content-sections ${isTransitioning ? "transitioning" : ""}`}
      >
        <div className="sections-grid">
          <AIChatSection plan={currentPlan} className="section-card" />
          <SmartLeadsSection plan={currentPlan} className="section-card" />
          <ChromeExtensionSection plan={currentPlan} className="section-card" />
          <PricingHighlightsSection
            plan={currentPlan}
            className="section-card"
          />
        </div>
      </div>

      {/* Plan-Specific Features Showcase */}
      <div className="plan-features-showcase">
        <h3 className="features-title">Your {currentPlan} Plan Features</h3>
        <div className="features-list">
          <div className="feature-item">
            <span className="feature-label">Monthly Chats:</span>
            <span className="feature-value">
              {planFeatures.maxChats === -1
                ? "Unlimited"
                : planFeatures.maxChats}
            </span>
          </div>
          <div className="feature-item">
            <span className="feature-label">Token Limit:</span>
            <span className="feature-value">
              {planFeatures.monthlyTokenLimit === -1
                ? "Unlimited"
                : planFeatures.monthlyTokenLimit.toLocaleString()}
            </span>
          </div>
          <div className="feature-item">
            <span className="feature-label">Storage:</span>
            <span className="feature-value">
              {planFeatures.storageLimit === -1
                ? "Unlimited"
                : `${planFeatures.storageLimit}GB`}
            </span>
          </div>
          <div className="feature-item">
            <span className="feature-label">Advanced Features:</span>
            <span className="feature-value">
              {planFeatures.hasAdvancedFeatures ? "✅ Enabled" : "❌ Disabled"}
            </span>
          </div>
          <div className="feature-item">
            <span className="feature-label">API Access:</span>
            <span className="feature-value">
              {planFeatures.hasAPIAccess ? "✅ Enabled" : "❌ Disabled"}
            </span>
          </div>
          <div className="feature-item">
            <span className="feature-label">Priority Support:</span>
            <span className="feature-value">
              {planFeatures.hasPrioritySupport ? "✅ Enabled" : "❌ Disabled"}
            </span>
          </div>
        </div>
      </div>

      {/* Custom children */}
      {children}

      <style jsx>{`
        .plan-aware-wrapper {
          width: 100%;
          font-family:
            Inter,
            -apple-system,
            Roboto,
            Helvetica,
            sans-serif;
        }

        .plan-status-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          margin-bottom: 24px;
          background: linear-gradient(
            135deg,
            rgba(0, 0, 0, 0.6),
            rgba(24, 24, 27, 0.8)
          );
          border: 1px solid rgba(253, 255, 220, 0.2);
          border-radius: 12px;
          backdrop-filter: blur(8px);
        }

        .plan-info {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .plan-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(253, 255, 220, 0.1);
          border: 1px solid rgba(253, 255, 220, 0.3);
          border-radius: 8px;
          padding: 8px 12px;
        }

        .plan-icon {
          font-size: 18px;
        }

        .plan-name {
          font-weight: 700;
          font-size: 14px;
          color: #fdffdc;
        }

        .plan-description {
          font-size: 14px;
          color: #a1a1aa;
        }

        .quick-upgrade {
          flex-shrink: 0;
        }

        .upgrade-quick-btn {
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          color: #000;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .upgrade-quick-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(251, 191, 36, 0.4);
        }

        .ai-assistant-section {
          margin-bottom: 32px;
          display: flex;
          justify-content: center;
          padding: 0 16px;
        }

        .ai-component {
          width: 100%;
          max-width: 500px;
        }

        .content-sections {
          transition:
            opacity 0.3s ease,
            transform 0.3s ease;
        }

        .content-sections.transitioning {
          opacity: 0.7;
          transform: translateY(10px);
        }

        .sections-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 24px;
          margin-bottom: 40px;
        }

        .section-card {
          transition: all 0.3s ease;
        }

        .plan-features-showcase {
          background: rgba(24, 24, 27, 0.5);
          border: 1px solid rgba(253, 255, 220, 0.1);
          border-radius: 12px;
          padding: 24px;
          margin-top: 32px;
        }

        .features-title {
          font-size: 20px;
          font-weight: 700;
          color: #fdffdc;
          margin-bottom: 20px;
          text-align: center;
        }

        .features-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
        }

        .feature-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .feature-label {
          font-size: 14px;
          color: #a1a1aa;
          font-weight: 500;
        }

        .feature-value {
          font-size: 14px;
          color: #fdffdc;
          font-weight: 600;
        }

        /* Plan-specific styling */
        .plan-aware-wrapper.plan-free {
          --plan-accent: #fdffdc;
        }

        .plan-aware-wrapper.plan-pro {
          --plan-accent: #fbbf24;
        }

        .plan-aware-wrapper.plan-pro .plan-badge {
          background: rgba(251, 191, 36, 0.1);
          border-color: rgba(251, 191, 36, 0.3);
        }

        .plan-aware-wrapper.plan-enterprise {
          --plan-accent: #a855f7;
        }

        .plan-aware-wrapper.plan-enterprise .plan-badge {
          background: linear-gradient(
            135deg,
            rgba(251, 191, 36, 0.1),
            rgba(168, 85, 247, 0.1)
          );
          border-color: rgba(168, 85, 247, 0.3);
        }

        .plan-aware-wrapper.plan-enterprise .plan-status-banner {
          background: linear-gradient(
            135deg,
            rgba(168, 85, 247, 0.1),
            rgba(0, 0, 0, 0.8)
          );
          border-color: rgba(168, 85, 247, 0.3);
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .plan-status-banner {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }

          .plan-info {
            flex-direction: column;
            gap: 8px;
            align-items: center;
          }

          .sections-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .features-list {
            grid-template-columns: 1fr;
          }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .plan-aware-wrapper {
            /* Already optimized for dark mode */
          }
        }

        /* Animation for plan transitions */
        @keyframes planTransition {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .content-sections:not(.transitioning) {
          animation: planTransition 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

// Helper functions
function getPlanIcon(plan: UserPlan): string {
  switch (plan) {
    case "FREE":
      return "🆓";
    case "PRO":
      return "⭐";
    case "ENTERPRISE":
      return "👑";
    default:
      return "🔧";
  }
}

function getPlanDescription(plan: UserPlan): string {
  switch (plan) {
    case "FREE":
      return "Perfect for getting started with AI";
    case "PRO":
      return "Advanced features for professionals";
    case "ENTERPRISE":
      return "Ultimate power for enterprise teams";
    default:
      return "Your AI-powered experience";
  }
}

export default PlanAwareWrapper;
