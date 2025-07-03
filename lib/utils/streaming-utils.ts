/**
 * Streaming Utilities for Real-time Token Rendering
 * Supports chunked transfer encoding from backend APIs
 */

export interface StreamingOptions {
  onToken?: (token: string, isComplete: boolean) => void;
  onChunk?: (chunk: string, accumulated: string) => void;
  onComplete?: (fullResponse: string) => void;
  onError?: (error: Error) => void;
  signal?: AbortSignal;
}

export interface StreamingResponse {
  content: string;
  tokens: number;
  duration: number;
  completed: boolean;
}

/**
 * Stream response from backend API with chunked transfer encoding
 * Treats each token or delta as a unit to render live
 */
export async function streamFromAPI(
  url: string,
  options: RequestInit & { streamingOptions?: StreamingOptions } = {},
): Promise<StreamingResponse> {
  const { streamingOptions, ...fetchOptions } = options;
  const startTime = Date.now();

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        Accept: "text/plain, application/json",
        "Cache-Control": "no-cache",
        ...fetchOptions.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error("Response body is null");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulated = "";
    let tokenCount = 0;

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        // Decode the chunk
        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;

        // Count tokens (rough approximation)
        tokenCount = accumulated.split(/\s+/).length;

        // Call chunk handler
        streamingOptions?.onChunk?.(chunk, accumulated);

        // Call token handler with current accumulated content
        streamingOptions?.onToken?.(accumulated, false);
      }

      // Final call to indicate completion
      streamingOptions?.onToken?.(accumulated, true);
      streamingOptions?.onComplete?.(accumulated);

      return {
        content: accumulated,
        tokens: tokenCount,
        duration: Date.now() - startTime,
        completed: true,
      };
    } finally {
      reader.releaseLock();
    }
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    streamingOptions?.onError?.(err);
    throw err;
  }
}

/**
 * Stream OpenAI-style Server-Sent Events (SSE)
 * Handles data: prefixed chunks and [DONE] completion
 */
export async function streamSSE(
  url: string,
  options: RequestInit & { streamingOptions?: StreamingOptions } = {},
): Promise<StreamingResponse> {
  const { streamingOptions, ...fetchOptions } = options;
  const startTime = Date.now();

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        Accept: "text/event-stream",
        "Cache-Control": "no-cache",
        ...fetchOptions.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error("Response body is null");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulated = "";
    let tokenCount = 0;

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);

            // Check for completion signal
            if (data.trim() === "[DONE]") {
              streamingOptions?.onToken?.(accumulated, true);
              streamingOptions?.onComplete?.(accumulated);
              return {
                content: accumulated,
                tokens: tokenCount,
                duration: Date.now() - startTime,
                completed: true,
              };
            }

            try {
              // Try to parse as JSON for structured responses
              const parsed = JSON.parse(data);
              const content =
                parsed.choices?.[0]?.delta?.content || parsed.content || "";

              if (content) {
                accumulated += content;
                tokenCount = accumulated.split(/\s+/).length;

                streamingOptions?.onChunk?.(content, accumulated);
                streamingOptions?.onToken?.(accumulated, false);
              }
            } catch {
              // If not JSON, treat as raw text
              accumulated += data;
              tokenCount = accumulated.split(/\s+/).length;

              streamingOptions?.onChunk?.(data, accumulated);
              streamingOptions?.onToken?.(accumulated, false);
            }
          }
        }
      }

      return {
        content: accumulated,
        tokens: tokenCount,
        duration: Date.now() - startTime,
        completed: true,
      };
    } finally {
      reader.releaseLock();
    }
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    streamingOptions?.onError?.(err);
    throw err;
  }
}

/**
 * Simulate streaming for development/demo purposes
 * Useful when backend streaming is not yet implemented
 */
export async function simulateStreaming(
  text: string,
  options: {
    tokenDelay?: number;
    chunkSize?: number;
    streamingOptions?: StreamingOptions;
  } = {},
): Promise<StreamingResponse> {
  const { tokenDelay = 50, chunkSize = 1, streamingOptions } = options;

  const startTime = Date.now();
  const words = text.split(" ");
  let accumulated = "";

  try {
    for (let i = 0; i < words.length; i += chunkSize) {
      // Create chunk of words
      const chunk = words.slice(i, i + chunkSize).join(" ");
      const isLastChunk = i + chunkSize >= words.length;

      // Add space if not first chunk
      if (i > 0) {
        accumulated += " ";
      }
      accumulated += chunk;

      // Simulate network delay
      await new Promise((resolve) =>
        setTimeout(resolve, tokenDelay + Math.random() * tokenDelay),
      );

      // Call handlers
      streamingOptions?.onChunk?.(chunk, accumulated);
      streamingOptions?.onToken?.(accumulated, isLastChunk);

      if (isLastChunk) {
        streamingOptions?.onComplete?.(accumulated);
      }
    }

    return {
      content: accumulated,
      tokens: words.length,
      duration: Date.now() - startTime,
      completed: true,
    };
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    streamingOptions?.onError?.(err);
    throw err;
  }
}

/**
 * Create an AbortController for cancelling streaming requests
 */
export function createStreamingController(): {
  controller: AbortController;
  signal: AbortSignal;
  abort: () => void;
} {
  const controller = new AbortController();

  return {
    controller,
    signal: controller.signal,
    abort: () => controller.abort(),
  };
}

/**
 * Streaming state management types for React components
 * Import React and use these in your component's useState hooks
 */
export interface StreamingState {
  isStreaming: boolean;
  content: string;
  error: Error | null;
  tokenCount: number;
}

export interface StreamingActions {
  reset: () => void;
  streamingOptions: StreamingOptions;
}

/**
 * Create streaming options for state management
 * Use this with your component's useState hooks
 */
export function createStreamingOptions(
  setContent: (content: string) => void,
  setIsStreaming: (streaming: boolean) => void,
  setError: (error: Error | null) => void,
  setTokenCount: (count: number) => void,
): StreamingOptions {
  return {
    onToken: (token, isComplete) => {
      setContent(token);
      setTokenCount(token.split(/\s+/).length);
      setIsStreaming(!isComplete);
    },
    onError: (err) => {
      setError(err);
      setIsStreaming(false);
    },
    onComplete: (finalContent) => {
      setContent(finalContent);
      setIsStreaming(false);
    },
  };
}
