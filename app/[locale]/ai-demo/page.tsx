import { AuthProvider } from "../../../context/auth-context";
import { AuthenticatedMobileLayout } from "../../../components/mobile/authenticated-mobile-layout";
import { PlanAwareWrapper } from "../../../components/layout/plan-aware-wrapper";
import "../../../lib/builder/builder-config"; // Ensure components are registered

export default function AIDemoPage() {
  return (
    <AuthProvider>
      <AuthenticatedMobileLayout
        showDashboard={true}
        dashboardPosition="left"
        builderModel="ai-demo-layout"
        enableSlots={true}
        className="ai-demo-layout"
      >
        <div className="ai-demo-content">
          {/* Hero Section */}
          <section className="demo-hero">
            <div className="hero-content">
              <h1 className="hero-title">🤖 SaintSal™ AI Assistant Demo</h1>
              <p className="hero-description">
                Experience our intelligent AI system that adapts to your plan
                tier. FREE users get our friendly Companion, while PRO+ users
                unlock the powerful Dual AI Console.
              </p>
            </div>
          </section>

          {/* Plan-Based AI Assistant */}
          <section className="ai-assistant-demo">
            <div className="demo-header">
              <h2 className="section-title">Your AI Assistant</h2>
              <p className="section-description">
                The AI experience automatically adapts based on your current
                plan tier
              </p>
            </div>

            {/* This will conditionally render DualAIAssistant or CompanionCard */}
            <PlanAwareWrapper
              fallbackPlan="FREE"
              showUpgradePrompts={true}
              className="ai-demo-wrapper"
            />
          </section>

          {/* Feature Comparison */}
          <section className="feature-comparison">
            <div className="comparison-header">
              <h2 className="section-title">AI Features by Plan</h2>
              <p className="section-description">
                See what's available at each tier
              </p>
            </div>

            <div className="comparison-grid">
              <div className="plan-card free-plan">
                <div className="plan-header">
                  <h3 className="plan-name">FREE Plan</h3>
                  <div className="plan-price">$0/month</div>
                </div>
                <div className="plan-features">
                  <div className="feature-item">
                    <span className="feature-icon">🤖</span>
                    <span>AI Companion Card</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">💬</span>
                    <span>10 conversations/month</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">🧠</span>
                    <span>Basic AI model (GPT-3.5)</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">⚡</span>
                    <span>Standard response time</span>
                  </div>
                </div>
              </div>

              <div className="plan-card pro-plan">
                <div className="plan-header">
                  <h3 className="plan-name">PRO Plan</h3>
                  <div className="plan-price">$29/month</div>
                  <div className="plan-badge">Most Popular</div>
                </div>
                <div className="plan-features">
                  <div className="feature-item">
                    <span className="feature-icon">🚀</span>
                    <span>Dual AI Assistant Console</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">💬</span>
                    <span>100 conversations/month</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">🧠</span>
                    <span>Premium AI models (GPT-4)</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">⚡</span>
                    <span>Compare AI responses</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">🎯</span>
                    <span>Model selection & switching</span>
                  </div>
                </div>
              </div>

              <div className="plan-card enterprise-plan">
                <div className="plan-header">
                  <h3 className="plan-name">ENTERPRISE</h3>
                  <div className="plan-price">Custom</div>
                </div>
                <div className="plan-features">
                  <div className="feature-item">
                    <span className="feature-icon">👑</span>
                    <span>Enterprise AI Console</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">♾️</span>
                    <span>Unlimited conversations</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">🧠</span>
                    <span>All AI models + Custom</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">⚡</span>
                    <span>Priority processing</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">🔧</span>
                    <span>Custom AI fine-tuning</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">👥</span>
                    <span>Team collaboration</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Technical Details */}
          <section className="technical-details">
            <div className="details-header">
              <h2 className="section-title">🔧 How It Works</h2>
              <p className="section-description">
                Behind the scenes of our plan-based AI system
              </p>
            </div>

            <div className="details-grid">
              <div className="detail-card">
                <h3 className="detail-title">Real-Time Plan Detection</h3>
                <p className="detail-description">
                  Our system checks <code>user.plan_tier</code> in real-time and
                  instantly adapts the interface when your plan changes.
                </p>
                <div className="code-snippet">
                  <pre>{`{currentPlan === 'FREE' ? (
  <CompanionCard />
) : (
  <DualAIAssistant />
)}`}</pre>
                </div>
              </div>

              <div className="detail-card">
                <h3 className="detail-title">Seamless Transitions</h3>
                <p className="detail-description">
                  When you upgrade, the interface smoothly transitions from the
                  Companion Card to the full Dual AI Console with no page
                  refresh.
                </p>
              </div>

              <div className="detail-card">
                <h3 className="detail-title">Builder.io Integration</h3>
                <p className="detail-description">
                  Both AI components are registered with Builder.io, allowing
                  for dynamic content management and A/B testing across plan
                  tiers.
                </p>
              </div>
            </div>
          </section>
        </div>
      </AuthenticatedMobileLayout>
    </AuthProvider>
  );
}

export const metadata = {
  title: "AI Assistant Demo - SaintSal™",
  description:
    "Experience plan-based AI assistance with conditional rendering based on user tier",
};

// Add custom styles
const styles = `
  .ai-demo-content {
    min-height: 100vh;
    background: linear-gradient(135deg, rgba(0, 0, 0, 1) 0%, rgba(24, 24, 27, 1) 100%);
    color: white;
    font-family: Inter, -apple-system, Roboto, Helvetica, sans-serif;
  }

  .demo-hero {
    padding: 60px 20px;
    text-align: center;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1));
    border-bottom: 1px solid rgba(253, 255, 220, 0.1);
  }

  .hero-content {
    max-width: 800px;
    margin: 0 auto;
  }

  .hero-title {
    font-size: clamp(28px, 5vw, 40px);
    font-weight: 700;
    color: #FDFFDC;
    margin-bottom: 16px;
  }

  .hero-description {
    font-size: 18px;
    color: #A1A1AA;
    line-height: 1.6;
    max-width: 600px;
    margin: 0 auto;
  }

  .ai-assistant-demo {
    padding: 60px 20px;
  }

  .demo-header {
    text-align: center;
    margin-bottom: 40px;
  }

  .section-title {
    font-size: 32px;
    font-weight: 700;
    color: #FDFFDC;
    margin-bottom: 12px;
  }

  .section-description {
    font-size: 16px;
    color: #A1A1AA;
    max-width: 500px;
    margin: 0 auto;
  }

  .ai-demo-wrapper {
    max-width: 1000px;
    margin: 0 auto;
  }

  .feature-comparison {
    padding: 80px 20px;
    background: rgba(24, 24, 27, 0.5);
  }

  .comparison-header {
    text-align: center;
    margin-bottom: 48px;
  }

  .comparison-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .plan-card {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(253, 255, 220, 0.2);
    border-radius: 16px;
    padding: 24px;
    position: relative;
    transition: all 0.3s ease;
  }

  .plan-card:hover {
    border-color: rgba(253, 255, 220, 0.4);
    transform: translateY(-4px);
  }

  .pro-plan {
    border-color: rgba(251, 191, 36, 0.4);
    background: linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(0, 0, 0, 0.3));
  }

  .enterprise-plan {
    border-color: rgba(168, 85, 247, 0.4);
    background: linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(0, 0, 0, 0.3));
  }

  .plan-header {
    margin-bottom: 24px;
    text-align: center;
    position: relative;
  }

  .plan-name {
    font-size: 20px;
    font-weight: 700;
    color: #FDFFDC;
    margin-bottom: 8px;
  }

  .plan-price {
    font-size: 24px;
    font-weight: 700;
    color: #FDFFDC;
  }

  .plan-badge {
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(45deg, #fbbf24, #f59e0b);
    color: #000;
    font-size: 12px;
    font-weight: 600;
    padding: 4px 12px;
    border-radius: 12px;
  }

  .plan-features {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .feature-item {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #E5E7EB;
    font-size: 14px;
  }

  .feature-icon {
    font-size: 16px;
    width: 20px;
    text-align: center;
  }

  .technical-details {
    padding: 80px 20px;
  }

  .details-header {
    text-align: center;
    margin-bottom: 48px;
  }

  .details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 24px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .detail-card {
    background: rgba(24, 24, 27, 0.5);
    border: 1px solid rgba(253, 255, 220, 0.1);
    border-radius: 12px;
    padding: 24px;
  }

  .detail-title {
    color: #FDFFDC;
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 12px;
  }

  .detail-description {
    color: #A1A1AA;
    line-height: 1.6;
    margin-bottom: 16px;
  }

  .detail-description code {
    background: rgba(253, 255, 220, 0.1);
    color: #FDFFDC;
    padding: 2px 4px;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    font-size: 13px;
  }

  .code-snippet {
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(253, 255, 220, 0.2);
    border-radius: 8px;
    padding: 16px;
    overflow-x: auto;
  }

  .code-snippet pre {
    color: #E5E7EB;
    font-family: 'Courier New', monospace;
    font-size: 14px;
    margin: 0;
    white-space: pre-wrap;
  }

  @media (max-width: 768px) {
    .demo-hero {
      padding: 40px 20px;
    }

    .ai-assistant-demo,
    .feature-comparison,
    .technical-details {
      padding: 60px 20px;
    }

    .comparison-grid,
    .details-grid {
      grid-template-columns: 1fr;
    }

    .section-title {
      font-size: 24px;
    }
  }
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
