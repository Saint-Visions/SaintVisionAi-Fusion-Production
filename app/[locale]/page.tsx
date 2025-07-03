import {
  Content,
  fetchOneEntry,
  isPreviewing,
  isEditing,
} from "@builder.io/sdk-react";
import { AuthenticatedMobileLayout } from "../../components/mobile/authenticated-mobile-layout";
import { AuthProvider } from "../../context/auth-context";
import { FusionSyncProvider } from "../../context/fusion-sync-context";
import {
  AIChatSection,
  SmartLeadsSection,
  ChromeExtensionSection,
  PricingHighlightsSection,
} from "../../components/dashboard/plan-sections";
import { FloatingUpgradePrompt } from "../../components/upgrade/floating-upgrade-prompt";
import { PlanAwareWrapper } from "../../components/layout/plan-aware-wrapper";
import {
  SaintSalBranding,
  SaintSalHeader,
} from "../../components/branding/saintsal-branding";
import "../../lib/builder/builder-config"; // Ensure components are registered

interface HomePageProps {
  params: {
    locale: string;
  };
  searchParams: Record<string, string>;
}

// Builder.io API key
const BUILDER_PUBLIC_API_KEY = process.env.NEXT_PUBLIC_BUILDER_API_KEY!;

// Homepage content component
function HomePageContent() {
  return (
    <div className="homepage-content">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-branding">
            <SaintSalBranding
              variant="full"
              size="xl"
              theme="auto"
              showTagline={true}
              animated={true}
            />
          </div>

          <h1 className="hero-title">
            Welcome to Your
            <span className="gradient-text"> AI-Powered </span>
            Business Dashboard
          </h1>

          <p className="hero-description">
            Streamline your workflow with intelligent AI conversations, smart
            lead discovery, and powerful automation tools - all in one unified
            platform.
          </p>

          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Active Users</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">2M+</div>
              <div className="stat-label">AI Conversations</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">99.9%</div>
              <div className="stat-label">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Plan-Based Dashboard Sections */}
      <PlanBasedDashboard />

      {/* Feature Showcase */}
      <section className="features-showcase">
        <div className="section-header">
          <h2 className="section-title">
            Powerful Features at Your Fingertips
          </h2>
          <p className="section-description">
            Everything you need to scale your business with AI
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3 className="feature-title">AI-Powered Conversations</h3>
            <p className="feature-description">
              Engage with advanced AI models for complex problem-solving and
              creative tasks
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3 className="feature-title">Smart Lead Discovery</h3>
            <p className="feature-description">
              Find and qualify high-quality leads with our intelligent discovery
              engine
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔗</div>
            <h3 className="feature-title">Seamless Integration</h3>
            <p className="feature-description">
              Connect with your favorite tools through our Chrome extension and
              APIs
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3 className="feature-title">Advanced Analytics</h3>
            <p className="feature-description">
              Get insights into your usage patterns and optimize your workflow
            </p>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="success-stories">
        <div className="section-header">
          <h2 className="section-title">Trusted by Industry Leaders</h2>
          <p className="section-description">
            See how businesses are transforming with SaintSal™
          </p>
        </div>

        <div className="stories-grid">
          <div className="story-card">
            <div className="story-quote">
              "SaintSal™ increased our lead generation by 300% and saved us 20
              hours per week"
            </div>
            <div className="story-author">
              <div className="author-info">
                <div className="author-name">Sarah Chen</div>
                <div className="author-title">VP of Sales, TechCorp</div>
              </div>
            </div>
          </div>

          <div className="story-card">
            <div className="story-quote">
              "The AI conversations feel incredibly natural and help us solve
              complex problems faster"
            </div>
            <div className="story-author">
              <div className="author-info">
                <div className="author-name">Marcus Rodriguez</div>
                <div className="author-title">CTO, InnovateLabs</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .homepage-content {
          min-height: 100vh;
          background: linear-gradient(
            135deg,
            rgba(0, 0, 0, 1) 0%,
            rgba(24, 24, 27, 1) 50%,
            rgba(0, 0, 0, 1) 100%
          );
          color: white;
          font-family:
            Inter,
            -apple-system,
            Roboto,
            Helvetica,
            sans-serif;
        }

        .hero-section {
          padding: 60px 20px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .hero-section::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(
            ellipse at center top,
            rgba(253, 255, 220, 0.1) 0%,
            transparent 70%
          );
          pointer-events: none;
        }

        .hero-content {
          position: relative;
          z-index: 1;
          max-width: 800px;
          margin: 0 auto;
        }

        .hero-branding {
          margin-bottom: 32px;
          display: flex;
          justify-content: center;
        }

        .hero-title {
          font-size: clamp(32px, 6vw, 56px);
          font-weight: 700;
          line-height: 1.1;
          margin-bottom: 20px;
          color: #fdffdc;
        }

        .gradient-text {
          background: linear-gradient(135deg, #fbbf24, #a855f7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-description {
          font-size: 18px;
          line-height: 1.6;
          color: #a1a1aa;
          margin-bottom: 40px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 32px;
          max-width: 400px;
          margin: 0 auto;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-size: 32px;
          font-weight: 700;
          color: #fdffdc;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 14px;
          color: #71717a;
        }

        .features-showcase {
          padding: 80px 20px;
        }

        .section-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .section-title {
          font-size: 36px;
          font-weight: 700;
          color: #fdffdc;
          margin-bottom: 16px;
        }

        .section-description {
          font-size: 18px;
          color: #a1a1aa;
          max-width: 600px;
          margin: 0 auto;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 32px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .feature-card {
          background: rgba(24, 24, 27, 0.5);
          border: 1px solid rgba(253, 255, 220, 0.1);
          border-radius: 16px;
          padding: 32px;
          text-align: center;
          transition: all 0.3s ease;
          backdrop-filter: blur(8px);
        }

        .feature-card:hover {
          border-color: rgba(253, 255, 220, 0.3);
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .feature-icon {
          font-size: 48px;
          margin-bottom: 20px;
        }

        .feature-title {
          font-size: 20px;
          font-weight: 600;
          color: #fdffdc;
          margin-bottom: 12px;
        }

        .feature-description {
          font-size: 16px;
          color: #a1a1aa;
          line-height: 1.5;
        }

        .success-stories {
          padding: 80px 20px;
          background: linear-gradient(
            135deg,
            rgba(253, 255, 220, 0.02) 0%,
            rgba(24, 24, 27, 0.5) 100%
          );
        }

        .stories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 32px;
          max-width: 1000px;
          margin: 0 auto;
        }

        .story-card {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(253, 255, 220, 0.1);
          border-radius: 16px;
          padding: 32px;
          transition: all 0.3s ease;
        }

        .story-card:hover {
          border-color: rgba(253, 255, 220, 0.3);
          transform: translateY(-2px);
        }

        .story-quote {
          font-size: 18px;
          line-height: 1.6;
          color: #e5e7eb;
          margin-bottom: 24px;
          font-style: italic;
        }

        .story-quote::before {
          content: '"';
          color: #fdffdc;
          font-size: 24px;
          font-weight: 700;
        }

        .story-quote::after {
          content: '"';
          color: #fdffdc;
          font-size: 24px;
          font-weight: 700;
        }

        .story-author {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .author-name {
          font-size: 16px;
          font-weight: 600;
          color: #fdffdc;
        }

        .author-title {
          font-size: 14px;
          color: #a1a1aa;
        }

        @media (max-width: 768px) {
          .hero-section {
            padding: 40px 20px;
          }

          .features-showcase,
          .success-stories {
            padding: 60px 20px;
          }

          .section-title {
            font-size: 28px;
          }

          .stories-grid {
            grid-template-columns: 1fr;
          }

          .story-card {
            min-width: auto;
          }
        }
      `}</style>
    </div>
  );
}

// Plan-based dashboard sections
function PlanBasedDashboard() {
  return (
    <section className="plan-dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h2 className="dashboard-title">Your Personalized Dashboard</h2>
          <p className="dashboard-description">
            Tailored features and capabilities based on your current plan
          </p>
        </div>

        <PlanBasedSections />
      </div>

      <style jsx>{`
        .plan-dashboard {
          padding: 60px 20px;
          background: linear-gradient(
            135deg,
            rgba(24, 24, 27, 0.8) 0%,
            rgba(0, 0, 0, 0.9) 100%
          );
        }

        .dashboard-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .dashboard-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .dashboard-title {
          font-size: 32px;
          font-weight: 700;
          color: #fdffdc;
          margin-bottom: 12px;
        }

        .dashboard-description {
          font-size: 16px;
          color: #a1a1aa;
          max-width: 500px;
          margin: 0 auto;
        }
      `}</style>
    </section>
  );
}

// Plan-based sections wrapper
function PlanBasedSections() {
  return (
    <PlanAwareWrapper
      fallbackPlan="FREE"
      showUpgradePrompts={true}
      className="dashboard-sections"
    />
  );
}

export default async function HomePage(props: HomePageProps) {
  // Initialize Builder.io node runtime
  const { initializeNodeRuntime } = await import(
    "@builder.io/sdk-react/node/init"
  );
  initializeNodeRuntime();

  const urlPath = "/";

  // Fetch Builder.io content for homepage slots
  const [headerContent, heroContent, dashboardContent, footerContent] =
    await Promise.all([
      fetchOneEntry({
        options: props.searchParams,
        apiKey: BUILDER_PUBLIC_API_KEY,
        model: "header-slot",
        userAttributes: { urlPath },
      }),
      fetchOneEntry({
        options: props.searchParams,
        apiKey: BUILDER_PUBLIC_API_KEY,
        model: "hero-slot",
        userAttributes: { urlPath },
      }),
      fetchOneEntry({
        options: props.searchParams,
        apiKey: BUILDER_PUBLIC_API_KEY,
        model: "dashboard-slot",
        userAttributes: { urlPath },
      }),
      fetchOneEntry({
        options: props.searchParams,
        apiKey: BUILDER_PUBLIC_API_KEY,
        model: "footer-slot",
        userAttributes: { urlPath },
      }),
    ]);

  return (
    <AuthProvider>
      <FusionSyncProvider>
        <AuthenticatedMobileLayout
          showDashboard={true}
          dashboardPosition="left"
          builderModel="homepage-layout"
          enableSlots={true}
          className="homepage-layout"
          slots={{
            header: "header-slot",
            sidebar: "sidebar-slot",
            main: "main-slot",
            footer: "footer-slot",
            overlay: "overlay-slot",
          }}
        >
          {/* Builder.io Hero Section */}
          {(heroContent ||
            isPreviewing(props.searchParams) ||
            isEditing(props.searchParams)) && (
            <section className="builder-hero-section">
              <Content
                content={heroContent}
                apiKey={BUILDER_PUBLIC_API_KEY}
                model="hero-slot"
              />
            </section>
          )}

          {/* Main Homepage Content */}
          <HomePageContent />

          {/* Builder.io Dashboard Section */}
          {(dashboardContent ||
            isPreviewing(props.searchParams) ||
            isEditing(props.searchParams)) && (
            <section className="builder-dashboard-section">
              <Content
                content={dashboardContent}
                apiKey={BUILDER_PUBLIC_API_KEY}
                model="dashboard-slot"
              />
            </section>
          )}

          {/* Floating Upgrade Prompt */}
          <FloatingUpgradePrompt
            showOnlyForFree={true}
            autoShow={true}
            delayMs={15000}
            position="bottom-right"
          />
        </AuthenticatedMobileLayout>
      </FusionSyncProvider>
    </AuthProvider>
  );
}

export const metadata = {
  title: "SaintSal™ - AI-Powered Business Dashboard",
  description:
    "Transform your business with intelligent AI conversations, smart lead discovery, and powerful automation tools. Join 50,000+ users scaling with SaintSal™.",
  keywords:
    "AI, business automation, lead generation, Chrome extension, SaintSal, dashboard",
  openGraph: {
    title: "SaintSal™ - AI-Powered Business Dashboard",
    description:
      "Transform your business with intelligent AI conversations and smart lead discovery",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "SaintSal™ - AI-Powered Business Dashboard",
    description:
      "Transform your business with intelligent AI conversations and smart lead discovery",
  },
};
