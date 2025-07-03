"use client";

import React from "react";
import { Sparkles, Zap, Bot } from "@tabler/icons-react";

interface SaintSalBrandingProps {
  variant?: "logo" | "full" | "compact" | "icon-only";
  size?: "sm" | "md" | "lg" | "xl";
  theme?: "auto" | "dark" | "light";
  showTagline?: boolean;
  animated?: boolean;
  className?: string;
}

export const SaintSalBranding = ({
  variant = "full",
  size = "md",
  theme = "auto",
  showTagline = false,
  animated = true,
  className = "",
}: SaintSalBrandingProps) => {
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "brand-sm";
      case "lg":
        return "brand-lg";
      case "xl":
        return "brand-xl";
      default:
        return "brand-md";
    }
  };

  const getThemeClasses = () => {
    switch (theme) {
      case "light":
        return "theme-light";
      case "dark":
        return "theme-dark";
      default:
        return "theme-auto";
    }
  };

  const renderIcon = () => (
    <div className={`brand-icon ${animated ? "animated" : ""}`}>
      <div className="icon-layers">
        <Sparkles className="icon-sparkle icon-layer-1" />
        <Bot className="icon-bot icon-layer-2" />
        <Zap className="icon-zap icon-layer-3" />
      </div>
    </div>
  );

  const renderText = () => (
    <div className="brand-text">
      <h1 className="brand-title">
        <span className="saint">Saint</span>
        <span className="sal">Sal</span>
        <span className="trademark">™</span>
      </h1>
      {showTagline && (
        <p className="brand-tagline">AI-Powered Business Intelligence</p>
      )}
    </div>
  );

  const renderCompactText = () => (
    <div className="brand-text-compact">
      <span className="compact-title">SaintSal™</span>
      {showTagline && <span className="compact-tagline">AI Platform</span>}
    </div>
  );

  return (
    <div
      className={`saintsal-branding ${getSizeClasses()} ${getThemeClasses()} variant-${variant} ${className}`}
    >
      {variant === "icon-only" && renderIcon()}

      {variant === "logo" && (
        <div className="logo-variant">
          {renderIcon()}
          {renderText()}
        </div>
      )}

      {variant === "full" && (
        <div className="full-variant">
          {renderIcon()}
          {renderText()}
        </div>
      )}

      {variant === "compact" && (
        <div className="compact-variant">
          {renderIcon()}
          {renderCompactText()}
        </div>
      )}

      <style jsx>{`
        .saintsal-branding {
          display: flex;
          align-items: center;
          font-family:
            Inter,
            -apple-system,
            Roboto,
            Helvetica,
            sans-serif;
          user-select: none;
        }

        /* Size variants */
        .brand-sm {
          --icon-size: 32px;
          --title-size: 18px;
          --tagline-size: 12px;
          --spacing: 8px;
        }

        .brand-md {
          --icon-size: 48px;
          --title-size: 24px;
          --tagline-size: 14px;
          --spacing: 12px;
        }

        .brand-lg {
          --icon-size: 64px;
          --title-size: 32px;
          --tagline-size: 16px;
          --spacing: 16px;
        }

        .brand-xl {
          --icon-size: 80px;
          --title-size: 40px;
          --tagline-size: 18px;
          --spacing: 20px;
        }

        /* Theme variants */
        .theme-dark {
          --brand-primary: #fdffdc;
          --brand-secondary: #fbbf24;
          --brand-accent: #a855f7;
          --brand-text: #fdffdc;
          --brand-muted: #a1a1aa;
          --brand-bg: rgba(0, 0, 0, 0.1);
        }

        .theme-light {
          --brand-primary: #000000;
          --brand-secondary: #f59e0b;
          --brand-accent: #7c3aed;
          --brand-text: #1f2937;
          --brand-muted: #6b7280;
          --brand-bg: rgba(255, 255, 255, 0.1);
        }

        .theme-auto {
          --brand-primary: #fdffdc;
          --brand-secondary: #fbbf24;
          --brand-accent: #a855f7;
          --brand-text: #fdffdc;
          --brand-muted: #a1a1aa;
          --brand-bg: rgba(0, 0, 0, 0.1);
        }

        @media (prefers-color-scheme: light) {
          .theme-auto {
            --brand-primary: #000000;
            --brand-secondary: #f59e0b;
            --brand-accent: #7c3aed;
            --brand-text: #1f2937;
            --brand-muted: #6b7280;
            --brand-bg: rgba(255, 255, 255, 0.1);
          }
        }

        /* Icon styling */
        .brand-icon {
          position: relative;
          width: var(--icon-size);
          height: var(--icon-size);
          background: linear-gradient(
            135deg,
            var(--brand-secondary),
            var(--brand-accent)
          );
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          overflow: hidden;
        }

        .brand-icon.animated {
          animation: iconGlow 3s ease-in-out infinite;
        }

        @keyframes iconGlow {
          0%,
          100% {
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 8px 32px rgba(251, 191, 36, 0.4);
            transform: scale(1.02);
          }
        }

        .icon-layers {
          position: relative;
          width: 60%;
          height: 60%;
        }

        .icon-layer-1,
        .icon-layer-2,
        .icon-layer-3 {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #000;
        }

        .icon-layer-1 {
          width: 100%;
          height: 100%;
          opacity: 0.8;
          animation: sparkle 2s ease-in-out infinite;
        }

        .icon-layer-2 {
          width: 80%;
          height: 80%;
          opacity: 1;
          z-index: 2;
        }

        .icon-layer-3 {
          width: 40%;
          height: 40%;
          opacity: 0.6;
          animation: zap 1.5s ease-in-out infinite alternate;
        }

        @keyframes sparkle {
          0%,
          100% {
            opacity: 0.8;
            transform: translate(-50%, -50%) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -50%) rotate(180deg);
          }
        }

        @keyframes zap {
          0% {
            opacity: 0.6;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            opacity: 0.9;
            transform: translate(-50%, -50%) scale(1.1);
          }
        }

        /* Text styling */
        .brand-text {
          margin-left: var(--spacing);
        }

        .brand-title {
          margin: 0;
          font-size: var(--title-size);
          font-weight: 700;
          line-height: 1;
          display: flex;
          align-items: baseline;
          gap: 2px;
        }

        .saint {
          color: var(--brand-primary);
          background: linear-gradient(
            135deg,
            var(--brand-primary),
            var(--brand-secondary)
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .sal {
          color: var(--brand-secondary);
          background: linear-gradient(
            135deg,
            var(--brand-secondary),
            var(--brand-accent)
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .trademark {
          color: var(--brand-accent);
          font-size: 0.6em;
          font-weight: 500;
          margin-left: 2px;
        }

        .brand-tagline {
          margin: 4px 0 0 0;
          font-size: var(--tagline-size);
          color: var(--brand-muted);
          font-weight: 500;
          letter-spacing: 0.02em;
        }

        /* Compact text styling */
        .brand-text-compact {
          margin-left: var(--spacing);
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .compact-title {
          font-size: var(--title-size);
          font-weight: 700;
          color: var(--brand-text);
          line-height: 1;
        }

        .compact-tagline {
          font-size: var(--tagline-size);
          color: var(--brand-muted);
          font-weight: 500;
        }

        /* Layout variants */
        .logo-variant,
        .full-variant {
          display: flex;
          align-items: center;
        }

        .compact-variant {
          display: flex;
          align-items: center;
        }

        .variant-icon-only {
          width: var(--icon-size);
        }

        /* Responsive design */
        @media (max-width: 640px) {
          .brand-lg {
            --icon-size: 48px;
            --title-size: 24px;
            --tagline-size: 14px;
            --spacing: 12px;
          }

          .brand-xl {
            --icon-size: 56px;
            --title-size: 28px;
            --tagline-size: 16px;
            --spacing: 14px;
          }
        }

        /* Accessibility */
        @media (prefers-reduced-motion: reduce) {
          .brand-icon.animated,
          .icon-layer-1,
          .icon-layer-3 {
            animation: none;
          }
        }

        /* High contrast mode */
        @media (prefers-contrast: high) {
          .brand-icon {
            border: 2px solid var(--brand-text);
          }

          .saint,
          .sal {
            -webkit-text-fill-color: var(--brand-text);
            background: none;
            color: var(--brand-text);
          }
        }
      `}</style>
    </div>
  );
};

// Preset variants for common use cases
export const SaintSalLogo = (props: Omit<SaintSalBrandingProps, "variant">) => (
  <SaintSalBranding {...props} variant="logo" />
);

export const SaintSalIcon = (props: Omit<SaintSalBrandingProps, "variant">) => (
  <SaintSalBranding {...props} variant="icon-only" />
);

export const SaintSalCompact = (
  props: Omit<SaintSalBrandingProps, "variant">,
) => <SaintSalBranding {...props} variant="compact" />;

// Header component with SaintSal branding
export const SaintSalHeader = ({
  showNavigation = true,
  className = "",
}: {
  showNavigation?: boolean;
  className?: string;
}) => {
  return (
    <header className={`saintsal-header ${className}`}>
      <div className="header-content">
        <SaintSalBranding
          variant="compact"
          size="md"
          theme="auto"
          animated={true}
        />

        {showNavigation && (
          <nav className="header-nav">
            <a href="#features" className="nav-link">
              Features
            </a>
            <a href="#pricing" className="nav-link">
              Pricing
            </a>
            <a href="#about" className="nav-link">
              About
            </a>
            <a href="#contact" className="nav-link">
              Contact
            </a>
          </nav>
        )}
      </div>

      <style jsx>{`
        .saintsal-header {
          background: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(253, 255, 220, 0.1);
          padding: 12px 0;
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .header-nav {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .nav-link {
          color: #a1a1aa;
          text-decoration: none;
          font-weight: 500;
          font-size: 14px;
          transition: color 0.3s ease;
        }

        .nav-link:hover {
          color: #fdffdc;
        }

        @media (max-width: 768px) {
          .header-nav {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};

export default SaintSalBranding;
