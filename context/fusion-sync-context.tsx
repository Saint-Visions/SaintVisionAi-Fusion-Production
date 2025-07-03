"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { useAuth } from "./auth-context";
import { useBuilderFusion } from "../lib/hooks/use-builder-fusion";

// Fusion Sync Event Types
type FusionSyncEvent =
  | "user-plan-changed"
  | "ai-interaction"
  | "usage-updated"
  | "builder-content-changed"
  | "dashboard-action"
  | "preference-changed"
  | "real-time-sync"
  | "contextual-update";

interface SyncPayload {
  type: FusionSyncEvent;
  data: any;
  timestamp: Date;
  userId?: string;
  sessionId: string;
  component: string;
  context?: Record<string, any>;
}

interface FusionSyncState {
  isConnected: boolean;
  lastSync: Date | null;
  syncStatus: "idle" | "syncing" | "error" | "connected";
  contextualData: Record<string, any>;
  activeComponents: Set<string>;
  realtimeEvents: SyncPayload[];
  syncMetrics: {
    totalSyncs: number;
    errorCount: number;
    averageLatency: number;
  };
}

interface FusionSyncContextType {
  // State
  syncState: FusionSyncState;

  // Core Sync Functions
  broadcastEvent: (
    event: FusionSyncEvent,
    data: any,
    component: string,
    context?: Record<string, any>,
  ) => void;
  subscribeToEvents: (
    eventTypes: FusionSyncEvent[],
    callback: (payload: SyncPayload) => void,
  ) => () => void;

  // Contextual Data Management
  setContextualData: (key: string, value: any, persist?: boolean) => void;
  getContextualData: (key: string) => any;
  syncContextualData: (data: Record<string, any>) => void;

  // Component Registration
  registerComponent: (componentName: string) => void;
  unregisterComponent: (componentName: string) => void;

  // Real-time Features
  initializeRealTimeSync: () => void;
  forceSync: () => Promise<void>;

  // Builder.io Integration
  syncBuilderContent: (model: string, content: any) => void;

  // AI Context Sync
  syncAIContext: (conversationId: string, context: any) => void;

  // Performance & Metrics
  getSyncMetrics: () => typeof syncState.syncMetrics;
  clearSyncHistory: () => void;
}

const FusionSyncContext = createContext<FusionSyncContextType | undefined>(
  undefined,
);

// Session ID generation
const generateSessionId = () => {
  return `fusion_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export function FusionSyncProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userProfile, isAuthenticated } = useAuth();
  const [syncState, setSyncState] = useState<FusionSyncState>({
    isConnected: false,
    lastSync: null,
    syncStatus: "idle",
    contextualData: {},
    activeComponents: new Set(),
    realtimeEvents: [],
    syncMetrics: {
      totalSyncs: 0,
      errorCount: 0,
      averageLatency: 0,
    },
  });

  const sessionId = useRef(generateSessionId());
  const eventListeners = useRef<Map<string, (payload: SyncPayload) => void>>(
    new Map(),
  );
  const syncQueue = useRef<SyncPayload[]>([]);
  const latencyTracker = useRef<number[]>([]);

  // WebSocket or EventSource for real-time sync (simulated)
  const wsRef = useRef<WebSocket | null>(null);
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Fusion Sync System
  useEffect(() => {
    if (isAuthenticated && userProfile) {
      initializeFusionSync();
    }

    return () => {
      cleanup();
    };
  }, [isAuthenticated, userProfile]);

  const initializeFusionSync = useCallback(() => {
    setSyncState((prev) => ({
      ...prev,
      syncStatus: "connecting",
      isConnected: false,
    }));

    // Simulate WebSocket connection (in production, use real WebSocket)
    setTimeout(() => {
      setSyncState((prev) => ({
        ...prev,
        isConnected: true,
        syncStatus: "connected",
        lastSync: new Date(),
      }));

      // Start real-time sync interval
      startRealTimeSync();

      // Broadcast initial connection event
      broadcastEvent(
        "real-time-sync",
        {
          action: "connected",
          userId: userProfile?.id,
          plan: userProfile?.plan,
        },
        "fusion-sync-provider",
      );
    }, 1000);
  }, [userProfile]);

  const startRealTimeSync = useCallback(() => {
    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current);
    }

    syncIntervalRef.current = setInterval(() => {
      processSyncQueue();
      performContextualSync();
    }, 2000); // Sync every 2 seconds
  }, []);

  const processSyncQueue = useCallback(() => {
    if (syncQueue.current.length === 0) return;

    const startTime = Date.now();
    const queueToProcess = [...syncQueue.current];
    syncQueue.current = [];

    // Process each sync event
    queueToProcess.forEach((payload) => {
      // Broadcast to all registered listeners
      eventListeners.current.forEach((callback) => {
        try {
          callback(payload);
        } catch (error) {
          console.error("Fusion Sync listener error:", error);
          setSyncState((prev) => ({
            ...prev,
            syncMetrics: {
              ...prev.syncMetrics,
              errorCount: prev.syncMetrics.errorCount + 1,
            },
          }));
        }
      });
    });

    // Update metrics
    const latency = Date.now() - startTime;
    latencyTracker.current.push(latency);
    if (latencyTracker.current.length > 100) {
      latencyTracker.current = latencyTracker.current.slice(-50);
    }

    setSyncState((prev) => ({
      ...prev,
      lastSync: new Date(),
      syncMetrics: {
        totalSyncs: prev.syncMetrics.totalSyncs + queueToProcess.length,
        errorCount: prev.syncMetrics.errorCount,
        averageLatency:
          latencyTracker.current.reduce((a, b) => a + b, 0) /
          latencyTracker.current.length,
      },
      realtimeEvents: [...queueToProcess, ...prev.realtimeEvents].slice(0, 50), // Keep last 50 events
    }));
  }, []);

  const performContextualSync = useCallback(() => {
    // Sync contextual data based on current state
    const contextUpdate = {
      userPlan: userProfile?.plan,
      activeComponents: Array.from(syncState.activeComponents),
      timestamp: new Date(),
      sessionDuration: Date.now() - parseInt(sessionId.current.split("_")[1]),
      syncMetrics: syncState.syncMetrics,
    };

    broadcastEvent("contextual-update", contextUpdate, "fusion-sync-provider");
  }, [userProfile, syncState.activeComponents, syncState.syncMetrics]);

  const broadcastEvent = useCallback(
    (
      event: FusionSyncEvent,
      data: any,
      component: string,
      context?: Record<string, any>,
    ) => {
      const payload: SyncPayload = {
        type: event,
        data,
        timestamp: new Date(),
        userId: userProfile?.id,
        sessionId: sessionId.current,
        component,
        context: {
          ...context,
          userPlan: userProfile?.plan,
          isAuthenticated,
          activeComponents: Array.from(syncState.activeComponents),
        },
      };

      // Add to sync queue
      syncQueue.current.push(payload);

      // Immediate local processing for critical events
      if (["user-plan-changed", "builder-content-changed"].includes(event)) {
        processSyncQueue();
      }
    },
    [userProfile, isAuthenticated, syncState.activeComponents],
  );

  const subscribeToEvents = useCallback(
    (
      eventTypes: FusionSyncEvent[],
      callback: (payload: SyncPayload) => void,
    ) => {
      const listenerId = `listener_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const wrappedCallback = (payload: SyncPayload) => {
        if (eventTypes.includes(payload.type)) {
          callback(payload);
        }
      };

      eventListeners.current.set(listenerId, wrappedCallback);

      return () => {
        eventListeners.current.delete(listenerId);
      };
    },
    [],
  );

  const setContextualData = useCallback(
    (key: string, value: any, persist = false) => {
      setSyncState((prev) => ({
        ...prev,
        contextualData: {
          ...prev.contextualData,
          [key]: value,
        },
      }));

      if (persist) {
        localStorage.setItem(`fusion_context_${key}`, JSON.stringify(value));
      }

      broadcastEvent(
        "preference-changed",
        { key, value, persist },
        "contextual-data",
      );
    },
    [broadcastEvent],
  );

  const getContextualData = useCallback(
    (key: string) => {
      const memoryValue = syncState.contextualData[key];
      if (memoryValue !== undefined) return memoryValue;

      // Try to get from localStorage
      try {
        const stored = localStorage.getItem(`fusion_context_${key}`);
        return stored ? JSON.parse(stored) : undefined;
      } catch {
        return undefined;
      }
    },
    [syncState.contextualData],
  );

  const syncContextualData = useCallback(
    (data: Record<string, any>) => {
      setSyncState((prev) => ({
        ...prev,
        contextualData: {
          ...prev.contextualData,
          ...data,
        },
      }));

      broadcastEvent("contextual-update", data, "fusion-sync-provider");
    },
    [broadcastEvent],
  );

  const registerComponent = useCallback(
    (componentName: string) => {
      setSyncState((prev) => ({
        ...prev,
        activeComponents: new Set([...prev.activeComponents, componentName]),
      }));

      broadcastEvent(
        "dashboard-action",
        {
          action: "component-registered",
          component: componentName,
        },
        componentName,
      );
    },
    [broadcastEvent],
  );

  const unregisterComponent = useCallback(
    (componentName: string) => {
      setSyncState((prev) => {
        const newComponents = new Set(prev.activeComponents);
        newComponents.delete(componentName);
        return {
          ...prev,
          activeComponents: newComponents,
        };
      });

      broadcastEvent(
        "dashboard-action",
        {
          action: "component-unregistered",
          component: componentName,
        },
        componentName,
      );
    },
    [broadcastEvent],
  );

  const initializeRealTimeSync = useCallback(() => {
    if (!syncState.isConnected) {
      initializeFusionSync();
    }
  }, [syncState.isConnected, initializeFusionSync]);

  const forceSync = useCallback(async () => {
    setSyncState((prev) => ({ ...prev, syncStatus: "syncing" }));

    try {
      // Force process all pending sync events
      processSyncQueue();

      // Perform full contextual sync
      performContextualSync();

      setSyncState((prev) => ({ ...prev, syncStatus: "connected" }));
    } catch (error) {
      console.error("Force sync error:", error);
      setSyncState((prev) => ({
        ...prev,
        syncStatus: "error",
        syncMetrics: {
          ...prev.syncMetrics,
          errorCount: prev.syncMetrics.errorCount + 1,
        },
      }));
    }
  }, [processSyncQueue, performContextualSync]);

  const syncBuilderContent = useCallback(
    (model: string, content: any) => {
      broadcastEvent(
        "builder-content-changed",
        {
          model,
          content,
          timestamp: new Date(),
        },
        "builder-io",
      );
    },
    [broadcastEvent],
  );

  const syncAIContext = useCallback(
    (conversationId: string, context: any) => {
      broadcastEvent(
        "ai-interaction",
        {
          conversationId,
          context,
          userPlan: userProfile?.plan,
          timestamp: new Date(),
        },
        "ai-assistant",
      );
    },
    [broadcastEvent, userProfile],
  );

  const getSyncMetrics = useCallback(() => {
    return syncState.syncMetrics;
  }, [syncState.syncMetrics]);

  const clearSyncHistory = useCallback(() => {
    setSyncState((prev) => ({
      ...prev,
      realtimeEvents: [],
      syncMetrics: {
        totalSyncs: 0,
        errorCount: 0,
        averageLatency: 0,
      },
    }));
    latencyTracker.current = [];
  }, []);

  const cleanup = useCallback(() => {
    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
    }
    eventListeners.current.clear();
    syncQueue.current = [];
  }, []);

  // Sync user plan changes
  useEffect(() => {
    if (userProfile?.plan) {
      broadcastEvent(
        "user-plan-changed",
        {
          newPlan: userProfile.plan,
          userId: userProfile.id,
          timestamp: new Date(),
        },
        "auth-provider",
      );
    }
  }, [userProfile?.plan, broadcastEvent]);

  const contextValue: FusionSyncContextType = {
    syncState,
    broadcastEvent,
    subscribeToEvents,
    setContextualData,
    getContextualData,
    syncContextualData,
    registerComponent,
    unregisterComponent,
    initializeRealTimeSync,
    forceSync,
    syncBuilderContent,
    syncAIContext,
    getSyncMetrics,
    clearSyncHistory,
  };

  return (
    <FusionSyncContext.Provider value={contextValue}>
      {children}
    </FusionSyncContext.Provider>
  );
}

// Hook to use Fusion Sync
export function useFusionSync() {
  const context = useContext(FusionSyncContext);
  if (context === undefined) {
    throw new Error("useFusionSync must be used within a FusionSyncProvider");
  }
  return context;
}

// Specialized hooks for different sync scenarios

// Real-time AI context synchronization
export function useAIContextSync(conversationId?: string) {
  const { syncAIContext, subscribeToEvents } = useFusionSync();
  const [aiContext, setAiContext] = useState<any>(null);

  useEffect(() => {
    if (!conversationId) return;

    const unsubscribe = subscribeToEvents(["ai-interaction"], (payload) => {
      if (payload.data.conversationId === conversationId) {
        setAiContext(payload.data.context);
      }
    });

    return unsubscribe;
  }, [conversationId, subscribeToEvents]);

  const updateAIContext = useCallback(
    (context: any) => {
      if (conversationId) {
        syncAIContext(conversationId, context);
        setAiContext(context);
      }
    },
    [conversationId, syncAIContext],
  );

  return { aiContext, updateAIContext };
}

// Real-time user preference synchronization
export function usePreferenceSync() {
  const { setContextualData, getContextualData, subscribeToEvents } =
    useFusionSync();
  const [preferences, setPreferences] = useState<Record<string, any>>({});

  useEffect(() => {
    const unsubscribe = subscribeToEvents(["preference-changed"], (payload) => {
      setPreferences((prev) => ({
        ...prev,
        [payload.data.key]: payload.data.value,
      }));
    });

    return unsubscribe;
  }, [subscribeToEvents]);

  const setPreference = useCallback(
    (key: string, value: any, persist = true) => {
      setContextualData(key, value, persist);
      setPreferences((prev) => ({ ...prev, [key]: value }));
    },
    [setContextualData],
  );

  const getPreference = useCallback(
    (key: string) => {
      return preferences[key] ?? getContextualData(key);
    },
    [preferences, getContextualData],
  );

  return { preferences, setPreference, getPreference };
}

// Component lifecycle sync
export function useComponentSync(componentName: string) {
  const { registerComponent, unregisterComponent, broadcastEvent } =
    useFusionSync();

  useEffect(() => {
    registerComponent(componentName);
    return () => unregisterComponent(componentName);
  }, [componentName, registerComponent, unregisterComponent]);

  const logAction = useCallback(
    (action: string, data?: any) => {
      broadcastEvent(
        "dashboard-action",
        {
          action,
          component: componentName,
          data,
          timestamp: new Date(),
        },
        componentName,
      );
    },
    [broadcastEvent, componentName],
  );

  return { logAction };
}

export default FusionSyncProvider;
