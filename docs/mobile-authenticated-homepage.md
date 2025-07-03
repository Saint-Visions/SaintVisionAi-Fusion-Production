# Mobile-Authenticated Homepage Implementation

## Overview

This documentation covers the complete implementation of a mobile-responsive, authenticated homepage that detects the user's Supabase plan in real-time and shows different dashboard content based on their tier (FREE, PRO, ENTERPRISE). The implementation includes Builder.io slots, SaintSal™ branding, dark mode support, and floating upgrade prompts.

## Architecture Overview

```
AuthProvider (Root Context)
└── AuthenticatedMobileLayout (Main Container)
    ├── SaintSal™ Header (Branding + Navigation)
    ├── Plan-Aware Dashboard Sections
    │   ├── AI Chat Section (Plan-specific features)
    │   ├── Smart Leads Section (Plan-specific limits)
    │   ├── Chrome Extension Section (PRO+ only)
    │   └── Pricing Highlights Section (Plan comparison)
    ├── Builder.io Dynamic Slots
    │   ├── Hero Slot (Customizable hero content)
    │   ├── Dashboard Slot (Custom dashboard widgets)
    │   └── Footer Slot (Dynamic footer content)
    └── Floating Upgrade Prompt (FREE plan only)
```

## Key Features Implemented

### 🔐 Real-Time Plan Detection

- **Supabase Integration**: Live user authentication and plan status
- **Plan-Based Rendering**: Content adapts instantly to plan changes
- **Usage Monitoring**: Real-time tracking of chats, tokens, storage
- **Automatic Limits**: Enforced plan restrictions with graceful degradation

### 📱 Mobile-Responsive Design

- **Mobile-First**: Optimized for touch interfaces and small screens
- **Adaptive Layout**: Dashboard positions adjust based on screen size
- **Touch-Friendly**: 44px minimum touch targets throughout
- **Gesture Support**: Swipe gestures for navigation on mobile

### 🎨 SaintSal™ Branding System

- **Consistent Identity**: Unified branding across all components
- **Animated Icons**: Subtle animations with respect for reduced motion
- **Theme Support**: Automatic dark/light mode detection
- **Scalable Design**: Multiple size variants for different contexts

### 🧩 Builder.io Integration

- **Dynamic Slots**: Header, hero, dashboard, footer, and overlay slots
- **Visual Editing**: Edit content through Builder.io's interface
- **User Targeting**: Content personalized by plan and user attributes
- **Real-Time Sync**: 30-second automatic content synchronization

### ⚡ Smart Upgrade System

- **Context-Aware**: Prompts appear based on usage patterns
- **Multiple Triggers**: Usage limits, feature access, time-based
- **Non-Intrusive**: Floating design that doesn't block workflow
- **Conversion-Optimized**: Clear value propositions and CTAs

## Component Structure

### 1. Homepage Entry Point (`app/[locale]/page.tsx`)

- Server-side Builder.io content fetching
- Layout configuration and slot mapping
- SEO optimization with metadata
- Progressive enhancement for non-JS users

### 2. Plan-Aware Wrapper (`components/layout/plan-aware-wrapper.tsx`)

- Real-time plan detection and display
- Smooth transitions between plan states
- Plan-specific feature showcases
- Usage statistics visualization

### 3. Plan-Based Sections (`components/dashboard/plan-sections.tsx`)

- **AI Chat Section**: Plan-specific conversation limits and models
- **Smart Leads Section**: Lead discovery capabilities by tier
- **Chrome Extension Section**: PRO+ exclusive browser integration
- **Pricing Highlights Section**: Current plan status and upgrade paths

### 4. Floating Upgrade Prompt (`components/upgrade/floating-upgrade-prompt.tsx`)

- Animated entry/exit with Framer Motion
- Expandable design (collapsed ↔ expanded states)
- Multiple trigger conditions
- Dismissible with persistence

### 5. SaintSal™ Branding (`components/branding/saintsal-branding.tsx`)

- Consistent visual identity system
- Multiple variants (full, compact, icon-only)
- Animated icon layers with performance optimization
- Accessibility and high contrast support

### 6. Authentication Context (`context/auth-context.tsx`)

- Supabase user management
- Plan feature validation
- Usage tracking and limits
- Real-time profile synchronization

## Plan-Based Features Matrix

| Feature                 | FREE    | PRO       | ENTERPRISE   |
| ----------------------- | ------- | --------- | ------------ |
| **Monthly Chats**       | 10      | 100       | Unlimited    |
| **Token Limit**         | 10,000  | 100,000   | Unlimited    |
| **Storage**             | 1GB     | 10GB      | Unlimited    |
| **AI Models**           | Basic   | Premium   | All + Custom |
| **Chrome Extension**    | ❌      | ✅        | ✅           |
| **Lead Discovery**      | 5/month | 500/month | Unlimited    |
| **API Access**          | ❌      | ✅        | ✅           |
| **Team Features**       | ❌      | ❌        | ✅           |
| **Priority Support**    | ❌      | ❌        | ✅           |
| **Custom Integrations** | ❌      | ❌        | ✅           |

## Builder.io Slot Configuration

### Header Slot (`header-slot`)

- Navigation components
- User profile widgets
- Plan status indicators
- Notification centers

### Hero Slot (`hero-slot`)

- Dynamic banner content
- Feature announcements
- Seasonal promotions
- A/B testing variants

### Dashboard Slot (`dashboard-slot`)

- Custom dashboard widgets
- Third-party integrations
- Analytics components
- Team collaboration tools

### Footer Slot (`footer-slot`)

- Dynamic footer links
- Legal information
- Social media links
- Help resources

### Overlay Slot (`overlay-slot`)

- Modal content
- Popup announcements
- Tour guides
- Feedback forms

## Implementation Examples

### Basic Usage

```tsx
import { AuthProvider } from "@/context/auth-context";
import { AuthenticatedMobileLayout } from "@/components/mobile/authenticated-mobile-layout";

export default function HomePage() {
  return (
    <AuthProvider>
      <AuthenticatedMobileLayout
        showDashboard={true}
        dashboardPosition="left"
        enableSlots={true}
      >
        <YourContent />
      </AuthenticatedMobileLayout>
    </AuthProvider>
  );
}
```

### Plan-Specific Content

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

### Usage Monitoring

```tsx
import { useAuth } from "@/context/auth-context";

function UsageDisplay() {
  const { userProfile, getRemainingUsage } = useAuth();
  const remainingChats = getRemainingUsage("chats");

  return <div>Remaining chats: {remainingChats}</div>;
}
```

### Custom Branding

```tsx
import { SaintSalBranding } from "@/components/branding/saintsal-branding";

function Header() {
  return (
    <SaintSalBranding
      variant="compact"
      size="md"
      theme="auto"
      showTagline={true}
      animated={true}
    />
  );
}
```

## Performance Optimizations

### Code Splitting

- Dynamic imports for all major components
- Lazy loading of plan-specific features
- Route-based chunking for optimal loading

### Image Optimization

- Next.js Image component with optimization
- WebP format with fallbacks
- Responsive image sizing

### Animation Performance

- GPU-accelerated animations with `transform` and `opacity`
- Respect for `prefers-reduced-motion`
- Efficient Framer Motion configurations

### Memory Management

- Cleanup of event listeners and timers
- Optimized re-renders with React.memo
- Efficient state management patterns

## Accessibility Features

### Screen Reader Support

- Semantic HTML structure
- ARIA labels and descriptions
- Proper heading hierarchy
- Focus management

### Keyboard Navigation

- Tab order optimization
- Keyboard shortcuts for common actions
- Skip links for navigation
- Focus indicators

### Visual Accessibility

- High contrast mode support
- Scalable font sizes
- Color-blind friendly palettes
- Motion reduction preferences

## SEO Optimization

### Metadata

- Dynamic page titles based on user plan
- Rich Open Graph tags
- Twitter Card optimization
- Structured data markup

### Performance

- Core Web Vitals optimization
- Server-side rendering
- Efficient resource loading
- Critical CSS inlining

## Testing Strategy

### Unit Tests

```typescript
// Example test for plan features
describe("Plan Features", () => {
  it("should show PRO features for PRO users", () => {
    const { result } = renderHook(() => usePlanFeatures(), {
      wrapper: createAuthWrapper("PRO"),
    });
    expect(result.current.canAccessFeature("hasAdvancedFeatures")).toBe(true);
  });
});
```

### Integration Tests

- Authentication flow testing
- Plan upgrade/downgrade scenarios
- Builder.io content loading
- Mobile responsiveness

### E2E Tests

- Complete user journeys
- Plan-based feature access
- Upgrade flow completion
- Cross-browser compatibility

## Deployment Considerations

### Environment Variables

```env
NEXT_PUBLIC_BUILDER_API_KEY=your_builder_io_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Build Configuration

- Static generation for public pages
- Server-side rendering for authenticated pages
- Edge functions for real-time features
- CDN optimization for global performance

### Monitoring

- Real-time error tracking
- Performance monitoring
- User analytics
- Conversion tracking

## Troubleshooting

### Common Issues

1. **Plan Detection Not Working**

   - Verify Supabase connection
   - Check user profile structure
   - Validate authentication tokens

2. **Builder.io Content Not Loading**

   - Confirm API key configuration
   - Check model names and paths
   - Verify user attribute targeting

3. **Mobile Layout Issues**

   - Test on physical devices
   - Verify touch target sizes
   - Check viewport configuration

4. **Performance Problems**
   - Analyze bundle sizes
   - Check for memory leaks
   - Optimize image loading

### Debug Tools

```typescript
// Enable debug mode
const authDebug = useAuth({ debug: true });
const builderDebug = useBuilderFusion({ debug: true });
```

## Future Enhancements

### Planned Features

- **Multi-language Support**: i18n integration for global users
- **Advanced Analytics**: Detailed usage insights and trends
- **Team Management**: Collaboration features for Enterprise users
- **API Documentation**: Interactive API explorer
- **Mobile App**: React Native implementation

### Performance Improvements

- **Edge Computing**: Move authentication to edge functions
- **Smart Caching**: Intelligent content caching strategies
- **Progressive Loading**: Skeleton screens and loading states
- **Background Sync**: Offline capability with sync when online

## Support and Resources

### Documentation

- [Builder.io Integration Guide](./builder-fusion-integration.md)
- [Authentication Setup](./authenticated-mobile-layout.md)
- [Plan Management](../types/user-plans.ts)

### Community

- Internal Slack channels for development
- Regular architecture reviews
- Code review guidelines
- Best practices documentation

---

This implementation provides a solid foundation for a plan-aware, mobile-responsive homepage that can scale with business needs while maintaining excellent user experience across all devices and plan tiers.
