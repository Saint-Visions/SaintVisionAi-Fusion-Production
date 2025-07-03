/**
 * Behavior Tracking Service for PartnerTech.ai Scoring
 * Tracks user interactions and queries for real-time score updates
 */

export interface BehaviorEvent {
  type:
    | "page_view"
    | "click"
    | "scroll"
    | "ai_query"
    | "feature_use"
    | "session_start"
    | "session_end";
  category: string;
  action: string;
  label?: string;
  value?: number;
  metadata?: Record<string, any>;
  timestamp: Date;
  sessionId: string;
  userId: string;
}

export interface QueryEvent {
  queryId: string;
  type: "ai_chat" | "search" | "voice" | "help";
  prompt: string;
  response: string;
  model: string;
  complexity: number;
  quality: number;
  duration: number;
  success: boolean;
  timestamp: Date;
  sessionId: string;
  userId: string;
}

export interface SessionMetrics {
  sessionId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  pageViews: number;
  interactions: number;
  queriesCount: number;
  featuresUsed: string[];
  bounceRate: number;
  engagementScore: number;
}

class BehaviorTrackingService {
  private events: BehaviorEvent[] = [];
  private queries: QueryEvent[] = [];
  private currentSession: SessionMetrics | null = null;
  private eventListeners: Array<(event: BehaviorEvent) => void> = [];
  private queryListeners: Array<(query: QueryEvent) => void> = [];
  private scoreUpdateCallbacks: Array<(score: any) => void> = [];

  // Initialize tracking for a user session
  startSession(userId: string): string {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    this.currentSession = {
      sessionId,
      userId,
      startTime: new Date(),
      duration: 0,
      pageViews: 0,
      interactions: 0,
      queriesCount: 0,
      featuresUsed: [],
      bounceRate: 0,
      engagementScore: 0,
    };

    this.trackEvent({
      type: "session_start",
      category: "session",
      action: "start",
      timestamp: new Date(),
      sessionId,
      userId,
    });

    // Start session duration tracking
    setInterval(() => {
      if (this.currentSession) {
        this.currentSession.duration =
          Date.now() - this.currentSession.startTime.getTime();
      }
    }, 1000);

    return sessionId;
  }

  // End current session
  endSession(): void {
    if (!this.currentSession) return;

    this.currentSession.endTime = new Date();
    this.currentSession.duration =
      Date.now() - this.currentSession.startTime.getTime();

    this.trackEvent({
      type: "session_end",
      category: "session",
      action: "end",
      value: this.currentSession.duration,
      metadata: {
        pageViews: this.currentSession.pageViews,
        interactions: this.currentSession.interactions,
        queriesCount: this.currentSession.queriesCount,
        featuresUsed: this.currentSession.featuresUsed,
      },
      timestamp: new Date(),
      sessionId: this.currentSession.sessionId,
      userId: this.currentSession.userId,
    });

    // Send session data to PartnerTech.ai
    this.sendSessionData(this.currentSession);
    this.currentSession = null;
  }

  // Track a behavior event
  trackEvent(
    event: Omit<BehaviorEvent, "timestamp" | "sessionId" | "userId">,
  ): void {
    if (!this.currentSession) return;

    const fullEvent: BehaviorEvent = {
      ...event,
      timestamp: new Date(),
      sessionId: this.currentSession.sessionId,
      userId: this.currentSession.userId,
    };

    this.events.push(fullEvent);

    // Update session metrics
    switch (event.type) {
      case "page_view":
        this.currentSession.pageViews++;
        break;
      case "click":
      case "scroll":
        this.currentSession.interactions++;
        break;
      case "feature_use":
        if (
          event.label &&
          !this.currentSession.featuresUsed.includes(event.label)
        ) {
          this.currentSession.featuresUsed.push(event.label);
        }
        break;
    }

    // Notify listeners
    this.eventListeners.forEach((listener) => listener(fullEvent));

    // Send to PartnerTech.ai API
    this.sendEventToAPI(fullEvent);
  }

  // Track an AI query
  trackQuery(
    query: Omit<QueryEvent, "timestamp" | "sessionId" | "userId" | "queryId">,
  ): void {
    if (!this.currentSession) return;

    const queryId = `query_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const fullQuery: QueryEvent = {
      ...query,
      queryId,
      timestamp: new Date(),
      sessionId: this.currentSession.sessionId,
      userId: this.currentSession.userId,
    };

    this.queries.push(fullQuery);
    this.currentSession.queriesCount++;

    // Notify listeners
    this.queryListeners.forEach((listener) => listener(fullQuery));

    // Send to PartnerTech.ai API
    this.sendQueryToAPI(fullQuery);

    // Calculate and update scores based on query
    this.updateScoresFromQuery(fullQuery);
  }

  // Calculate query complexity based on prompt analysis
  calculateQueryComplexity(prompt: string): number {
    const factors = {
      length: Math.min(prompt.length / 100, 1),
      questionWords:
        (prompt.match(/\b(how|what|why|when|where|who|which)\b/gi) || [])
          .length * 0.1,
      technicalTerms:
        (
          prompt.match(
            /\b(algorithm|api|framework|database|integration)\b/gi,
          ) || []
        ).length * 0.15,
      conditionals:
        (prompt.match(/\b(if|unless|provided|assuming|given)\b/gi) || [])
          .length * 0.1,
      multiPart:
        (prompt.match(/\b(and|or|also|additionally|furthermore)\b/gi) || [])
          .length * 0.05,
    };

    const complexity = Object.values(factors).reduce(
      (sum, value) => sum + value,
      0,
    );
    return Math.min(Math.max(complexity * 10, 1), 10); // Scale to 1-10
  }

  // Calculate query quality based on response success
  calculateQueryQuality(query: QueryEvent): number {
    const factors = {
      success: query.success ? 3 : 0,
      responseTime: query.duration < 5000 ? 2 : query.duration < 10000 ? 1 : 0,
      complexity: query.complexity > 7 ? 2 : query.complexity > 4 ? 1 : 0,
      promptQuality: query.prompt.length > 20 ? 2 : 1,
      engagement: 1, // Base engagement score
    };

    const quality = Object.values(factors).reduce(
      (sum, value) => sum + value,
      0,
    );
    return Math.min(quality, 10); // Scale to 1-10
  }

  // Update scores based on query data
  private updateScoresFromQuery(query: QueryEvent): void {
    const complexity = this.calculateQueryComplexity(query.prompt);
    const quality = this.calculateQueryQuality(query);

    // Update the query with calculated metrics
    query.complexity = complexity;
    query.quality = quality;

    // Calculate real-time score updates
    const scoreUpdate = {
      queryScore: this.calculateOverallQueryScore(),
      behaviorScore: this.calculateBehaviorScore(),
      timestamp: new Date(),
    };

    // Notify score update listeners
    this.scoreUpdateCallbacks.forEach((callback) => callback(scoreUpdate));
  }

  // Calculate overall query score
  private calculateOverallQueryScore(): number {
    if (this.queries.length === 0) return 0;

    const totalScore = this.queries.reduce((sum, query) => {
      return (
        sum +
        (query.quality * 0.4 +
          query.complexity * 0.3 +
          (query.success ? 30 : 0))
      );
    }, 0);

    return Math.round(totalScore / this.queries.length);
  }

  // Calculate behavior score
  private calculateBehaviorScore(): number {
    if (!this.currentSession) return 0;

    const sessionDurationMinutes = this.currentSession.duration / (1000 * 60);
    const factors = {
      sessionDuration: Math.min(sessionDurationMinutes / 30, 1) * 200, // Max 200 points for 30+ min sessions
      interactions: Math.min(this.currentSession.interactions / 50, 1) * 150, // Max 150 points for 50+ interactions
      pageViews: Math.min(this.currentSession.pageViews / 10, 1) * 100, // Max 100 points for 10+ page views
      featuresUsed:
        Math.min(this.currentSession.featuresUsed.length / 5, 1) * 150, // Max 150 points for 5+ features
      queryEngagement: Math.min(this.currentSession.queriesCount / 10, 1) * 100, // Max 100 points for 10+ queries
    };

    return Math.round(
      Object.values(factors).reduce((sum, value) => sum + value, 0),
    );
  }

  // Send event data to PartnerTech.ai API
  private async sendEventToAPI(event: BehaviorEvent): Promise<void> {
    try {
      await fetch("/api/partnertech/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      });
    } catch (error) {
      console.error("Failed to send event to PartnerTech.ai:", error);
    }
  }

  // Send query data to PartnerTech.ai API
  private async sendQueryToAPI(query: QueryEvent): Promise<void> {
    try {
      await fetch("/api/partnertech/queries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(query),
      });
    } catch (error) {
      console.error("Failed to send query to PartnerTech.ai:", error);
    }
  }

  // Send session data to PartnerTech.ai API
  private async sendSessionData(session: SessionMetrics): Promise<void> {
    try {
      await fetch("/api/partnertech/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(session),
      });
    } catch (error) {
      console.error("Failed to send session to PartnerTech.ai:", error);
    }
  }

  // Subscribe to behavior events
  onEvent(listener: (event: BehaviorEvent) => void): () => void {
    this.eventListeners.push(listener);
    return () => {
      const index = this.eventListeners.indexOf(listener);
      if (index > -1) {
        this.eventListeners.splice(index, 1);
      }
    };
  }

  // Subscribe to query events
  onQuery(listener: (query: QueryEvent) => void): () => void {
    this.queryListeners.push(listener);
    return () => {
      const index = this.queryListeners.indexOf(listener);
      if (index > -1) {
        this.queryListeners.splice(index, 1);
      }
    };
  }

  // Subscribe to score updates
  onScoreUpdate(callback: (score: any) => void): () => void {
    this.scoreUpdateCallbacks.push(callback);
    return () => {
      const index = this.scoreUpdateCallbacks.indexOf(callback);
      if (index > -1) {
        this.scoreUpdateCallbacks.splice(index, 1);
      }
    };
  }

  // Get current session metrics
  getCurrentSession(): SessionMetrics | null {
    return this.currentSession;
  }

  // Get event history
  getEvents(limit?: number): BehaviorEvent[] {
    return limit ? this.events.slice(-limit) : this.events;
  }

  // Get query history
  getQueries(limit?: number): QueryEvent[] {
    return limit ? this.queries.slice(-limit) : this.queries;
  }

  // Auto-track common page interactions
  initializeAutoTracking(): void {
    // Track page views
    window.addEventListener("load", () => {
      this.trackEvent({
        type: "page_view",
        category: "navigation",
        action: "page_load",
        label: window.location.pathname,
      });
    });

    // Track clicks on interactive elements
    document.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest('[role="button"]')
      ) {
        this.trackEvent({
          type: "click",
          category: "interaction",
          action: "click",
          label: target.textContent?.substring(0, 50) || "unknown",
          metadata: {
            elementType: target.tagName,
            className: target.className,
          },
        });
      }
    });

    // Track scroll depth
    let maxScrollDepth = 0;
    window.addEventListener("scroll", () => {
      const scrollDepth = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
          100,
      );
      if (scrollDepth > maxScrollDepth && scrollDepth % 25 === 0) {
        maxScrollDepth = scrollDepth;
        this.trackEvent({
          type: "scroll",
          category: "engagement",
          action: "scroll_depth",
          value: scrollDepth,
        });
      }
    });

    // Track session end on page unload
    window.addEventListener("beforeunload", () => {
      this.endSession();
    });
  }
}

// Create singleton instance
export const behaviorTracker = new BehaviorTrackingService();

// React hook for behavior tracking
export function useBehaviorTracking() {
  const [sessionMetrics, setSessionMetrics] =
    React.useState<SessionMetrics | null>(null);
  const [recentEvents, setRecentEvents] = React.useState<BehaviorEvent[]>([]);
  const [recentQueries, setRecentQueries] = React.useState<QueryEvent[]>([]);

  React.useEffect(() => {
    // Subscribe to events and queries
    const unsubscribeEvents = behaviorTracker.onEvent((event) => {
      setRecentEvents((prev) => [...prev.slice(-19), event]);
    });

    const unsubscribeQueries = behaviorTracker.onQuery((query) => {
      setRecentQueries((prev) => [...prev.slice(-9), query]);
    });

    // Update session metrics periodically
    const interval = setInterval(() => {
      const session = behaviorTracker.getCurrentSession();
      setSessionMetrics(session);
    }, 1000);

    return () => {
      unsubscribeEvents();
      unsubscribeQueries();
      clearInterval(interval);
    };
  }, []);

  return {
    sessionMetrics,
    recentEvents,
    recentQueries,
    trackEvent: behaviorTracker.trackEvent.bind(behaviorTracker),
    trackQuery: behaviorTracker.trackQuery.bind(behaviorTracker),
    startSession: behaviorTracker.startSession.bind(behaviorTracker),
    endSession: behaviorTracker.endSession.bind(behaviorTracker),
  };
}

// React import declaration
declare global {
  const React: typeof import("react");
}
