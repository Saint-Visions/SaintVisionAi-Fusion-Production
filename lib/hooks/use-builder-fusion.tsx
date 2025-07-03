"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchOneEntry, isPreviewing, isEditing } from "@builder.io/sdk-react";

interface BuilderFusionConfig {
  apiKey: string;
  model: string;
  urlPath?: string;
  userAttributes?: Record<string, any>;
  enableSync?: boolean;
  syncInterval?: number;
}

interface BuilderFusionState {
  content: any;
  isLoading: boolean;
  error: string | null;
  isPreview: boolean;
  isEdit: boolean;
  lastSync: Date | null;
}

export function useBuilderFusion(config: BuilderFusionConfig) {
  const {
    apiKey,
    model,
    urlPath = "/",
    userAttributes = {},
    enableSync = true,
    syncInterval = 30000, // 30 seconds
  } = config;

  const [state, setState] = useState<BuilderFusionState>({
    content: null,
    isLoading: true,
    error: null,
    isPreview: false,
    isEdit: false,
    lastSync: null,
  });

  // Check if we're in preview or edit mode
  const checkPreviewMode = useCallback(() => {
    if (typeof window === "undefined")
      return { isPreview: false, isEdit: false };

    const searchParams = new URLSearchParams(window.location.search);
    return {
      isPreview: isPreviewing(Object.fromEntries(searchParams.entries())),
      isEdit: isEditing(Object.fromEntries(searchParams.entries())),
    };
  }, []);

  // Fetch content from Builder.io
  const fetchContent = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const searchParams =
        typeof window !== "undefined"
          ? Object.fromEntries(
              new URLSearchParams(window.location.search).entries(),
            )
          : {};

      const content = await fetchOneEntry({
        options: searchParams,
        apiKey,
        model,
        userAttributes: {
          urlPath,
          ...userAttributes,
        },
      });

      const { isPreview, isEdit } = checkPreviewMode();

      setState((prev) => ({
        ...prev,
        content,
        isLoading: false,
        isPreview,
        isEdit,
        lastSync: new Date(),
      }));

      return content;
    } catch (error) {
      console.error("Builder.io fetch error:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Unknown error",
        lastSync: new Date(),
      }));
      return null;
    }
  }, [apiKey, model, urlPath, userAttributes, checkPreviewMode]);

  // Sync content periodically
  useEffect(() => {
    let syncInterval_: NodeJS.Timeout;

    const startSync = () => {
      if (enableSync && typeof window !== "undefined") {
        syncInterval_ = setInterval(() => {
          fetchContent();
        }, syncInterval);
      }
    };

    // Initial fetch
    fetchContent().then(() => {
      startSync();
    });

    // Listen for Builder.io events
    const handleBuilderMessage = (event: MessageEvent) => {
      if (event.data?.type === "builder.contentUpdate") {
        fetchContent();
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("message", handleBuilderMessage);

      // Listen for route changes
      window.addEventListener("popstate", fetchContent);
    }

    return () => {
      if (syncInterval_) {
        clearInterval(syncInterval_);
      }
      if (typeof window !== "undefined") {
        window.removeEventListener("message", handleBuilderMessage);
        window.removeEventListener("popstate", fetchContent);
      }
    };
  }, [fetchContent, enableSync, syncInterval]);

  // Manual refresh function
  const refresh = useCallback(() => {
    return fetchContent();
  }, [fetchContent]);

  // Check if content should be shown
  const shouldShowContent = useCallback(() => {
    return state.content || state.isPreview || state.isEdit;
  }, [state.content, state.isPreview, state.isEdit]);

  // Update user attributes dynamically
  const updateUserAttributes = useCallback(
    (newAttributes: Record<string, any>) => {
      userAttributes = { ...userAttributes, ...newAttributes };
      fetchContent();
    },
    [fetchContent],
  );

  return {
    ...state,
    refresh,
    shouldShowContent,
    updateUserAttributes,
    // Helper methods
    canEdit: state.isEdit,
    canPreview: state.isPreview || state.isEdit,
    hasContent: Boolean(state.content),
    // Builder.io specific helpers
    builderApiKey: apiKey,
    builderModel: model,
    builderUrlPath: urlPath,
  };
}

// Hook for managing multiple Builder.io models
export function useMultiBuilderFusion(configs: BuilderFusionConfig[]) {
  const fusionStates = configs.map((config) => useBuilderFusion(config));

  const isLoading = fusionStates.some((state) => state.isLoading);
  const hasErrors = fusionStates.some((state) => state.error !== null);
  const errors = fusionStates.map((state) => state.error).filter(Boolean);

  const refreshAll = useCallback(() => {
    return Promise.all(fusionStates.map((state) => state.refresh()));
  }, [fusionStates]);

  return {
    states: fusionStates,
    isLoading,
    hasErrors,
    errors,
    refreshAll,
    // Get content by model name
    getContentByModel: (model: string) => {
      return fusionStates.find((state) => state.builderModel === model)
        ?.content;
    },
    // Check if any model should show content
    shouldShowAnyContent: () => {
      return fusionStates.some((state) => state.shouldShowContent());
    },
  };
}

// Context for Builder.io Fusion
export const BuilderFusionContext = React.createContext<{
  layouts: any[];
  updateLayout: (id: string, layout: any) => void;
  syncLayouts: () => void;
} | null>(null);

// Provider for Builder.io Fusion state management
export function BuilderFusionProvider({
  children,
  apiKey,
  models = ["page", "layout", "section"],
}: {
  children: React.ReactNode;
  apiKey: string;
  models?: string[];
}) {
  const [layouts, setLayouts] = useState<any[]>([]);

  const configs = models.map((model) => ({
    apiKey,
    model,
    enableSync: true,
  }));

  const { states, refreshAll } = useMultiBuilderFusion(configs);

  const updateLayout = useCallback((id: string, layout: any) => {
    setLayouts((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...layout } : l)),
    );
  }, []);

  const syncLayouts = useCallback(() => {
    refreshAll();
  }, [refreshAll]);

  useEffect(() => {
    // Update layouts when Builder.io content changes
    const layoutContents = states
      .filter((state) => state.builderModel === "layout" && state.content)
      .map((state) => state.content);

    if (layoutContents.length > 0) {
      setLayouts(layoutContents);
    }
  }, [states]);

  const contextValue = {
    layouts,
    updateLayout,
    syncLayouts,
  };

  return (
    <BuilderFusionContext.Provider value={contextValue}>
      {children}
    </BuilderFusionContext.Provider>
  );
}
