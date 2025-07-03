"use client";

import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";
import { StatusBar, Style } from "@capacitor/status-bar";
import { SplashScreen } from "@capacitor/splash-screen";
import { Keyboard } from "@capacitor/keyboard";
import { PushNotifications } from "@capacitor/push-notifications";
import { toast } from "sonner";
import { BuilderFusionProvider } from "../../lib/hooks/use-builder-fusion";

interface MobileAppWrapperProps {
  children: React.ReactNode;
}

export function MobileAppWrapper({ children }: MobileAppWrapperProps) {
  const [isNativeApp, setIsNativeApp] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    initializeMobileApp();
  }, []);

  const initializeMobileApp = async () => {
    // Check if running as native app
    const isNative = Capacitor.isNativePlatform();
    setIsNativeApp(isNative);

    if (isNative) {
      try {
        // Configure status bar
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: "#000000" });

        // Hide splash screen
        await SplashScreen.hide();

        // Configure keyboard
        Keyboard.addListener("keyboardWillShow", (info) => {
          document.body.style.setProperty(
            "--keyboard-height",
            `${info.keyboardHeight}px`,
          );
        });

        Keyboard.addListener("keyboardWillHide", () => {
          document.body.style.setProperty("--keyboard-height", "0px");
        });

        // Handle app state changes
        App.addListener("appStateChange", ({ isActive }) => {
          if (isActive) {
            // App came to foreground
            console.log("SaintSal™ app activated");
          } else {
            // App went to background
            console.log("SaintSal™ app backgrounded");
          }
        });

        // Handle URL opening
        App.addListener("appUrlOpen", (data) => {
          console.log("App opened with URL:", data);
          // Handle deep linking for referral codes, etc.
          if (data.url.includes("ref=")) {
            const urlParams = new URLSearchParams(data.url.split("?")[1]);
            const refCode = urlParams.get("ref");
            if (refCode) {
              // Store referral code for tracking
              localStorage.setItem("saintsal_ref_code", refCode);
              toast.success(`🔥 Referral code ${refCode} applied!`);
            }
          }
        });

        // Handle back button (Android)
        App.addListener("backButton", ({ canGoBack }) => {
          if (!canGoBack) {
            App.exitApp();
          } else {
            window.history.back();
          }
        });

        // Request push notification permissions
        await requestPushPermissions();

        console.log("✅ SaintSal™ mobile app initialized");
      } catch (error) {
        console.error("❌ Mobile app initialization error:", error);
      }
    }

    setIsReady(true);
  };

  const requestPushPermissions = async () => {
    try {
      let permStatus = await PushNotifications.checkPermissions();

      if (permStatus.receive === "prompt") {
        permStatus = await PushNotifications.requestPermissions();
      }

      if (permStatus.receive !== "granted") {
        console.log("Push notification permission denied");
        return;
      }

      // Register for push notifications
      await PushNotifications.register();

      PushNotifications.addListener("registration", (token) => {
        console.log("Push registration success, token: " + token.value);
        // Send token to your backend for targeting
      });

      PushNotifications.addListener("registrationError", (error) => {
        console.error("Error on registration: " + JSON.stringify(error));
      });

      PushNotifications.addListener(
        "pushNotificationReceived",
        (notification) => {
          console.log("Push received: " + JSON.stringify(notification));
          toast.success(
            notification.title || "New notification from SaintSal™",
          );
        },
      );

      PushNotifications.addListener(
        "pushNotificationActionPerformed",
        (notification) => {
          console.log("Push action performed: " + JSON.stringify(notification));
        },
      );
    } catch (error) {
      console.error("Push notification setup error:", error);
    }
  };

  // Add mobile-specific styles
  useEffect(() => {
    if (isNativeApp) {
      // Add mobile app styles
      const mobileStyles = `
        :root {
          --keyboard-height: 0px;
          --safe-area-inset-top: env(safe-area-inset-top, 0px);
          --safe-area-inset-bottom: env(safe-area-inset-bottom, 0px);
        }

        body {
          padding-top: var(--safe-area-inset-top);
          padding-bottom: max(var(--safe-area-inset-bottom), var(--keyboard-height));
          overflow-x: hidden;
          -webkit-overflow-scrolling: touch;
        }

        /* Prevent zoom on input focus (iOS) */
        input, textarea, select {
          font-size: 16px !important;
        }

        /* Native app scrolling */
        .mobile-scroll {
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
        }

        /* Hide web-only elements in native app */
        .web-only {
          display: none !important;
        }

        /* Mobile-optimized touch targets */
        button, .touchable {
          min-height: 44px;
          min-width: 44px;
        }
      `;

      const styleSheet = document.createElement("style");
      styleSheet.textContent = mobileStyles;
      document.head.appendChild(styleSheet);

      // Add mobile app class to body
      document.body.classList.add("mobile-app");

      return () => {
        document.head.removeChild(styleSheet);
        document.body.classList.remove("mobile-app");
      };
    }
  }, [isNativeApp]);

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center">
          <div className="mx-auto mb-4 size-12 animate-spin rounded-full border-b-2 border-yellow-400"></div>
          <div className="font-semibold text-yellow-400">
            🔥 Loading SaintSal™...
          </div>
        </div>
      </div>
    );
  }

  return (
    <BuilderFusionProvider
      apiKey={process.env.NEXT_PUBLIC_BUILDER_API_KEY || ""}
      models={["page", "layout", "section", "mobile-layout"]}
    >
      <div
        className={`mobile-app-container ${isNativeApp ? "native-app" : "web-app"}`}
      >
        {children}
      </div>
    </BuilderFusionProvider>
  );
}

// Hook for mobile-specific functionality
export function useMobileApp() {
  const [isNativeApp, setIsNativeApp] = useState(false);
  const [platform, setPlatform] = useState<"ios" | "android" | "web">("web");

  useEffect(() => {
    const isNative = Capacitor.isNativePlatform();
    setIsNativeApp(isNative);

    if (isNative) {
      const platformName = Capacitor.getPlatform() as "ios" | "android";
      setPlatform(platformName);
    }
  }, []);

  const shareContent = async (title: string, text: string, url?: string) => {
    if (isNativeApp && navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (error) {
        console.error("Share failed:", error);
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(`${title}\n${text}\n${url || ""}`);
      toast.success("Content copied to clipboard!");
    }
  };

  const exitApp = () => {
    if (isNativeApp) {
      App.exitApp();
    } else {
      window.close();
    }
  };

  return {
    isNativeApp,
    platform,
    shareContent,
    exitApp,
  };
}
