"use client";

import React, { useEffect } from "react";
import {
  useFusionSync,
  useComponentSync,
  usePreferenceSync,
} from "../../context/fusion-sync-context";
import { useAuth } from "../../context/auth-context";

// HOC to add Fusion Sync capabilities to any component
export function withFusionSync<T extends {}>(
  WrappedComponent: React.ComponentType<T>,
  componentName: string,
  syncOptions?: {
    trackActions?: boolean;
    syncPreferences?: boolean;
    realTimeUpdates?: boolean;
  },
) {
  const options = {
    trackActions: true,
    syncPreferences: true,
    realTimeUpdates: true,
    ...syncOptions,
  };

  return function FusionSyncWrapper(props: T) {
    const { logAction } = useComponentSync(componentName);
    const { setPreference, getPreference } = usePreferenceSync();
    const { subscribeToEvents } = useFusionSync();

    // Track component lifecycle
    useEffect(() => {
      if (options.trackActions) {
        logAction("component-mounted");
      }

      return () => {
        if (options.trackActions) {
          logAction("component-unmounted");
        }
      };
    }, [logAction]);

    // Enhanced props with sync capabilities
    const enhancedProps = {
      ...props,
      ...(options.trackActions && {
        onFusionAction: (action: string, data?: any) => logAction(action, data),
      }),
      ...(options.syncPreferences && {
        setPreference,
        getPreference,
      }),
    } as T & {
      onFusionAction?: (action: string, data?: any) => void;
      setPreference?: (key: string, value: any, persist?: boolean) => void;
      getPreference?: (key: string) => any;
    };

    return <WrappedComponent {...enhancedProps} />;
  };
}

// Real-time Builder.io content sync wrapper
export function BuilderContentSync({
  children,
  model,
  onContentChange,
}: {
  children: React.ReactNode;
  model: string;
  onContentChange?: (content: any) => void;
}) {
  const { subscribeToEvents, syncBuilderContent } = useFusionSync();

  useEffect(() => {
    const unsubscribe = subscribeToEvents(
      ["builder-content-changed"],
      (payload) => {
        if (payload.data.model === model) {
          onContentChange?.(payload.data.content);
        }
      },
    );

    return unsubscribe;
  }, [model, onContentChange, subscribeToEvents]);

  return <>{children}</>;
}

// AI Context synchronization wrapper
export function AIContextSync({
  children,
  conversationId,
  onContextUpdate,
}: {
  children: React.ReactNode;
  conversationId?: string;
  onContextUpdate?: (context: any) => void;
}) {
  const { subscribeToEvents } = useFusionSync();

  useEffect(() => {
    if (!conversationId) return;

    const unsubscribe = subscribeToEvents(["ai-interaction"], (payload) => {
      if (payload.data.conversationId === conversationId) {
        onContextUpdate?.(payload.data.context);
      }
    });

    return unsubscribe;
  }, [conversationId, onContextUpdate, subscribeToEvents]);

  return <>{children}</>;
}

// Plan change synchronization
export function PlanSync({
  children,
  onPlanChange,
}: {
  children: React.ReactNode;
  onPlanChange?: (newPlan: string, oldPlan: string) => void;
}) {
  const { subscribeToEvents } = useFusionSync();
  const { userProfile } = useAuth();

  useEffect(() => {
    const unsubscribe = subscribeToEvents(["user-plan-changed"], (payload) => {
      const newPlan = payload.data.newPlan;
      const oldPlan = userProfile?.plan;

      if (oldPlan && newPlan !== oldPlan) {
        onPlanChange?.(newPlan, oldPlan);
      }
    });

    return unsubscribe;
  }, [onPlanChange, subscribeToEvents, userProfile]);

  return <>{children}</>;
}

// Usage tracking sync
export function UsageSync({
  children,
  onUsageUpdate,
}: {
  children: React.ReactNode;
  onUsageUpdate?: (usage: any) => void;
}) {
  const { subscribeToEvents } = useFusionSync();

  useEffect(() => {
    const unsubscribe = subscribeToEvents(["usage-updated"], (payload) => {
      onUsageUpdate?.(payload.data);
    });

    return unsubscribe;
  }, [onUsageUpdate, subscribeToEvents]);

  return <>{children}</>;
}

// Global state synchronization
export function GlobalStateSync({ children }: { children: React.ReactNode }) {
  const { subscribeToEvents, broadcastEvent } = useFusionSync();
  const { userProfile } = useAuth();

  // Sync global state changes
  useEffect(() => {
    const unsubscribe = subscribeToEvents(["contextual-update"], (payload) => {
      // Handle global state updates
      console.log("Global state update:", payload.data);
    });

    return unsubscribe;
  }, [subscribeToEvents]);

  // Broadcast user authentication state changes
  useEffect(() => {
    if (userProfile) {
      broadcastEvent(
        "contextual-update",
        {
          userAuthenticated: true,
          userPlan: userProfile.plan,
          userId: userProfile.id,
        },
        "global-state-sync",
      );
    }
  }, [userProfile, broadcastEvent]);

  return <>{children}</>;
}

// Performance monitoring sync
export function PerformanceSync({
  children,
  componentName,
}: {
  children: React.ReactNode;
  componentName: string;
}) {
  const { broadcastEvent } = useFusionSync();

  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.name.includes(componentName)) {
          broadcastEvent(
            "dashboard-action",
            {
              action: "performance-metric",
              component: componentName,
              metric: {
                name: entry.name,
                duration: entry.duration,
                startTime: entry.startTime,
                type: entry.entryType,
              },
            },
            componentName,
          );
        }
      });
    });

    observer.observe({ entryTypes: ["measure", "navigation"] });

    return () => observer.disconnect();
  }, [componentName, broadcastEvent]);

  return <>{children}</>;
}

// Cross-component communication
export function CrossComponentSync({
  children,
  componentId,
  onMessage,
}: {
  children: React.ReactNode;
  componentId: string;
  onMessage?: (message: any, fromComponent: string) => void;
}) {
  const { subscribeToEvents, broadcastEvent } = useFusionSync();

  useEffect(() => {
    const unsubscribe = subscribeToEvents(["dashboard-action"], (payload) => {
      if (
        payload.data.action === "cross-component-message" &&
        payload.data.targetComponent === componentId
      ) {
        onMessage?.(payload.data.message, payload.component);
      }
    });

    return unsubscribe;
  }, [componentId, onMessage, subscribeToEvents]);

  const sendMessage = (targetComponent: string, message: any) => {
    broadcastEvent(
      "dashboard-action",
      {
        action: "cross-component-message",
        targetComponent,
        message,
        fromComponent: componentId,
      },
      componentId,
    );
  };

  // Provide sendMessage through context or props
  return (
    <div data-component-id={componentId} data-send-message={sendMessage}>
      {children}
    </div>
  );
}

// Fusion Sync status indicator
export function SyncStatusIndicator({
  showDetails = false,
}: {
  showDetails?: boolean;
}) {
  const { syncState } = useFusionSync();

  const getStatusColor = () => {
    switch (syncState.syncStatus) {
      case "connected":
        return "#22C55E";
      case "syncing":
        return "#F59E0B";
      case "error":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  return (
    <div className="sync-status-indicator">
      <div
        className="status-dot"
        style={{ backgroundColor: getStatusColor() }}
      />
      {showDetails && (
        <div className="status-details">
          <span className="status-text">{syncState.syncStatus}</span>
          <span className="sync-count">{syncState.syncMetrics.totalSyncs}</span>
        </div>
      )}

      <style jsx>{`
        .sync-status-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .status-dot {
          width: 8px;
          height: 8px;
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

        .status-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .status-text {
          font-size: 10px;
          color: #a1a1aa;
          text-transform: capitalize;
        }

        .sync-count {
          font-size: 9px;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
}

export default {
  withFusionSync,
  BuilderContentSync,
  AIContextSync,
  PlanSync,
  UsageSync,
  GlobalStateSync,
  PerformanceSync,
  CrossComponentSync,
  SyncStatusIndicator,
};
