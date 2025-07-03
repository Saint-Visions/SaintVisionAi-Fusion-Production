"use client";

import React, { useState, useEffect } from "react";
import {
  Target,
  TrendingUp,
  Award,
  Zap,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/auth-context";
import { useFusionSync } from "@/context/fusion-sync-context";
import "./scoring-widget.css";

interface ScoringWidgetProps {
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  minimizable?: boolean;
  showDetails?: boolean;
  className?: string;
}

interface QuickScore {
  overall: number;
  behavior: number;
  queries: number;
  tier: string;
  rank: number;
  trend: "up" | "down" | "stable";
  trendValue: number;
}

export const ScoringWidget = ({
  position = "top-right",
  minimizable = true,
  showDetails = false,
  className = "",
}: ScoringWidgetProps) => {
  const { userProfile } = useAuth();
  const { broadcastEvent } = useFusionSync();
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [score, setScore] = useState<QuickScore>({
    overall: 847,
    behavior: 892,
    queries: 756,
    tier: "Gold",
    rank: 1247,
    trend: "up",
    trendValue: 12,
  });

  // Simulate real-time score updates
  useEffect(() => {
    const interval = setInterval(() => {
      setScore((prev) => {
        const change = (Math.random() - 0.5) * 10;
        const newScore = Math.max(0, Math.min(1000, prev.overall + change));

        return {
          ...prev,
          overall: Math.round(newScore),
          trend: change > 0 ? "up" : change < 0 ? "down" : "stable",
          trendValue: Math.abs(Math.round(change)),
        };
      });
    }, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, []);

  // Broadcast score updates
  useEffect(() => {
    broadcastEvent(
      "partner-score-widget-update",
      {
        score: score.overall,
        tier: score.tier,
        timestamp: new Date(),
      },
      "scoring-widget",
    );
  }, [score, broadcastEvent]);

  const getTierColor = (tier: string) => {
    const colors = {
      Bronze: "#cd7f32",
      Silver: "#c0c0c0",
      Gold: "#ffd700",
      Platinum: "#e5e4e2",
      Diamond: "#b9f2ff",
    };
    return colors[tier as keyof typeof colors] || "#cd7f32";
  };

  const getScoreColor = (score: number) => {
    if (score >= 900) return "#10b981"; // Green
    if (score >= 700) return "#f59e0b"; // Yellow
    if (score >= 500) return "#3b82f6"; // Blue
    return "#ef4444"; // Red
  };

  if (!isVisible) {
    return (
      <button
        className={`scoring-widget-toggle ${position}`}
        onClick={() => setIsVisible(true)}
      >
        <Target className="w-4 h-4" />
      </button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`scoring-widget ${position} ${className}`}
    >
      <AnimatePresence mode="wait">
        {isMinimized ? (
          <motion.div
            key="minimized"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="widget-minimized"
          >
            <div className="minimized-content">
              <div className="minimized-score">
                <div
                  className="score-value"
                  style={{ color: getScoreColor(score.overall) }}
                >
                  {score.overall}
                </div>
                <div className="score-trend">
                  {score.trend === "up" && (
                    <ArrowUp className="w-3 h-3 text-green-400" />
                  )}
                  {score.trend === "down" && (
                    <ArrowDown className="w-3 h-3 text-red-400" />
                  )}
                  {score.trend !== "stable" && (
                    <span
                      className={
                        score.trend === "up" ? "text-green-400" : "text-red-400"
                      }
                    >
                      {score.trendValue}
                    </span>
                  )}
                </div>
              </div>

              {minimizable && (
                <button
                  className="expand-btn"
                  onClick={() => setIsMinimized(false)}
                >
                  <Eye className="w-3 h-3" />
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="widget-expanded"
          >
            <div className="widget-header">
              <div className="header-left">
                <Target className="w-4 h-4" />
                <span className="widget-title">PartnerTech Score</span>
              </div>

              <div className="header-controls">
                {minimizable && (
                  <button
                    className="control-btn"
                    onClick={() => setIsMinimized(true)}
                  >
                    <EyeOff className="w-3 h-3" />
                  </button>
                )}
                <button
                  className="control-btn"
                  onClick={() => setIsVisible(false)}
                >
                  ×
                </button>
              </div>
            </div>

            <div className="widget-body">
              {/* Overall Score Display */}
              <div className="score-display">
                <div className="score-circle-mini">
                  <svg viewBox="0 0 60 60" className="score-svg-mini">
                    <circle
                      cx="30"
                      cy="30"
                      r="25"
                      fill="none"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="4"
                    />
                    <motion.circle
                      cx="30"
                      cy="30"
                      r="25"
                      fill="none"
                      stroke={getScoreColor(score.overall)}
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={157}
                      initial={{ strokeDashoffset: 157 }}
                      animate={{
                        strokeDashoffset: 157 - (score.overall / 1000) * 157,
                      }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="score-text-mini">
                    <div className="score-number-mini">{score.overall}</div>
                  </div>
                </div>

                <div className="score-info">
                  <div
                    className="tier-badge"
                    style={{ backgroundColor: getTierColor(score.tier) }}
                  >
                    <Award className="w-3 h-3" />
                    <span>{score.tier}</span>
                  </div>
                  <div className="rank-info">
                    Rank #{score.rank.toLocaleString()}
                  </div>
                  <div className="trend-info">
                    {score.trend === "up" && (
                      <ArrowUp className="w-3 h-3 text-green-400" />
                    )}
                    {score.trend === "down" && (
                      <ArrowDown className="w-3 h-3 text-red-400" />
                    )}
                    {score.trend !== "stable" && (
                      <span
                        className={
                          score.trend === "up"
                            ? "text-green-400"
                            : "text-red-400"
                        }
                      >
                        {score.trendValue} pts
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Detailed Scores */}
              {showDetails && (
                <div className="detailed-scores">
                  <div className="score-item">
                    <span className="score-label">Behavior</span>
                    <span className="score-value-small">{score.behavior}</span>
                  </div>
                  <div className="score-item">
                    <span className="score-label">Queries</span>
                    <span className="score-value-small">{score.queries}</span>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="widget-actions">
                <button className="action-btn primary">
                  <TrendingUp className="w-3 h-3" />
                  <span>View Full Dashboard</span>
                </button>
                <div className="flex gap-1">
                  <button className="action-btn secondary flex-1">
                    <Zap className="w-3 h-3" />
                    <span>Boost Score</span>
                  </button>
                  <button className="action-btn secondary px-2">
                    <Eye className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
