import { type RegisteredComponent } from "@builder.io/sdk-react";
import dynamic from "next/dynamic";

// Dynamic import for Mobile Dashboard component
const MobileDashboard = dynamic(() =>
  import("./components/mobile/mobile-dashboard").then((mod) => ({
    default: mod.MobileDashboard,
  })),
);

// Dynamic import for Fusion Mobile Layout component
const FusionMobileLayout = dynamic(() =>
  import("./components/mobile/fusion-mobile-layout").then((mod) => ({
    default: mod.FusionMobileLayout,
  })),
);

// Dynamic import for Authenticated Mobile Layout component
const AuthenticatedMobileLayout = dynamic(() =>
  import("./components/mobile/authenticated-mobile-layout").then((mod) => ({
    default: mod.AuthenticatedMobileLayout,
  })),
);

// Dynamic import for AI components
const DualAIAssistant = dynamic(() =>
  import("./components/ai/dual-ai-assistant").then((mod) => ({
    default: mod.DualAIAssistant,
  })),
);

const CompanionCard = dynamic(() =>
  import("./components/ai/companion-card").then((mod) => ({
    default: mod.CompanionCard,
  })),
);

export const customComponents: RegisteredComponent[] = [
  {
    component: MobileDashboard,
    name: "MobileDashboard",
    inputs: [
      {
        name: "userInitials",
        type: "string",
        defaultValue: "AP",
        helperText: "User initials to display in avatar",
      },
      {
        name: "userName",
        type: "string",
        defaultValue: "Saint Gottaguy",
        helperText: "Full user name to display",
      },
      {
        name: "isFreeTier",
        type: "boolean",
        defaultValue: true,
        helperText: "Whether user is on free tier",
      },
      {
        name: "upgradeTitle",
        type: "string",
        defaultValue: "Upgrade to Unlimited",
        helperText: "Title for upgrade section",
      },
      {
        name: "upgradeDescription",
        type: "string",
        defaultValue:
          "Generate Premium Content by upgrading to an unlimited plan!",
        helperText: "Description for upgrade section",
      },
      {
        name: "upgradeButtonText",
        type: "string",
        defaultValue: "Get started with PRO",
        helperText: "Text for upgrade button",
      },
      {
        name: "joinUsersText",
        type: "string",
        defaultValue: "Join 80,000+ users now",
        helperText: "Text for join users section",
      },
      {
        name: "logoUrl",
        type: "file",
        allowedFileTypes: ["jpeg", "jpg", "png", "svg", "webp"],
        defaultValue:
          "https://cdn.builder.io/api/v1/image/assets/TEMP/995f5a9f55e2b585339c1ccb6ae796354253390a?width=124",
        helperText: "Logo image URL",
      },
      {
        name: "profileImageUrl",
        type: "file",
        allowedFileTypes: ["jpeg", "jpg", "png", "svg", "webp"],
        defaultValue:
          "https://cdn.builder.io/api/v1/image/assets/TEMP/2cc7e5387733bf04502b89840130924f4bb8c93b?width=163",
        helperText: "Profile image URL",
      },
    ],
    canHaveChildren: false,
    noWrap: true,
    defaultStyles: {
      display: "block",
      position: "relative",
    },
  },
  {
    component: FusionMobileLayout,
    name: "FusionMobileLayout",
    inputs: [
      {
        name: "showDashboard",
        type: "boolean",
        defaultValue: true,
        helperText: "Whether to show the mobile dashboard",
      },
      {
        name: "dashboardPosition",
        type: "string",
        enum: ["left", "right", "overlay"],
        defaultValue: "left",
        helperText: "Position of the dashboard",
      },
      {
        name: "builderModel",
        type: "string",
        defaultValue: "mobile-layout",
        helperText: "Builder.io model to fetch content from",
      },
      {
        name: "userInitials",
        type: "string",
        defaultValue: "AP",
        helperText: "User initials for dashboard",
      },
      {
        name: "userName",
        type: "string",
        defaultValue: "Saint Gottaguy",
        helperText: "User name for dashboard",
      },
      {
        name: "isFreeTier",
        type: "boolean",
        defaultValue: true,
        helperText: "Whether user is on free tier",
      },
    ],
    canHaveChildren: true,
    noWrap: true,
    defaultStyles: {
      display: "block",
      minHeight: "100vh",
    },
  },
  {
    component: AuthenticatedMobileLayout,
    name: "AuthenticatedMobileLayout",
    inputs: [
      {
        name: "showDashboard",
        type: "boolean",
        defaultValue: true,
        helperText: "Whether to show the mobile dashboard",
      },
      {
        name: "dashboardPosition",
        type: "string",
        enum: ["left", "right", "overlay", "hidden"],
        defaultValue: "left",
        helperText: "Position of the dashboard",
      },
      {
        name: "builderModel",
        type: "string",
        defaultValue: "authenticated-layout",
        helperText: "Builder.io model to fetch layout content from",
      },
      {
        name: "enableSlots",
        type: "boolean",
        defaultValue: true,
        helperText: "Enable Builder.io slot-based content",
      },
      {
        name: "className",
        type: "string",
        defaultValue: "",
        helperText: "Additional CSS classes",
      },
    ],
    canHaveChildren: true,
    noWrap: true,
    defaultStyles: {
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
    },
  },
  {
    component: DualAIAssistant,
    name: "DualAIAssistant",
    inputs: [],
    canHaveChildren: false,
    noWrap: true,
    defaultStyles: {
      display: "block",
      width: "100%",
    },
  },
  {
    component: CompanionCard,
    name: "CompanionCard",
    inputs: [
      {
        name: "className",
        type: "string",
        defaultValue: "",
        helperText: "Additional CSS classes",
      },
    ],
    canHaveChildren: false,
    noWrap: true,
    defaultStyles: {
      display: "block",
      width: "100%",
    },
  },
];
