import { AuthenticatedMobileLayout } from "../../../components/mobile/authenticated-mobile-layout";
import { AuthProvider } from "../../../context/auth-context";
import "../../../lib/builder/builder-config"; // Ensure components are registered

interface AuthDemoPageProps {
  params: {
    locale: string;
  };
  searchParams: Record<string, string>;
}

export default function AuthDemoPage(props: AuthDemoPageProps) {
  return (
    <AuthProvider>
      <AuthenticatedMobileLayout
        showDashboard={true}
        dashboardPosition="left"
        builderModel="authenticated-layout"
        enableSlots={true}
        slots={{
          header: "header-slot",
          sidebar: "sidebar-slot",
          main: "main-slot",
          footer: "footer-slot",
          overlay: "overlay-slot",
        }}
      >
        {/* Demo Content */}
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="text-center py-12">
            <h1 className="text-4xl font-bold text-[#FDFFDC] mb-4">
              🔐 Authenticated Mobile Layout Demo
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Experience the power of plan-based rendering with dynamic
              Builder.io slots and Supabase user context integration.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Plan-Based Rendering */}
            <div className="bg-gray-900 p-6 rounded-xl border border-[#FDFFDC]/20">
              <div className="w-12 h-12 bg-[#FDFFDC]/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-[#FDFFDC] mb-3">
                Plan-Based Rendering
              </h3>
              <p className="text-gray-300 text-sm">
                Content and features dynamically adapt based on user's
                subscription plan (FREE, PRO, ENTERPRISE).
              </p>
            </div>

            {/* Dynamic Slots */}
            <div className="bg-gray-900 p-6 rounded-xl border border-[#FDFFDC]/20">
              <div className="w-12 h-12 bg-[#FDFFDC]/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🧩</span>
              </div>
              <h3 className="text-xl font-semibold text-[#FDFFDC] mb-3">
                Builder.io Slots
              </h3>
              <p className="text-gray-300 text-sm">
                Header, sidebar, main, footer, and overlay slots can be managed
                dynamically through Builder.io CMS.
              </p>
            </div>

            {/* Usage Tracking */}
            <div className="bg-gray-900 p-6 rounded-xl border border-[#FDFFDC]/20">
              <div className="w-12 h-12 bg-[#FDFFDC]/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-[#FDFFDC] mb-3">
                Usage Monitoring
              </h3>
              <p className="text-gray-300 text-sm">
                Real-time tracking of chats, tokens, and storage usage with
                automated upgrade prompts.
              </p>
            </div>

            {/* Supabase Integration */}
            <div className="bg-gray-900 p-6 rounded-xl border border-[#FDFFDC]/20">
              <div className="w-12 h-12 bg-[#FDFFDC]/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔗</span>
              </div>
              <h3 className="text-xl font-semibold text-[#FDFFDC] mb-3">
                Supabase Auth
              </h3>
              <p className="text-gray-300 text-sm">
                Seamless authentication and user profile management with
                real-time sync capabilities.
              </p>
            </div>

            {/* Mobile Responsive */}
            <div className="bg-gray-900 p-6 rounded-xl border border-[#FDFFDC]/20">
              <div className="w-12 h-12 bg-[#FDFFDC]/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold text-[#FDFFDC] mb-3">
                Mobile First
              </h3>
              <p className="text-gray-300 text-sm">
                Fully responsive design that works perfectly on mobile, tablet,
                and desktop devices.
              </p>
            </div>

            {/* Upgrade Prompts */}
            <div className="bg-gray-900 p-6 rounded-xl border border-[#FDFFDC]/20">
              <div className="w-12 h-12 bg-[#FDFFDC]/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-[#FDFFDC] mb-3">
                Smart Upgrades
              </h3>
              <p className="text-gray-300 text-sm">
                Intelligent upgrade prompts based on usage patterns and feature
                access requirements.
              </p>
            </div>
          </div>

          {/* Interactive Demo Section */}
          <div className="bg-gradient-to-r from-[#FDFFDC]/10 to-transparent p-8 rounded-2xl border border-[#FDFFDC]/20">
            <h2 className="text-2xl font-bold text-[#FDFFDC] mb-4">
              🚀 Interactive Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#FDFFDC]">
                  Current User Context
                </h3>
                <div className="text-sm text-gray-300 space-y-2">
                  <p>• Dashboard shows user-specific information</p>
                  <p>• Usage meters reflect current consumption</p>
                  <p>• Plan-specific features are enabled/disabled</p>
                  <p>• Upgrade prompts appear based on usage</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#FDFFDC]">
                  Builder.io Integration
                </h3>
                <div className="text-sm text-gray-300 space-y-2">
                  <p>• Real-time content synchronization</p>
                  <p>• Visual editing in Builder.io dashboard</p>
                  <p>• User-targeted content delivery</p>
                  <p>• Preview mode support</p>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Details */}
          <div className="bg-gray-900/50 p-8 rounded-2xl border border-gray-700">
            <h2 className="text-2xl font-bold text-[#FDFFDC] mb-6">
              🔧 Technical Implementation
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-[#FDFFDC] mb-3">
                  Authentication Context
                </h3>
                <pre className="bg-black/50 p-4 rounded-lg text-sm text-gray-300 overflow-x-auto">
                  {`// User authentication and plan management
const { user, userProfile, plan, features } = useAuth();
const { needsUpgrade, urgency } = useUpgradeCheck();`}
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#FDFFDC] mb-3">
                  Builder.io Slots
                </h3>
                <pre className="bg-black/50 p-4 rounded-lg text-sm text-gray-300 overflow-x-auto">
                  {`// Dynamic slot configuration
slots={{
  header: 'header-slot',
  sidebar: 'sidebar-slot', 
  main: 'main-slot',
  footer: 'footer-slot',
  overlay: 'overlay-slot'
}}`}
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#FDFFDC] mb-3">
                  Plan-Based Features
                </h3>
                <pre className="bg-black/50 p-4 rounded-lg text-sm text-gray-300 overflow-x-auto">
                  {`// Feature access control
const features = getUserPlanFeatures(userProfile.plan);
const canAccess = features.hasAdvancedFeatures;
const usageLimit = features.maxChats;`}
                </pre>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-[#FDFFDC] mb-4">
              Ready to Experience the Full Power?
            </h2>
            <p className="text-gray-300 mb-6">
              This demo showcases a small portion of what's possible with
              authenticated layouts and plan-based rendering.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 bg-[#FDFFDC] text-black rounded-xl font-semibold hover:bg-[#FDFFDC]/90 transition-colors">
                Explore Builder.io Integration
              </button>
              <button className="px-6 py-3 border border-[#FDFFDC]/30 text-[#FDFFDC] rounded-xl font-semibold hover:bg-[#FDFFDC]/10 transition-colors">
                View Documentation
              </button>
            </div>
          </div>
        </div>
      </AuthenticatedMobileLayout>
    </AuthProvider>
  );
}

export const metadata = {
  title: "Authenticated Layout Demo - SaintVisionAi™",
  description:
    "Experience plan-based rendering with dynamic Builder.io slots and Supabase user context integration",
};
