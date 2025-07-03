/**
 * Boss Mode Detection Utility
 * Detects when avatar should render in "boss" form
 */

import { useState, useEffect } from "react";

export interface BossModeConfig {
  isActive: boolean;
  trigger: string;
  timestamp: Date;
}

class BossModeDetector {
  private activeTriggers: Set<string> = new Set();
  private bossStateListeners: Array<(isActive: boolean) => void> = [];

  // Check if boss mode should be active
  isBossMode(input?: string): boolean {
    if (!input) return this.activeTriggers.size > 0;

    // Check for boss triggers
    const bossTriggers = ["al'", "boss", "ultimate", "supreme", "final form"];

    return bossTriggers.some((trigger) =>
      input.toLowerCase().includes(trigger.toLowerCase()),
    );
  }

  // Activate boss mode
  activateBossMode(trigger: string = "al'"): void {
    this.activeTriggers.add(trigger);
    this.notifyListeners(true);

    // Auto-deactivate after 30 seconds unless refreshed
    setTimeout(() => {
      this.activeTriggers.delete(trigger);
      if (this.activeTriggers.size === 0) {
        this.notifyListeners(false);
      }
    }, 30000);
  }

  // Manually deactivate boss mode
  deactivateBossMode(trigger?: string): void {
    if (trigger) {
      this.activeTriggers.delete(trigger);
    } else {
      this.activeTriggers.clear();
    }

    if (this.activeTriggers.size === 0) {
      this.notifyListeners(false);
    }
  }

  // Subscribe to boss mode changes
  onBossModeChange(listener: (isActive: boolean) => void): () => void {
    this.bossStateListeners.push(listener);

    return () => {
      const index = this.bossStateListeners.indexOf(listener);
      if (index > -1) {
        this.bossStateListeners.splice(index, 1);
      }
    };
  }

  // Get current boss mode config
  getBossConfig(): BossModeConfig {
    return {
      isActive: this.activeTriggers.size > 0,
      trigger: Array.from(this.activeTriggers)[0] || "",
      timestamp: new Date(),
    };
  }

  private notifyListeners(isActive: boolean): void {
    this.bossStateListeners.forEach((listener) => listener(isActive));
  }
}

// Singleton instance
export const bossMode = new BossModeDetector();

// React hook for boss mode
export function useBossMode() {
  const [isBoss, setIsBoss] = useState(false);

  useEffect(() => {
    const unsubscribe = bossMode.onBossModeChange(setIsBoss);
    return unsubscribe;
  }, []);

  return {
    isBoss,
    activateBoss: (trigger?: string) => bossMode.activateBossMode(trigger),
    deactivateBoss: (trigger?: string) => bossMode.deactivateBossMode(trigger),
    checkBoss: (input: string) => bossMode.isBossMode(input),
  };
}

// Auto-detect boss mode in text input
export function detectBossMode(input: string): boolean {
  const detector = new BossModeDetector();
  return detector.isBossMode(input);
}

// Boss mode trigger for specific contexts
export function triggerBossAvatar(context: string = "user-input"): boolean {
  bossMode.activateBossMode(`${context}-al'`);
  return true;
}
