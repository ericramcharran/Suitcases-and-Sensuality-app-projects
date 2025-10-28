import OpenAI from "openai";

// This is using Replit's AI Integrations service, which provides OpenAI-compatible API access without requiring your own OpenAI API key.
// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY
});

export interface AIActivityParams {
  city: string;
  state: string;
  relationshipType?: string;
  activityPreferences?: string[];
}

export interface AIGeneratedActivity {
  title: string;
  description: string;
  location: string;
  category: string;
  estimated_duration: string;
  cost_range: string;
  location_type: string;
  energy_level: string;
  tips: string[];
  isAIGenerated: true;
}

export async function generateLocalActivity(params: AIActivityParams): Promise<AIGeneratedActivity> {
  const { city, state, relationshipType, activityPreferences } = params;

  const prompt = `You are a creative date planner helping couples discover unique activities in their local area.

Location: ${city}, ${state}
Relationship Type: ${relationshipType || 'couple'}
${activityPreferences ? `Preferences: ${activityPreferences.join(', ')}` : ''}

Generate ONE specific, real, and actionable date activity that:
1. Takes place in or near ${city}, ${state}
2. Is appropriate for a ${relationshipType || 'couple'}
3. Includes a specific venue, location, or area (e.g., "Visit the farmers market at Central Park" not just "Go to a farmers market")
4. Is fun, romantic, or engaging
5. Can be completed in one session (a few hours max)

Return ONLY valid JSON with this exact structure (no markdown, no code blocks):
{
  "title": "Short catchy title (max 50 chars)",
  "description": "Detailed description of what to do (2-3 sentences)",
  "location": "Specific venue or area name in ${city}",
  "category": "One of: Romantic, Adventure, Foodie, Cultural, Active, Entertainment, Creative, or Relaxing",
  "estimated_duration": "e.g., '1-2 hours' or '2-3 hours'",
  "cost_range": "e.g., 'Free', '$', '$$', '$$$'",
  "location_type": "indoor or outdoor",
  "energy_level": "low, medium, or high",
  "tips": ["Tip 1", "Tip 2", "Tip 3"]
}`;

  try {
    console.log('[OpenAI] Calling GPT-4 Turbo with prompt for', city, state);
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates date ideas. Always respond with valid JSON only, no markdown formatting."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 500
    });

    console.log('[OpenAI] Response received:', {
      choices: completion.choices.length,
      hasContent: !!completion.choices[0]?.message?.content,
      finishReason: completion.choices[0]?.finish_reason
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      console.error('[OpenAI] No content in response:', JSON.stringify(completion, null, 2));
      throw new Error("No response from AI");
    }

    console.log('[OpenAI] Parsing JSON response, length:', content.length);
    const activity = JSON.parse(content);
    console.log('[OpenAI] Successfully generated activity:', activity.title);
    
    return {
      ...activity,
      isAIGenerated: true as const
    };
  } catch (error) {
    console.error("[OpenAI] Error generating AI activity:", error);
    if (error instanceof Error) {
      console.error("[OpenAI] Error details:", error.message, error.stack);
    }
    throw new Error("Failed to generate activity suggestion");
  }
}
