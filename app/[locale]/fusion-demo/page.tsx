import {
  Content,
  fetchOneEntry,
  isPreviewing,
  isEditing,
} from "@builder.io/sdk-react";
import { AuthProvider } from "../../../context/auth-context";
import { FusionSyncProvider } from "../../../context/fusion-sync-context";
import { AuthenticatedMobileLayout } from "../../../components/mobile/authenticated-mobile-layout";
import { SaintSalBranding } from "../../../components/branding/saintsal-branding";
import { FloatingUpgradePrompt } from "../../../components/upgrade/floating-upgrade-prompt";
import { FusionDemoSections } from "../../../components/fusion/fusion-demo-sections";
import { PlanSimulator } from "../../../components/fusion/plan-simulator";
import { SyncVisualizer } from "../../../components/fusion/sync-visualizer";
import "../../../lib/builder/builder-config";
import "./fusion-demo.css";

interface FusionDemoPageProps {
  params: {
    locale: string;
  };
  searchParams: Record<string, string>;
}

const BUILDER_PUBLIC_API_KEY = process.env.NEXT_PUBLIC_BUILDER_API_KEY!;

// Demo Content Component
function FusionDemoContent() {
  return (
    <div className="fusion-demo-content">
      {/* Hero Section */}
      <section className="demo-hero">
        <div className="hero-background">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>

        <div className="hero-content">
          <div className="branding-showcase">
            <SaintSalBranding
              variant="full"
              size="xl"
              theme="dark"
              showTagline={true}
              animated={true}
            />
          </div>

          <div className="hero-text">
            <h1 className="hero-title">
              🚀 SaintSal™ Fusion
              <span className="title-highlight">System Demo</span>
            </h1>
            <p className="hero-subtitle">
              Experience the power of real-time AI synchronization, plan-based
              rendering, and contextual integration across all components
            </p>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">8</div>
              <div className="stat-label">Sync Events</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">Real-time</div>
              <div className="stat-label">Updates</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">3</div>
              <div className="stat-label">Plan Tiers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Plan Simulator */}
      <section className="demo-section">
        <div className="section-header">
          <h2 className="section-title">🎯 Interactive Plan Simulator</h2>
          <p className="section-description">
            Switch between plan tiers to see conditional rendering in action
          </p>
        </div>
        <PlanSimulator />
      </section>

      {/* Real-time Sync Visualization */}
      <section className="demo-section">
        <div className="section-header">
          <h2 className="section-title">⚡ Fusion Sync Visualizer</h2>
          <p className="section-description">
            Monitor real-time synchronization events and system performance
          </p>
        </div>
        <SyncVisualizer />
      </section>

      {/* Feature Demonstrations */}
      <section className="demo-section">
        <div className="section-header">
          <h2 className="section-title">🛠️ Feature Demonstrations</h2>
          <p className="section-description">
            Explore individual Fusion system capabilities
          </p>
        </div>
        <FusionDemoSections />
      </section>

      {/* Integration Examples */}
      <section className="demo-section">
        <div className="section-header">
          <h2 className="section-title">🔗 Builder.io Integration</h2>
          <p className="section-description">
            Dynamic content management with real-time updates
          </p>
        </div>

        <div className="integration-showcase">
          <div className="integration-card">
            <div className="card-header">
              <h3 className="card-title">Dynamic Content Slots</h3>
              <div className="status-badge">Active</div>
            </div>
            <div className="card-content">
              <p className="card-description">
                Content areas that update in real-time from Builder.io CMS
              </p>
              <div className="slot-preview">
                <div className="slot-indicator">
                  <div className="slot-dot"></div>
                  <span>Dynamic Slot 1</span>
                </div>
                <div className="slot-indicator">
                  <div className="slot-dot"></div>
                  <span>Dynamic Slot 2</span>
                </div>
                <div className="slot-indicator">
                  <div className="slot-dot"></div>
                  <span>Dynamic Slot 3</span>
                </div>
              </div>
            </div>
          </div>

          <div className="integration-card">
            <div className="card-header">
              <h3 className="card-title">Visual Editing</h3>
              <div className="status-badge">Ready</div>
            </div>
            <div className="card-content">
              <p className="card-description">
                Edit content visually in Builder.io and see changes instantly
              </p>
              <div className="edit-preview">
                <div className="edit-toolbar">
                  <div className="tool-icon">✏️</div>
                  <div className="tool-icon">🎨</div>
                  <div className="tool-icon">⚙️</div>
                </div>
                <div className="preview-area">
                  <div className="preview-element">Live Preview</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Metrics */}
      <section className="demo-section">
        <div className="section-header">
          <h2 className="section-title">📊 System Performance</h2>
          <p className="section-description">
            Real-time metrics and system health monitoring
          </p>
        </div>

        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-header">
              <h4 className="metric-title">Sync Latency</h4>
              <div className="metric-status good">Excellent</div>
            </div>
            <div className="metric-value">
              <span className="value-number">12</span>
              <span className="value-unit">ms</span>
            </div>
            <div className="metric-chart">
              <div className="chart-bar" style={{ height: "40%" }}></div>
              <div className="chart-bar" style={{ height: "60%" }}></div>
              <div className="chart-bar" style={{ height: "30%" }}></div>
              <div className="chart-bar" style={{ height: "80%" }}></div>
              <div className="chart-bar" style={{ height: "20%" }}></div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <h4 className="metric-title">Active Components</h4>
              <div className="metric-status good">Online</div>
            </div>
            <div className="metric-value">
              <span className="value-number">7</span>
              <span className="value-unit">connected</span>
            </div>
            <div className="component-list">
              <div className="component-item">Dashboard</div>
              <div className="component-item">AI Assistant</div>
              <div className="component-item">Sync Monitor</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <h4 className="metric-title">Event Throughput</h4>
              <div className="metric-status good">Optimal</div>
            </div>
            <div className="metric-value">
              <span className="value-number">145</span>
              <span className="value-unit">events/min</span>
            </div>
            <div className="throughput-indicator">
              <div className="throughput-bar">
                <div className="throughput-fill" style={{ width: "78%" }}></div>
              </div>
              <span className="throughput-label">78% capacity</span>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Actions */}
      <section className="demo-actions">
        <div className="actions-grid">
          <button className="demo-action-btn primary">
            <span className="btn-icon">🚀</span>
            <span className="btn-text">Launch Live Demo</span>
          </button>
          <button className="demo-action-btn secondary">
            <span className="btn-icon">📖</span>
            <span className="btn-text">View Documentation</span>
          </button>
          <button className="demo-action-btn secondary">
            <span className="btn-icon">💬</span>
            <span className="btn-text">Contact Sales</span>
          </button>
        </div>
      </section>
    </div>
  );
}

export default async function FusionDemoPage(props: FusionDemoPageProps) {
  // Initialize Builder.io node runtime
  const { initializeNodeRuntime } = await import(
    "@builder.io/sdk-react/node/init"
  );
  initializeNodeRuntime();

  const urlPath = "/fusion-demo";

  // Fetch Builder.io content for this page
  const content = await fetchOneEntry({
    options: props.searchParams,
    apiKey: BUILDER_PUBLIC_API_KEY,
    model: "page",
    userAttributes: { urlPath },
  });

  // Fetch mobile layout content
  const mobileLayoutContent = await fetchOneEntry({
    options: props.searchParams,
    apiKey: BUILDER_PUBLIC_API_KEY,
    model: "mobile-layout",
    userAttributes: { urlPath },
  });

  const canShowContent =
    content ||
    isPreviewing(props.searchParams) ||
    isEditing(props.searchParams);

  const canShowMobileLayout =
    mobileLayoutContent ||
    isPreviewing(props.searchParams) ||
    isEditing(props.searchParams);

  return (
    <AuthProvider>
      <FusionSyncProvider>
        <AuthenticatedMobileLayout
          showDashboard={true}
          dashboardPosition="left"
          builderModel="mobile-layout"
          builderContent={mobileLayoutContent}
        >
          <div className="fusion-demo-page">
            <FusionDemoContent />

            {/* Builder.io Dynamic Content */}
            {canShowContent && (
              <section className="builder-content-section">
                <div className="section-header">
                  <h2 className="section-title">
                    🎨 Dynamic Builder.io Content
                  </h2>
                  <p className="section-description">
                    Content managed and updated through Builder.io CMS
                  </p>
                </div>
                <div className="builder-content-wrapper">
                  <Content
                    content={content}
                    apiKey={BUILDER_PUBLIC_API_KEY}
                    model="page"
                  />
                </div>
              </section>
            )}

            <FloatingUpgradePrompt />
          </div>
        </AuthenticatedMobileLayout>
      </FusionSyncProvider>
    </AuthProvider>
  );
}

export const metadata = {
  title: "SaintSal™ Fusion System Demo - Real-time AI Synchronization",
  description:
    "Experience the power of SaintSal™ Fusion: real-time AI synchronization, plan-based rendering, contextual integration, and Builder.io dynamic content management.",
  keywords: [
    "SaintSal Fusion",
    "AI synchronization",
    "real-time updates",
    "plan-based rendering",
    "Builder.io integration",
    "contextual AI",
  ],
};
