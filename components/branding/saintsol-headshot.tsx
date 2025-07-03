"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Crown,
  Sparkles,
  Zap,
  Star,
  Brain,
  Eye,
  Shield,
  Award,
} from "@tabler/icons-react";

interface SaintSalHeadshotProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  variant?: "default" | "premium" | "enterprise" | "ai" | "founder" | "boss";
  status?: "online" | "busy" | "away" | "offline";
  animated?: boolean;
  showStatus?: boolean;
  showBadge?: boolean;
  className?: string;
  onClick?: () => void;
}

export const SaintSalHeadshot: React.FC<SaintSalHeadshotProps> = ({
  size = "md",
  variant = "default",
  status = "online",
  animated = true,
  showStatus = true,
  showBadge = true,
  className = "",
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Size configurations
  const sizeConfig = {
    xs: { container: "w-8 h-8", badge: "w-2 h-2", status: "w-2 h-2" },
    sm: { container: "w-12 h-12", badge: "w-3 h-3", status: "w-3 h-3" },
    md: { container: "w-16 h-16", badge: "w-4 h-4", status: "w-3 h-3" },
    lg: { container: "w-24 h-24", badge: "w-6 h-6", status: "w-4 h-4" },
    xl: { container: "w-32 h-32", badge: "w-8 h-8", status: "w-5 h-5" },
    "2xl": { container: "w-48 h-48", badge: "w-12 h-12", status: "w-6 h-6" },
  };

  // Variant configurations
  const variantConfig = {
    default: {
      gradient: "from-blue-500 to-purple-600",
      glow: "shadow-blue-500/30",
      icon: <Crown className="w-1/2 h-1/2" />,
      badge: <Star className="w-full h-full" />,
      badgeColor: "bg-yellow-500",
    },
    premium: {
      gradient: "from-purple-600 to-pink-600",
      glow: "shadow-purple-500/40",
      icon: <Sparkles className="w-1/2 h-1/2" />,
      badge: <Crown className="w-full h-full" />,
      badgeColor: "bg-gradient-to-r from-yellow-400 to-orange-500",
    },
    enterprise: {
      gradient: "from-gray-700 to-gray-900",
      glow: "shadow-gray-500/30",
      icon: <Shield className="w-1/2 h-1/2" />,
      badge: <Award className="w-full h-full" />,
      badgeColor: "bg-gradient-to-r from-blue-600 to-blue-800",
    },
    ai: {
      gradient: "from-cyan-500 to-blue-600",
      glow: "shadow-cyan-500/40",
      icon: <Brain className="w-1/2 h-1/2" />,
      badge: <Zap className="w-full h-full" />,
      badgeColor: "bg-gradient-to-r from-cyan-400 to-cyan-600",
    },
    founder: {
      gradient: "from-amber-500 to-orange-600",
      glow: "shadow-amber-500/40",
      icon: <Eye className="w-1/2 h-1/2" />,
      badge: <Crown className="w-full h-full" />,
      badgeColor: "bg-gradient-to-r from-amber-400 to-yellow-500",
    },
    boss: {
      gradient: "from-purple-900 via-red-600 to-black",
      glow: "shadow-red-500/60",
      icon: <Crown className="w-1/2 h-1/2" />,
      badge: <Sparkles className="w-full h-full" />,
      badgeColor: "bg-gradient-to-r from-red-500 via-purple-600 to-black",
    },
  };

  // Status configurations
  const statusConfig = {
    online: "bg-green-500",
    busy: "bg-red-500",
    away: "bg-yellow-500",
    offline: "bg-gray-500",
  };

  const currentSize = sizeConfig[size];
  const currentVariant = variantConfig[variant];
  const currentStatus = statusConfig[status];

  return (
    <div className={`relative inline-block ${className}`}>
      <motion.div
        className={`
          relative ${currentSize.container} rounded-2xl overflow-hidden cursor-pointer
          bg-gradient-to-br ${currentVariant.gradient}
          ${animated ? `hover:shadow-2xl ${currentVariant.glow}` : ""}
          transition-all duration-300 ease-out
          touch-action-manipulation select-none
          active:scale-95 md:active:scale-100
        `}
        onClick={onClick}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => setTimeout(() => setIsHovered(false), 200)}
        whileHover={animated ? { scale: 1.05, rotate: 2 } : {}}
        whileTap={animated ? { scale: 0.9, rotate: -1 } : {}}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
          <div className="absolute top-2 left-2 w-4 h-4 bg-white/30 rounded-full blur-sm" />
          <div className="absolute bottom-3 right-3 w-3 h-3 bg-white/20 rounded-full blur-sm" />
        </div>

        {/* Main Icon */}
        <div className="absolute inset-0 flex items-center justify-center text-white">
          {currentVariant.icon}
        </div>

        {/* Animated Border */}
        {animated && (
          <motion.div
            className={`absolute inset-0 rounded-2xl border-2 ${variant === "boss" ? "border-red-500/50" : "border-white/30"}`}
            animate={{
              borderColor:
                variant === "boss"
                  ? [
                      "rgba(239,68,68,0.5)",
                      "rgba(255,255,255,1)",
                      "rgba(139,92,246,0.8)",
                      "rgba(239,68,68,0.5)",
                    ]
                  : isHovered
                    ? [
                        "rgba(255,255,255,0.3)",
                        "rgba(255,255,255,0.8)",
                        "rgba(255,255,255,0.3)",
                      ]
                    : "rgba(255,255,255,0.3)",
              boxShadow:
                variant === "boss"
                  ? [
                      "0 0 20px rgba(239,68,68,0.5)",
                      "0 0 40px rgba(255,255,255,0.8)",
                      "0 0 30px rgba(139,92,246,0.6)",
                      "0 0 20px rgba(239,68,68,0.5)",
                    ]
                  : "0 0 0px transparent",
            }}
            transition={{
              duration: variant === "boss" ? 1.5 : 2,
              repeat: Infinity,
              ease: variant === "boss" ? "easeInOut" : "linear",
            }}
          />
        )}

        {/* Boss Mode Lightning Effects */}
        {variant === "boss" && animated && (
          <>
            <motion.div
              className="absolute inset-0 rounded-2xl"
              animate={{
                background: [
                  "radial-gradient(circle, rgba(239,68,68,0.3) 0%, transparent 50%)",
                  "radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 60%)",
                  "radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)",
                  "radial-gradient(circle, rgba(239,68,68,0.3) 0%, transparent 50%)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-2xl border border-red-500/20"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 3,
                  delay: i * 1,
                  repeat: Infinity,
                }}
              />
            ))}
          </>
        )}

        {/* Floating Particles */}
        {animated && (isHovered || variant === "boss") && (
          <>
            {[...Array(variant === "boss" ? 12 : 6)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-1 h-1 rounded-full ${
                  variant === "boss"
                    ? i % 3 === 0
                      ? "bg-red-400"
                      : i % 3 === 1
                        ? "bg-purple-400"
                        : "bg-white"
                    : "bg-white"
                }`}
                initial={{
                  opacity: 0,
                  x: Math.random() * 100 - 50,
                  y: Math.random() * 100 - 50,
                }}
                animate={{
                  opacity: variant === "boss" ? [0, 1, 0.5, 1, 0] : [0, 1, 0],
                  y: [0, -20, -40],
                  x: [0, Math.random() * 20 - 10, Math.random() * 40 - 20],
                  scale: variant === "boss" ? [1, 1.5, 1] : 1,
                }}
                transition={{
                  duration: variant === "boss" ? 1.5 : 2,
                  delay: i * (variant === "boss" ? 0.1 : 0.2),
                  repeat: Infinity,
                }}
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                }}
              />
            ))}
          </>
        )}
      </motion.div>

      {/* Status Indicator */}
      {showStatus && (
        <motion.div
          className={`
            absolute -bottom-1 -right-1 ${currentSize.status} rounded-full border-2 border-white
            ${currentStatus}
          `}
          animate={
            animated
              ? {
                  scale: status === "online" ? [1, 1.2, 1] : 1,
                }
              : {}
          }
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* Badge */}
      {showBadge && (
        <motion.div
          className={`
            absolute -top-1 -right-1 ${currentSize.badge} rounded-full
            ${currentVariant.badgeColor} text-white
            flex items-center justify-center shadow-lg
          `}
          animate={
            animated
              ? {
                  rotate: [0, 10, -10, 0],
                }
              : {}
          }
          transition={{ duration: 4, repeat: Infinity }}
        >
          {currentVariant.badge}
        </motion.div>
      )}

      {/* Glow Effect */}
      {animated && isHovered && (
        <motion.div
          className={`
            absolute inset-0 rounded-2xl bg-gradient-to-br ${currentVariant.gradient}
            opacity-50 blur-xl -z-10
          `}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* Tooltip on Hover */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-20"
        >
          <div className="bg-gray-900 text-white px-3 py-1 rounded-lg text-sm font-medium shadow-lg">
            SaintSal™ {variant.charAt(0).toUpperCase() + variant.slice(1)}
            <div className="text-xs text-gray-300 capitalize">{status}</div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// Pre-configured variants for common use cases
export const SaintSalAvatar = (
  props: Omit<SaintSalHeadshotProps, "variant">,
) => <SaintSalHeadshot {...props} variant="default" />;

export const SaintSalPremiumAvatar = (
  props: Omit<SaintSalHeadshotProps, "variant">,
) => <SaintSalHeadshot {...props} variant="premium" />;

export const SaintSalAIAvatar = (
  props: Omit<SaintSalHeadshotProps, "variant">,
) => <SaintSalHeadshot {...props} variant="ai" />;

export const SaintSalFounderAvatar = (
  props: Omit<SaintSalHeadshotProps, "variant">,
) => <SaintSalHeadshot {...props} variant="founder" />;

export const SaintSalBossAvatar = (
  props: Omit<SaintSalHeadshotProps, "variant">,
) => <SaintSalHeadshot {...props} variant="boss" animated={true} />;

// Compact display component
export const SaintSalProfile: React.FC<{
  name?: string;
  title?: string;
  variant?: SaintSalHeadshotProps["variant"];
  size?: SaintSalHeadshotProps["size"];
  status?: SaintSalHeadshotProps["status"];
}> = ({
  name = "SaintSal",
  title = "AI Vision Architect",
  variant = "founder",
  size = "lg",
  status = "online",
}) => {
  return (
    <div className="flex items-center gap-4">
      <SaintSalHeadshot
        variant={variant}
        size={size}
        status={status}
        animated={true}
      />
      <div className="flex flex-col">
        <h3 className="font-bold text-lg text-gray-900">{name}</h3>
        <p className="text-gray-600 text-sm">{title}</p>
        <div className="flex items-center gap-2 mt-1">
          <div
            className={`w-2 h-2 rounded-full ${
              status === "online"
                ? "bg-green-500"
                : status === "busy"
                  ? "bg-red-500"
                  : status === "away"
                    ? "bg-yellow-500"
                    : "bg-gray-500"
            }`}
          />
          <span className="text-xs text-gray-500 capitalize">{status}</span>
        </div>
      </div>
    </div>
  );
};
