"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/browser-client";
import {
  UserProfile,
  UserPlan,
  getUserPlanFeatures,
  isUsageLimitReached,
} from "@/types/user-plans";

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updatePlan: (plan: UserPlan) => Promise<void>;
  checkFeatureAccess: (feature: string) => boolean;
  getRemainingUsage: (type: "chats" | "tokens" | "storage") => number;
  isUsageLimitReached: (type: "chats" | "tokens" | "storage") => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (mounted) {
        if (error) {
          console.error("Error getting session:", error);
        } else if (session?.user) {
          setUser(session.user);
          await fetchUserProfile(session.user.id);
        }
        setIsLoading(false);
      }
    }

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (mounted) {
        if (event === "SIGNED_IN" && session?.user) {
          setUser(session.user);
          await fetchUserProfile(session.user.id);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setUserProfile(null);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user profile from database
  const fetchUserProfile = async (userId: string) => {
    try {
      // For now, we'll create a mock profile since the database schema is not fully defined
      // In a real implementation, this would fetch from Supabase:
      // const { data, error } = await supabase
      //   .from('profiles')
      //   .select('*')
      //   .eq('id', userId)
      //   .single();

      // Mock profile for development
      const userPlan = (user?.user_metadata?.plan as UserPlan) || "FREE";
      const mockProfile: UserProfile = {
        id: userId,
        email: user?.email || "user@example.com",
        username: user?.user_metadata?.username || "user",
        display_name: user?.user_metadata?.display_name || "Saint Gottaguy",
        avatar_url: user?.user_metadata?.avatar_url,
        plan: userPlan,
        plan_tier: userPlan, // Set plan_tier for compatibility
        plan_expires_at: undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        monthly_chat_count: 3, // Example usage
        monthly_token_usage: 2500,
        storage_used: 0.5,
        theme: "dark",
        language: "en",
        timezone: "UTC",
        customer_id: undefined,
        subscription_id: undefined,
        beta_features: false,
        early_access: true,
      };

      setUserProfile(mockProfile);
    } catch (error) {
      console.error("Error fetching user profile:", error);

      // Fallback mock profile
      if (user) {
        const fallbackProfile: UserProfile = {
          id: userId,
          email: user.email || "user@example.com",
          display_name: "Saint Gottaguy",
          plan: "FREE",
          plan_tier: "FREE", // Set plan_tier for compatibility
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          monthly_chat_count: 0,
          monthly_token_usage: 0,
          storage_used: 0,
          theme: "dark",
          language: "en",
          timezone: "UTC",
          beta_features: false,
          early_access: false,
        };
        setUserProfile(fallbackProfile);
      }
    }
  };

  // Refresh user profile
  const refreshProfile = async () => {
    if (user) {
      await fetchUserProfile(user.id);
    }
  };

  // Update user plan
  const updatePlan = async (plan: UserPlan) => {
    if (!userProfile) return;

    try {
      // In a real implementation, this would update the database:
      // const { error } = await supabase
      //   .from('profiles')
      //   .update({ plan, updated_at: new Date().toISOString() })
      //   .eq('id', userProfile.id);

      // For now, update locally
      setUserProfile((prev) =>
        prev ? { ...prev, plan, updated_at: new Date().toISOString() } : null,
      );
    } catch (error) {
      console.error("Error updating plan:", error);
      throw error;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  // Check feature access
  const checkFeatureAccess = (feature: string) => {
    if (!userProfile) return false;

    const planFeatures = getUserPlanFeatures(userProfile.plan);
    return Boolean((planFeatures as any)[feature]);
  };

  // Get remaining usage
  const getRemainingUsage = (type: "chats" | "tokens" | "storage") => {
    if (!userProfile) return 0;

    const planFeatures = getUserPlanFeatures(userProfile.plan);

    switch (type) {
      case "chats":
        return planFeatures.maxChats > 0
          ? Math.max(0, planFeatures.maxChats - userProfile.monthly_chat_count)
          : Infinity;
      case "tokens":
        return planFeatures.monthlyTokenLimit > 0
          ? Math.max(
              0,
              planFeatures.monthlyTokenLimit - userProfile.monthly_token_usage,
            )
          : Infinity;
      case "storage":
        return planFeatures.storageLimit > 0
          ? Math.max(0, planFeatures.storageLimit - userProfile.storage_used)
          : Infinity;
      default:
        return 0;
    }
  };

  // Check if usage limit is reached
  const checkUsageLimitReached = (type: "chats" | "tokens" | "storage") => {
    if (!userProfile) return false;
    return isUsageLimitReached(userProfile, type);
  };

  const value: AuthContextType = {
    user,
    userProfile,
    isLoading,
    isAuthenticated: !!user,
    signOut,
    refreshProfile,
    updatePlan,
    checkFeatureAccess,
    getRemainingUsage,
    isUsageLimitReached: checkUsageLimitReached,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook for getting user plan information
export function useUserPlan() {
  const { userProfile } = useAuth();

  if (!userProfile) {
    return {
      plan: "FREE" as UserPlan,
      features: getUserPlanFeatures("FREE"),
      isLoading: true,
    };
  }

  return {
    plan: userProfile.plan,
    features: getUserPlanFeatures(userProfile.plan),
    isLoading: false,
  };
}

// Hook for checking if user needs to upgrade
export function useUpgradeCheck() {
  const { userProfile, isUsageLimitReached } = useAuth();

  const needsUpgrade = React.useMemo(() => {
    if (!userProfile || userProfile.plan === "ENTERPRISE") return false;

    return (
      isUsageLimitReached("chats") ||
      isUsageLimitReached("tokens") ||
      isUsageLimitReached("storage")
    );
  }, [userProfile, isUsageLimitReached]);

  const urgency = React.useMemo(() => {
    if (!userProfile) return "low";

    const chatUsage =
      userProfile.monthly_chat_count /
      getUserPlanFeatures(userProfile.plan).maxChats;
    const tokenUsage =
      userProfile.monthly_token_usage /
      getUserPlanFeatures(userProfile.plan).monthlyTokenLimit;

    if (chatUsage >= 0.9 || tokenUsage >= 0.9) return "high";
    if (chatUsage >= 0.7 || tokenUsage >= 0.7) return "medium";
    return "low";
  }, [userProfile]);

  return {
    needsUpgrade,
    urgency,
    plan: userProfile?.plan || "FREE",
  };
}
