import {
  Content,
  fetchOneEntry,
  isPreviewing,
  isEditing,
} from "@builder.io/sdk-react";
import { AuthProvider } from "../../../context/auth-context";
import { FusionSyncProvider } from "../../../context/fusion-sync-context";
import { AuthenticatedMobileLayout } from "../../../components/mobile/authenticated-mobile-layout";
import { PlanAwareWrapper } from "../../../components/layout/plan-aware-wrapper";
import { SaintSalBranding } from "../../../components/branding/saintsal-branding";
import { FloatingUpgradePrompt } from "../../../components/upgrade/floating-upgrade-prompt";
import "../../../lib/builder/builder-config";

interface DashboardPageProps {
  params: {
    locale: string;
  };
  searchParams: Record<string, string>;
}

const BUILDER_PUBLIC_API_KEY = process.env.NEXT_PUBLIC_BUILDER_API_KEY!;

// Dashboard Content Component
function DashboardContent() {
  return (
    <div className="dashboard-content">
      {/* Welcome Header */}
      <section className="welcome-section">
        <div className="welcome-header">
          <div className="branding-container">
            <SaintSalBranding
              variant="compact"
              size="lg"
              theme="auto"
              showTagline={true}
              animated={true}
            />
          </div>
          <div className="welcome-text">
            <h1 className="welcome-title">Welcome to Your Dashboard</h1>
            <p className="welcome-subtitle">
              Your AI-powered business intelligence center
            </p>
          </div>
        </div>
      </section>

      {/* Main Dashboard Grid */}
      <section className="dashboard-grid">
        <PlanAwareWrapper
          fallbackPlan="FREE"
          showUpgradePrompts={true}
          className="main-dashboard-wrapper"
        />
      </section>

      {/* Quick Actions */}
      <section className="quick-actions">
        <div className="actions-header">
          <h2 className="section-title">Quick Actions</h2>
          <p className="section-description">
            Get started with these common tasks
          </p>
        </div>

        <div className="actions-grid">
          <div className="action-card">
            <div className="action-icon">🤖</div>
            <h3 className="action-title">Start AI Chat</h3>
            <p className="action-description">
              Begin a conversation with your AI assistant
            </p>
            <button className="action-button">Open Chat</button>
          </div>

          <div className="action-card">
            <div className="action-icon">🎯</div>
            <h3 className="action-title">Find Leads</h3>
            <p className="action-description">
              Discover new potential customers
            </p>
            <button className="action-button">Start Search</button>
          </div>

          <div className="action-card">
            <div className="action-icon">📊</div>
            <h3 className="action-title">View Analytics</h3>
            <p className="action-description">
              Check your usage and performance
            </p>
            <button className="action-button">View Stats</button>
          </div>

          <div className="action-card">
            <div className="action-icon">⚙️</div>
            <h3 className="action-title">Settings</h3>
            <p className="action-description">Customize your experience</p>
            <button className="action-button">Open Settings</button>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="recent-activity">
        <div className="activity-header">
          <h2 className="section-title">Recent Activity</h2>
          <button className="view-all-btn">View All</button>
        </div>

        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">💬</div>
            <div className="activity-content">
              <div className="activity-title">AI Chat Session</div>
              <div className="activity-description">
                Discussed marketing strategy optimization
              </div>
              <div className="activity-time">2 minutes ago</div>
            </div>
            <div className="activity-status success">Completed</div>
          </div>

          <div className="activity-item">
            <div className="activity-icon">🎯</div>
            <div className="activity-content">
              <div className="activity-title">Lead Discovery</div>
              <div className="activity-description">
                Found 15 new potential customers
              </div>
              <div className="activity-time">1 hour ago</div>
            </div>
            <div className="activity-status success">Completed</div>
          </div>

          <div className="activity-item">
            <div className="activity-icon">📈</div>
            <div className="activity-content">
              <div className="activity-title">Analytics Report</div>
              <div className="activity-description">
                Monthly performance summary generated
              </div>
              <div className="activity-time">3 hours ago</div>
            </div>
            <div className="activity-status success">Completed</div>
          </div>
        </div>
      </section>

      {/* Performance Metrics */}
      <section className="performance-metrics">
        <div className="metrics-header">
          <h2 className="section-title">Performance Overview</h2>
          <p className="section-description">Key metrics for this month</p>
        </div>

        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon">💬</div>
            <div className="metric-value">127</div>
            <div className="metric-label">AI Conversations</div>
            <div className="metric-change positive">+12% vs last month</div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">🎯</div>
            <div className="metric-value">89</div>
            <div className="metric-label">Leads Generated</div>
            <div className="metric-change positive">+24% vs last month</div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">⚡</div>
            <div className="metric-value">2.3s</div>
            <div className="metric-label">Avg Response Time</div>
            <div className="metric-change positive">-15% vs last month</div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">💰</div>
            <div className="metric-value">$4.2K</div>
            <div className="metric-label">Value Generated</div>
            <div className="metric-change positive">+31% vs last month</div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .dashboard-content {
          min-height: 100vh;
          background: linear-gradient(
            135deg,
            rgba(0, 0, 0, 1) 0%,
            rgba(24, 24, 27, 1) 100%
          );
          color: white;
          font-family:
            Inter,
            -apple-system,
            Roboto,
            Helvetica,
            sans-serif;
          padding: 0 0 40px 0;
        }

        .welcome-section {
          padding: 40px 20px;
          background: linear-gradient(
            135deg,
            rgba(253, 255, 220, 0.05) 0%,
            rgba(59, 130, 246, 0.05) 50%,
            rgba(147, 51, 234, 0.05) 100%
          );
          border-bottom: 1px solid rgba(253, 255, 220, 0.1);
        }

        .welcome-header {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 24px;
        }

        .branding-container {
          display: flex;
          justify-content: center;
        }

        .welcome-text {
          max-width: 600px;
        }

        .welcome-title {
          font-size: clamp(32px, 5vw, 48px);
          font-weight: 700;
          color: #fdffdc;
          margin: 0 0 12px 0;
          background: linear-gradient(135deg, #fdffdc, #fbbf24);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .welcome-subtitle {
          font-size: 18px;
          color: #a1a1aa;
          margin: 0;
          line-height: 1.6;
        }

        .dashboard-grid {
          padding: 60px 20px;
        }

        .main-dashboard-wrapper {
          max-width: 1200px;
          margin: 0 auto;
        }

        .quick-actions {
          padding: 60px 20px;
          background: rgba(24, 24, 27, 0.3);
        }

        .actions-header {
          text-align: center;
          margin-bottom: 48px;
          max-width: 1200px;
          margin-left: auto;
          margin-right: auto;
        }

        .section-title {
          font-size: 32px;
          font-weight: 700;
          color: #fdffdc;
          margin: 0 0 12px 0;
        }

        .section-description {
          font-size: 16px;
          color: #a1a1aa;
          margin: 0;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .action-card {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(253, 255, 220, 0.1);
          border-radius: 16px;
          padding: 24px;
          text-align: center;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .action-card:hover {
          border-color: rgba(253, 255, 220, 0.3);
          transform: translateY(-4px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .action-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .action-title {
          font-size: 20px;
          font-weight: 600;
          color: #fdffdc;
          margin: 0 0 8px 0;
        }

        .action-description {
          font-size: 14px;
          color: #a1a1aa;
          margin: 0 0 20px 0;
          line-height: 1.5;
        }

        .action-button {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
        }

        .action-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .recent-activity {
          padding: 60px 20px;
        }

        .activity-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          max-width: 1200px;
          margin-left: auto;
          margin-right: auto;
        }

        .view-all-btn {
          background: transparent;
          color: #3b82f6;
          border: 1px solid #3b82f6;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .view-all-btn:hover {
          background: #3b82f6;
          color: white;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: rgba(24, 24, 27, 0.5);
          border: 1px solid rgba(253, 255, 220, 0.1);
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .activity-item:hover {
          border-color: rgba(253, 255, 220, 0.2);
          background: rgba(24, 24, 27, 0.7);
        }

        .activity-icon {
          font-size: 24px;
          width: 48px;
          height: 48px;
          background: rgba(59, 130, 246, 0.1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .activity-content {
          flex: 1;
        }

        .activity-title {
          font-size: 16px;
          font-weight: 600;
          color: #fdffdc;
          margin-bottom: 4px;
        }

        .activity-description {
          font-size: 14px;
          color: #a1a1aa;
          margin-bottom: 4px;
        }

        .activity-time {
          font-size: 12px;
          color: #6b7280;
        }

        .activity-status {
          padding: 4px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          flex-shrink: 0;
        }

        .activity-status.success {
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
          border: 1px solid rgba(34, 197, 94, 0.2);
        }

        .performance-metrics {
          padding: 60px 20px;
          background: rgba(24, 24, 27, 0.3);
        }

        .metrics-header {
          text-align: center;
          margin-bottom: 48px;
          max-width: 1200px;
          margin-left: auto;
          margin-right: auto;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .metric-card {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(253, 255, 220, 0.1);
          border-radius: 16px;
          padding: 24px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .metric-card:hover {
          border-color: rgba(253, 255, 220, 0.3);
          transform: translateY(-2px);
        }

        .metric-icon {
          font-size: 32px;
          margin-bottom: 16px;
        }

        .metric-value {
          font-size: 36px;
          font-weight: 700;
          color: #fdffdc;
          margin-bottom: 8px;
        }

        .metric-label {
          font-size: 14px;
          color: #a1a1aa;
          margin-bottom: 8px;
        }

        .metric-change {
          font-size: 12px;
          font-weight: 500;
          padding: 4px 8px;
          border-radius: 4px;
        }

        .metric-change.positive {
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
        }

        .metric-change.negative {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .welcome-section {
            padding: 32px 16px;
          }

          .dashboard-grid,
          .quick-actions,
          .recent-activity,
          .performance-metrics {
            padding: 40px 16px;
          }

          .welcome-header {
            flex-direction: column;
            gap: 20px;
          }

          .activity-header {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }

          .activity-item {
            flex-direction: column;
            text-align: center;
            gap: 12px;
          }

          .activity-content {
            order: -1;
          }

          .actions-grid,
          .metrics-grid {
            grid-template-columns: 1fr;
          }

          .section-title {
            font-size: 24px;
          }
        }

        /* Animation for metrics */
        @keyframes countUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .metric-card {
          animation: countUp 0.6s ease-out forwards;
        }

        .metric-card:nth-child(1) {
          animation-delay: 0.1s;
        }
        .metric-card:nth-child(2) {
          animation-delay: 0.2s;
        }
        .metric-card:nth-child(3) {
          animation-delay: 0.3s;
        }
        .metric-card:nth-child(4) {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
}

export default async function DashboardPage(props: DashboardPageProps) {
  // Initialize Builder.io node runtime
  const { initializeNodeRuntime } = await import(
    "@builder.io/sdk-react/node/init"
  );
  initializeNodeRuntime();

  const urlPath = "/dashboard";

  // Fetch Builder.io content for dashboard slots
  const [
    dashboardHeroContent,
    dashboardWidgetsContent,
    dashboardFooterContent,
  ] = await Promise.all([
    fetchOneEntry({
      options: props.searchParams,
      apiKey: BUILDER_PUBLIC_API_KEY,
      model: "dashboard-hero-slot",
      userAttributes: { urlPath },
    }),
    fetchOneEntry({
      options: props.searchParams,
      apiKey: BUILDER_PUBLIC_API_KEY,
      model: "dashboard-widgets-slot",
      userAttributes: { urlPath },
    }),
    fetchOneEntry({
      options: props.searchParams,
      apiKey: BUILDER_PUBLIC_API_KEY,
      model: "dashboard-footer-slot",
      userAttributes: { urlPath },
    }),
  ]);

  return (
    <AuthProvider>
      <FusionSyncProvider>
        <AuthenticatedMobileLayout
          showDashboard={true}
          dashboardPosition="left"
          builderModel="dashboard-layout"
          enableSlots={true}
          className="dashboard-page-layout"
          slots={{
            header: "dashboard-header-slot",
            sidebar: "dashboard-sidebar-slot",
            main: "dashboard-main-slot",
            footer: "dashboard-footer-slot",
            overlay: "dashboard-overlay-slot",
          }}
        >
          {/* Builder.io Dashboard Hero Section */}
          {(dashboardHeroContent ||
            isPreviewing(props.searchParams) ||
            isEditing(props.searchParams)) && (
            <section className="builder-dashboard-hero">
              <Content
                content={dashboardHeroContent}
                apiKey={BUILDER_PUBLIC_API_KEY}
                model="dashboard-hero-slot"
              />
            </section>
          )}

          {/* Main Dashboard Content */}
          <DashboardContent />

          {/* Builder.io Dashboard Widgets */}
          {(dashboardWidgetsContent ||
            isPreviewing(props.searchParams) ||
            isEditing(props.searchParams)) && (
            <section className="builder-dashboard-widgets">
              <Content
                content={dashboardWidgetsContent}
                apiKey={BUILDER_PUBLIC_API_KEY}
                model="dashboard-widgets-slot"
              />
            </section>
          )}

          {/* Builder.io Dashboard Footer */}
          {(dashboardFooterContent ||
            isPreviewing(props.searchParams) ||
            isEditing(props.searchParams)) && (
            <section className="builder-dashboard-footer">
              <Content
                content={dashboardFooterContent}
                apiKey={BUILDER_PUBLIC_API_KEY}
                model="dashboard-footer-slot"
              />
            </section>
          )}

          {/* Floating Upgrade Prompt for FREE users */}
          <FloatingUpgradePrompt
            showOnlyForFree={true}
            autoShow={true}
            delayMs={20000}
            position="bottom-right"
          />
        </AuthenticatedMobileLayout>
      </FusionSyncProvider>
    </AuthProvider>
  );
}

export const metadata = {
  title: "Dashboard - SaintSal™",
  description:
    "Your AI-powered business intelligence dashboard with plan-based features and real-time insights",
  keywords:
    "dashboard, AI, business intelligence, SaintSal, analytics, metrics",
  openGraph: {
    title: "Dashboard - SaintSal™",
    description: "Your AI-powered business intelligence dashboard",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dashboard - SaintSal™",
    description: "Your AI-powered business intelligence dashboard",
  },
};
