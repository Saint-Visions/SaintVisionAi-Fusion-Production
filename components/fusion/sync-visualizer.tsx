"use client";

import React, { useState, useEffect, useRef } from "react";
import "./sync-visualizer.css";
import {
  Activity,
  Wifi,
  WifiOff,
  Zap,
  Clock,
  Database,
  Users,
  BarChart3,
  Pulse,
  RefreshCw,
  Play,
  Pause,
  Download,
  Settings,
  AlertCircle,
  CheckCircle,
  XCircle,
  TrendingUp,
  Monitor,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { useFusionSync } from "@/context/fusion-sync-context";

interface MetricData {
  timestamp: Date;
  value: number;
  label: string;
}

interface ComponentStatus {
  name: string;
  status: "online" | "offline" | "syncing" | "error";
  lastSync: Date;
  syncCount: number;
}

export const SyncVisualizer = () => {
  const { syncState, broadcastEvent, getSyncMetrics } = useFusionSync();
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<
    "latency" | "throughput" | "errors"
  >("latency");
  const [timeRange, setTimeRange] = useState<"1m" | "5m" | "15m" | "1h">("5m");
  const [chartData, setChartData] = useState<MetricData[]>([]);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  // Mock component statuses (in real implementation, this would come from syncState)
  const [componentStatuses, setComponentStatuses] = useState<ComponentStatus[]>(
    [
      {
        name: "Dashboard",
        status: "online",
        lastSync: new Date(),
        syncCount: 145,
      },
      {
        name: "AI Assistant",
        status: "online",
        lastSync: new Date(),
        syncCount: 89,
      },
      {
        name: "Plan Manager",
        status: "syncing",
        lastSync: new Date(),
        syncCount: 67,
      },
      {
        name: "Builder Content",
        status: "online",
        lastSync: new Date(),
        syncCount: 23,
      },
      {
        name: "Mobile Layout",
        status: "online",
        lastSync: new Date(),
        syncCount: 156,
      },
      {
        name: "Sync Monitor",
        status: "online",
        lastSync: new Date(),
        syncCount: 234,
      },
      {
        name: "Auth Context",
        status: "online",
        lastSync: new Date(),
        syncCount: 45,
      },
    ],
  );

  // Generate mock data for charts
  const generateMockData = (type: string) => {
    const now = new Date();
    const data: MetricData[] = [];
    const points = 20;

    for (let i = points; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 30000); // 30 second intervals
      let value: number;

      switch (type) {
        case "latency":
          value = Math.random() * 50 + 10; // 10-60ms
          break;
        case "throughput":
          value = Math.random() * 200 + 50; // 50-250 events/min
          break;
        case "errors":
          value = Math.random() * 5; // 0-5 errors
          break;
        default:
          value = Math.random() * 100;
      }

      data.push({
        timestamp,
        value,
        label: type,
      });
    }

    return data;
  };

  // Update chart data
  useEffect(() => {
    const updateData = () => {
      if (isLiveMode) {
        setChartData(generateMockData(selectedMetric));
      }
    };

    updateData();
    const interval = setInterval(updateData, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [selectedMetric, isLiveMode]);

  // Trigger demo sync events
  const triggerDemoEvent = (eventType: string) => {
    broadcastEvent(
      "demo-sync-event" as any,
      {
        type: eventType,
        timestamp: new Date(),
        demoMode: true,
      },
      "sync-visualizer",
    );

    // Update component status temporarily
    setComponentStatuses((prev) =>
      prev.map((comp) => ({
        ...comp,
        status: comp.name === "Dashboard" ? "syncing" : comp.status,
        syncCount:
          comp.name === "Dashboard" ? comp.syncCount + 1 : comp.syncCount,
      })),
    );

    setTimeout(() => {
      setComponentStatuses((prev) =>
        prev.map((comp) => ({
          ...comp,
          status: comp.status === "syncing" ? "online" : comp.status,
          lastSync: comp.name === "Dashboard" ? new Date() : comp.lastSync,
        })),
      );
    }, 2000);
  };

  // Export sync data
  const exportSyncData = () => {
    const data = {
      timestamp: new Date().toISOString(),
      syncState,
      componentStatuses,
      chartData,
      metrics: getSyncMetrics(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fusion-sync-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: ComponentStatus["status"]) => {
    switch (status) {
      case "online":
        return "text-green-400";
      case "offline":
        return "text-red-400";
      case "syncing":
        return "text-yellow-400";
      case "error":
        return "text-red-500";
      default:
        return "text-gray-400";
    }
  };

  const getStatusIcon = (status: ComponentStatus["status"]) => {
    switch (status) {
      case "online":
        return <CheckCircle className="w-4 h-4" />;
      case "offline":
        return <XCircle className="w-4 h-4" />;
      case "syncing":
        return <RefreshCw className="w-4 h-4 animate-spin" />;
      case "error":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  return (
    <div className="sync-visualizer">
      {/* Header Controls */}
      <div className="visualizer-header">
        <div className="header-left">
          <div className="connection-status">
            <div
              className={`status-indicator ${syncState.isConnected ? "connected" : "disconnected"}`}
            >
              {syncState.isConnected ? (
                <Wifi className="w-5 h-5 text-green-400" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-400" />
              )}
              <span className="status-text">
                {syncState.isConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
            <div className="sync-status">
              <Pulse className="w-4 h-4 text-blue-400" />
              <span>Status: {syncState.syncStatus}</span>
            </div>
          </div>
        </div>

        <div className="header-right">
          <div className="control-group">
            <button
              className={`control-btn ${isLiveMode ? "active" : ""}`}
              onClick={() => setIsLiveMode(!isLiveMode)}
            >
              {isLiveMode ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Resume</span>
                </>
              )}
            </button>

            <button className="control-btn" onClick={exportSyncData}>
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>

            <button className="control-btn">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics Dashboard */}
      <div className="metrics-dashboard">
        <div className="metric-card latency">
          <div className="metric-header">
            <div className="metric-icon">
              <Clock className="w-5 h-5" />
            </div>
            <div className="metric-info">
              <h4 className="metric-title">Sync Latency</h4>
              <p className="metric-description">Average response time</p>
            </div>
          </div>
          <div className="metric-value">
            <span className="value-number">
              {getSyncMetrics().averageLatency.toFixed(1)}
            </span>
            <span className="value-unit">ms</span>
          </div>
          <div className="metric-trend">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="trend-text">-5% from last hour</span>
          </div>
        </div>

        <div className="metric-card throughput">
          <div className="metric-header">
            <div className="metric-icon">
              <Activity className="w-5 h-5" />
            </div>
            <div className="metric-info">
              <h4 className="metric-title">Event Throughput</h4>
              <p className="metric-description">Events per minute</p>
            </div>
          </div>
          <div className="metric-value">
            <span className="value-number">145</span>
            <span className="value-unit">events/min</span>
          </div>
          <div className="throughput-bar">
            <div className="bar-fill" style={{ width: "73%" }}></div>
          </div>
        </div>

        <div className="metric-card components">
          <div className="metric-header">
            <div className="metric-icon">
              <Users className="w-5 h-5" />
            </div>
            <div className="metric-info">
              <h4 className="metric-title">Active Components</h4>
              <p className="metric-description">Currently synchronized</p>
            </div>
          </div>
          <div className="metric-value">
            <span className="value-number">
              {syncState.activeComponents.size}
            </span>
            <span className="value-unit">online</span>
          </div>
          <div className="component-indicators">
            {componentStatuses.slice(0, 4).map((comp, index) => (
              <div
                key={index}
                className={`component-dot ${comp.status}`}
                title={comp.name}
              ></div>
            ))}
          </div>
        </div>

        <div className="metric-card errors">
          <div className="metric-header">
            <div className="metric-icon">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="metric-info">
              <h4 className="metric-title">Error Rate</h4>
              <p className="metric-description">Sync failures</p>
            </div>
          </div>
          <div className="metric-value">
            <span className="value-number">{getSyncMetrics().errorCount}</span>
            <span className="value-unit">errors</span>
          </div>
          <div className="error-status">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>System healthy</span>
          </div>
        </div>
      </div>

      {/* Real-time Chart */}
      <div className="chart-section">
        <div className="chart-header">
          <div className="chart-title">
            <BarChart3 className="w-5 h-5" />
            <span>Real-time Performance</span>
          </div>

          <div className="chart-controls">
            <div className="metric-selector">
              {[
                {
                  key: "latency",
                  label: "Latency",
                  icon: <Clock className="w-4 h-4" />,
                },
                {
                  key: "throughput",
                  label: "Throughput",
                  icon: <Activity className="w-4 h-4" />,
                },
                {
                  key: "errors",
                  label: "Errors",
                  icon: <AlertCircle className="w-4 h-4" />,
                },
              ].map((metric) => (
                <button
                  key={metric.key}
                  className={`metric-btn ${selectedMetric === metric.key ? "active" : ""}`}
                  onClick={() => setSelectedMetric(metric.key as any)}
                >
                  {metric.icon}
                  <span>{metric.label}</span>
                </button>
              ))}
            </div>

            <div className="time-range-selector">
              {[
                { key: "1m", label: "1m" },
                { key: "5m", label: "5m" },
                { key: "15m", label: "15m" },
                { key: "1h", label: "1h" },
              ].map((range) => (
                <button
                  key={range.key}
                  className={`range-btn ${timeRange === range.key ? "active" : ""}`}
                  onClick={() => setTimeRange(range.key as any)}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="chart-container" ref={chartContainerRef}>
          <div className="chart-area">
            <svg className="chart-svg" viewBox="0 0 800 200">
              {/* Chart Grid */}
              <defs>
                <pattern
                  id="grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="800" height="200" fill="url(#grid)" />

              {/* Chart Line */}
              {chartData.length > 1 && (
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  d={`M ${chartData
                    .map((point, index) => {
                      const x = (index / (chartData.length - 1)) * 800;
                      const y =
                        200 -
                        (point.value /
                          Math.max(...chartData.map((p) => p.value))) *
                          180;
                      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
                    })
                    .join(" ")}`}
                  fill="none"
                  stroke="url(#chartGradient)"
                  strokeWidth="2"
                />
              )}

              {/* Chart Points */}
              {chartData.map((point, index) => {
                const x = (index / (chartData.length - 1)) * 800;
                const y =
                  200 -
                  (point.value / Math.max(...chartData.map((p) => p.value))) *
                    180;

                return (
                  <motion.circle
                    key={index}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    cx={x}
                    cy={y}
                    r="3"
                    fill="#3B82F6"
                    className="chart-point"
                  />
                );
              })}

              {/* Gradient Definition */}
              <defs>
                <linearGradient
                  id="chartGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="50%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-color"></div>
              <span>
                {selectedMetric.charAt(0).toUpperCase() +
                  selectedMetric.slice(1)}
              </span>
            </div>
            {isLiveMode && (
              <div className="live-indicator">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="live-dot"
                ></motion.div>
                <span>Live</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Component Status Grid */}
      <div className="components-section">
        <div className="section-header">
          <h4 className="section-title">Component Status</h4>
          <p className="section-description">
            Real-time status of all synchronized components
          </p>
        </div>

        <div className="components-grid">
          {componentStatuses.map((component, index) => (
            <motion.div
              key={component.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="component-card"
            >
              <div className="component-header">
                <div className="component-name">{component.name}</div>
                <div
                  className={`component-status ${getStatusColor(component.status)}`}
                >
                  {getStatusIcon(component.status)}
                  <span>{component.status}</span>
                </div>
              </div>

              <div className="component-stats">
                <div className="stat-item">
                  <Database className="w-4 h-4" />
                  <span>{component.syncCount} syncs</span>
                </div>
                <div className="stat-item">
                  <Clock className="w-4 h-4" />
                  <span>{component.lastSync.toLocaleTimeString()}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Demo Controls */}
      <div className="demo-controls">
        <div className="controls-header">
          <h4 className="controls-title">Demo Controls</h4>
          <p className="controls-description">
            Trigger sync events to see the system in action
          </p>
        </div>

        <div className="demo-buttons">
          <button
            className="demo-btn"
            onClick={() => triggerDemoEvent("ai-interaction")}
          >
            <Zap className="w-4 h-4" />
            <span>AI Interaction</span>
          </button>

          <button
            className="demo-btn"
            onClick={() => triggerDemoEvent("plan-change")}
          >
            <Users className="w-4 h-4" />
            <span>Plan Change</span>
          </button>

          <button
            className="demo-btn"
            onClick={() => triggerDemoEvent("content-update")}
          >
            <Database className="w-4 h-4" />
            <span>Content Update</span>
          </button>

          <button
            className="demo-btn"
            onClick={() => triggerDemoEvent("bulk-sync")}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Bulk Sync</span>
          </button>
        </div>
      </div>

      {/* Recent Events Stream */}
      <div className="events-stream">
        <div className="stream-header">
          <h4 className="stream-title">Event Stream</h4>
          <div className="stream-controls">
            <button className="stream-btn">
              <Pause className="w-4 h-4" />
            </button>
            <button className="stream-btn">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="events-list">
          <AnimatePresence>
            {syncState.realtimeEvents
              .slice(-5)
              .reverse()
              .map((event, index) => (
                <motion.div
                  key={`${event.timestamp.getTime()}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="event-item"
                >
                  <div className="event-indicator">
                    <div className="event-dot"></div>
                  </div>
                  <div className="event-content">
                    <div className="event-header">
                      <span className="event-type">{event.type}</span>
                      <span className="event-time">
                        {event.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="event-details">
                      <span className="event-component">
                        Component: {event.component}
                      </span>
                      {event.context && (
                        <span className="event-context">
                          {Object.keys(event.context).length} context items
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
