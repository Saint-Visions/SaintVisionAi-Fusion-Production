import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

/**
 * PartnerTech.ai Query Tracking API
 * Receives and processes AI query data for scoring
 */
export async function POST(request: NextRequest) {
  try {
    const query = await request.json();

    // Validate required fields
    if (!query.type || !query.prompt || !query.userId || !query.sessionId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Process the query data
    const processedQuery = {
      ...query,
      timestamp: new Date(query.timestamp),
      processed_at: new Date(),
      server_timestamp: new Date(),
      complexity: query.complexity || calculateComplexity(query.prompt),
      quality: query.quality || calculateQuality(query),
    };

    // In production, this would:
    // 1. Store in database
    // 2. Send to PartnerTech.ai API
    // 3. Update user scoring
    // 4. Trigger real-time updates

    // Simulate PartnerTech.ai API call
    await simulatePartnerTechAPI("queries", processedQuery);

    // Calculate query score impact
    const scoreImpact = calculateQueryScoreImpact(processedQuery);

    return NextResponse.json({
      success: true,
      query_id: processedQuery.queryId,
      score_impact: scoreImpact,
      complexity: processedQuery.complexity,
      quality: processedQuery.quality,
      processed_at: processedQuery.processed_at,
    });
  } catch (error) {
    console.error("Error processing query:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Calculate query complexity based on prompt analysis
function calculateComplexity(prompt: string): number {
  const factors = {
    length: Math.min(prompt.length / 100, 1) * 2,
    questionWords:
      (prompt.match(/\b(how|what|why|when|where|who|which)\b/gi) || []).length *
      0.5,
    technicalTerms:
      (
        prompt.match(
          /\b(algorithm|api|framework|database|integration|optimization|analytics)\b/gi,
        ) || []
      ).length * 0.8,
    conditionals:
      (
        prompt.match(/\b(if|unless|provided|assuming|given|considering)\b/gi) ||
        []
      ).length * 0.4,
    multiPart:
      (
        prompt.match(/\b(and|or|also|additionally|furthermore|moreover)\b/gi) ||
        []
      ).length * 0.3,
    specificity:
      (
        prompt.match(
          /\b(specific|exactly|precisely|detailed|comprehensive)\b/gi,
        ) || []
      ).length * 0.6,
  };

  const complexity = Object.values(factors).reduce(
    (sum, value) => sum + value,
    0,
  );
  return Math.min(Math.max(complexity, 1), 10); // Scale to 1-10
}

// Calculate query quality based on various factors
function calculateQuality(query: any): number {
  const factors = {
    success: query.success ? 3 : 0,
    responseTime: query.duration < 3000 ? 2 : query.duration < 8000 ? 1 : 0,
    promptClarity: query.prompt.length > 10 ? 2 : 1,
    engagement: 1, // Base engagement score
    modelUsed: getModelQualityScore(query.model),
  };

  const quality = Object.values(factors).reduce((sum, value) => sum + value, 0);
  return Math.min(quality, 10); // Scale to 1-10
}

// Get quality score based on AI model used
function getModelQualityScore(model: string): number {
  const modelScores = {
    "gpt-4": 3,
    "gpt-4-turbo": 3,
    "claude-3-sonnet": 3,
    "claude-3-opus": 3,
    "gpt-3.5": 2,
    "claude-3-haiku": 2,
    "claude-2": 1,
    basic: 1,
  };

  return modelScores[model as keyof typeof modelScores] || 1;
}

// Calculate score impact from query
function calculateQueryScoreImpact(query: any): number {
  const baseScore = 10; // Base points for any query
  const complexityBonus = query.complexity * 2; // Up to 20 points
  const qualityBonus = query.quality * 1.5; // Up to 15 points
  const successBonus = query.success ? 10 : -5;

  // Type-based multipliers
  const typeMultipliers = {
    ai_chat: 1.2,
    search: 1.0,
    voice: 1.5,
    help: 0.8,
  };

  const multiplier =
    typeMultipliers[query.type as keyof typeof typeMultipliers] || 1.0;
  const totalScore =
    (baseScore + complexityBonus + qualityBonus + successBonus) * multiplier;

  return Math.max(Math.round(totalScore), 0);
}

// Simulate PartnerTech.ai API integration
async function simulatePartnerTechAPI(
  endpoint: string,
  data: any,
): Promise<void> {
  // In production, replace with actual PartnerTech.ai API call
  console.log(`Sending to PartnerTech.ai ${endpoint}:`, {
    queryId: data.queryId,
    userId: data.userId,
    sessionId: data.sessionId,
    type: data.type,
    complexity: data.complexity,
    quality: data.quality,
    success: data.success,
    model: data.model,
    timestamp: data.timestamp,
  });

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 150));
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
