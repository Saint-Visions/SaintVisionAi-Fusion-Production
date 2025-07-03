"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Target,
  Brain,
  MessageSquare,
  Users,
  Award,
  Activity,
  BarChart3,
  Zap,
  Clock,
  Star,
  ArrowUp,
  ArrowDown,
  Eye,
  Mouse,
  Search,
  Bot,
  Crown,
  Gift,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/auth-context";
import { useFusionSync } from "@/context/fusion-sync-context";
import { SaintSalFounderAvatar } from "../branding/saintsol-headshot";
import "./scoring-dashboard.css";

interface BehaviorMetric {
  id: string;
  name: string;
  value: number;
  maxValue: number;
  weight: number;
  icon: React.ReactNode;
  color: string;
  trend: "up" | "down" | "stable";
  trendValue: number;
}

interface QueryMetric {
  type: string;
  count: number;
  quality: number;
  complexity: number;
  successRate: number;
  avgResponseTime: number;
}

interface PartnerScore {
  overall: number;
  behavior: number;
  queries: number;
  engagement: number;
  retention: number;
  tier: "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond";
  rank: number;
  percentile: number;
}

export const ScoringDashboard = () => {
  const { userProfile } = useAuth();
  const { broadcastEvent } = useFusionSync();
  const [selectedTimeframe, setSelectedTimeframe] = useState<
    "7d" | "30d" | "90d"
  >("30d");
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Mock data - replace with real PartnerTech.ai API calls
  const [partnerScore, setPartnerScore] = useState<PartnerScore>({
    overall: 847,
    behavior: 892,
    queries: 756,
    engagement: 934,
    retention: 823,
    tier: "Gold",
    rank: 1247,
    percentile: 78,
  });

  const [behaviorMetrics, setBehaviorMetrics] = useState<BehaviorMetric[]>([
    {
      id: "session_duration",
      name: "Session Duration",
      value: 24.5,
      maxValue: 60,
      weight: 0.2,
      icon: <Clock className="w-4 h-4" />,
      color: "#3b82f6",
      trend: "up",
      trendValue: 12,
    },
    {
      id: "feature_usage",
      name: "Feature Usage",
      value: 78,
      maxValue: 100,
      weight: 0.25,
      icon: <Activity className="w-4 h-4" />,
      color: "#10b981",
      trend: "up",
      trendValue: 8,
    },
    {
      id: "interaction_depth",
      name: "Interaction Depth",
      value: 67,
      maxValue: 100,
      weight: 0.15,
      icon: <Mouse className="w-4 h-4" />,
      color: "#8b5cf6",
      trend: "stable",
      trendValue: 0,
    },
    {
      id: "return_frequency",
      name: "Return Frequency",
      value: 89,
      maxValue: 100,
      weight: 0.3,
      icon: <TrendingUp className="w-4 h-4" />,
      color: "#f59e0b",
      trend: "up",
      trendValue: 15,
    },
    {
      id: "help_engagement",
      name: "Help Engagement",
      value: 45,
      maxValue: 100,
      weight: 0.1,
      icon: <Eye className="w-4 h-4" />,
      color: "#ef4444",
      trend: "down",
      trendValue: -5,
    },
  ]);

  const [queryMetrics, setQueryMetrics] = useState<QueryMetric[]>([
    {
      type: "AI Chat",
      count: 156,
      quality: 8.4,
      complexity: 7.2,
      successRate: 94,
      avgResponseTime: 2.3,
    },
    {
      type: "Search",
      count: 89,
      quality: 7.8,
      complexity: 5.6,
      successRate: 87,
      avgResponseTime: 1.1,
    },
    {
      type: "Voice",
      count: 23,
      quality: 9.1,
      complexity: 8.9,
      successRate: 96,
      avgResponseTime: 3.7,
    },
  ]);

  // Calculate weighted behavior score
  const calculateBehaviorScore = () => {
    return behaviorMetrics.reduce((total, metric) => {
      const normalizedValue = (metric.value / metric.maxValue) * 100;
      return total + normalizedValue * metric.weight;
    }, 0);
  };

  // Calculate query score based on metrics
  const calculateQueryScore = () => {
    const totalQueries = queryMetrics.reduce((sum, q) => sum + q.count, 0);
    const weightedScore = queryMetrics.reduce((total, query) => {
      const weight = query.count / totalQueries;
      const score =
        query.quality * 0.3 + query.complexity * 0.2 + query.successRate * 0.5;
      return total + score * weight;
    }, 0);
    return Math.round(weightedScore * 10); // Scale to 0-1000
  };

  // Get tier color and icon
  const getTierDisplay = (tier: string) => {
    const tiers = {
      Bronze: { color: "#cd7f32", icon: <Award className="w-5 h-5" /> },
      Silver: { color: "#c0c0c0", icon: <Star className="w-5 h-5" /> },
      Gold: { color: "#ffd700", icon: <Crown className="w-5 h-5" /> },
      Platinum: { color: "#e5e4e2", icon: <Crown className="w-5 h-5" /> },
      Diamond: { color: "#b9f2ff", icon: <Gift className="w-5 h-5" /> },
    };
    return tiers[tier as keyof typeof tiers] || tiers.Bronze;
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate behavior metric updates
      setBehaviorMetrics((prev) =>
        prev.map((metric) => ({
          ...metric,
          value: Math.min(
            metric.maxValue,
            metric.value + (Math.random() - 0.5) * 2,
          ),
        })),
      );

      // Broadcast scoring event
      broadcastEvent(
        "partner-score-updated",
        {
          score: partnerScore.overall,
          timestamp: new Date(),
        },
        "scoring-dashboard",
      );
    }, 10000);

    return () => clearInterval(interval);
  }, [broadcastEvent, partnerScore.overall]);

  const refreshData = async () => {
    setIsLoading(true);
    // Simulate API call to PartnerTech.ai
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Update scores with fresh data
    setPartnerScore((prev) => ({
      ...prev,
      overall: Math.round(prev.overall + (Math.random() - 0.5) * 20),
      behavior: calculateBehaviorScore(),
      queries: calculateQueryScore(),
    }));

    setIsLoading(false);
  };

  const tierDisplay = getTierDisplay(partnerScore.tier);

  return (
    <div className="scoring-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="title-section">
            <div className="flex gap-4 items-center mb-2">
              <SaintSalFounderAvatar
                size="lg"
                status="online"
                animated={true}
              />
              <div>
                <h2 className="dashboard-title">
                  <Target className="w-6 h-6" />
                  PartnerTech.ai Scoring
                </h2>
                <p className="dashboard-subtitle">
                  Behavior and query-based performance insights
                </p>
              </div>
            </div>
          </div>

          <div className="header-controls">
            <div className="timeframe-selector">
              {[
                { key: "7d", label: "7 Days" },
                { key: "30d", label: "30 Days" },
                { key: "90d", label: "90 Days" },
              ].map((option) => (
                <button
                  key={option.key}
                  className={`timeframe-btn ${selectedTimeframe === option.key ? "active" : ""}`}
                  onClick={() => setSelectedTimeframe(option.key as any)}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <button
              className="refresh-btn"
              onClick={refreshData}
              disabled={isLoading}
            >
              <TrendingUp
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overall Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="overall-score-card"
      >
        <div className="score-visual">
          <div className="score-circle">
            <svg viewBox="0 0 120 120" className="score-svg">
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="8"
              />
              <motion.circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="url(#scoreGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={314}
                initial={{ strokeDashoffset: 314 }}
                animate={{
                  strokeDashoffset: 314 - (partnerScore.overall / 1000) * 314,
                }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
              <defs>
                <linearGradient
                  id="scoreGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="50%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>
            <div className="score-text">
              <div className="score-number">{partnerScore.overall}</div>
              <div className="score-label">Overall Score</div>
            </div>
          </div>
        </div>

        <div className="score-details">
          <div className="tier-display">
            <div className="tier-icon" style={{ color: tierDisplay.color }}>
              {tierDisplay.icon}
            </div>
            <div className="tier-info">
              <h3 className="tier-name" style={{ color: tierDisplay.color }}>
                {partnerScore.tier} Tier
              </h3>
              <p className="tier-description">
                Rank #{partnerScore.rank.toLocaleString()} • Top{" "}
                {partnerScore.percentile}%
              </p>
            </div>
          </div>

          <div className="score-breakdown">
            <div className="breakdown-item">
              <span className="breakdown-label">Behavior</span>
              <span className="breakdown-value">{partnerScore.behavior}</span>
            </div>
            <div className="breakdown-item">
              <span className="breakdown-label">Queries</span>
              <span className="breakdown-value">{partnerScore.queries}</span>
            </div>
            <div className="breakdown-item">
              <span className="breakdown-label">Engagement</span>
              <span className="breakdown-value">{partnerScore.engagement}</span>
            </div>
            <div className="breakdown-item">
              <span className="breakdown-label">Retention</span>
              <span className="breakdown-value">{partnerScore.retention}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        {/* Behavior Metrics */}
        <div className="metric-section">
          <div className="section-header">
            <h3 className="section-title">
              <Activity className="w-5 h-5" />
              Behavior Metrics
            </h3>
            <div className="section-score">
              Score: {Math.round(calculateBehaviorScore())}
            </div>
          </div>

          <div className="behavior-metrics">
            {behaviorMetrics.map((metric, index) => (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="behavior-metric"
              >
                <div className="metric-header">
                  <div className="metric-icon" style={{ color: metric.color }}>
                    {metric.icon}
                  </div>
                  <div className="metric-info">
                    <h4 className="metric-name">{metric.name}</h4>
                    <div className="metric-trend">
                      {metric.trend === "up" && (
                        <ArrowUp className="w-3 h-3 text-green-400" />
                      )}
                      {metric.trend === "down" && (
                        <ArrowDown className="w-3 h-3 text-red-400" />
                      )}
                      {metric.trend !== "stable" && (
                        <span
                          className={
                            metric.trend === "up"
                              ? "text-green-400"
                              : "text-red-400"
                          }
                        >
                          {Math.abs(metric.trendValue)}%
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="metric-value">
                    {metric.name.includes("Duration")
                      ? `${metric.value}m`
                      : `${Math.round(metric.value)}${metric.name.includes("Percentage") ? "%" : ""}`}
                  </div>
                </div>

                <div className="metric-progress">
                  <div className="progress-track">
                    <motion.div
                      className="progress-fill"
                      style={{ backgroundColor: metric.color }}
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(metric.value / metric.maxValue) * 100}%`,
                      }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>
                  <div className="progress-labels">
                    <span>0</span>
                    <span>
                      {metric.maxValue}
                      {metric.name.includes("Duration") ? "m" : ""}
                    </span>
                  </div>
                </div>

                <div className="metric-weight">
                  Weight: {(metric.weight * 100).toFixed(0)}%
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Query Metrics */}
        <div className="metric-section">
          <div className="section-header">
            <h3 className="section-title">
              <Brain className="w-5 h-5" />
              Query Performance
            </h3>
            <div className="section-score">Score: {calculateQueryScore()}</div>
          </div>

          <div className="query-metrics">
            {queryMetrics.map((query, index) => (
              <motion.div
                key={query.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                className="query-metric"
              >
                <div className="query-header">
                  <div className="query-icon">
                    {query.type === "AI Chat" && <Bot className="w-5 h-5" />}
                    {query.type === "Search" && <Search className="w-5 h-5" />}
                    {query.type === "Voice" && (
                      <MessageSquare className="w-5 h-5" />
                    )}
                  </div>
                  <div className="query-info">
                    <h4 className="query-type">{query.type}</h4>
                    <p className="query-count">{query.count} queries</p>
                  </div>
                </div>

                <div className="query-stats">
                  <div className="stat-item">
                    <span className="stat-label">Quality</span>
                    <span className="stat-value">{query.quality}/10</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Complexity</span>
                    <span className="stat-value">{query.complexity}/10</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Success Rate</span>
                    <span className="stat-value">{query.successRate}%</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Avg Response</span>
                    <span className="stat-value">{query.avgResponseTime}s</span>
                  </div>
                </div>

                <div className="query-score">
                  <span className="score-label">Quality Score:</span>
                  <span className="score-number">
                    {Math.round(
                      (query.quality * 0.3 +
                        query.complexity * 0.2 +
                        query.successRate * 0.5) *
                        10,
                    )}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights & Recommendations */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="insights-section"
      >
        <div className="section-header">
          <h3 className="section-title">
            <Zap className="w-5 h-5" />
            AI Insights & Recommendations
          </h3>
          <button
            className="details-toggle"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? "Hide Details" : "Show Details"}
          </button>
        </div>

        <div className="insights-grid">
          <div className="insight-card positive">
            <div className="insight-icon">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="insight-content">
              <h4 className="insight-title">Strong Engagement Growth</h4>
              <p className="insight-description">
                Your return frequency has increased 15% this month, indicating
                strong user retention.
              </p>
              <div className="flex gap-2 items-center mt-2">
                <button className="px-2 py-1 bg-green-100 hover:bg-green-200 border border-green-300 rounded text-green-600 text-xs font-medium transition-colors">
                  View Details
                </button>
                <button className="px-2 py-1 bg-blue-100 hover:bg-blue-200 border border-blue-300 rounded text-blue-600 text-xs font-medium transition-colors">
                  Share
                </button>
              </div>
            </div>
          </div>

          <div className="insight-card warning">
            <div className="insight-icon">
              <Target className="w-5 h-5" />
            </div>
            <div className="insight-content">
              <h4 className="insight-title">Improve Help Engagement</h4>
              <p className="insight-description">
                Consider exploring more help features to boost your help
                engagement score by 10-15 points.
              </p>
            </div>
          </div>

          <div className="insight-card info">
            <div className="insight-icon">
              <Brain className="w-5 h-5" />
            </div>
            <div className="insight-content">
              <h4 className="insight-title">Query Complexity Opportunity</h4>
              <p className="insight-description">
                Try more advanced AI features to increase your query complexity
                and overall score.
              </p>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="detailed-insights"
            >
              <div className="detailed-grid">
                <div className="detail-section">
                  <h4 className="detail-title">Scoring Algorithm</h4>
                  <ul className="detail-list">
                    <li>
                      Behavior metrics weighted by importance (20-30% each)
                    </li>
                    <li>
                      Query quality combines complexity, success rate, and user
                      satisfaction
                    </li>
                    <li>
                      Real-time updates every 10 minutes during active sessions
                    </li>
                    <li>
                      Historical trending analysis over selected timeframe
                    </li>
                  </ul>
                </div>

                <div className="detail-section">
                  <h4 className="detail-title">Next Tier Requirements</h4>
                  <ul className="detail-list">
                    <li>
                      Overall score: 900+ points (current:{" "}
                      {partnerScore.overall})
                    </li>
                    <li>Improve help engagement to 60+ points</li>
                    <li>Maintain 95%+ query success rate</li>
                    <li>Increase session duration to 30+ minutes</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Progress Indicator */}
      <div className="progress-indicator">
        <div className="progress-header">
          <span className="progress-title">Progress to Platinum Tier</span>
          <span className="progress-percentage">
            {Math.round((partnerScore.overall / 900) * 100)}%
          </span>
        </div>
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{
              width: `${Math.min((partnerScore.overall / 900) * 100, 100)}%`,
            }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
        </div>
        <div className="progress-milestones">
          <div className="milestone bronze">Bronze</div>
          <div className="milestone silver">Silver</div>
          <div className="milestone gold active">Gold</div>
          <div className="milestone platinum">Platinum</div>
          <div className="milestone diamond">Diamond</div>
        </div>
      </div>
    </div>
  );
};
