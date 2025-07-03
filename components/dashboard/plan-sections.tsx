"use client";

import React from "react";
import {
  MessageCircle,
  Users,
  Chrome,
  Zap,
  BarChart3,
  Shield,
  Rocket,
  Star,
  TrendingUp,
  Bot,
  Target,
  Sparkles,
} from "@tabler/icons-react";
import { UserPlan } from "@/types/user-plans";
import { useAuth } from "@/context/auth-context";

interface DashboardSectionProps {
  plan: UserPlan;
  className?: string;
}

// AI Chat Section
export const AIChatSection = ({
  plan,
  className = "",
}: DashboardSectionProps) => {
  const getFeatures = () => {
    switch (plan) {
      case "FREE":
        return [
          "10 conversations/month",
          "Basic AI models",
          "Standard responses",
        ];
      case "PRO":
        return [
          "100 conversations/month",
          "Premium AI models (GPT-4, Claude)",
          "Advanced context memory",
          "Custom personalities",
        ];
      case "ENTERPRISE":
        return [
          "Unlimited conversations",
          "All premium models",
          "Custom model fine-tuning",
          "Team collaboration",
          "Priority processing",
        ];
    }
  };

  const getIcon = () => {
    switch (plan) {
      case "FREE":
        return <MessageCircle className="w-8 h-8 text-blue-400" />;
      case "PRO":
        return <Bot className="w-8 h-8 text-purple-400" />;
      case "ENTERPRISE":
        return <Sparkles className="w-8 h-8 text-gold-400" />;
    }
  };

  return (
    <div className={`ai-chat-section plan-${plan.toLowerCase()} ${className}`}>
      <div className="section-header">
        <div className="icon-container">{getIcon()}</div>
        <div className="header-content">
          <h3 className="section-title">AI Chat Intelligence</h3>
          <p className="section-subtitle">
            {plan === "FREE" && "Get started with AI conversations"}
            {plan === "PRO" && "Advanced AI with premium models"}
            {plan === "ENTERPRISE" && "Enterprise-grade AI solutions"}
          </p>
        </div>
      </div>

      <div className="features-grid">
        {getFeatures().map((feature, index) => (
          <div key={index} className="feature-item">
            <div className="feature-dot"></div>
            <span className="feature-text">{feature}</span>
          </div>
        ))}
      </div>

      <div className="section-actions">
        <button className="primary-action">
          {plan === "FREE"
            ? "Use AI Companion"
            : plan === "PRO"
              ? "Open Dual AI Console"
              : "Launch Enterprise Console"}
        </button>
        {plan === "FREE" && (
          <button className="secondary-action">See PRO Features</button>
        )}
      </div>

      <style jsx>{`
        .ai-chat-section {
          background: linear-gradient(
            135deg,
            rgba(59, 130, 246, 0.1) 0%,
            rgba(147, 51, 234, 0.1) 100%
          );
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 16px;
          padding: 24px;
          transition: all 0.3s ease;
        }

        .ai-chat-section:hover {
          border-color: rgba(59, 130, 246, 0.4);
          transform: translateY(-2px);
        }

        .section-header {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 20px;
        }

        .icon-container {
          flex-shrink: 0;
          width: 56px;
          height: 56px;
          background: rgba(59, 130, 246, 0.1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .plan-pro .icon-container {
          background: rgba(147, 51, 234, 0.1);
        }

        .plan-enterprise .icon-container {
          background: linear-gradient(
            135deg,
            rgba(251, 191, 36, 0.1),
            rgba(147, 51, 234, 0.1)
          );
        }

        .header-content {
          flex: 1;
        }

        .section-title {
          font-size: 20px;
          font-weight: 700;
          color: #fdffdc;
          margin: 0 0 4px 0;
        }

        .section-subtitle {
          font-size: 14px;
          color: #a1a1aa;
          margin: 0;
        }

        .features-grid {
          display: grid;
          gap: 12px;
          margin-bottom: 24px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .feature-dot {
          width: 8px;
          height: 8px;
          background: #59c7f9;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .plan-pro .feature-dot {
          background: #a855f7;
        }

        .plan-enterprise .feature-dot {
          background: linear-gradient(45deg, #fbbf24, #a855f7);
        }

        .feature-text {
          font-size: 14px;
          color: #e5e7eb;
        }

        .section-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .primary-action {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          flex: 1;
          min-width: 140px;
        }

        .primary-action:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
        }

        .secondary-action {
          background: transparent;
          color: #a1a1aa;
          border: 1px solid #374151;
          padding: 12px 24px;
          border-radius: 10px;
          font-weight: 500;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .secondary-action:hover {
          border-color: #6b7280;
          color: #fdffdc;
        }
      `}</style>
    </div>
  );
};

// Smart Leads Section
export const SmartLeadsSection = ({
  plan,
  className = "",
}: DashboardSectionProps) => {
  const getFeatures = () => {
    switch (plan) {
      case "FREE":
        return ["5 lead searches/month", "Basic lead profiles", "Email finder"];
      case "PRO":
        return [
          "500 lead searches/month",
          "Advanced lead scoring",
          "CRM integration",
          "Email sequences",
          "LinkedIn automation",
        ];
      case "ENTERPRISE":
        return [
          "Unlimited lead searches",
          "AI-powered lead qualification",
          "Custom lead sources",
          "Team lead sharing",
          "Advanced analytics",
          "API access",
        ];
    }
  };

  return (
    <div
      className={`smart-leads-section plan-${plan.toLowerCase()} ${className}`}
    >
      <div className="section-header">
        <div className="icon-container">
          <Target className="w-8 h-8 text-green-400" />
        </div>
        <div className="header-content">
          <h3 className="section-title">Smart Leads Discovery</h3>
          <p className="section-subtitle">
            {plan === "FREE" && "Find your first leads"}
            {plan === "PRO" && "Advanced lead generation"}
            {plan === "ENTERPRISE" && "Enterprise lead intelligence"}
          </p>
        </div>
      </div>

      <div className="leads-stats">
        <div className="stat-item">
          <div className="stat-number">
            {plan === "FREE" ? "5" : plan === "PRO" ? "500" : "∞"}
          </div>
          <div className="stat-label">Monthly Searches</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">
            {plan === "FREE" ? "85%" : plan === "PRO" ? "94%" : "99%"}
          </div>
          <div className="stat-label">Accuracy Rate</div>
        </div>
      </div>

      <div className="features-list">
        {getFeatures().map((feature, index) => (
          <div key={index} className="feature-item">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span>{feature}</span>
          </div>
        ))}
      </div>

      <button className="section-cta">
        {plan === "FREE" ? "Find Leads" : "Open Lead Studio"}
      </button>

      <style jsx>{`
        .smart-leads-section {
          background: linear-gradient(
            135deg,
            rgba(34, 197, 94, 0.1) 0%,
            rgba(59, 130, 246, 0.1) 100%
          );
          border: 1px solid rgba(34, 197, 94, 0.2);
          border-radius: 16px;
          padding: 24px;
          transition: all 0.3s ease;
        }

        .smart-leads-section:hover {
          border-color: rgba(34, 197, 94, 0.4);
          transform: translateY(-2px);
        }

        .section-header {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 20px;
        }

        .icon-container {
          flex-shrink: 0;
          width: 56px;
          height: 56px;
          background: rgba(34, 197, 94, 0.1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .header-content {
          flex: 1;
        }

        .section-title {
          font-size: 20px;
          font-weight: 700;
          color: #fdffdc;
          margin: 0 0 4px 0;
        }

        .section-subtitle {
          font-size: 14px;
          color: #a1a1aa;
          margin: 0;
        }

        .leads-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 20px;
          padding: 16px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 12px;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-size: 24px;
          font-weight: 700;
          color: #22c55e;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 12px;
          color: #9ca3af;
        }

        .features-list {
          display: grid;
          gap: 12px;
          margin-bottom: 24px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
          color: #e5e7eb;
        }

        .section-cta {
          width: 100%;
          background: linear-gradient(135deg, #22c55e, #3b82f6);
          color: white;
          border: none;
          padding: 14px 24px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .section-cta:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 25px rgba(34, 197, 94, 0.3);
        }
      `}</style>
    </div>
  );
};

// Chrome Extension Section
export const ChromeExtensionSection = ({
  plan,
  className = "",
}: DashboardSectionProps) => {
  const isAvailable = plan !== "FREE";

  return (
    <div
      className={`chrome-extension-section plan-${plan.toLowerCase()} ${className}`}
    >
      <div className="section-header">
        <div className="icon-container">
          <Chrome className="w-8 h-8 text-orange-400" />
        </div>
        <div className="header-content">
          <h3 className="section-title">
            Chrome Extension
            {!isAvailable && <span className="pro-badge">PRO</span>}
          </h3>
          <p className="section-subtitle">
            {isAvailable
              ? "Browse with AI-powered insights"
              : "Upgrade to unlock browser integration"}
          </p>
        </div>
      </div>

      {isAvailable ? (
        <div className="extension-content">
          <div className="extension-features">
            <div className="feature-row">
              <Zap className="w-5 h-5 text-orange-400" />
              <span>Auto-capture leads from any page</span>
            </div>
            <div className="feature-row">
              <BarChart3 className="w-5 h-5 text-orange-400" />
              <span>Real-time company insights</span>
            </div>
            <div className="feature-row">
              <Shield className="w-5 h-5 text-orange-400" />
              <span>Privacy-first data collection</span>
            </div>
          </div>

          <div className="extension-status">
            <div className="status-indicator installed">
              <div className="status-dot"></div>
              <span>Extension Installed</span>
            </div>
          </div>

          <button className="extension-cta">Open Extension</button>
        </div>
      ) : (
        <div className="extension-locked">
          <div className="lock-icon">
            <Shield className="w-12 h-12 text-gray-500" />
          </div>
          <p className="lock-message">
            Get instant access to our powerful Chrome extension with PRO or
            Enterprise plans
          </p>
          <button className="upgrade-cta">Upgrade to PRO</button>
        </div>
      )}

      <style jsx>{`
        .chrome-extension-section {
          background: linear-gradient(
            135deg,
            rgba(251, 146, 60, 0.1) 0%,
            rgba(249, 115, 22, 0.1) 100%
          );
          border: 1px solid rgba(251, 146, 60, 0.2);
          border-radius: 16px;
          padding: 24px;
          transition: all 0.3s ease;
        }

        .chrome-extension-section:hover {
          border-color: rgba(251, 146, 60, 0.4);
          transform: translateY(-2px);
        }

        .section-header {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 20px;
        }

        .icon-container {
          flex-shrink: 0;
          width: 56px;
          height: 56px;
          background: rgba(251, 146, 60, 0.1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .header-content {
          flex: 1;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 20px;
          font-weight: 700;
          color: #fdffdc;
          margin: 0 0 4px 0;
        }

        .pro-badge {
          background: linear-gradient(45deg, #fbbf24, #f59e0b);
          color: #000;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .section-subtitle {
          font-size: 14px;
          color: #a1a1aa;
          margin: 0;
        }

        .extension-content {
          display: grid;
          gap: 20px;
        }

        .extension-features {
          display: grid;
          gap: 12px;
        }

        .feature-row {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
          color: #e5e7eb;
        }

        .extension-status {
          padding: 12px;
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.2);
          border-radius: 8px;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #22c55e;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          background: #22c55e;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 1;
          }
        }

        .extension-cta {
          width: 100%;
          background: linear-gradient(135deg, #fb923c, #f97316);
          color: white;
          border: none;
          padding: 14px 24px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .extension-cta:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 25px rgba(251, 146, 60, 0.3);
        }

        .extension-locked {
          text-align: center;
          padding: 20px 0;
        }

        .lock-icon {
          margin-bottom: 16px;
          opacity: 0.5;
        }

        .lock-message {
          font-size: 14px;
          color: #9ca3af;
          margin-bottom: 20px;
          line-height: 1.5;
        }

        .upgrade-cta {
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          color: #000;
          border: none;
          padding: 12px 24px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .upgrade-cta:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(251, 191, 36, 0.4);
        }
      `}</style>
    </div>
  );
};

// Pricing Highlights Section
export const PricingHighlightsSection = ({
  plan,
  className = "",
}: DashboardSectionProps) => {
  const { userProfile } = useAuth();

  const getCurrentPlanInfo = () => {
    switch (plan) {
      case "FREE":
        return {
          title: "Free Plan",
          price: "$0",
          period: "/month",
          description: "Perfect for getting started",
          highlight: "Currently Active",
        };
      case "PRO":
        return {
          title: "PRO Plan",
          price: "$29",
          period: "/month",
          description: "Advanced features for professionals",
          highlight: "Currently Active",
        };
      case "ENTERPRISE":
        return {
          title: "Enterprise Plan",
          price: "Custom",
          period: "",
          description: "Tailored for enterprise needs",
          highlight: "Currently Active",
        };
    }
  };

  const getNextPlanInfo = () => {
    switch (plan) {
      case "FREE":
        return {
          title: "Upgrade to PRO",
          price: "$29",
          period: "/month",
          description: "Unlock advanced features",
          highlight: "⚡ Recommended",
        };
      case "PRO":
        return {
          title: "Upgrade to Enterprise",
          price: "Custom",
          period: "",
          description: "Scale with unlimited access",
          highlight: "🚀 Ultimate Power",
        };
      case "ENTERPRISE":
        return null;
    }
  };

  const currentPlan = getCurrentPlanInfo();
  const nextPlan = getNextPlanInfo();

  return (
    <div
      className={`pricing-highlights-section plan-${plan.toLowerCase()} ${className}`}
    >
      <div className="section-header">
        <div className="icon-container">
          <Star className="w-8 h-8 text-yellow-400" />
        </div>
        <div className="header-content">
          <h3 className="section-title">Your Plan & Pricing</h3>
          <p className="section-subtitle">
            Manage your subscription and explore upgrades
          </p>
        </div>
      </div>

      <div className="pricing-cards">
        {/* Current Plan Card */}
        <div className="pricing-card current-plan">
          <div className="plan-badge">{currentPlan.highlight}</div>
          <div className="plan-header">
            <h4 className="plan-title">{currentPlan.title}</h4>
            <div className="plan-price">
              <span className="price-amount">{currentPlan.price}</span>
              <span className="price-period">{currentPlan.period}</span>
            </div>
            <p className="plan-description">{currentPlan.description}</p>
          </div>

          <div className="plan-usage">
            <div className="usage-item">
              <span className="usage-label">Monthly Usage</span>
              <div className="usage-bar">
                <div
                  className="usage-fill"
                  style={{
                    width: userProfile
                      ? `${Math.min((userProfile.monthly_chat_count / (plan === "FREE" ? 10 : plan === "PRO" ? 100 : 1000)) * 100, 100)}%`
                      : "0%",
                  }}
                ></div>
              </div>
              <span className="usage-text">
                {userProfile?.monthly_chat_count || 0} /{" "}
                {plan === "FREE" ? 10 : plan === "PRO" ? 100 : "∞"} chats
              </span>
            </div>
          </div>

          <button className="manage-plan-btn">Manage Plan</button>
        </div>

        {/* Next Plan Card (if applicable) */}
        {nextPlan && (
          <div className="pricing-card next-plan">
            <div className="plan-badge upgrade">{nextPlan.highlight}</div>
            <div className="plan-header">
              <h4 className="plan-title">{nextPlan.title}</h4>
              <div className="plan-price">
                <span className="price-amount">{nextPlan.price}</span>
                <span className="price-period">{nextPlan.period}</span>
              </div>
              <p className="plan-description">{nextPlan.description}</p>
            </div>

            <div className="upgrade-features">
              {plan === "FREE" && (
                <>
                  <div className="feature">✨ 10x more conversations</div>
                  <div className="feature">🤖 Premium AI models</div>
                  <div className="feature">🔗 Chrome extension</div>
                  <div className="feature">📊 Advanced analytics</div>
                </>
              )}
              {plan === "PRO" && (
                <>
                  <div className="feature">♾️ Unlimited everything</div>
                  <div className="feature">👥 Team collaboration</div>
                  <div className="feature">🔧 Custom integrations</div>
                  <div className="feature">⚡ Priority support</div>
                </>
              )}
            </div>

            <button className="upgrade-btn">
              {plan === "FREE" ? "Upgrade to PRO" : "Contact Sales"}
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .pricing-highlights-section {
          background: linear-gradient(
            135deg,
            rgba(251, 191, 36, 0.1) 0%,
            rgba(147, 51, 234, 0.1) 100%
          );
          border: 1px solid rgba(251, 191, 36, 0.2);
          border-radius: 16px;
          padding: 24px;
          transition: all 0.3s ease;
        }

        .section-header {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 24px;
        }

        .icon-container {
          flex-shrink: 0;
          width: 56px;
          height: 56px;
          background: rgba(251, 191, 36, 0.1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .header-content {
          flex: 1;
        }

        .section-title {
          font-size: 20px;
          font-weight: 700;
          color: #fdffdc;
          margin: 0 0 4px 0;
        }

        .section-subtitle {
          font-size: 14px;
          color: #a1a1aa;
          margin: 0;
        }

        .pricing-cards {
          display: grid;
          gap: 16px;
        }

        .pricing-card {
          position: relative;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 20px;
          transition: all 0.3s ease;
        }

        .pricing-card:hover {
          border-color: rgba(251, 191, 36, 0.3);
          transform: translateY(-1px);
        }

        .current-plan {
          border-color: rgba(34, 197, 94, 0.3);
        }

        .next-plan {
          border-color: rgba(251, 191, 36, 0.3);
        }

        .plan-badge {
          position: absolute;
          top: -8px;
          left: 16px;
          background: rgba(34, 197, 94, 0.9);
          color: white;
          font-size: 12px;
          font-weight: 600;
          padding: 4px 12px;
          border-radius: 12px;
        }

        .plan-badge.upgrade {
          background: linear-gradient(45deg, #fbbf24, #f59e0b);
          color: #000;
        }

        .plan-header {
          margin-top: 12px;
          margin-bottom: 20px;
        }

        .plan-title {
          font-size: 18px;
          font-weight: 700;
          color: #fdffdc;
          margin: 0 0 8px 0;
        }

        .plan-price {
          display: flex;
          align-items: baseline;
          gap: 4px;
          margin-bottom: 8px;
        }

        .price-amount {
          font-size: 32px;
          font-weight: 700;
          color: #fdffdc;
        }

        .price-period {
          font-size: 16px;
          color: #9ca3af;
        }

        .plan-description {
          font-size: 14px;
          color: #a1a1aa;
          margin: 0;
        }

        .plan-usage {
          margin-bottom: 20px;
        }

        .usage-item {
          display: grid;
          gap: 8px;
        }

        .usage-label {
          font-size: 14px;
          font-weight: 500;
          color: #e5e7eb;
        }

        .usage-bar {
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
        }

        .usage-fill {
          height: 100%;
          background: linear-gradient(90deg, #22c55e, #16a34a);
          border-radius: 3px;
          transition: width 0.3s ease;
        }

        .usage-text {
          font-size: 12px;
          color: #9ca3af;
        }

        .upgrade-features {
          display: grid;
          gap: 8px;
          margin-bottom: 20px;
        }

        .feature {
          font-size: 14px;
          color: #e5e7eb;
          display: flex;
          align-items: center;
        }

        .manage-plan-btn {
          width: 100%;
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
          border: 1px solid rgba(34, 197, 94, 0.3);
          padding: 12px 24px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .manage-plan-btn:hover {
          background: rgba(34, 197, 94, 0.2);
          border-color: rgba(34, 197, 94, 0.5);
        }

        .upgrade-btn {
          width: 100%;
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          color: #000;
          border: none;
          padding: 14px 24px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .upgrade-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 25px rgba(251, 191, 36, 0.3);
        }

        @media (min-width: 768px) {
          .pricing-cards {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </div>
  );
};
