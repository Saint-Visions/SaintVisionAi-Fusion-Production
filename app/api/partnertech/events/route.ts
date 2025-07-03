import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

/**
 * PartnerTech.ai Behavior Events API
 * Receives and processes user behavior tracking data
 */
export async function POST(request: NextRequest) {
  try {
    const event = await request.json();

    // Validate required fields
    if (
      !event.type ||
      !event.category ||
      !event.action ||
      !event.userId ||
      !event.sessionId
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Process the behavior event
    const processedEvent = {
      ...event,
      timestamp: new Date(event.timestamp),
      processed_at: new Date(),
      server_timestamp: new Date(),
    };

    // In production, this would:
    // 1. Store in database (MongoDB, PostgreSQL, etc.)
    // 2. Send to PartnerTech.ai API
    // 3. Update real-time scoring
    // 4. Trigger webhooks if needed

    // Simulate PartnerTech.ai API call
    await simulatePartnerTechAPI("events", processedEvent);

    // Calculate immediate score impact
    const scoreImpact = calculateEventScoreImpact(processedEvent);

    return NextResponse.json({
      success: true,
      event_id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      score_impact: scoreImpact,
      processed_at: processedEvent.processed_at,
    });
  } catch (error) {
    console.error("Error processing behavior event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Calculate score impact from behavior event
function calculateEventScoreImpact(event: any): number {
  const impacts = {
    page_view: 1,
    click: 2,
    scroll: 1,
    ai_query: 5,
    feature_use: 3,
    session_start: 5,
    session_end: 0,
  };

  let impact = impacts[event.type as keyof typeof impacts] || 0;

  // Bonus points for engagement
  if (event.category === "engagement") {
    impact *= 1.5;
  }

  // Bonus for valuable interactions
  if (event.value && event.value > 0) {
    impact += Math.min(event.value / 100, 5); // Max 5 bonus points
  }

  return Math.round(impact);
}

// Simulate PartnerTech.ai API integration
async function simulatePartnerTechAPI(
  endpoint: string,
  data: any,
): Promise<void> {
  // In production, replace with actual PartnerTech.ai API call
  console.log(`Sending to PartnerTech.ai ${endpoint}:`, {
    userId: data.userId,
    sessionId: data.sessionId,
    type: data.type,
    category: data.category,
    action: data.action,
    timestamp: data.timestamp,
  });

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
