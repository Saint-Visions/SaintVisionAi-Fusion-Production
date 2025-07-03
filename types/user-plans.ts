// User plan types for SaintVisionAi™
export type UserPlan = "FREE" | "PRO" | "ENTERPRISE";

export interface UserPlanFeatures {
  plan: UserPlan;
  maxChats: number;
  maxFiles: number;
  maxAssistants: number;
  hasAdvancedFeatures: boolean;
  hasAPIAccess: boolean;
  hasPrioritySupport: boolean;
  hasCustomBranding: boolean;
  hasTeamCollaboration: boolean;
  monthlyTokenLimit: number;
  canAccessPremiumModels: boolean;
  canCreateCustomTools: boolean;
  canIntegrateWebhooks: boolean;
  storageLimit: number; // in GB
}

export const PLAN_FEATURES: Record<UserPlan, UserPlanFeatures> = {
  FREE: {
    plan: "FREE",
    maxChats: 10,
    maxFiles: 5,
    maxAssistants: 1,
    hasAdvancedFeatures: false,
    hasAPIAccess: false,
    hasPrioritySupport: false,
    hasCustomBranding: false,
    hasTeamCollaboration: false,
    monthlyTokenLimit: 10000,
    canAccessPremiumModels: false,
    canCreateCustomTools: false,
    canIntegrateWebhooks: false,
    storageLimit: 1,
  },
  PRO: {
    plan: "PRO",
    maxChats: 100,
    maxFiles: 50,
    maxAssistants: 10,
    hasAdvancedFeatures: true,
    hasAPIAccess: true,
    hasPrioritySupport: false,
    hasCustomBranding: true,
    hasTeamCollaboration: false,
    monthlyTokenLimit: 100000,
    canAccessPremiumModels: true,
    canCreateCustomTools: true,
    canIntegrateWebhooks: false,
    storageLimit: 10,
  },
  ENTERPRISE: {
    plan: "ENTERPRISE",
    maxChats: -1, // unlimited
    maxFiles: -1, // unlimited
    maxAssistants: -1, // unlimited
    hasAdvancedFeatures: true,
    hasAPIAccess: true,
    hasPrioritySupport: true,
    hasCustomBranding: true,
    hasTeamCollaboration: true,
    monthlyTokenLimit: -1, // unlimited
    canAccessPremiumModels: true,
    canCreateCustomTools: true,
    canIntegrateWebhooks: true,
    storageLimit: -1, // unlimited
  },
};

export interface UserProfile {
  id: string;
  email: string;
  username?: string;
  display_name?: string;
  avatar_url?: string;
  plan: UserPlan;
  plan_tier: UserPlan; // Alias for plan for compatibility
  plan_expires_at?: string;
  created_at: string;
  updated_at: string;
  // Usage tracking
  monthly_chat_count: number;
  monthly_token_usage: number;
  storage_used: number;
  // Preferences
  theme: "light" | "dark" | "auto";
  language: string;
  timezone: string;
  // Billing
  customer_id?: string;
  subscription_id?: string;
  // Feature flags
  beta_features: boolean;
  early_access: boolean;
}

export interface UpgradePrompt {
  title: string;
  description: string;
  buttonText: string;
  features: string[];
  currentLimit?: string;
  targetPlan: UserPlan;
  urgency: "low" | "medium" | "high";
}

export const UPGRADE_PROMPTS: Record<UserPlan, UpgradePrompt[]> = {
  FREE: [
    {
      title: "Upgrade to PRO",
      description: "Unlock advanced features and higher limits",
      buttonText: "Get PRO for $29/month",
      features: [
        "100 chats per month",
        "Premium AI models",
        "Custom tools",
        "API access",
        "10GB storage",
      ],
      currentLimit: "10 chats remaining",
      targetPlan: "PRO",
      urgency: "medium",
    },
    {
      title: "Go Enterprise",
      description: "Perfect for teams and businesses",
      buttonText: "Contact Sales",
      features: [
        "Unlimited everything",
        "Team collaboration",
        "Priority support",
        "Custom integrations",
        "SLA guarantees",
      ],
      targetPlan: "ENTERPRISE",
      urgency: "low",
    },
  ],
  PRO: [
    {
      title: "Upgrade to Enterprise",
      description: "Scale your AI operations with unlimited access",
      buttonText: "Contact Sales",
      features: [
        "Unlimited chats & storage",
        "Team collaboration",
        "Webhook integrations",
        "Priority support",
        "Custom SLA",
      ],
      targetPlan: "ENTERPRISE",
      urgency: "low",
    },
  ],
  ENTERPRISE: [],
};

export function getUserPlanFeatures(plan: UserPlan): UserPlanFeatures {
  return PLAN_FEATURES[plan];
}

export function canAccessFeature(
  userPlan: UserPlan,
  feature: keyof UserPlanFeatures,
): boolean {
  const features = getUserPlanFeatures(userPlan);
  return Boolean(features[feature]);
}

export function getUpgradePrompts(currentPlan: UserPlan): UpgradePrompt[] {
  return UPGRADE_PROMPTS[currentPlan] || [];
}

export function isUsageLimitReached(
  userProfile: UserProfile,
  usageType: "chats" | "tokens" | "storage",
): boolean {
  const features = getUserPlanFeatures(userProfile.plan);

  switch (usageType) {
    case "chats":
      return (
        features.maxChats > 0 &&
        userProfile.monthly_chat_count >= features.maxChats
      );
    case "tokens":
      return (
        features.monthlyTokenLimit > 0 &&
        userProfile.monthly_token_usage >= features.monthlyTokenLimit
      );
    case "storage":
      return (
        features.storageLimit > 0 &&
        userProfile.storage_used >= features.storageLimit
      );
    default:
      return false;
  }
}

export function getUsagePercentage(
  userProfile: UserProfile,
  usageType: "chats" | "tokens" | "storage",
): number {
  const features = getUserPlanFeatures(userProfile.plan);

  switch (usageType) {
    case "chats":
      return features.maxChats > 0
        ? (userProfile.monthly_chat_count / features.maxChats) * 100
        : 0;
    case "tokens":
      return features.monthlyTokenLimit > 0
        ? (userProfile.monthly_token_usage / features.monthlyTokenLimit) * 100
        : 0;
    case "storage":
      return features.storageLimit > 0
        ? (userProfile.storage_used / features.storageLimit) * 100
        : 0;
    default:
      return 0;
  }
}
