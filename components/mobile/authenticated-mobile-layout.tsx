"use client";

import React, { useState, useEffect } from "react";
import {
  Content,
  fetchOneEntry,
  isPreviewing,
  isEditing,
} from "@builder.io/sdk-react";
import { useAuth, useUserPlan, useUpgradeCheck } from "@/context/auth-context";
import { useBuilderFusion } from "@/lib/hooks/use-builder-fusion";
import { useFusionSync, useComponentSync } from "@/context/fusion-sync-context";
import { MobileDashboard } from "./mobile-dashboard";
import {
  UpgradePromptComponent,
  UpgradeBanner,
  UsageMeter,
} from "../upgrade/upgrade-prompt";
import {
  UserPlan,
  getUserPlanFeatures,
  getUsagePercentage,
} from "@/types/user-plans";
import { SyncDashboard } from "../fusion/sync-dashboard";
import { SyncStatusIndicator } from "../fusion/sync-integration";
import { Settings, Bell, Menu, X, Activity } from "@tabler/icons-react";
import "../../lib/builder/builder-config"; // Ensure components are registered

interface AuthenticatedMobileLayoutProps {
  children?: React.ReactNode;
  showDashboard?: boolean;
  dashboardPosition?: "left" | "right" | "overlay" | "hidden";
  builderModel?: string;
  enableSlots?: boolean;
  className?: string;
  // Builder.io slot configurations
  slots?: {
    header?: string;
    sidebar?: string;
    main?: string;
    footer?: string;
    overlay?: string;
  };
}

export const AuthenticatedMobileLayout = ({
  children,
  showDashboard = true,
  dashboardPosition = "left",
  builderModel = "authenticated-layout",
  enableSlots = true,
  className = "",
  slots = {
    header: "header-slot",
    sidebar: "sidebar-slot",
    main: "main-slot",
    footer: "footer-slot",
    overlay: "overlay-slot",
  },
}: AuthenticatedMobileLayoutProps) => {
  const { user, userProfile, isAuthenticated, isLoading } = useAuth();
  const { plan, features } = useUserPlan();
  const { needsUpgrade, urgency } = useUpgradeCheck();

  // UI State
  const [isUpgradePromptOpen, setIsUpgradePromptOpen] = useState(false);
  const [isDashboardCollapsed, setIsDashboardCollapsed] = useState(false);
  const [showUpgradeBanner, setShowUpgradeBanner] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSyncDashboard, setShowSyncDashboard] = useState(false);
  const [syncDashboardMinimized, setSyncDashboardMinimized] = useState(true);

  // Fusion Sync integration
  const { broadcastEvent, subscribeToEvents } = useFusionSync();
  const { logAction } = useComponentSync("authenticated-mobile-layout");

  // Builder.io Fusion for dynamic content
  const layoutContent = useBuilderFusion({
    apiKey: process.env.NEXT_PUBLIC_BUILDER_API_KEY!,
    model: builderModel,
    urlPath: typeof window !== "undefined" ? window.location.pathname : "/",
    userAttributes: {
      userId: user?.id,
      plan: userProfile?.plan,
      isAuthenticated,
      hasFeatureAccess: features.hasAdvancedFeatures,
    },
    enableSync: true,
    syncInterval: 30000,
  });

  // Slot content fetching
  const slotContents = {
    header: useBuilderFusion({
      apiKey: process.env.NEXT_PUBLIC_BUILDER_API_KEY!,
      model: slots.header || "header-slot",
      userAttributes: { plan, userId: user?.id },
    }),
    sidebar: useBuilderFusion({
      apiKey: process.env.NEXT_PUBLIC_BUILDER_API_KEY!,
      model: slots.sidebar || "sidebar-slot",
      userAttributes: { plan, userId: user?.id },
    }),
    main: useBuilderFusion({
      apiKey: process.env.NEXT_PUBLIC_BUILDER_API_KEY!,
      model: slots.main || "main-slot",
      userAttributes: { plan, userId: user?.id },
    }),
    footer: useBuilderFusion({
      apiKey: process.env.NEXT_PUBLIC_BUILDER_API_KEY!,
      model: slots.footer || "footer-slot",
      userAttributes: { plan, userId: user?.id },
    }),
    overlay: useBuilderFusion({
      apiKey: process.env.NEXT_PUBLIC_BUILDER_API_KEY!,
      model: slots.overlay || "overlay-slot",
      userAttributes: { plan, userId: user?.id },
    }),
  };

  // Auto-show upgrade prompts based on usage
  useEffect(() => {
    if (needsUpgrade && urgency === "high" && !showUpgradeBanner) {
      setShowUpgradeBanner(true);
      logAction("upgrade-prompt-triggered", { urgency, plan });
    }
  }, [needsUpgrade, urgency, showUpgradeBanner, logAction, plan]);

  // Fusion Sync: Listen for plan changes and contextual updates
  useEffect(() => {
    const unsubscribe = subscribeToEvents(
      ["user-plan-changed", "contextual-update", "builder-content-changed"],
      (payload) => {
        logAction("fusion-sync-event", {
          eventType: payload.type,
          component: payload.component,
          timestamp: payload.timestamp,
        });

        // Handle plan changes
        if (payload.type === "user-plan-changed") {
          setShowUpgradeBanner(false);
          broadcastEvent(
            "dashboard-action",
            {
              action: "plan-upgrade-completed",
              newPlan: payload.data.newPlan,
              layoutComponent: "authenticated-mobile-layout",
            },
            "authenticated-mobile-layout",
          );
        }
      },
    );

    return unsubscribe;
  }, [subscribeToEvents, logAction, broadcastEvent]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#FDFFDC] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#FDFFDC]">Loading...</p>
        </div>
      </div>
    );
  }

  // Unauthenticated state
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-[#FDFFDC] mb-4">
            Authentication Required
          </h1>
          <p className="text-gray-300 mb-6">
            Please sign in to access this area.
          </p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="px-6 py-3 bg-[#FDFFDC] text-black rounded-xl font-semibold hover:bg-[#FDFFDC]/90 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const renderDashboard = () => {
    if (!showDashboard || dashboardPosition === "hidden") return null;

    return (
      <div
        className={`
        dashboard-container
        ${dashboardPosition === "overlay" ? "fixed inset-0 z-40 bg-black/80 backdrop-blur-sm" : ""}
        ${isDashboardCollapsed ? "collapsed" : ""}
      `}
      >
        {dashboardPosition === "overlay" && (
          <div
            className="absolute inset-0 z-10"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
        <div
          className={`
          dashboard-content relative z-20
          ${dashboardPosition === "overlay" ? "flex items-center justify-center" : ""}
        `}
        >
          <MobileDashboard
            userInitials={
              userProfile?.display_name?.substring(0, 2).toUpperCase() || "AP"
            }
            userName={userProfile?.display_name || "Saint Gottaguy"}
            isFreeTier={plan === "FREE"}
            upgradeTitle={
              plan === "FREE"
                ? "Upgrade to PRO"
                : plan === "PRO"
                  ? "Upgrade to Enterprise"
                  : "You're on Enterprise!"
            }
            upgradeDescription={
              plan === "FREE"
                ? "Unlock advanced features and higher limits"
                : plan === "PRO"
                  ? "Get unlimited access and team features"
                  : "You have access to all features"
            }
            upgradeButtonText={
              plan === "FREE"
                ? "Get PRO for $29/month"
                : plan === "PRO"
                  ? "Contact Sales"
                  : "Manage Plan"
            }
          />
        </div>
      </div>
    );
  };

  const renderSlotContent = (slotName: keyof typeof slotContents) => {
    const slotContent = slotContents[slotName];

    if (!enableSlots || !slotContent.shouldShowContent()) return null;

    return (
      <div className={`builder-slot slot-${slotName}`}>
        <Content
          apiKey={process.env.NEXT_PUBLIC_BUILDER_API_KEY!}
          model={slots[slotName] || `${slotName}-slot`}
          content={slotContent.content}
        />
      </div>
    );
  };

  const renderUsageIndicators = () => {
    if (!userProfile || plan === "ENTERPRISE") return null;

    const chatUsage = getUsagePercentage(userProfile, "chats");
    const tokenUsage = getUsagePercentage(userProfile, "tokens");
    const storageUsage = getUsagePercentage(userProfile, "storage");

    return (
      <div className="space-y-3">
        <UsageMeter
          label="Monthly Chats"
          current={userProfile.monthly_chat_count}
          limit={features.maxChats}
          type={
            chatUsage >= 90 ? "danger" : chatUsage >= 70 ? "warning" : "default"
          }
        />
        <UsageMeter
          label="Token Usage"
          current={userProfile.monthly_token_usage}
          limit={features.monthlyTokenLimit}
          type={
            tokenUsage >= 90
              ? "danger"
              : tokenUsage >= 70
                ? "warning"
                : "default"
          }
        />
        <UsageMeter
          label="Storage"
          current={Math.round(userProfile.storage_used * 10) / 10}
          limit={features.storageLimit}
          type={
            storageUsage >= 90
              ? "danger"
              : storageUsage >= 70
                ? "warning"
                : "default"
          }
        />
      </div>
    );
  };

  return (
    <div className={`authenticated-mobile-layout ${className}`}>
      {/* Header Slot */}
      <header className="header-section">
        {renderSlotContent("header")}

        {/* Default header if no Builder.io content */}
        {!slotContents.header.content && (
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-[#FDFFDC] hover:bg-gray-800"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <h1 className="text-xl font-bold text-[#FDFFDC]">
                SaintVisionAi™
              </h1>
              <div className="px-2 py-1 rounded-full bg-[#FDFFDC]/20 text-[#FDFFDC] text-xs font-medium">
                {plan}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <SyncStatusIndicator showDetails={false} />
              <button
                onClick={() => setShowSyncDashboard(!showSyncDashboard)}
                className="p-2 rounded-lg text-gray-400 hover:text-[#FDFFDC] hover:bg-gray-800"
                title="Fusion Sync Dashboard"
              >
                <Activity size={20} />
              </button>
              <button className="p-2 rounded-lg text-gray-400 hover:text-[#FDFFDC] hover:bg-gray-800">
                <Bell size={20} />
              </button>
              <button className="p-2 rounded-lg text-gray-400 hover:text-[#FDFFDC] hover:bg-gray-800">
                <Settings size={20} />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Upgrade Banner */}
      {showUpgradeBanner && needsUpgrade && (
        <div className="p-4">
          <UpgradeBanner
            currentPlan={plan}
            onUpgrade={() => setIsUpgradePromptOpen(true)}
            onDismiss={() => setShowUpgradeBanner(false)}
          />
        </div>
      )}

      {/* Main Layout */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar/Dashboard */}
        <aside
          className={`
          sidebar-section
          ${dashboardPosition === "left" ? "order-1" : "order-3"}
          ${isMobileMenuOpen ? "block" : "hidden lg:block"}
          ${dashboardPosition === "overlay" && isMobileMenuOpen ? "fixed inset-0 z-40" : ""}
        `}
        >
          {renderSlotContent("sidebar")}
          {renderDashboard()}

          {/* Usage indicators in sidebar */}
          {showDashboard && (
            <div className="p-4 space-y-4">
              <h3 className="text-sm font-semibold text-[#FDFFDC] mb-3">
                Usage
              </h3>
              {renderUsageIndicators()}

              {needsUpgrade && (
                <button
                  onClick={() => setIsUpgradePromptOpen(true)}
                  className="w-full py-2 px-4 bg-[#FDFFDC]/10 border border-[#FDFFDC]/30 rounded-lg text-[#FDFFDC] text-sm font-medium hover:bg-[#FDFFDC]/20 transition-colors"
                >
                  Upgrade Plan
                </button>
              )}
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main
          className={`
          main-content flex-1 order-2
          ${showDashboard && dashboardPosition !== "overlay" ? "lg:ml-0" : ""}
        `}
        >
          {renderSlotContent("main")}

          {/* Default main content */}
          {!slotContents.main.content && children && (
            <div className="p-6">{children}</div>
          )}

          {/* Builder.io layout content */}
          {layoutContent.shouldShowContent() && (
            <div className="builder-layout-content">
              <Content
                apiKey={process.env.NEXT_PUBLIC_BUILDER_API_KEY!}
                model={builderModel}
                content={layoutContent.content}
              />
            </div>
          )}
        </main>
      </div>

      {/* Footer Slot */}
      <footer className="footer-section">{renderSlotContent("footer")}</footer>

      {/* Overlay Slot */}
      {renderSlotContent("overlay")}

      {/* Upgrade Prompt Modal */}
      <UpgradePromptComponent
        isOpen={isUpgradePromptOpen}
        onClose={() => setIsUpgradePromptOpen(false)}
        currentPlan={plan}
        urgency={urgency}
        triggerType={needsUpgrade ? "usage-limit" : "proactive"}
      />

      {/* Fusion Sync Dashboard */}
      {showSyncDashboard && (
        <div className="fixed top-20 right-4 z-50">
          <SyncDashboard
            isMinimized={syncDashboardMinimized}
            onToggleMinimize={() =>
              setSyncDashboardMinimized(!syncDashboardMinimized)
            }
            showAdvanced={true}
          />
        </div>
      )}

      {/* Floating Sync Dashboard (when minimized and hidden) */}
      {!showSyncDashboard && (
        <SyncDashboard
          isMinimized={true}
          onToggleMinimize={() => {
            setShowSyncDashboard(true);
            setSyncDashboardMinimized(false);
          }}
        />
      )}

      <style jsx>{`
        .authenticated-mobile-layout {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background: #000;
          color: white;
          font-family:
            Inter,
            -apple-system,
            Roboto,
            Helvetica,
            sans-serif;
        }

        .header-section {
          flex-shrink: 0;
          background: rgba(24, 24, 27, 0.95);
          backdrop-filter: blur(8px);
          border-bottom: 1px solid rgba(253, 255, 220, 0.1);
        }

        .sidebar-section {
          width: 331px;
          background: rgba(9, 9, 11, 0.95);
          backdrop-filter: blur(8px);
          border-right: 1px solid rgba(253, 255, 220, 0.1);
          overflow-y: auto;
          flex-shrink: 0;
        }

        .main-content {
          background: #000;
          overflow-y: auto;
          min-height: 0;
        }

        .footer-section {
          flex-shrink: 0;
          background: rgba(24, 24, 27, 0.95);
          backdrop-filter: blur(8px);
          border-top: 1px solid rgba(253, 255, 220, 0.1);
        }

        .builder-slot {
          width: 100%;
        }

        .dashboard-container.collapsed {
          transform: translateX(-280px);
        }

        /* Mobile Responsive */
        @media (max-width: 1024px) {
          .sidebar-section {
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            z-index: 40;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
          }

          .sidebar-section.block {
            transform: translateX(0);
          }

          .main-content {
            width: 100%;
          }
        }

        /* Plan-specific styling */
        .authenticated-mobile-layout[data-plan="PRO"] {
          --accent-color: #fbbf24;
        }

        .authenticated-mobile-layout[data-plan="ENTERPRISE"] {
          --accent-color: #a855f7;
        }

        .authenticated-mobile-layout[data-plan="FREE"] {
          --accent-color: #fdffdc;
        }

        /* Scrollbar styling */
        .authenticated-mobile-layout * {
          scrollbar-width: thin;
          scrollbar-color: #71717a #18181b;
        }

        .authenticated-mobile-layout *::-webkit-scrollbar {
          width: 6px;
        }

        .authenticated-mobile-layout *::-webkit-scrollbar-track {
          background: #18181b;
        }

        .authenticated-mobile-layout *::-webkit-scrollbar-thumb {
          background-color: #71717a;
          border-radius: 3px;
        }

        .authenticated-mobile-layout *::-webkit-scrollbar-thumb:hover {
          background-color: #a1a1aa;
        }
      `}</style>
    </div>
  );
};

export default AuthenticatedMobileLayout;
