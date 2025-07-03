# Builder.io Fusion Integration Documentation

## Overview

The Builder.io Fusion integration provides dynamic layout and page sync support for the SaintVisionAi™ chatbot application. This integration allows for real-time content management, visual editing, and seamless synchronization across devices.

## Features

### 🚀 Dynamic Layout Support

- Real-time content updates from Builder.io
- Visual component editing in Builder.io dashboard
- Responsive mobile-first design
- Component-based architecture

### 🔄 Page Sync Capabilities

- Automatic content synchronization
- Preview mode support
- Multi-model content fetching
- User attribute targeting
- Real-time updates across sessions

### 📱 Mobile Dashboard Integration

- SaintVisionAi™ branded mobile interface
- Configurable dashboard positioning
- User profile management
- Upgrade flow integration

## Components

### MobileDashboard

A pixel-perfect implementation of the SaintVisionAi™ mobile dashboard interface.

**Props:**

- `userInitials`: User initials for avatar (default: "AP")
- `userName`: Full user name (default: "Saint Gottaguy")
- `isFreeTier`: Whether user is on free tier (default: true)
- `upgradeTitle`: Title for upgrade section
- `upgradeDescription`: Description for upgrade section
- `upgradeButtonText`: Text for upgrade button
- `joinUsersText`: Text for join users section
- `logoUrl`: Logo image URL
- `profileImageUrl`: Profile image URL

### FusionMobileLayout

A wrapper component that integrates the mobile dashboard with Builder.io content.

**Props:**

- `showDashboard`: Whether to show dashboard (default: true)
- `dashboardPosition`: Position ('left', 'right', 'overlay')
- `builderModel`: Builder.io model to fetch from
- `builderContent`: Pre-fetched Builder.io content
- `userInitials`: User initials for dashboard
- `userName`: User name for dashboard
- `isFreeTier`: Whether user is on free tier

## Hooks

### useBuilderFusion

A comprehensive hook for managing Builder.io content with sync capabilities.

```tsx
const {
  content,
  isLoading,
  error,
  isPreview,
  isEdit,
  lastSync,
  refresh,
  shouldShowContent,
  updateUserAttributes,
} = useBuilderFusion({
  apiKey: process.env.NEXT_PUBLIC_BUILDER_API_KEY!,
  model: "page",
  urlPath: "/",
  userAttributes: { userId: "user123" },
  enableSync: true,
  syncInterval: 30000,
});
```

### useMultiBuilderFusion

Manage multiple Builder.io models simultaneously.

```tsx
const {
  states,
  isLoading,
  hasErrors,
  errors,
  refreshAll,
  getContentByModel,
  shouldShowAnyContent,
} = useMultiBuilderFusion([
  { apiKey, model: "page" },
  { apiKey, model: "layout" },
  { apiKey, model: "section" },
]);
```

## Setup Instructions

### 1. Environment Variables

Add your Builder.io API key to your environment:

```env
NEXT_PUBLIC_BUILDER_API_KEY=your-builder-io-api-key
```

### 2. Import Builder Configuration

Ensure Builder.io components are registered:

```tsx
import "../../../lib/builder/builder-config";
```

### 3. Wrap with Fusion Provider

Use the BuilderFusionProvider in your app:

```tsx
import { BuilderFusionProvider } from "../../lib/hooks/use-builder-fusion";

<BuilderFusionProvider
  apiKey={process.env.NEXT_PUBLIC_BUILDER_API_KEY || ""}
  models={["page", "layout", "section", "mobile-layout"]}
>
  {children}
</BuilderFusionProvider>;
```

### 4. Use Components

Implement the fusion layout in your pages:

```tsx
<FusionMobileLayout
  showDashboard={true}
  dashboardPosition="left"
  builderModel="mobile-layout"
  builderContent={mobileLayoutContent}
>
  {/* Your page content */}
</FusionMobileLayout>
```

## Builder.io Models

### Supported Models

- `page`: Main page content
- `layout`: Layout configurations
- `section`: Reusable content sections
- `mobile-layout`: Mobile-specific layouts

### Content Structure

When creating content in Builder.io, use these URL paths:

- Homepage: `/`
- Fusion Demo: `/fusion-demo`
- Custom pages: `/your-custom-path`

## Advanced Features

### Real-time Sync

Content automatically syncs every 30 seconds (configurable):

```tsx
const fusion = useBuilderFusion({
  apiKey: "your-key",
  model: "page",
  enableSync: true,
  syncInterval: 15000, // 15 seconds
});
```

### User Targeting

Target content based on user attributes:

```tsx
const fusion = useBuilderFusion({
  apiKey: "your-key",
  model: "page",
  userAttributes: {
    userId: user.id,
    tier: user.tier,
    locale: user.locale,
  },
});
```

### Preview Mode

The integration automatically detects Builder.io preview mode:

```tsx
if (fusion.isPreview || fusion.isEdit) {
  // Show preview-specific UI
}
```

## Styling

### CSS Variables

The mobile dashboard uses consistent CSS variables:

```css
:root {
  --Zinc-400: #a1a1aa;
  --Zinc-950: #09090b;
  --Zinc-900: #18181b;
  --Zinc-500: #71717a;
  --Amber-50: #fffbeb;
}
```

### Responsive Design

The layout is mobile-first with responsive breakpoints:

```css
@media (max-width: 768px) {
  .fusion-mobile-layout {
    flex-direction: column;
  }
}
```

## API Reference

### BuilderFusionProvider Props

- `apiKey`: Builder.io API key (required)
- `models`: Array of Builder.io models to support
- `children`: React children

### FusionMobileLayout Props

- `children`: React children (optional)
- `showDashboard`: Show/hide dashboard (boolean)
- `dashboardPosition`: 'left' | 'right' | 'overlay'
- `builderModel`: Builder.io model name
- `builderContent`: Pre-fetched content
- `userInitials`: User initials string
- `userName`: User name string
- `isFreeTier`: Free tier status (boolean)

## Troubleshooting

### Common Issues

1. **Content not loading**: Verify API key and model names
2. **Sync not working**: Check network connectivity and API limits
3. **Styling issues**: Ensure CSS variables are defined
4. **Performance issues**: Reduce sync interval or disable auto-sync

### Debug Mode

Enable debug logging:

```tsx
const fusion = useBuilderFusion({
  apiKey: "your-key",
  model: "page",
  debug: true, // Enable console logging
});
```

## Example Implementation

See `/app/[locale]/fusion-demo/page.tsx` for a complete implementation example.

## Support

For Builder.io specific issues, consult the [Builder.io documentation](https://www.builder.io/c/docs).

For SaintVisionAi™ integration questions, refer to the project documentation.
