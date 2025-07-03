"use client";

import React from "react";
import {
  Content,
  fetchOneEntry,
  isPreviewing,
  isEditing,
} from "@builder.io/sdk-react";
import { MobileDashboard } from "./mobile-dashboard";
import "../../../lib/builder/builder-config"; // Ensure components are registered

interface FusionMobileLayoutProps {
  children?: React.ReactNode;
  showDashboard?: boolean;
  dashboardPosition?: "left" | "right" | "overlay";
  builderModel?: string;
  builderContent?: any;
  userInitials?: string;
  userName?: string;
  isFreeTier?: boolean;
}

export const FusionMobileLayout = ({
  children,
  showDashboard = true,
  dashboardPosition = "left",
  builderModel = "mobile-layout",
  builderContent,
  userInitials = "AP",
  userName = "Saint Gottaguy",
  isFreeTier = true,
}: FusionMobileLayoutProps) => {
  const renderDashboard = () => {
    if (!showDashboard) return null;

    return (
      <div className={`dashboard-container dashboard-${dashboardPosition}`}>
        <MobileDashboard
          userInitials={userInitials}
          userName={userName}
          isFreeTier={isFreeTier}
        />
      </div>
    );
  };

  const renderBuilderContent = () => {
    if (!builderContent && !isPreviewing() && !isEditing()) {
      return null;
    }

    return (
      <div className="builder-content">
        <Content
          apiKey={process.env.NEXT_PUBLIC_BUILDER_API_KEY!}
          model={builderModel}
          content={builderContent}
        />
      </div>
    );
  };

  return (
    <div className="fusion-mobile-layout">
      {/* Mobile Dashboard */}
      {renderDashboard()}

      {/* Main Content Area */}
      <div
        className={`main-content ${showDashboard ? `with-dashboard-${dashboardPosition}` : ""}`}
      >
        {/* Builder.io Dynamic Content */}
        {renderBuilderContent()}

        {/* Static/Passed Children */}
        {children && <div className="static-content">{children}</div>}
      </div>

      <style jsx>{`
        .fusion-mobile-layout {
          display: flex;
          min-height: 100vh;
          background: #000;
          position: relative;
          font-family:
            Inter,
            -apple-system,
            Roboto,
            Helvetica,
            sans-serif;
        }

        .dashboard-container {
          z-index: 100;
        }

        .dashboard-left {
          position: fixed;
          left: 0;
          top: 0;
          height: 100vh;
          overflow-y: auto;
          background: rgba(0, 0, 0, 0.95);
        }

        .dashboard-right {
          position: fixed;
          right: 0;
          top: 0;
          height: 100vh;
          overflow-y: auto;
          background: rgba(0, 0, 0, 0.95);
        }

        .dashboard-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1000;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .main-content {
          flex: 1;
          min-height: 100vh;
          background: #000;
          overflow-x: hidden;
        }

        .with-dashboard-left {
          margin-left: 331px;
        }

        .with-dashboard-right {
          margin-right: 331px;
        }

        .builder-content {
          width: 100%;
          min-height: 100vh;
        }

        .static-content {
          width: 100%;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .fusion-mobile-layout {
            flex-direction: column;
          }

          .dashboard-left,
          .dashboard-right {
            position: relative;
            height: auto;
            width: 100%;
          }

          .with-dashboard-left,
          .with-dashboard-right {
            margin: 0;
          }

          .main-content {
            order: 2;
          }

          .dashboard-container {
            order: 1;
          }
        }

        /* Dark mode optimizations */
        .fusion-mobile-layout * {
          scrollbar-width: thin;
          scrollbar-color: #71717a #18181b;
        }

        .fusion-mobile-layout *::-webkit-scrollbar {
          width: 6px;
        }

        .fusion-mobile-layout *::-webkit-scrollbar-track {
          background: #18181b;
        }

        .fusion-mobile-layout *::-webkit-scrollbar-thumb {
          background-color: #71717a;
          border-radius: 3px;
        }

        .fusion-mobile-layout *::-webkit-scrollbar-thumb:hover {
          background-color: #a1a1aa;
        }
      `}</style>
    </div>
  );
};

export default FusionMobileLayout;
