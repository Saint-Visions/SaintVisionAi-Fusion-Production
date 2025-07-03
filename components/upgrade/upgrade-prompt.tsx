"use client";

import React from "react";
import { X, Star, Zap, Users, Shield, ArrowRight } from "@tabler/icons-react";
import { UserPlan, UpgradePrompt, getUpgradePrompts } from "@/types/user-plans";
import { useAuth } from "@/context/auth-context";

interface UpgradePromptProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: UserPlan;
  urgency?: "low" | "medium" | "high";
  triggerType?: "usage-limit" | "feature-gate" | "proactive";
}

export const UpgradePromptComponent = ({
  isOpen,
  onClose,
  currentPlan,
  urgency = "medium",
  triggerType = "proactive",
}: UpgradePromptProps) => {
  const { updatePlan } = useAuth();
  const upgradeOptions = getUpgradePrompts(currentPlan);

  if (!isOpen || upgradeOptions.length === 0) return null;

  const handleUpgrade = async (targetPlan: UserPlan) => {
    try {
      // In a real implementation, this would trigger the billing flow
      console.log(`Initiating upgrade to ${targetPlan}`);

      // For demo purposes, we'll just update the plan
      if (targetPlan === "PRO") {
        await updatePlan(targetPlan);
        onClose();
      } else if (targetPlan === "ENTERPRISE") {
        // Open contact form or redirect to sales
        window.open(
          "mailto:sales@saintvisionai.com?subject=Enterprise Plan Inquiry",
          "_blank",
        );
      }
    } catch (error) {
      console.error("Error during upgrade:", error);
    }
  };

  const getUrgencyStyles = () => {
    switch (urgency) {
      case "high":
        return "border-red-400 bg-red-900/20";
      case "medium":
        return "border-yellow-400 bg-yellow-900/20";
      default:
        return "border-[#FDFFDC] bg-gray-900/20";
    }
  };

  const getUrgencyMessage = () => {
    switch (triggerType) {
      case "usage-limit":
        return "⚠️ You've reached your usage limit";
      case "feature-gate":
        return "🔒 This feature requires an upgrade";
      default:
        return "🚀 Unlock your full potential";
    }
  };

  const getPlanIcon = (plan: UserPlan) => {
    switch (plan) {
      case "PRO":
        return <Star className="w-6 h-6 text-yellow-400" />;
      case "ENTERPRISE":
        return <Shield className="w-6 h-6 text-purple-400" />;
      default:
        return <Zap className="w-6 h-6 text-[#FDFFDC]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div
        className={`
        relative w-full max-w-2xl mx-4 rounded-3xl border-2 p-8
        ${getUrgencyStyles()}
        shadow-2xl backdrop-blur-lg
      `}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FDFFDC]/10 mb-4">
            <Zap className="w-8 h-8 text-[#FDFFDC]" />
          </div>
          <h2 className="text-2xl font-bold text-[#FDFFDC] mb-2">
            {getUrgencyMessage()}
          </h2>
          <p className="text-gray-300">
            Choose the perfect plan for your needs
          </p>
        </div>

        {/* Upgrade options */}
        <div className="space-y-6">
          {upgradeOptions.map((option, index) => (
            <div
              key={index}
              className="relative p-6 rounded-2xl border border-gray-700 bg-gray-800/50 hover:bg-gray-800/70 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getPlanIcon(option.targetPlan)}
                  <div>
                    <h3 className="text-xl font-bold text-[#FDFFDC]">
                      {option.title}
                    </h3>
                    <p className="text-gray-300 text-sm">
                      {option.description}
                    </p>
                  </div>
                </div>
                {option.urgency === "high" && (
                  <div className="px-3 py-1 rounded-full bg-red-500/20 border border-red-500">
                    <span className="text-red-400 text-xs font-medium">
                      URGENT
                    </span>
                  </div>
                )}
              </div>

              {/* Features list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                {option.features.map((feature, featureIndex) => (
                  <div
                    key={featureIndex}
                    className="flex items-center space-x-2"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FDFFDC]"></div>
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Current limit warning */}
              {option.currentLimit && (
                <div className="mb-4 p-3 rounded-lg bg-yellow-900/20 border border-yellow-400/30">
                  <p className="text-yellow-300 text-sm">
                    ⚠️ {option.currentLimit}
                  </p>
                </div>
              )}

              {/* Action button */}
              <button
                onClick={() => handleUpgrade(option.targetPlan)}
                className="w-full py-3 px-6 rounded-xl bg-[#FDFFDC] text-black font-semibold hover:bg-[#FDFFDC]/90 transition-colors flex items-center justify-center space-x-2 group"
              >
                <span>{option.buttonText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            All plans include our 30-day money-back guarantee
          </p>
          <div className="mt-4 flex items-center justify-center space-x-6 text-xs text-gray-500">
            <span>🔒 Secure payments</span>
            <span>📞 24/7 support</span>
            <span>🚀 Instant activation</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Compact upgrade banner for inline prompts
export const UpgradeBanner = ({
  currentPlan,
  onUpgrade,
  onDismiss,
}: {
  currentPlan: UserPlan;
  onUpgrade: () => void;
  onDismiss?: () => void;
}) => {
  const upgradeOptions = getUpgradePrompts(currentPlan);
  const primaryOption = upgradeOptions[0];

  if (!primaryOption) return null;

  return (
    <div className="relative p-4 rounded-xl border border-[#FDFFDC]/30 bg-gradient-to-r from-[#FDFFDC]/5 to-transparent backdrop-blur-sm">
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-2 right-2 p-1 rounded-full text-gray-400 hover:text-white"
        >
          <X size={16} />
        </button>
      )}

      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-[#FDFFDC]/10 flex items-center justify-center">
            <Star className="w-5 h-5 text-[#FDFFDC]" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-[#FDFFDC] font-semibold text-sm">
            {primaryOption.title}
          </h4>
          <p className="text-gray-300 text-xs truncate">
            {primaryOption.description}
          </p>
        </div>

        <button
          onClick={onUpgrade}
          className="flex-shrink-0 px-4 py-2 rounded-lg bg-[#FDFFDC] text-black text-sm font-medium hover:bg-[#FDFFDC]/90 transition-colors"
        >
          Upgrade
        </button>
      </div>
    </div>
  );
};

// Usage meter component
export const UsageMeter = ({
  label,
  current,
  limit,
  type = "default",
}: {
  label: string;
  current: number;
  limit: number;
  type?: "default" | "warning" | "danger";
}) => {
  const percentage = limit > 0 ? Math.min((current / limit) * 100, 100) : 0;
  const isUnlimited = limit === -1;

  const getBarColor = () => {
    if (isUnlimited) return "bg-green-400";
    if (type === "danger" || percentage >= 90) return "bg-red-400";
    if (type === "warning" || percentage >= 70) return "bg-yellow-400";
    return "bg-[#FDFFDC]";
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-300">{label}</span>
        <span className="text-[#FDFFDC] font-medium">
          {isUnlimited ? "∞" : `${current} / ${limit}`}
        </span>
      </div>

      {!isUnlimited && (
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getBarColor()}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}

      {isUnlimited && (
        <div className="flex items-center space-x-2">
          <div className="w-full bg-green-400/20 rounded-full h-2">
            <div className="h-2 bg-green-400 rounded-full w-full" />
          </div>
          <span className="text-green-400 text-xs">Unlimited</span>
        </div>
      )}
    </div>
  );
};
