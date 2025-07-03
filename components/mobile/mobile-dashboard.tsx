"use client";

import React from "react";
import {
  User,
  CpuChip,
  DocumentText,
  Photo,
  Microphone,
  Users,
  Cog8Tooth,
  CreditCard,
  Clock,
  LockClosed,
  Home,
} from "@tabler/icons-react";

interface MobileDashboardProps {
  userInitials?: string;
  userName?: string;
  isFreeTier?: boolean;
  upgradeTitle?: string;
  upgradeDescription?: string;
  upgradeButtonText?: string;
  joinUsersText?: string;
  logoUrl?: string;
  profileImageUrl?: string;
  menuItems?: Array<{
    id: string;
    label: string;
    icon: string;
    emoji: string;
    isLocked?: boolean;
    isActive?: boolean;
  }>;
}

const defaultMenuItems = [
  {
    id: "main-dashboard",
    label: "Main Dashboard",
    icon: "home",
    emoji: "",
    isActive: true,
  },
  {
    id: "companion",
    label: "My Companion",
    icon: "user",
    emoji: "🧠",
    isLocked: true,
  },
  {
    id: "business",
    label: "My Business",
    icon: "cpu-chip",
    emoji: "📁",
    isLocked: true,
  },
  {
    id: "sticky-notes",
    label: "Sticky Notes",
    icon: "document-text",
    emoji: "✍️",
    isLocked: true,
  },
  {
    id: "ai-tools",
    label: "Ai Tools",
    icon: "photo",
    emoji: "🛠️🌃",
    isLocked: true,
  },
  {
    id: "image-generator",
    label: "Image Generator",
    icon: "microphone",
    emoji: "🤖",
    isLocked: true,
  },
  {
    id: "svg-launchpad",
    label: "SVG Launchpad",
    icon: "users",
    emoji: "🚀",
    isLocked: true,
  },
  {
    id: "feedback-help",
    label: "Feedback & Help",
    icon: "cog-8-tooth",
    emoji: "🗣️",
    isLocked: true,
  },
  {
    id: "partnertech-crm",
    label: "PartnerTech.ai CRM",
    icon: "credit-card",
    emoji: "",
    isLocked: true,
  },
  {
    id: "client-portal",
    label: "Client Portal",
    icon: "clock",
    emoji: "🏟️",
    isLocked: true,
  },
  {
    id: "svt-institute",
    label: "SVT Institute of AI (R + D)",
    icon: "lock-closed",
    emoji: "🏛️",
    isLocked: true,
  },
  {
    id: "upgrade-tier",
    label: "Upgrade Tier",
    icon: "lock-closed",
    emoji: "⚡️",
    isLocked: true,
  },
  {
    id: "my-account",
    label: "My Account",
    icon: "lock-closed",
    emoji: "💫",
    isLocked: true,
  },
  {
    id: "logout",
    label: "Logout",
    icon: "lock-closed",
    emoji: "👀",
    isLocked: true,
  },
];

const IconComponent = ({ iconName }: { iconName: string }) => {
  const iconProps = { size: 16, stroke: 1.2, color: "#FDFFDC" };

  switch (iconName) {
    case "home":
      return <Home {...iconProps} strokeWidth={1.5} />;
    case "user":
      return <User {...iconProps} strokeWidth={1.5} />;
    case "cpu-chip":
      return <CpuChip {...iconProps} />;
    case "document-text":
      return <DocumentText {...iconProps} />;
    case "photo":
      return <Photo {...iconProps} />;
    case "microphone":
      return <Microphone {...iconProps} />;
    case "users":
      return <Users {...iconProps} />;
    case "cog-8-tooth":
      return <Cog8Tooth {...iconProps} />;
    case "credit-card":
      return <CreditCard {...iconProps} />;
    case "clock":
      return <Clock {...iconProps} />;
    case "lock-closed":
      return <LockClosed {...iconProps} />;
    default:
      return <User {...iconProps} />;
  }
};

export const MobileDashboard = ({
  userInitials = "AP",
  userName = "Saint Gottaguy",
  isFreeTier = true,
  upgradeTitle = "Upgrade to Unlimited",
  upgradeDescription = "Generate Premium Content by upgrading to an unlimited plan!",
  upgradeButtonText = "Get started with PRO",
  joinUsersText = "Join 80,000+ users now",
  logoUrl = "https://cdn.builder.io/api/v1/image/assets/TEMP/995f5a9f55e2b585339c1ccb6ae796354253390a?width=124",
  profileImageUrl = "https://cdn.builder.io/api/v1/image/assets/TEMP/2cc7e5387733bf04502b89840130924f4bb8c93b?width=163",
  menuItems = defaultMenuItems,
}: MobileDashboardProps) => {
  return (
    <div className="mobile-dashboard-container">
      <div className="mobile-dashboard-main">
        {/* Main Container */}
        <div className="dashboard-frame">
          <div className="dashboard-inner">
            <div className="dashboard-content">
              <div className="dashboard-layout">
                <div className="dashboard-wrapper">
                  <div className="dashboard-border">
                    <div className="dashboard-inner-content">
                      {/* Header Section */}
                      <div className="header-section">
                        <div className="header-container">
                          <div className="header-content">
                            <div className="logo-section">
                              <div className="logo-container">
                                <div className="logo-text-container">
                                  <div className="brand-text">
                                    SaintVisionAi™
                                  </div>
                                </div>
                              </div>
                            </div>
                            <img
                              className="logo-image"
                              src={logoUrl}
                              alt="Logo"
                            />
                          </div>
                        </div>
                        <div className="tier-badge">
                          <div className="tier-content">
                            <div className="tier-text">FREE🔥</div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Section */}
                      <div className="menu-section">
                        <div className="menu-container">
                          <div className="menu-content">
                            <div className="menu-wrapper">
                              <div className="menu-inner">
                                <div className="menu-layout">
                                  <div className="menu-grid">
                                    {/* Menu Items */}
                                    {menuItems.map((item, index) => (
                                      <div
                                        key={item.id}
                                        className={`menu-item ${item.isActive ? "menu-item-active" : "menu-item-inactive"}`}
                                        style={{ top: `${55 + index * 55}px` }}
                                      >
                                        <div className="menu-item-icon">
                                          <IconComponent iconName={item.icon} />
                                        </div>
                                        <div className="menu-item-content">
                                          <div className="menu-item-text">
                                            {item.label} {item.emoji}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Profile Image */}
                      <img
                        className="profile-image"
                        src={profileImageUrl}
                        alt="Profile"
                      />

                      {/* Upgrade Section */}
                      <div className="upgrade-section">
                        <div className="upgrade-content">
                          <div className="upgrade-text-container">
                            <div className="upgrade-title">{upgradeTitle}</div>
                            <div className="upgrade-description">
                              {upgradeDescription}
                            </div>
                          </div>
                          <div className="upgrade-button">
                            <div className="upgrade-button-content">
                              <div className="upgrade-button-text">
                                {upgradeButtonText}
                              </div>
                            </div>
                          </div>
                          <div className="join-users-text">{joinUsersText}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Section */}
        <div className="user-section">
          <div className="user-details">
            <div className="user-avatar">
              <div className="avatar-content">
                <div className="avatar-text">{userInitials}</div>
              </div>
            </div>
            <div className="user-info">
              <div className="user-name">{userName}</div>
            </div>
          </div>
          <div className="user-action-button"></div>
        </div>
      </div>

      <style jsx>{`
        .mobile-dashboard-container {
          display: flex;
          width: 331px;
          flex-direction: column;
          align-items: center;
          position: absolute;
          left: 0px;
          top: 27px;
          height: 1346px;
        }

        .mobile-dashboard-main {
          width: 331px;
          height: 1373px;
          position: absolute;
          left: 0px;
          top: -27px;
        }

        .dashboard-frame {
          width: 331px;
          height: 1373px;
          flex-shrink: 0;
          position: absolute;
          left: 0px;
          top: 0px;
        }

        .dashboard-inner {
          display: flex;
          width: 331px;
          height: 1373px;
          padding-bottom: 27px;
          flex-direction: column;
          align-items: center;
          flex-shrink: 0;
          position: absolute;
          left: 0px;
          top: 0px;
        }

        .dashboard-content {
          display: flex;
          width: 331px;
          height: 1346px;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          flex-shrink: 0;
          position: absolute;
          left: 0px;
          top: 0px;
        }

        .dashboard-layout {
          width: 331px;
          height: 1346px;
          flex-shrink: 0;
          position: absolute;
          left: 0px;
          top: 0px;
        }

        .dashboard-wrapper {
          display: flex;
          width: 331px;
          height: 1346px;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          flex-shrink: 0;
          position: absolute;
          left: 0px;
          top: 0px;
        }

        .dashboard-border {
          display: flex;
          width: 331px;
          height: 1346px;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          flex-shrink: 0;
          border-radius: 32px;
          border: 4px solid #fdffdc;
          position: absolute;
          left: 0px;
          top: 0px;
        }

        .dashboard-inner-content {
          width: 331px;
          height: 1346px;
          flex-shrink: 0;
          position: absolute;
          left: 0px;
          top: 0px;
        }

        .header-section {
          width: 331px;
          height: 84px;
          flex-shrink: 0;
          position: absolute;
          left: 0px;
          top: 0px;
        }

        .header-container {
          width: 331px;
          height: 84px;
          flex-shrink: 0;
          border-radius: 32px;
          border: 1px solid #fdffdc;
          position: absolute;
          left: 0px;
          top: 0px;
        }

        .header-content {
          width: 293px;
          height: 62px;
          flex-shrink: 0;
          position: absolute;
          left: 9px;
          top: 5px;
        }

        .logo-section {
          display: flex;
          width: 271px;
          height: 30px;
          justify-content: center;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
          position: absolute;
          left: 22px;
          top: 22px;
        }

        .logo-container {
          display: flex;
          width: 183px;
          justify-content: center;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
          position: relative;
        }

        .logo-text-container {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }

        .brand-text {
          color: #fdffdc;
          -webkit-text-stroke-width: 1px;
          -webkit-text-stroke-color: #000;
          font-family:
            Inter,
            -apple-system,
            Roboto,
            Helvetica,
            sans-serif;
          font-size: 24px;
          font-style: normal;
          font-weight: 700;
          line-height: normal;
          position: relative;
        }

        .logo-image {
          width: 62px;
          height: 62px;
          flex-shrink: 0;
          aspect-ratio: 1/1;
          position: absolute;
          left: 0px;
          top: 0px;
        }

        .tier-badge {
          display: flex;
          width: 46px;
          height: 21px;
          padding: 2px 10px;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
          border-radius: 9999px;
          background: #fffbeb;
          position: absolute;
          left: 258px;
          top: 42px;
        }

        .tier-content {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          position: relative;
        }

        .tier-text {
          color: #4a4a4a;
          font-family:
            Inter,
            -apple-system,
            Roboto,
            Helvetica,
            sans-serif;
          font-size: 12px;
          font-style: normal;
          font-weight: 700;
          line-height: normal;
          position: relative;
        }

        .menu-section {
          width: 331px;
          height: 917px;
          flex-shrink: 0;
          position: absolute;
          left: 0px;
          top: 0px;
        }

        .menu-container {
          width: 312px;
          height: 811px;
          flex-shrink: 0;
          position: absolute;
          left: 7px;
          top: 106px;
        }

        .menu-content {
          width: 312px;
          height: 811px;
          flex-shrink: 0;
          filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
          position: absolute;
          left: 0px;
          top: 0px;
        }

        .menu-wrapper {
          width: 312px;
          height: 811px;
          flex-shrink: 0;
          position: absolute;
          left: 0px;
          top: 0px;
        }

        .menu-inner {
          width: 312px;
          height: 811px;
          flex-shrink: 0;
          position: absolute;
          left: 0px;
          top: 0px;
        }

        .menu-layout {
          width: 312px;
          height: 811px;
          flex-shrink: 0;
          position: absolute;
          left: 0px;
          top: 0px;
        }

        .menu-grid {
          width: 312px;
          height: 811px;
          flex-shrink: 0;
          position: absolute;
          left: 0px;
          top: 0px;
        }

        .menu-item {
          display: flex;
          width: 309px;
          padding: 16px 16px;
          align-items: center;
          border-radius: 32px;
          border: 1px solid #fdffdc;
          position: absolute;
          left: 3px;
          height: 56px;
        }

        .menu-item-active {
          background: #71717a;
          opacity: 1;
        }

        .menu-item-inactive {
          opacity: 0.3;
          background: #18181b;
        }

        .menu-item-icon {
          display: flex;
          padding-right: 8px;
          justify-content: center;
          align-items: center;
          gap: 10px;
          position: relative;
        }

        .menu-item-content {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          position: relative;
        }

        .menu-item-text {
          color: #fdffdc;
          font-family:
            Inter,
            -apple-system,
            Roboto,
            Helvetica,
            sans-serif;
          font-size: 16px;
          font-style: normal;
          font-weight: 400;
          line-height: 24px;
          position: relative;
        }

        .profile-image {
          width: 82px;
          height: 116px;
          transform: rotate(-0.304deg);
          flex-shrink: 0;
          aspect-ratio: 81.54/116.08;
          border-radius: 24px;
          border: 4px solid #fdffdc;
          box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
          position: absolute;
          left: 117px;
          top: 933px;
        }

        .upgrade-section {
          width: 236px;
          height: 193px;
          flex-shrink: 0;
          position: absolute;
          left: 40px;
          top: 1067px;
        }

        .upgrade-content {
          width: 236px;
          height: 193px;
          flex-shrink: 0;
          position: absolute;
          left: 0px;
          top: 0px;
        }

        .upgrade-text-container {
          display: flex;
          width: 168px;
          height: 84px;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
          border-radius: 32px;
          position: absolute;
          left: 34px;
          top: 0px;
        }

        .upgrade-title {
          color: #fdffdc;
          text-align: center;
          font-family:
            Inter,
            -apple-system,
            Roboto,
            Helvetica,
            sans-serif;
          font-size: 18px;
          font-style: normal;
          font-weight: 700;
          line-height: normal;
          position: relative;
        }

        .upgrade-description {
          align-self: stretch;
          color: #a1a1aa;
          text-align: center;
          font-family:
            Inter,
            -apple-system,
            Roboto,
            Helvetica,
            sans-serif;
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
          line-height: 20px;
          position: relative;
        }

        .upgrade-button {
          display: flex;
          width: 236px;
          height: 52px;
          padding: 16px 16px;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
          border-radius: 32px;
          background: #fdffdc;
          position: absolute;
          left: 0px;
          top: 103px;
        }

        .upgrade-button-content {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          position: relative;
        }

        .upgrade-button-text {
          color: #09090b;
          font-family:
            Inter,
            -apple-system,
            Roboto,
            Helvetica,
            sans-serif;
          font-size: 16px;
          font-style: normal;
          font-weight: 700;
          line-height: 24px;
          position: relative;
        }

        .join-users-text {
          width: 168px;
          height: 19px;
          flex-shrink: 0;
          color: #a1a1aa;
          text-align: center;
          font-family:
            Inter,
            -apple-system,
            Roboto,
            Helvetica,
            sans-serif;
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
          line-height: 20px;
          position: absolute;
          left: 34px;
          top: 174px;
        }

        .user-section {
          display: inline-flex;
          height: 69px;
          padding: 14px 0px 14px 20px;
          justify-content: flex-end;
          align-items: flex-start;
          gap: 206px;
          flex-shrink: 0;
          border-radius: 32px;
          border: 1px solid #fdffdc;
          position: absolute;
          left: 10px;
          top: 1277px;
          width: 312px;
        }

        .user-details {
          display: flex;
          align-items: center;
          gap: 10px;
          position: absolute;
          left: 20px;
          top: 15px;
          width: 167px;
          height: 40px;
        }

        .user-avatar {
          display: flex;
          width: 40px;
          height: 40px;
          padding: 10px 10px;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 10px;
          border-radius: 9999px;
          background: #a1a1aa;
          position: relative;
        }

        .avatar-content {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          position: relative;
        }

        .avatar-text {
          color: #fdffdc;
          font-family:
            Inter,
            -apple-system,
            Roboto,
            Helvetica,
            sans-serif;
          font-size: 16px;
          font-style: normal;
          font-weight: 700;
          line-height: 24px;
          position: relative;
        }

        .user-info {
          display: flex;
          width: 225px;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          gap: 2px;
          position: relative;
        }

        .user-name {
          color: #fdffdc;
          font-family:
            Inter,
            -apple-system,
            Roboto,
            Helvetica,
            sans-serif;
          font-size: 14px;
          font-style: normal;
          font-weight: 700;
          line-height: 20px;
          position: relative;
        }

        .user-action-button {
          display: flex;
          width: 40px;
          height: 40px;
          min-width: 40px;
          max-width: 40px;
          padding: 8px 16px;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 10px;
          border-radius: 9999px;
          border: 1px solid #fdffdc;
          box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
          position: absolute;
          left: 393px;
          top: 14px;
        }
      `}</style>
    </div>
  );
};

export default MobileDashboard;
