/**
 * Mobile Optimization Utilities
 * Handles mobile-specific interactions and optimizations
 */

// Detect if user is on mobile device
export const isMobileDevice = (): boolean => {
  if (typeof window === "undefined") return false;

  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    ) || window.innerWidth <= 768
  );
};

// Detect if device supports touch
export const isTouchDevice = (): boolean => {
  if (typeof window === "undefined") return false;

  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
};

// Get viewport dimensions
export const getViewportDimensions = () => {
  if (typeof window === "undefined") return { width: 0, height: 0 };

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};

// Check if device is in landscape mode
export const isLandscape = (): boolean => {
  if (typeof window === "undefined") return false;

  return window.innerWidth > window.innerHeight;
};

// Prevent zoom on double tap for specific elements
export const preventDoubleTabZoom = (element: HTMLElement) => {
  let lastTap = 0;

  element.addEventListener(
    "touchend",
    (event) => {
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTap;

      if (tapLength < 500 && tapLength > 0) {
        event.preventDefault();
      }

      lastTap = currentTime;
    },
    { passive: false },
  );
};

// Optimize scroll performance on mobile
export const optimizeScrolling = () => {
  if (typeof document === "undefined") return;

  // Add passive listeners for better scroll performance
  document.addEventListener("touchstart", () => {}, { passive: true });
  document.addEventListener("touchmove", () => {}, { passive: true });

  // Prevent overscroll on iOS
  document.body.style.overscrollBehavior = "none";
};

// Add haptic feedback (if supported)
export const addHapticFeedback = (
  type: "light" | "medium" | "heavy" = "light",
) => {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30],
    };

    navigator.vibrate(patterns[type]);
  }
};

// Safe area insets for devices with notches
export const getSafeAreaInsets = () => {
  if (typeof window === "undefined")
    return { top: 0, bottom: 0, left: 0, right: 0 };

  const computedStyle = getComputedStyle(document.documentElement);

  return {
    top: parseInt(
      computedStyle.getPropertyValue("env(safe-area-inset-top)") || "0",
    ),
    bottom: parseInt(
      computedStyle.getPropertyValue("env(safe-area-inset-bottom)") || "0",
    ),
    left: parseInt(
      computedStyle.getPropertyValue("env(safe-area-inset-left)") || "0",
    ),
    right: parseInt(
      computedStyle.getPropertyValue("env(safe-area-inset-right)") || "0",
    ),
  };
};

// Optimize button size for touch
export const getTouchOptimizedSize = (baseSize: number): number => {
  const minTouchSize = 44; // 44px minimum for iOS guidelines
  return Math.max(baseSize, minTouchSize);
};

// Add mobile-specific CSS classes
export const addMobileClasses = (element: HTMLElement) => {
  if (isMobileDevice()) {
    element.classList.add("mobile-device");
  }

  if (isTouchDevice()) {
    element.classList.add("touch-device");
  }

  if (isLandscape()) {
    element.classList.add("landscape-mode");
  } else {
    element.classList.add("portrait-mode");
  }
};

// React hook for mobile detection
export function useMobileDetection() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setIsMobile(isMobileDevice());
    setIsTouch(isTouchDevice());
    setDimensions(getViewportDimensions());

    const handleResize = () => {
      setDimensions(getViewportDimensions());
      setIsMobile(isMobileDevice());
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  return {
    isMobile,
    isTouch,
    dimensions,
    isLandscape: dimensions.width > dimensions.height,
  };
}

// React import
import { useState, useEffect } from "react";
