// Chat URL utility functions for SaintSal™ Fusion

export interface ChatUrlParams {
  prompt?: string;
  conversationId?: string;
  model?: string;
  context?: Record<string, any>;
  source?: string;
}

export class ChatUrlBuilder {
  private baseUrl: string;
  private params: ChatUrlParams;

  constructor(baseUrl?: string) {
    this.baseUrl =
      baseUrl || (typeof window !== "undefined" ? window.location.origin : "");
    this.params = {};
  }

  // Set the main prompt
  setPrompt(prompt: string): ChatUrlBuilder {
    this.params.prompt = prompt;
    return this;
  }

  // Set conversation ID for context
  setConversationId(id: string): ChatUrlBuilder {
    this.params.conversationId = id;
    return this;
  }

  // Set AI model preference
  setModel(model: string): ChatUrlBuilder {
    this.params.model = model;
    return this;
  }

  // Add contextual data
  setContext(context: Record<string, any>): ChatUrlBuilder {
    this.params.context = context;
    return this;
  }

  // Set source identifier
  setSource(source: string): ChatUrlBuilder {
    this.params.source = source;
    return this;
  }

  // Build the complete URL
  build(): string {
    const url = new URL("/chat", this.baseUrl);

    if (this.params.prompt) {
      url.searchParams.set("prompt", encodeURIComponent(this.params.prompt));
    }

    if (this.params.conversationId) {
      url.searchParams.set("conversationId", this.params.conversationId);
    }

    if (this.params.model) {
      url.searchParams.set("model", this.params.model);
    }

    if (this.params.context) {
      url.searchParams.set(
        "context",
        encodeURIComponent(JSON.stringify(this.params.context)),
      );
    }

    if (this.params.source) {
      url.searchParams.set("source", this.params.source);
    }

    return url.toString();
  }

  // Build relative URL (without domain)
  buildRelative(): string {
    const fullUrl = this.build();
    return fullUrl.replace(this.baseUrl, "");
  }
}

// Utility function to create chat URLs
export function createChatUrl(params: ChatUrlParams): string {
  return new ChatUrlBuilder()
    .setPrompt(params.prompt || "")
    .setConversationId(params.conversationId || "")
    .setModel(params.model || "")
    .setContext(params.context || {})
    .setSource(params.source || "")
    .build();
}

// Parse chat URL parameters
export function parseChatUrl(url: string): ChatUrlParams {
  const urlObj = new URL(url);
  const params: ChatUrlParams = {};

  const prompt = urlObj.searchParams.get("prompt");
  if (prompt) {
    params.prompt = decodeURIComponent(prompt);
  }

  const conversationId = urlObj.searchParams.get("conversationId");
  if (conversationId) {
    params.conversationId = conversationId;
  }

  const model = urlObj.searchParams.get("model");
  if (model) {
    params.model = model;
  }

  const context = urlObj.searchParams.get("context");
  if (context) {
    try {
      params.context = JSON.parse(decodeURIComponent(context));
    } catch (error) {
      console.warn("Failed to parse context from URL:", error);
    }
  }

  const source = urlObj.searchParams.get("source");
  if (source) {
    params.source = source;
  }

  return params;
}

// Predefined chat templates
export const ChatTemplates = {
  businessIdeas: (industry?: string) =>
    new ChatUrlBuilder()
      .setPrompt(
        `Help me brainstorm innovative business ideas${industry ? ` in the ${industry} industry` : ""}`,
      )
      .setSource("template-business-ideas")
      .setContext({ template: "business-ideas", industry })
      .buildRelative(),

  marketingStrategy: (business?: string) =>
    new ChatUrlBuilder()
      .setPrompt(
        `Analyze and improve my marketing strategy${business ? ` for ${business}` : ""}`,
      )
      .setSource("template-marketing")
      .setContext({ template: "marketing-strategy", business })
      .buildRelative(),

  emailWriting: (purpose?: string) =>
    new ChatUrlBuilder()
      .setPrompt(
        `Help me write a professional email${purpose ? ` for ${purpose}` : ""}`,
      )
      .setSource("template-email")
      .setContext({ template: "email-writing", purpose })
      .buildRelative(),

  codeReview: (language?: string) =>
    new ChatUrlBuilder()
      .setPrompt(
        `Review my code and suggest improvements${language ? ` (${language})` : ""}`,
      )
      .setSource("template-code-review")
      .setContext({ template: "code-review", language })
      .buildRelative(),

  explainConcept: (topic?: string) =>
    new ChatUrlBuilder()
      .setPrompt(
        `Explain ${topic || "complex topics"} in simple terms with examples`,
      )
      .setSource("template-explain")
      .setContext({ template: "explain-concept", topic })
      .buildRelative(),

  problemSolving: (problem?: string) =>
    new ChatUrlBuilder()
      .setPrompt(
        `Help me solve this problem: ${problem || "[describe your problem]"}`,
      )
      .setSource("template-problem-solving")
      .setContext({ template: "problem-solving", problem })
      .buildRelative(),

  contentCreation: (type?: string) =>
    new ChatUrlBuilder()
      .setPrompt(`Help me create ${type || "engaging content"} for my audience`)
      .setSource("template-content")
      .setContext({ template: "content-creation", type })
      .buildRelative(),

  dataAnalysis: (dataType?: string) =>
    new ChatUrlBuilder()
      .setPrompt(
        `Help me analyze ${dataType || "my data"} and extract insights`,
      )
      .setSource("template-data-analysis")
      .setContext({ template: "data-analysis", dataType })
      .buildRelative(),
};

// Share chat functionality
export class ChatSharer {
  static async shareViaUrl(
    prompt: string,
    options?: {
      title?: string;
      text?: string;
      additionalParams?: ChatUrlParams;
    },
  ): Promise<boolean> {
    const url = new ChatUrlBuilder()
      .setPrompt(prompt)
      .setSource("shared-url")
      .setContext(options?.additionalParams?.context || {})
      .build();

    // Try native sharing first
    if (navigator.share) {
      try {
        await navigator.share({
          title: options?.title || "SaintSal™ AI Chat",
          text:
            options?.text ||
            `Check out this AI conversation: "${prompt.substring(0, 100)}..."`,
          url: url,
        });
        return true;
      } catch (error) {
        console.log("Native sharing failed, falling back to clipboard");
      }
    }

    // Fallback to clipboard
    try {
      await navigator.clipboard.writeText(url);
      return true;
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      return false;
    }
  }

  static generateQRCode(prompt: string): string {
    const url = new ChatUrlBuilder()
      .setPrompt(prompt)
      .setSource("qr-code")
      .build();

    // Return URL for QR code generation service
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
  }

  static generateEmbedCode(
    prompt: string,
    options?: {
      width?: number;
      height?: number;
      theme?: "light" | "dark";
    },
  ): string {
    const url = new ChatUrlBuilder()
      .setPrompt(prompt)
      .setSource("embed")
      .build();

    const width = options?.width || 400;
    const height = options?.height || 600;
    const theme = options?.theme || "dark";

    return `<iframe
      src="${url}&embed=true&theme=${theme}"
      width="${width}"
      height="${height}"
      frameborder="0"
      sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      style="border-radius: 8px; background: ${theme === "dark" ? "#000" : "#fff"};"
      title="SaintSal™ AI Chat">
    </iframe>`;
  }
}

// Chat URL validation
export function validateChatUrl(url: string): {
  isValid: boolean;
  errors: string[];
  params?: ChatUrlParams;
} {
  const errors: string[] = [];

  try {
    const urlObj = new URL(url);

    // Check if it's a chat URL
    if (!urlObj.pathname.includes("/chat")) {
      errors.push("URL must be a chat URL");
    }

    const params = parseChatUrl(url);

    // Validate prompt
    if (params.prompt && params.prompt.length > 1000) {
      errors.push("Prompt is too long (max 1000 characters)");
    }

    // Validate conversation ID format
    if (
      params.conversationId &&
      !/^chat_\d+_[a-z0-9]+$/.test(params.conversationId)
    ) {
      errors.push("Invalid conversation ID format");
    }

    return {
      isValid: errors.length === 0,
      errors,
      params: errors.length === 0 ? params : undefined,
    };
  } catch (error) {
    return {
      isValid: false,
      errors: ["Invalid URL format"],
    };
  }
}

// Analytics tracking for chat URLs
export function trackChatUrlUsage(
  params: ChatUrlParams,
  action: "created" | "accessed" | "shared",
) {
  // In a real implementation, this would send analytics events
  console.log("Chat URL Analytics:", {
    action,
    source: params.source,
    hasPrompt: Boolean(params.prompt),
    hasContext: Boolean(params.context),
    timestamp: new Date().toISOString(),
  });
}

export default {
  ChatUrlBuilder,
  createChatUrl,
  parseChatUrl,
  ChatTemplates,
  ChatSharer,
  validateChatUrl,
  trackChatUrlUsage,
};
