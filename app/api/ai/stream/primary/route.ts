import { NextRequest } from "next/server";

export const runtime = "edge";

/**
 * Primary AI Model Streaming Endpoint
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
          // Simulate streaming from AI backend
          // In production, this would connect to OpenAI, Anthropic, etc.

          const responses = [
            `As your primary AI assistant with ${model || "GPT-4"} capabilities, I'll analyze "${prompt}" comprehensively. Let me provide structured insights that leverage advanced reasoning patterns.`,
            `Examining "${prompt}" through multiple analytical frameworks, I can identify key leverage points and strategic opportunities. This requires systematic evaluation of the problem space.`,
            `Based on my analysis of "${prompt}", here are evidence-based recommendations that integrate cross-domain knowledge and proven methodologies for optimal outcomes.`,
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
            // Faster for PRO/ENTERPRISE users
            const baseDelay =
              user_plan === "FREE" ? 120 : user_plan === "PRO" ? 80 : 50;
            const delay = baseDelay + Math.random() * 50;

            if (!isLast) {
              await new Promise((resolve) => setTimeout(resolve, delay));
            }
          }
        } catch (error) {
          console.error("Streaming error:", error);
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
    console.error("Primary AI streaming error:", error);
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
