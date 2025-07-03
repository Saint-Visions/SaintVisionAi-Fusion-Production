"use client";

import React, { useState, useEffect } from "react";
import "./fusion-demo-sections.css";
import {
  MessageCircle,
  Bot,
  Zap,
  Users,
  Shield,
  BarChart3,
  Sparkles,
  Layers,
  GitBranch,
  Database,
  Wifi,
  Crown,
  Heart,
  Settings,
  Eye,
  Link,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/auth-context";
import { useFusionSync } from "@/context/fusion-sync-context";
import { DualAIAssistant } from "../ai/dual-ai-assistant";
import { CompanionCard } from "../ai/companion-card";

interface DemoSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: "ai" | "sync" | "plan" | "builder" | "mobile";
  complexity: "basic" | "intermediate" | "advanced";
  features: string[];
  demo: React.ReactNode;
}

export const FusionDemoSections = () => {
  const { userProfile } = useAuth();
  const { syncState, broadcastEvent } = useFusionSync();
  const [activeSection, setActiveSection] = useState<string>("ai-components");
  const [isInteracting, setIsInteracting] = useState(false);

  // Simulate demo interactions
  const triggerDemoEvent = (type: string, data: any) => {
    setIsInteracting(true);
    broadcastEvent("demo-interaction" as any, { type, data }, "demo-sections");
    setTimeout(() => setIsInteracting(false), 2000);
  };

  const demoSections: DemoSection[] = [
    {
      id: "ai-components",
      title: "AI Component Switching",
      description: "Experience plan-based AI component rendering",
      icon: <Bot className="w-5 h-5" />,
      category: "ai",
      complexity: "intermediate",
      features: [
        "Plan-aware component rendering",
        "Dual AI model support",
        "Interactive conversation interface",
        "Token usage tracking",
        "Upgrade prompts for free users",
      ],
      demo: (
        <div className="ai-demo-container">
          <div className="demo-header">
            <h4 className="demo-title">
              Current Plan: {userProfile?.plan || "FREE"}
            </h4>
            <div className="plan-indicator">
              {userProfile?.plan === "FREE" ? (
                <span className="plan-badge free">Free User</span>
              ) : (
                <span className="plan-badge pro">Pro/Enterprise</span>
              )}
            </div>
          </div>

          <div className="ai-component-demo">
            {userProfile?.plan === "FREE" ? (
              <div className="component-showcase">
                <div className="showcase-label">CompanionCard Component</div>
                <CompanionCard className="demo-companion" />
              </div>
            ) : (
              <div className="component-showcase">
                <div className="showcase-label">DualAIAssistant Component</div>
                <div className="dual-ai-preview">
                  <div className="ai-preview-card">
                    <Bot className="w-6 h-6 text-green-400" />
                    <span>GPT-4 Turbo</span>
                  </div>
                  <div className="ai-preview-card">
                    <Sparkles className="w-6 h-6 text-purple-400" />
                    <span>Claude-3 Sonnet</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      id: "real-time-sync",
      title: "Real-time Synchronization",
      description: "Watch events propagate across components instantly",
      icon: <Wifi className="w-5 h-5" />,
      category: "sync",
      complexity: "advanced",
      features: [
        "Event broadcasting system",
        "Component registration",
        "Cross-component communication",
        "Performance monitoring",
        "Auto-reconnection",
      ],
      demo: (
        <div className="sync-demo-container">
          <div className="sync-status">
            <div className="status-indicator">
              <div
                className={`status-dot ${syncState.isConnected ? "connected" : "disconnected"}`}
              ></div>
              <span>Sync Status: {syncState.syncStatus}</span>
            </div>
            <div className="active-components">
              <span>Active: {syncState.activeComponents.size} components</span>
            </div>
          </div>

          <div className="event-demo">
            <button
              className="demo-trigger-btn"
              onClick={() =>
                triggerDemoEvent("user-interaction", { action: "demo-click" })
              }
              disabled={isInteracting}
            >
              {isInteracting ? "Broadcasting..." : "Trigger Sync Event"}
            </button>

            <div className="recent-events">
              <h5 className="events-title">Recent Events</h5>
              <div className="events-list">
                {syncState.realtimeEvents.slice(-3).map((event, index) => (
                  <div key={index} className="event-item">
                    <div className="event-type">{event.type}</div>
                    <div className="event-component">{event.component}</div>
                    <div className="event-time">
                      {event.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "plan-features",
      title: "Plan-based Features",
      description: "Compare features across different plan tiers",
      icon: <Crown className="w-5 h-5" />,
      category: "plan",
      complexity: "basic",
      features: [
        "Feature gating by plan",
        "Usage limit enforcement",
        "Upgrade prompts",
        "Plan comparison matrix",
        "Dynamic UI adaptation",
      ],
      demo: (
        <div className="plan-demo-container">
          <div className="plan-comparison">
            <div className="plan-tier free">
              <div className="tier-header">
                <h4 className="tier-name">Free</h4>
                <div className="tier-price">$0/month</div>
              </div>
              <div className="tier-features">
                <div className="feature-item">
                  <Heart className="w-4 h-4 text-red-400" />
                  <span>Basic AI Companion</span>
                </div>
                <div className="feature-item">
                  <MessageCircle className="w-4 h-4 text-blue-400" />
                  <span>10 chats/month</span>
                </div>
                <div className="feature-item">
                  <Shield className="w-4 h-4 text-gray-400" />
                  <span>Standard support</span>
                </div>
              </div>
            </div>

            <div className="plan-tier pro">
              <div className="tier-header">
                <h4 className="tier-name">Pro</h4>
                <div className="tier-price">$29/month</div>
              </div>
              <div className="tier-features">
                <div className="feature-item">
                  <Bot className="w-4 h-4 text-green-400" />
                  <span>Dual AI Assistant</span>
                </div>
                <div className="feature-item">
                  <MessageCircle className="w-4 h-4 text-blue-400" />
                  <span>Unlimited chats</span>
                </div>
                <div className="feature-item">
                  <BarChart3 className="w-4 h-4 text-purple-400" />
                  <span>Advanced analytics</span>
                </div>
              </div>
            </div>

            <div className="plan-tier enterprise">
              <div className="tier-header">
                <h4 className="tier-name">Enterprise</h4>
                <div className="tier-price">$99/month</div>
              </div>
              <div className="tier-features">
                <div className="feature-item">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  <span>Premium AI Models</span>
                </div>
                <div className="feature-item">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span>Team collaboration</span>
                </div>
                <div className="feature-item">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span>Priority support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "builder-integration",
      title: "Builder.io Dynamic Content",
      description: "See how content updates in real-time from CMS",
      icon: <Layers className="w-5 h-5" />,
      category: "builder",
      complexity: "intermediate",
      features: [
        "Visual content editing",
        "Real-time content sync",
        "Component registration",
        "Preview mode support",
        "Multi-model content",
      ],
      demo: (
        <div className="builder-demo-container">
          <div className="content-editor-preview">
            <div className="editor-header">
              <h4 className="editor-title">Builder.io Visual Editor</h4>
              <div className="editor-status">
                <div className="status-dot connected"></div>
                <span>Live</span>
              </div>
            </div>

            <div className="content-slots">
              <div className="content-slot">
                <div className="slot-header">
                  <Eye className="w-4 h-4" />
                  <span>Hero Section</span>
                </div>
                <div className="slot-content">
                  <div className="content-block">Editable Hero Content</div>
                </div>
              </div>

              <div className="content-slot">
                <div className="slot-header">
                  <Settings className="w-4 h-4" />
                  <span>Feature Grid</span>
                </div>
                <div className="slot-content">
                  <div className="content-grid">
                    <div className="grid-item">Feature 1</div>
                    <div className="grid-item">Feature 2</div>
                    <div className="grid-item">Feature 3</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="sync-indicator">
              <GitBranch className="w-4 h-4 text-green-400" />
              <span>Content synchronized with CMS</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "mobile-responsive",
      title: "Mobile-first Design",
      description: "Responsive layouts that adapt to any screen",
      icon: <Users className="w-5 h-5" />,
      category: "mobile",
      complexity: "basic",
      features: [
        "Mobile-first responsive design",
        "Touch-optimized interactions",
        "Adaptive navigation",
        "Performance optimization",
        "Cross-device sync",
      ],
      demo: (
        <div className="mobile-demo-container">
          <div className="device-previews">
            <div className="device-preview mobile">
              <div className="device-frame">
                <div className="device-screen">
                  <div className="mobile-ui">
                    <div className="mobile-header">SaintSal™</div>
                    <div className="mobile-content">
                      <div className="mobile-card">AI Chat</div>
                      <div className="mobile-card">Dashboard</div>
                      <div className="mobile-card">Settings</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="device-label">Mobile</div>
            </div>

            <div className="device-preview tablet">
              <div className="device-frame">
                <div className="device-screen">
                  <div className="tablet-ui">
                    <div className="tablet-sidebar">Menu</div>
                    <div className="tablet-main">
                      <div className="tablet-header">Dashboard</div>
                      <div className="tablet-grid">
                        <div className="grid-card">Analytics</div>
                        <div className="grid-card">AI Chat</div>
                        <div className="grid-card">Settings</div>
                        <div className="grid-card">Profile</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="device-label">Tablet</div>
            </div>

            <div className="device-preview desktop">
              <div className="device-frame">
                <div className="device-screen">
                  <div className="desktop-ui">
                    <div className="desktop-sidebar">Navigation</div>
                    <div className="desktop-main">
                      <div className="desktop-header">
                        <span>SaintSal™ Dashboard</span>
                        <div className="header-actions">🔔 ⚙️ 👤</div>
                      </div>
                      <div className="desktop-content">
                        <div className="content-section">Analytics</div>
                        <div className="content-section">AI Assistant</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="device-label">Desktop</div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const categories = [
    { id: "all", name: "All Features", icon: <Layers className="w-4 h-4" /> },
    { id: "ai", name: "AI Components", icon: <Bot className="w-4 h-4" /> },
    { id: "sync", name: "Real-time Sync", icon: <Wifi className="w-4 h-4" /> },
    { id: "plan", name: "Plan Features", icon: <Crown className="w-4 h-4" /> },
    {
      id: "builder",
      name: "Builder.io",
      icon: <Database className="w-4 h-4" />,
    },
    { id: "mobile", name: "Mobile", icon: <Users className="w-4 h-4" /> },
  ];

  const [selectedCategory, setSelectedCategory] = useState("all");
  const filteredSections =
    selectedCategory === "all"
      ? demoSections
      : demoSections.filter((section) => section.category === selectedCategory);

  return (
    <div className="fusion-demo-sections">
      {/* Category Filter */}
      <div className="category-filter">
        <div className="filter-tabs">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`filter-tab ${selectedCategory === category.id ? "active" : ""}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.icon}
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Demo Sections Grid */}
      <div className="demo-sections-grid">
        <AnimatePresence mode="wait">
          {filteredSections.map((section) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`demo-section-card ${activeSection === section.id ? "active" : ""}`}
              onClick={() =>
                setActiveSection(activeSection === section.id ? "" : section.id)
              }
            >
              <div className="section-header">
                <div className="section-icon">{section.icon}</div>
                <div className="section-info">
                  <h3 className="section-title">{section.title}</h3>
                  <p className="section-description">{section.description}</p>
                </div>
                <div className="section-meta">
                  <div className={`complexity-badge ${section.complexity}`}>
                    {section.complexity}
                  </div>
                  <div className="expand-icon">
                    {activeSection === section.id ? "−" : "+"}
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {activeSection === section.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="section-content"
                  >
                    <div className="features-list">
                      <h4 className="features-title">Key Features:</h4>
                      <ul className="features-items">
                        {section.features.map((feature, index) => (
                          <li key={index} className="feature-item">
                            <div className="feature-bullet"></div>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="demo-content">
                      <h4 className="demo-title">Live Demo:</h4>
                      <div className="demo-wrapper">{section.demo}</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredSections.length === 0 && (
        <div className="no-sections">
          <div className="no-sections-icon">🔍</div>
          <h3 className="no-sections-title">No sections found</h3>
          <p className="no-sections-description">
            Try selecting a different category filter
          </p>
        </div>
      )}
    </div>
  );
};
