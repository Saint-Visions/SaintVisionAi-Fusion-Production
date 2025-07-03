"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/auth-context";
import {
  UserPlan,
  getUserPlanFeatures,
  getUpgradePrompts,
  isUsageLimitReached,
} from "@/types/user-plans";

interface FeatureGateOptions {
  feature: string;
  fallbackContent?: React.ReactNode;
  showUpgradePrompt?: boolean;
  redirectToUpgrade?: boolean;
}

interface UsageCheckOptions {
  type: "chats" | "tokens" | "storage";
  warningThreshold?: number; // Percentage at which to show warnings
  blockThreshold?: number; // Percentage at which to block action
}

export function usePlanFeatures() {
  const {
    userProfile,
    checkFeatureAccess,
    getRemainingUsage,
    isUsageLimitReached,
  } = useAuth();
  const [blockedFeatures, setBlockedFeatures] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);

  // Check if user can access a specific feature
  const canAccessFeature = useCallback(
    (feature: string): boolean => {
      if (!userProfile) return false;
      return checkFeatureAccess(feature);
    },
    [userProfile, checkFeatureAccess],
  );

  // Get usage status for a specific metric
  const getUsageStatus = useCallback(
    (type: "chats" | "tokens" | "storage") => {
      if (!userProfile)
        return {
          percentage: 0,
          remaining: 0,
          isLimited: false,
          isBlocked: false,
        };

      const features = getUserPlanFeatures(userProfile.plan);
      const remaining = getRemainingUsage(type);
      const isLimited = isUsageLimitReached(type);

      let limit: number;
      let current: number;

      switch (type) {
        case "chats":
          limit = features.maxChats;
          current = userProfile.monthly_chat_count;
          break;
        case "tokens":
          limit = features.monthlyTokenLimit;
          current = userProfile.monthly_token_usage;
          break;
        case "storage":
          limit = features.storageLimit;
          current = userProfile.storage_used;
          break;
      }

      const percentage = limit > 0 ? Math.min((current / limit) * 100, 100) : 0;

      return {
        percentage,
        remaining,
        isLimited,
        isBlocked: percentage >= 100,
        current,
        limit,
      };
    },
    [userProfile, getRemainingUsage, isUsageLimitReached],
  );

  // Check if an action should be blocked due to usage limits
  const shouldBlockAction = useCallback(
    (type: "chats" | "tokens" | "storage", threshold = 100): boolean => {
      const status = getUsageStatus(type);
      return status.percentage >= threshold;
    },
    [getUsageStatus],
  );

  // Get upgrade suggestions based on current usage
  const getUpgradeSuggestions = useCallback(() => {
    if (!userProfile || userProfile.plan === "ENTERPRISE") return [];

    const suggestions = [];
    const chatStatus = getUsageStatus("chats");
    const tokenStatus = getUsageStatus("tokens");
    const storageStatus = getUsageStatus("storage");

    if (chatStatus.percentage >= 80) {
      suggestions.push({
        type: "chats",
        message: `You've used ${chatStatus.percentage.toFixed(0)}% of your monthly chats`,
        urgency: chatStatus.percentage >= 95 ? "high" : "medium",
      });
    }

    if (tokenStatus.percentage >= 80) {
      suggestions.push({
        type: "tokens",
        message: `You've used ${tokenStatus.percentage.toFixed(0)}% of your monthly tokens`,
        urgency: tokenStatus.percentage >= 95 ? "high" : "medium",
      });
    }

    if (storageStatus.percentage >= 80) {
      suggestions.push({
        type: "storage",
        message: `You've used ${storageStatus.percentage.toFixed(0)}% of your storage`,
        urgency: storageStatus.percentage >= 95 ? "high" : "medium",
      });
    }

    return suggestions;
  }, [userProfile, getUsageStatus]);

  // Feature gate component
  const FeatureGate = useCallback(
    ({
      feature,
      children,
      fallbackContent,
      showUpgradePrompt = true,
    }: FeatureGateOptions & { children: React.ReactNode }) => {
      const hasAccess = canAccessFeature(feature);

      if (hasAccess) {
        return <>{children}</>;
      }

      if (fallbackContent) {
        return <>{fallbackContent}</>;
      }

      if (showUpgradePrompt) {
        const upgradeOptions = getUpgradePrompts(userProfile?.plan || "FREE");
        const primaryUpgrade = upgradeOptions[0];

        return (
          <div className="p-6 rounded-xl border border-[#FDFFDC]/30 bg-gray-900/50 text-center">
            <div className="w-12 h-12 bg-[#FDFFDC]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="text-lg font-semibold text-[#FDFFDC] mb-2">
              {primaryUpgrade?.title || "Upgrade Required"}
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              This feature requires a {primaryUpgrade?.targetPlan || "higher"}{" "}
              plan
            </p>
            <button className="px-4 py-2 bg-[#FDFFDC] text-black rounded-lg font-medium hover:bg-[#FDFFDC]/90 transition-colors">
              {primaryUpgrade?.buttonText || "Upgrade Now"}
            </button>
          </div>
        );
      }

      return null;
    },
    [canAccessFeature, userProfile],
  );

  // Usage gate component
  const UsageGate = useCallback(
    ({
      type,
      children,
      warningThreshold = 80,
      blockThreshold = 100,
      warningContent,
      blockedContent,
    }: UsageCheckOptions & {
      children: React.ReactNode;
      warningContent?: React.ReactNode;
      blockedContent?: React.ReactNode;
    }) => {
      const status = getUsageStatus(type);

      if (status.percentage >= blockThreshold) {
        if (blockedContent) {
          return <>{blockedContent}</>;
        }

        return (
          <div className="p-6 rounded-xl border border-red-400/30 bg-red-900/20 text-center">
            <div className="w-12 h-12 bg-red-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-semibold text-red-400 mb-2">
              Usage Limit Reached
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              You've reached your {type} limit for this month
            </p>
            <button className="px-4 py-2 bg-[#FDFFDC] text-black rounded-lg font-medium hover:bg-[#FDFFDC]/90 transition-colors">
              Upgrade Plan
            </button>
          </div>
        );
      }

      if (status.percentage >= warningThreshold) {
        return (
          <div className="space-y-4">
            {warningContent || (
              <div className="p-3 rounded-lg bg-yellow-900/20 border border-yellow-400/30">
                <p className="text-yellow-300 text-sm">
                  ⚠️ You've used {status.percentage.toFixed(0)}% of your {type}{" "}
                  limit
                </p>
              </div>
            )}
            {children}
          </div>
        );
      }

      return <>{children}</>;
    },
    [getUsageStatus],
  );

  // Plan comparison helper
  const comparePlans = useCallback(
    (targetPlan: UserPlan) => {
      if (!userProfile) return null;

      const currentFeatures = getUserPlanFeatures(userProfile.plan);
      const targetFeatures = getUserPlanFeatures(targetPlan);

      return {
        current: currentFeatures,
        target: targetFeatures,
        improvements: {
          chats: targetFeatures.maxChats - currentFeatures.maxChats,
          tokens:
            targetFeatures.monthlyTokenLimit -
            currentFeatures.monthlyTokenLimit,
          storage: targetFeatures.storageLimit - currentFeatures.storageLimit,
          newFeatures: [],
        },
      };
    },
    [userProfile],
  );

  // Track feature usage
  const trackFeatureUsage = useCallback((feature: string, metadata?: any) => {
    console.log(`Feature used: ${feature}`, metadata);
    // In a real implementation, this would send analytics events
  }, []);

  return {
    // Core data
    userProfile,
    plan: userProfile?.plan || "FREE",
    features: userProfile
      ? getUserPlanFeatures(userProfile.plan)
      : getUserPlanFeatures("FREE"),

    // Feature checking
    canAccessFeature,

    // Usage monitoring
    getUsageStatus,
    shouldBlockAction,
    getUpgradeSuggestions,

    // Components
    FeatureGate,
    UsageGate,

    // Helpers
    comparePlans,
    trackFeatureUsage,

    // State
    blockedFeatures,
    warnings,
  };
}

// Hook specifically for chat-related features
export function useChatFeatures() {
  const {
    canAccessFeature,
    getUsageStatus,
    shouldBlockAction,
    trackFeatureUsage,
    features,
  } = usePlanFeatures();

  const canStartNewChat = useCallback(() => {
    return !shouldBlockAction("chats", 100);
  }, [shouldBlockAction]);

  const canUseAdvancedModels = useCallback(() => {
    return canAccessFeature("canAccessPremiumModels");
  }, [canAccessFeature]);

  const canCreateCustomTools = useCallback(() => {
    return canAccessFeature("canCreateCustomTools");
  }, [canAccessFeature]);

  const getChatLimits = useCallback(() => {
    const status = getUsageStatus("chats");
    return {
      used: status.current,
      limit: status.limit,
      remaining: status.remaining,
      percentage: status.percentage,
      unlimited: status.limit === -1,
    };
  }, [getUsageStatus]);

  const startChat = useCallback(
    (metadata?: any) => {
      if (!canStartNewChat()) {
        throw new Error("Chat limit reached");
      }

      trackFeatureUsage("chat_started", metadata);
      return true;
    },
    [canStartNewChat, trackFeatureUsage],
  );

  return {
    canStartNewChat,
    canUseAdvancedModels,
    canCreateCustomTools,
    getChatLimits,
    startChat,
    maxChats: features.maxChats,
    hasAPIAccess: features.hasAPIAccess,
  };
}

// Hook for file/storage features
export function useStorageFeatures() {
  const { getUsageStatus, shouldBlockAction, trackFeatureUsage, features } =
    usePlanFeatures();

  const canUploadFile = useCallback(
    (fileSize: number) => {
      const status = getUsageStatus("storage");
      const newTotal = status.current + fileSize / (1024 * 1024 * 1024); // Convert to GB
      return (
        !shouldBlockAction("storage", 100) &&
        (status.limit === -1 || newTotal <= status.limit)
      );
    },
    [getUsageStatus, shouldBlockAction],
  );

  const getStorageLimits = useCallback(() => {
    const status = getUsageStatus("storage");
    return {
      used: status.current,
      limit: status.limit,
      remaining: status.remaining,
      percentage: status.percentage,
      unlimited: status.limit === -1,
    };
  }, [getUsageStatus]);

  const uploadFile = useCallback(
    (fileSize: number, metadata?: any) => {
      if (!canUploadFile(fileSize)) {
        throw new Error("Storage limit would be exceeded");
      }

      trackFeatureUsage("file_uploaded", { ...metadata, fileSize });
      return true;
    },
    [canUploadFile, trackFeatureUsage],
  );

  return {
    canUploadFile,
    getStorageLimits,
    uploadFile,
    maxFiles: features.maxFiles,
    storageLimit: features.storageLimit,
  };
}
