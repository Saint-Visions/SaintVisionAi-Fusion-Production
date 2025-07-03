"use client";

import React, { useState, useEffect } from "react";
import {
  Activity,
  Wifi,
  WifiOff,
  Zap,
  Users,
  Database,
  Clock,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  BarChart3,
  Layers,
} from "@tabler/icons-react";
import { useFusionSync } from "../../context/fusion-sync-context";
import { motion, AnimatePresence } from "framer-motion";

interface SyncDashboardProps {
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
  showAdvanced?: boolean;
}

export const SyncDashboard = ({
  isMinimized = false,
  onToggleMinimize,
  showAdvanced = false,
}: SyncDashboardProps) => {
  const {
    syncState,
    forceSync,
    getSyncMetrics,
    clearSyncHistory,
    subscribeToEvents,
  } = useFusionSync();

  const [realtimeEvents, setRealtimeEvents] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToEvents(
      [
        "user-plan-changed",
        "ai-interaction",
        "usage-updated",
        "builder-content-changed",
        "dashboard-action",
        "preference-changed",
        "real-time-sync",
        "contextual-update",
      ],
      (payload) => {
        setRealtimeEvents((prev) => [payload, ...prev.slice(0, 19)]); // Keep last 20 events
      },
    );

    return unsubscribe;
  }, [subscribeToEvents]);

  const handleForceSync = async () => {
    setIsRefreshing(true);
    try {
      await forceSync();
    } finally {
      setIsRefreshing(false);
    }
  };

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

  const getStatusIcon = () => {
    switch (syncState.syncStatus) {
      case "connected":
        return <Wifi className="w-4 h-4" style={{ color: getStatusColor() }} />;
      case "syncing":
        return (
          <RefreshCw
            className="w-4 h-4 animate-spin"
            style={{ color: getStatusColor() }}
          />
        );
      case "error":
        return (
          <WifiOff className="w-4 h-4" style={{ color: getStatusColor() }} />
        );
      default:
        return (
          <AlertCircle
            className="w-4 h-4"
            style={{ color: getStatusColor() }}
          />
        );
    }
  };

  if (isMinimized) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="sync-dashboard-minimized"
        onClick={onToggleMinimize}
      >
        <div className="minimized-content">
          {getStatusIcon()}
          <span className="minimized-status">{syncState.syncStatus}</span>
          <div className="pulse-indicator" />
        </div>

        <style jsx>{`
          .sync-dashboard-minimized {
            position: fixed;
            bottom: 80px;
            right: 20px;
            background: rgba(24, 24, 27, 0.95);
            border: 1px solid rgba(253, 255, 220, 0.2);
            border-radius: 25px;
            padding: 8px 16px;
            cursor: pointer;
            z-index: 999;
            backdrop-filter: blur(8px);
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s ease;
          }

          .sync-dashboard-minimized:hover {
            border-color: rgba(253, 255, 220, 0.4);
            transform: translateY(-2px);
          }

          .minimized-content {
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .minimized-status {
            color: #fdffdc;
            font-size: 12px;
            font-weight: 500;
            text-transform: capitalize;
          }

          .pulse-indicator {
            width: 6px;
            height: 6px;
            background: ${getStatusColor()};
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
        `}</style>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sync-dashboard"
    >
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <div className="status-indicator">
            {getStatusIcon()}
            <span className="status-text">{syncState.syncStatus}</span>
          </div>
          <h3 className="dashboard-title">Fusion Sync</h3>
        </div>
        <div className="header-actions">
          <button
            onClick={handleForceSync}
            disabled={isRefreshing}
            className="action-btn"
            title="Force Sync"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </button>
          {onToggleMinimize && (
            <button
              onClick={onToggleMinimize}
              className="action-btn"
              title="Minimize"
            >
              <Layers className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">
            <Activity className="w-5 h-5 text-blue-400" />
          </div>
          <div className="metric-content">
            <div className="metric-value">
              {syncState.syncMetrics.totalSyncs}
            </div>
            <div className="metric-label">Total Syncs</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <Users className="w-5 h-5 text-green-400" />
          </div>
          <div className="metric-content">
            <div className="metric-value">
              {syncState.activeComponents.size}
            </div>
            <div className="metric-label">Active Components</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <Clock className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="metric-content">
            <div className="metric-value">
              {Math.round(syncState.syncMetrics.averageLatency)}ms
            </div>
            <div className="metric-label">Avg Latency</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            {syncState.syncMetrics.errorCount > 0 ? (
              <AlertCircle className="w-5 h-5 text-red-400" />
            ) : (
              <CheckCircle className="w-5 h-5 text-green-400" />
            )}
          </div>
          <div className="metric-content">
            <div className="metric-value">
              {syncState.syncMetrics.errorCount}
            </div>
            <div className="metric-label">Errors</div>
          </div>
        </div>
      </div>

      {/* Active Components */}
      <div className="active-components">
        <div className="section-header">
          <h4 className="section-title">Active Components</h4>
          <span className="component-count">
            {syncState.activeComponents.size}
          </span>
        </div>
        <div className="components-list">
          {Array.from(syncState.activeComponents).map((component) => (
            <div key={component} className="component-item">
              <div className="component-dot" />
              <span className="component-name">{component}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Real-time Events */}
      <div className="realtime-events">
        <div className="section-header">
          <h4 className="section-title">Real-time Events</h4>
          <button
            onClick={clearSyncHistory}
            className="clear-btn"
            title="Clear History"
          >
            Clear
          </button>
        </div>
        <div className="events-list">
          <AnimatePresence>
            {realtimeEvents.slice(0, 10).map((event, index) => (
              <motion.div
                key={`${event.timestamp}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="event-item"
              >
                <div className="event-icon">{getEventIcon(event.type)}</div>
                <div className="event-content">
                  <div className="event-type">{event.type}</div>
                  <div className="event-component">{event.component}</div>
                  <div className="event-time">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </div>
                </div>
                <div className="event-status">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {showAdvanced && (
        <div className="advanced-section">
          <div className="section-header">
            <h4 className="section-title">Advanced Diagnostics</h4>
          </div>
          <div className="diagnostics-grid">
            <div className="diagnostic-item">
              <span className="diagnostic-label">Last Sync:</span>
              <span className="diagnostic-value">
                {syncState.lastSync
                  ? new Date(syncState.lastSync).toLocaleTimeString()
                  : "Never"}
              </span>
            </div>
            <div className="diagnostic-item">
              <span className="diagnostic-label">Connection:</span>
              <span className="diagnostic-value">
                {syncState.isConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
            <div className="diagnostic-item">
              <span className="diagnostic-label">Queue Size:</span>
              <span className="diagnostic-value">{realtimeEvents.length}</span>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .sync-dashboard {
          background: linear-gradient(
            135deg,
            rgba(24, 24, 27, 0.95),
            rgba(31, 41, 55, 0.95)
          );
          border: 1px solid rgba(253, 255, 220, 0.2);
          border-radius: 16px;
          padding: 20px;
          backdrop-filter: blur(16px);
          font-family:
            Inter,
            -apple-system,
            Roboto,
            Helvetica,
            sans-serif;
          max-width: 400px;
          width: 100%;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(253, 255, 220, 0.1);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .status-text {
          font-size: 12px;
          color: #a1a1aa;
          text-transform: capitalize;
        }

        .dashboard-title {
          font-size: 18px;
          font-weight: 700;
          color: #fdffdc;
          margin: 0;
        }

        .header-actions {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          padding: 6px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          color: #a1a1aa;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .action-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.2);
          color: #fdffdc;
        }

        .action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 20px;
        }

        .metric-card {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .metric-icon {
          flex-shrink: 0;
        }

        .metric-content {
          flex: 1;
        }

        .metric-value {
          font-size: 16px;
          font-weight: 700;
          color: #fdffdc;
          line-height: 1;
        }

        .metric-label {
          font-size: 11px;
          color: #9ca3af;
          margin-top: 2px;
        }

        .active-components,
        .realtime-events,
        .advanced-section {
          margin-bottom: 20px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .section-title {
          font-size: 14px;
          font-weight: 600;
          color: #fdffdc;
          margin: 0;
        }

        .component-count {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
          font-size: 11px;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .clear-btn {
          background: transparent;
          color: #f59e0b;
          border: 1px solid rgba(245, 158, 11, 0.3);
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .clear-btn:hover {
          background: rgba(245, 158, 11, 0.1);
        }

        .components-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .component-item {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          padding: 4px 8px;
        }

        .component-dot {
          width: 6px;
          height: 6px;
          background: #22c55e;
          border-radius: 50%;
        }

        .component-name {
          font-size: 11px;
          color: #e5e7eb;
        }

        .events-list {
          max-height: 200px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .event-item {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          padding: 8px;
        }

        .event-icon {
          flex-shrink: 0;
        }

        .event-content {
          flex: 1;
          min-width: 0;
        }

        .event-type {
          font-size: 12px;
          font-weight: 500;
          color: #fdffdc;
        }

        .event-component {
          font-size: 10px;
          color: #9ca3af;
        }

        .event-time {
          font-size: 10px;
          color: #6b7280;
        }

        .event-status {
          flex-shrink: 0;
        }

        .diagnostics-grid {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .diagnostic-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .diagnostic-item:last-child {
          border-bottom: none;
        }

        .diagnostic-label {
          font-size: 12px;
          color: #9ca3af;
        }

        .diagnostic-value {
          font-size: 12px;
          color: #fdffdc;
          font-weight: 500;
        }

        /* Scrollbar styling */
        .events-list::-webkit-scrollbar {
          width: 4px;
        }

        .events-list::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
        }

        .events-list::-webkit-scrollbar-thumb {
          background: rgba(253, 255, 220, 0.2);
          border-radius: 2px;
        }
      `}</style>
    </motion.div>
  );
};

// Helper function to get event icons
function getEventIcon(eventType: string) {
  switch (eventType) {
    case "user-plan-changed":
      return <Users className="w-3 h-3 text-blue-400" />;
    case "ai-interaction":
      return <Zap className="w-3 h-3 text-purple-400" />;
    case "builder-content-changed":
      return <Database className="w-3 h-3 text-green-400" />;
    case "dashboard-action":
      return <BarChart3 className="w-3 h-3 text-yellow-400" />;
    case "preference-changed":
      return <Activity className="w-3 h-3 text-orange-400" />;
    default:
      return <CheckCircle className="w-3 h-3 text-gray-400" />;
  }
}

export default SyncDashboard;
