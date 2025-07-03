# Authenticated Mobile Layout Documentation

## Overview

The Authenticated Mobile Layout system provides a comprehensive solution for building mobile-responsive layouts with user authentication, plan-based feature gating, and dynamic Builder.io content management. This system seamlessly integrates Supabase user context with Builder.io's visual editing capabilities.

## Key Features

### 🔐 Authentication Integration

- **Supabase Integration**: Seamless user authentication and profile management
- **Real-time User Context**: Dynamic user state management with automatic sync
- **Session Persistence**: Maintains user state across browser sessions

### 📱 Mobile-Responsive Design

- **Mobile-First Approach**: Optimized for mobile devices with responsive breakpoints
- **Adaptive Dashboard**: Configurable dashboard positioning (left, right, overlay, hidden)
- **Touch-Friendly Interface**: Optimized for touch interactions and mobile gestures

### 💳 Plan-Based Rendering

- **Multi-Tier Support**: FREE, PRO, and ENTERPRISE plan support
- **Feature Gating**: Automatic feature access control based on user plan
- **Usage Tracking**: Real-time monitoring of chats, tokens, and storage usage
- **Smart Upgrade Prompts**: Contextual upgrade suggestions based on usage patterns

### 🧩 Dynamic Builder.io Slots

- **Slot-Based Architecture**: Header, sidebar, main, footer, and overlay slots
- **Visual Content Management**: Edit content through Builder.io's visual editor
- **User-Targeted Content**: Deliver personalized content based on user attributes
- **Real-Time Sync**: Automatic content updates with 30-second sync intervals

## Architecture

### Component Hierarchy

```
AuthProvider
└── AuthenticatedMobileLayout
    ├── Header Slot (Builder.io)
    ├── Sidebar/Dashboard
    │   ├── MobileDashboard
    │   ├── UsageMeters
    │   └── UpgradePrompts
    ├── Main Content (Builder.io + Children)
    ├── Footer Slot (Builder.io)
    └── Overlay Slot (Builder.io)
```

### Data Flow

```
Supabase Auth → AuthContext → UserProfile → Plan Features → Feature Gates → UI Rendering
                    ↓
Builder.io CMS → Dynamic Slots → Content Rendering → User-Targeted Experience
```

## Implementation Guide

### 1. Setup Authentication Context

```tsx
import { AuthProvider } from "@/context/auth-context";

function App() {
  return (
    <AuthProvider>
      <YourAppContent />
    </AuthProvider>
  );
}
```

### 2. Basic Layout Implementation

```tsx
import { AuthenticatedMobileLayout } from "@/components/mobile/authenticated-mobile-layout";

function MyPage() {
  return (
    <AuthenticatedMobileLayout
      showDashboard={true}
      dashboardPosition="left"
      builderModel="my-page-layout"
      enableSlots={true}
    >
      <YourPageContent />
    </AuthenticatedMobileLayout>
  );
}
```

### 3. Plan-Based Feature Implementation

```tsx
import { usePlanFeatures } from "@/lib/hooks/use-plan-features";

function FeatureComponent() {
  const { FeatureGate, canAccessFeature } = usePlanFeatures();

  return (
    <FeatureGate feature="hasAdvancedFeatures">
      <AdvancedFeatureComponent />
    </FeatureGate>
  );
}
```

### 4. Usage Monitoring

```tsx
import { useChatFeatures } from "@/lib/hooks/use-plan-features";

function ChatInterface() {
  const { canStartNewChat, getChatLimits, startChat } = useChatFeatures();
  const limits = getChatLimits();

  const handleNewChat = () => {
    if (canStartNewChat()) {
      startChat({ source: "manual" });
    }
  };

  return (
    <div>
      <p>
        Chats used: {limits.used} / {limits.limit}
      </p>
      <button onClick={handleNewChat} disabled={!canStartNewChat()}>
        New Chat
      </button>
    </div>
  );
}
```

## User Plan System

### Plan Definitions

#### FREE Plan

- **Monthly Chats**: 10
- **Token Limit**: 10,000
- **Storage**: 1GB
- **Features**: Basic functionality only
- **Support**: Community support

#### PRO Plan ($29/month)

- **Monthly Chats**: 100
- **Token Limit**: 100,000
- **Storage**: 10GB
- **Features**: Advanced features, premium models, custom tools
- **Support**: Email support

#### ENTERPRISE Plan (Custom)

- **Monthly Chats**: Unlimited
- **Token Limit**: Unlimited
- **Storage**: Unlimited
- **Features**: All features, team collaboration, custom integrations
- **Support**: Priority support with SLA

### Feature Matrix

| Feature            | FREE | PRO | ENTERPRISE |
| ------------------ | ---- | --- | ---------- |
| Basic Chat         | ✅   | ✅  | ✅         |
| Advanced Models    | ❌   | ✅  | ✅         |
| Custom Tools       | ❌   | ✅  | ✅         |
| API Access         | ❌   | ✅  | ✅         |
| Team Collaboration | ❌   | ❌  | ✅         |
| Custom Branding    | ❌   | ✅  | ✅         |
| Webhooks           | ❌   | ❌  | ✅         |
| Priority Support   | ❌   | ❌  | ✅         |

## Builder.io Integration

### Slot Configuration

```tsx
// Configure Builder.io slots
const slots = {
  header: "header-slot", // Top navigation/branding
  sidebar: "sidebar-slot", // Left/right sidebar content
  main: "main-slot", // Primary content area
  footer: "footer-slot", // Bottom navigation/links
  overlay: "overlay-slot", // Modal/popup content
};
```

### User Attribute Targeting

Builder.io content can be targeted based on user attributes:

```javascript
// User attributes sent to Builder.io
{
  userId: "user-123",
  plan: "PRO",
  isAuthenticated: true,
  hasFeatureAccess: true,
  usagePercentage: 65,
  timeZone: "America/New_York",
  locale: "en"
}
```

### Content Models

#### Layout Model (`authenticated-layout`)

- Page-level layout configuration
- Global styling and branding
- Navigation structure

#### Slot Models

- `header-slot`: Header content and navigation
- `sidebar-slot`: Sidebar content and widgets
- `main-slot`: Main content area components
- `footer-slot`: Footer content and links
- `overlay-slot`: Modal and popup content

## Usage Tracking & Limits

### Automatic Tracking

The system automatically tracks:

- **Chat Count**: Number of chat sessions per month
- **Token Usage**: Total tokens consumed across all interactions
- **Storage Usage**: File uploads and data storage consumption

### Limit Enforcement

```tsx
// Usage limits are enforced at the component level
const { shouldBlockAction, getUsageStatus } = usePlanFeatures();

// Check before allowing action
if (shouldBlockAction("chats")) {
  // Show upgrade prompt
  return <UpgradePrompt />;
}
```

### Upgrade Prompts

Upgrade prompts are triggered automatically based on:

- **Usage Thresholds**: 70% warning, 90% urgent, 100% blocked
- **Feature Access**: When user tries to access premium features
- **Time-Based**: Proactive prompts for long-term free users

## Responsive Design

### Breakpoints

```css
/* Mobile First */
.mobile-layout {
  /* Base mobile styles */
}

/* Tablet */
@media (min-width: 768px) {
  .mobile-layout {
    /* Tablet adjustments */
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .mobile-layout {
    /* Desktop optimizations */
  }
}
```

### Dashboard Positioning

#### Left Position (Default)

- Dashboard on left side
- Main content on right
- Best for desktop/tablet

#### Right Position

- Dashboard on right side
- Main content on left
- Alternative desktop layout

#### Overlay Position

- Dashboard as full-screen overlay
- Ideal for mobile devices
- Toggleable with backdrop

#### Hidden Position

- Dashboard completely hidden
- Full-width main content
- Minimal interface mode

## Customization

### Theme Customization

```css
:root {
  /* Plan-specific accent colors */
  --free-accent: #fdffdc;
  --pro-accent: #fbbf24;
  --enterprise-accent: #a855f7;

  /* Component colors */
  --dashboard-bg: rgba(9, 9, 11, 0.95);
  --header-bg: rgba(24, 24, 27, 0.95);
  --border-color: rgba(253, 255, 220, 0.1);
}
```

### Custom Feature Gates

```tsx
// Create custom feature gates
function CustomFeatureGate({ children }) {
  const { userProfile } = useAuth();
  const canAccess = userProfile?.plan === "ENTERPRISE";

  return canAccess ? children : <UpgradePrompt />;
}
```

## API Reference

### AuthenticatedMobileLayout Props

```typescript
interface AuthenticatedMobileLayoutProps {
  children?: React.ReactNode;
  showDashboard?: boolean;
  dashboardPosition?: "left" | "right" | "overlay" | "hidden";
  builderModel?: string;
  enableSlots?: boolean;
  className?: string;
  slots?: {
    header?: string;
    sidebar?: string;
    main?: string;
    footer?: string;
    overlay?: string;
  };
}
```

### useAuth Hook

```typescript
interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updatePlan: (plan: UserPlan) => Promise<void>;
  checkFeatureAccess: (feature: string) => boolean;
  getRemainingUsage: (type: "chats" | "tokens" | "storage") => number;
  isUsageLimitReached: (type: "chats" | "tokens" | "storage") => boolean;
}
```

### usePlanFeatures Hook

```typescript
interface PlanFeaturesHook {
  canAccessFeature: (feature: string) => boolean;
  getUsageStatus: (type: "chats" | "tokens" | "storage") => UsageStatus;
  shouldBlockAction: (
    type: "chats" | "tokens" | "storage",
    threshold?: number,
  ) => boolean;
  FeatureGate: React.ComponentType<FeatureGateProps>;
  UsageGate: React.ComponentType<UsageGateProps>;
  getUpgradeSuggestions: () => UpgradeSuggestion[];
}
```

## Performance Considerations

### Optimization Strategies

1. **Lazy Loading**: Components are dynamically imported
2. **Memoization**: Expensive calculations are memoized
3. **Selective Rendering**: Only render what's needed for current plan
4. **Efficient Syncing**: Builder.io content syncs every 30 seconds
5. **Local Storage**: Cache user preferences locally

### Bundle Splitting

```typescript
// Components are split into separate bundles
const AuthenticatedMobileLayout = dynamic(
  () => import("./authenticated-mobile-layout"),
);
```

## Security Considerations

### Authentication Security

- JWT tokens stored securely
- Automatic session refresh
- Secure logout on all devices

### Plan Validation

- Server-side plan verification
- Feature access validated on backend
- Usage limits enforced server-side

### Content Security

- Builder.io content sanitized
- User-generated content filtered
- XSS protection enabled

## Testing

### Unit Tests

```typescript
// Test plan-based feature access
describe('Plan Features', () => {
  it('should allow PRO features for PRO users', () => {
    const { result } = renderHook(() => usePlanFeatures(), {
      wrapper: ({ children }) => (
        <AuthProvider>
          <MockUser plan="PRO">{children}</MockUser>
        </AuthProvider>
      ),
    });

    expect(result.current.canAccessFeature('hasAdvancedFeatures')).toBe(true);
  });
});
```

### Integration Tests

- Test authentication flows
- Verify plan-based rendering
- Test usage limit enforcement
- Validate Builder.io integration

## Troubleshooting

### Common Issues

1. **Content Not Loading**

   - Verify Builder.io API key
   - Check model names and paths
   - Ensure user attributes are properly set

2. **Feature Gates Not Working**

   - Verify user profile contains plan information
   - Check feature definitions in plan configuration
   - Ensure authentication context is properly initialized

3. **Usage Tracking Issues**
   - Verify database connections
   - Check usage calculation logic
   - Ensure real-time updates are working

### Debug Tools

```typescript
// Enable debug mode
const fusion = useBuilderFusion({
  apiKey: "your-key",
  model: "page",
  debug: true, // Enable console logging
});
```

## Migration Guide

### From Basic Layout

1. Wrap existing layouts with `AuthProvider`
2. Replace layout components with `AuthenticatedMobileLayout`
3. Add plan-based feature gates where needed
4. Configure Builder.io slots for dynamic content

### Database Schema Updates

```sql
-- Add plan information to user profiles
ALTER TABLE profiles
ADD COLUMN plan VARCHAR(20) DEFAULT 'FREE',
ADD COLUMN plan_expires_at TIMESTAMP,
ADD COLUMN monthly_chat_count INTEGER DEFAULT 0,
ADD COLUMN monthly_token_usage INTEGER DEFAULT 0,
ADD COLUMN storage_used DECIMAL DEFAULT 0;
```

## Best Practices

### Component Design

- Keep components small and focused
- Use proper TypeScript types
- Implement proper error boundaries
- Follow accessibility guidelines

### Plan Management

- Always validate plan access server-side
- Provide clear upgrade paths
- Track usage accurately
- Give users visibility into their limits

### Content Management

- Use semantic naming for Builder.io models
- Implement proper content fallbacks
- Test content across all plan types
- Optimize for mobile-first experiences

## Support & Resources

- **Builder.io Documentation**: [builder.io/docs](https://builder.io/docs)
- **Supabase Auth Guide**: [supabase.com/auth](https://supabase.com/auth)
- **Project Repository**: Internal repository with examples
- **Community Support**: Internal Slack channels

---

This documentation provides a comprehensive guide to implementing and maintaining the Authenticated Mobile Layout system. For specific implementation questions or advanced use cases, consult the example code in `/app/[locale]/auth-demo/page.tsx`.
