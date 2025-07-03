import { NextRequest } from "next/server";

export const runtime = "edge";

/**
 * Companion AI Streaming Endpoint (Free Tier)
 * Implements chunked transfer encoding for basic AI interactions
 */
export async function POST(request: NextRequest) {
  try {
    const { prompt, user_plan, remaining_chats } = await request.json();

    if (!prompt) {
      return new Response("Prompt is required", { status: 400 });
    }

    // Check usage limits for free tier
    if (user_plan === "FREE" && remaining_chats <= 0) {
      return new Response(
        JSON.stringify({
          error: "Chat limit exceeded",
          upgrade_required: true,
        }),
        {
          status: 429,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Create a readable stream for chunked transfer encoding
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Basic AI companion responses
          const responses = [
            `Hi! I'm your AI companion. I can help with "${prompt}". While I provide basic assistance, upgrading to Pro unlocks advanced AI models and unlimited conversations for deeper insights.`,
            `Thanks for asking about "${prompt}"! I'll do my best to help with basic guidance. For comprehensive analysis and expert-level responses, consider our Pro features with GPT-4 and Claude access.`,
            `I understand you're interested in "${prompt}". I can offer some basic assistance here. For unlimited chats and advanced AI capabilities, our Pro plan provides much more powerful tools.`,
          ];

          const fullResponse =
            responses[Math.floor(Math.random() * responses.length)];
          const words = fullResponse.split(" ");

          // Stream each word as a token with slower delays for free tier
          for (let i = 0; i < words.length; i++) {
            const word = words[i];
            const isLast = i === words.length - 1;

            // Add space between words (except first)
            const token = i === 0 ? word : ` ${word}`;

            // Encode and enqueue the token
            controller.enqueue(encoder.encode(token));

            // Slower streaming for free tier to encourage upgrades
            const delay = 150 + Math.random() * 100;

            if (!isLast) {
              await new Promise((resolve) => setTimeout(resolve, delay));
            }
          }
        } catch (error) {
          console.error("Companion streaming error:", error);
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
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    console.error("Companion AI streaming error:", error);
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
