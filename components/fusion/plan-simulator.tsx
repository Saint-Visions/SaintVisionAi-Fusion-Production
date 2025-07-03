"use client";

import React, { useState, useEffect } from "react";
import "./plan-simulator.css";
import {
  Crown,
  Star,
  Heart,
  Zap,
  Shield,
  Users,
  BarChart3,
  MessageCircle,
  Bot,
  Sparkles,
  ArrowRight,
  Check,
  X,
  RefreshCw,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/auth-context";
import { useFusionSync } from "@/context/fusion-sync-context";
import { DualAIAssistant } from "../ai/dual-ai-assistant";
import { CompanionCard } from "../ai/companion-card";

type PlanTier = "FREE" | "PRO" | "ENTERPRISE";

interface PlanFeature {
  name: string;
  icon: React.ReactNode;
  free: boolean | string;
  pro: boolean | string;
  enterprise: boolean | string;
}

export const PlanSimulator = () => {
  const { userProfile, updatePlan } = useAuth();
  const { broadcastEvent } = useFusionSync();
  const [simulatedPlan, setSimulatedPlan] = useState<PlanTier>(
    (userProfile?.plan as PlanTier) || "FREE",
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  // Plan features comparison
  const planFeatures: PlanFeature[] = [
    {
      name: "AI Assistant Type",
      icon: <Bot className="w-4 h-4" />,
      free: "Basic Companion",
      pro: "Dual AI Assistant",
      enterprise: "Premium Dual AI",
    },
    {
      name: "Monthly Chats",
      icon: <MessageCircle className="w-4 h-4" />,
      free: "10 chats",
      pro: "Unlimited",
      enterprise: "Unlimited",
    },
    {
      name: "AI Models",
      icon: <Sparkles className="w-4 h-4" />,
      free: "GPT-3.5",
      pro: "GPT-4 + Claude-3",
      enterprise: "Latest Models",
    },
    {
      name: "Real-time Sync",
      icon: <Zap className="w-4 h-4" />,
      free: true,
      pro: true,
      enterprise: true,
    },
    {
      name: "Analytics Dashboard",
      icon: <BarChart3 className="w-4 h-4" />,
      free: "Basic",
      pro: "Advanced",
      enterprise: "Enterprise",
    },
    {
      name: "Team Collaboration",
      icon: <Users className="w-4 h-4" />,
      free: false,
      pro: "Basic",
      enterprise: "Advanced",
    },
    {
      name: "Priority Support",
      icon: <Shield className="w-4 h-4" />,
      free: false,
      pro: "Email",
      enterprise: "24/7 Phone",
    },
    {
      name: "Custom Integrations",
      icon: <Crown className="w-4 h-4" />,
      free: false,
      pro: false,
      enterprise: true,
    },
  ];

  // Handle plan simulation
  const simulatePlan = async (plan: PlanTier) => {
    setIsTransitioning(true);

    // Broadcast plan change event
    broadcastEvent(
      "user-plan-changed",
      {
        oldPlan: simulatedPlan,
        newPlan: plan,
        simulation: true,
      },
      "plan-simulator",
    );

    // Simulate the plan change delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setSimulatedPlan(plan);
    setIsTransitioning(false);

    // Update the auth context for demo purposes
    try {
      await updatePlan(plan);
    } catch (error) {
      console.log("Demo mode: Plan simulation complete");
    }
  };

  // Reset to actual user plan
  const resetToActualPlan = () => {
    const actualPlan = (userProfile?.plan as PlanTier) || "FREE";
    setSimulatedPlan(actualPlan);
    broadcastEvent(
      "user-plan-changed",
      {
        oldPlan: simulatedPlan,
        newPlan: actualPlan,
        simulation: false,
        reset: true,
      },
      "plan-simulator",
    );
  };

  // Plan cards data
  const planCards = [
    {
      tier: "FREE" as PlanTier,
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started",
      color: "from-gray-600 to-gray-800",
      icon: <Heart className="w-6 h-6" />,
      features: ["Basic AI Companion", "10 chats/month", "Standard support"],
    },
    {
      tier: "PRO" as PlanTier,
      name: "Pro",
      price: "$29",
      period: "per month",
      description: "For serious professionals",
      color: "from-blue-600 to-purple-600",
      icon: <Star className="w-6 h-6" />,
      features: ["Dual AI Assistant", "Unlimited chats", "Advanced analytics"],
      popular: true,
    },
    {
      tier: "ENTERPRISE" as PlanTier,
      name: "Enterprise",
      price: "$99",
      period: "per month",
      description: "For teams and organizations",
      color: "from-yellow-500 to-orange-600",
      icon: <Crown className="w-6 h-6" />,
      features: ["Premium AI Models", "Team features", "Priority support"],
    },
  ];

  return (
    <div className="plan-simulator">
      {/* Simulator Header */}
      <div className="simulator-header">
        <div className="header-content">
          <h3 className="simulator-title">Interactive Plan Simulator</h3>
          <p className="simulator-description">
            Switch between plans to see how components adapt in real-time
          </p>
        </div>

        <div className="simulator-controls">
          <div className="current-plan-indicator">
            <span className="plan-label">Simulating:</span>
            <div className={`plan-badge ${simulatedPlan.toLowerCase()}`}>
              {simulatedPlan}
            </div>
          </div>

          <button
            className="reset-btn"
            onClick={resetToActualPlan}
            title="Reset to your actual plan"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Plan Selection Cards */}
      <div className="plan-cards-grid">
        {planCards.map((plan) => (
          <motion.div
            key={plan.tier}
            className={`plan-card ${simulatedPlan === plan.tier ? "active" : ""} ${plan.popular ? "popular" : ""}`}
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {plan.popular && (
              <div className="popular-badge">
                <Sparkles className="w-3 h-3" />
                <span>Most Popular</span>
              </div>
            )}

            <div className={`plan-header bg-gradient-to-br ${plan.color}`}>
              <div className="plan-icon">{plan.icon}</div>
              <h4 className="plan-name">{plan.name}</h4>
              <div className="plan-pricing">
                <span className="price">{plan.price}</span>
                <span className="period">{plan.period}</span>
              </div>
            </div>

            <div className="plan-content">
              <p className="plan-description">{plan.description}</p>

              <ul className="plan-features-list">
                {plan.features.map((feature, index) => (
                  <li key={index} className="feature-item">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`select-plan-btn ${simulatedPlan === plan.tier ? "selected" : ""}`}
                onClick={() => simulatePlan(plan.tier)}
                disabled={isTransitioning || simulatedPlan === plan.tier}
              >
                {isTransitioning ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </motion.div>
                    <span>Switching...</span>
                  </>
                ) : simulatedPlan === plan.tier ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Current Plan</span>
                  </>
                ) : (
                  <>
                    <span>Simulate Plan</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Live Component Preview */}
      <div className="component-preview-section">
        <div className="preview-header">
          <h4 className="preview-title">Live Component Preview</h4>
          <p className="preview-description">
            Watch how AI components change based on the selected plan
          </p>
        </div>

        <div className="component-preview-container">
          <AnimatePresence mode="wait">
            {isTransitioning ? (
              <motion.div
                key="transitioning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="transition-overlay"
              >
                <div className="transition-content">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="transition-spinner"
                  >
                    <Zap className="w-8 h-8 text-blue-400" />
                  </motion.div>
                  <h5 className="transition-title">Switching Components...</h5>
                  <p className="transition-text">
                    Plan-based rendering in progress
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={simulatedPlan}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="active-component-preview"
              >
                <div className="component-label">
                  <div className="label-info">
                    <span className="component-name">
                      {simulatedPlan === "FREE"
                        ? "CompanionCard"
                        : "DualAIAssistant"}
                    </span>
                    <span className="plan-tier">({simulatedPlan} Plan)</span>
                  </div>
                  <div className="component-status">
                    <div className="status-dot active"></div>
                    <span>Active</span>
                  </div>
                </div>

                <div className="component-wrapper">
                  {simulatedPlan === "FREE" ? (
                    <CompanionCard className="simulator-component" />
                  ) : (
                    <div className="dual-ai-preview">
                      <div className="ai-models-display">
                        <div className="ai-model-card">
                          <Bot className="w-5 h-5 text-green-400" />
                          <span>
                            {simulatedPlan === "ENTERPRISE"
                              ? "GPT-4 Turbo"
                              : "GPT-4"}
                          </span>
                        </div>
                        <div className="model-separator">+</div>
                        <div className="ai-model-card">
                          <Sparkles className="w-5 h-5 text-purple-400" />
                          <span>
                            {simulatedPlan === "ENTERPRISE"
                              ? "Claude-3 Sonnet"
                              : "Claude-3 Haiku"}
                          </span>
                        </div>
                      </div>
                      <p className="dual-ai-description">
                        Dual AI assistant with parallel model responses and
                        comparison
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Feature Comparison Toggle */}
      <div className="comparison-section">
        <button
          className="comparison-toggle"
          onClick={() => setShowComparison(!showComparison)}
        >
          <BarChart3 className="w-4 h-4" />
          <span>{showComparison ? "Hide" : "Show"} Feature Comparison</span>
          <motion.div
            animate={{ rotate: showComparison ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowRight className="w-4 h-4" />
          </motion.div>
        </button>

        <AnimatePresence>
          {showComparison && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="comparison-table"
            >
              <div className="table-header">
                <div className="feature-col">Feature</div>
                <div className="plan-col">Free</div>
                <div className="plan-col">Pro</div>
                <div className="plan-col">Enterprise</div>
              </div>

              {planFeatures.map((feature, index) => (
                <div key={index} className="table-row">
                  <div className="feature-cell">
                    {feature.icon}
                    <span>{feature.name}</span>
                  </div>
                  <div className="plan-cell">
                    {typeof feature.free === "boolean" ? (
                      feature.free ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <X className="w-4 h-4 text-gray-400" />
                      )
                    ) : (
                      <span className="feature-value">{feature.free}</span>
                    )}
                  </div>
                  <div className="plan-cell">
                    {typeof feature.pro === "boolean" ? (
                      feature.pro ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <X className="w-4 h-4 text-gray-400" />
                      )
                    ) : (
                      <span className="feature-value">{feature.pro}</span>
                    )}
                  </div>
                  <div className="plan-cell">
                    {typeof feature.enterprise === "boolean" ? (
                      feature.enterprise ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <X className="w-4 h-4 text-gray-400" />
                      )
                    ) : (
                      <span className="feature-value">
                        {feature.enterprise}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
