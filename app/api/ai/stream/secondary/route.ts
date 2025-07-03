import { NextRequest } from "next/server";

export const runtime = "edge";

/**
 * Secondary AI Model Streaming Endpoint
 * Implements chunked transfer encoding for real-time token streaming
 */
export async function POST(request: NextRequest) {
  try {
    const { prompt, model, stream, max_tokens, user_plan } =
      await request.json();

    if (!prompt) {
      return new Response("Prompt is required", { status: 400 });
    }

    // Create a readable stream for chunked transfer encoding
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Secondary AI with alternative perspective
          // In production, this would connect to Claude, Gemini, etc.

          const responses = [
            `From an alternative analytical perspective using ${model || "Claude-3"} reasoning, "${prompt}" presents interesting creative possibilities. Let me explore unconventional approaches and innovative solutions.`,
            `Taking a different angle on "${prompt}", I see opportunities for creative problem-solving that challenges conventional thinking. This requires divergent analysis and lateral reasoning.`,
            `Approaching "${prompt}" with fresh eyes and creative methodologies, I can offer unique insights that complement traditional analysis with innovative thinking patterns.`,
          ];

          const fullResponse =
            responses[Math.floor(Math.random() * responses.length)];
          const words = fullResponse.split(" ");

          // Stream each word as a token with realistic delays
          for (let i = 0; i < words.length; i++) {
            const word = words[i];
            const isLast = i === words.length - 1;

            // Add space between words (except first)
            const token = i === 0 ? word : ` ${word}`;

            // Encode and enqueue the token
            controller.enqueue(encoder.encode(token));

            // Simulate processing time for each token
            // Secondary model has slightly different timing patterns
            const baseDelay =
              user_plan === "FREE" ? 100 : user_plan === "PRO" ? 70 : 40;
            const delay = baseDelay + Math.random() * 60;

            if (!isLast) {
              await new Promise((resolve) => setTimeout(resolve, delay));
            }
          }
        } catch (error) {
          console.error("Secondary streaming error:", error);
          controller.enqueue(
            encoder.encode("\n\n[Error: Streaming interrupted]"),
          );
        } finally {
          controller.close();
        }
      },
    });

    // Return streaming response with proper headers
    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no", // Disable Nginx buffering
      },
    });
  } catch (error) {
    console.error("Secondary AI streaming error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}

// Handle preflight requests for CORS
export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
