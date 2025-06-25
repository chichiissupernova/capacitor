
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error("OpenAI API key not found");
    }

    // Parse request body
    const { audience, business, contentGoal, preferredFormats, platforms } = await req.json();
    
    if (!audience || !business || !contentGoal || !platforms || platforms.length === 0) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Generating 7-day content plan for: ${business}, audience: ${audience}, goal: ${contentGoal}`);
    
    // Create enhanced prompt for OpenAI
    const prompt = `
      Create a comprehensive 7-day content strategy for a creator with the following details:

      Target Audience: ${audience}
      Business/Niche: ${business}
      Content Goal: ${contentGoal}
      Preferred Formats: ${preferredFormats.length > 0 ? preferredFormats.join(', ') : 'Mixed content types'}
      Platforms: ${platforms.join(', ')}

      Create exactly 7 content ideas, one for each day of the week. For each day, provide:

      1. Day number (1-7)
      2. A compelling topic title (3-6 words max)
      3. A detailed content prompt explaining what to create (2-3 sentences)
      4. Suggested format (choose from: Reels, Carousels, Stories, Long-form video, Text post, Live session, UGC style, Tutorial, Behind-the-scenes)
      5. A strategic "ChiChi Tip" with engagement advice (1-2 sentences)
      6. Hook suggestions (2-3 engaging opening lines)
      7. Best posting time recommendation
      8. Call-to-action suggestion

      Make sure the content plan:
      - Aligns strategically with their content goal (${contentGoal})
      - Speaks directly to their audience (${audience})
      - Showcases their expertise in ${business}
      - Uses varied content formats throughout the week
      - Includes a strategic mix of educational (40%), personal/behind-scenes (30%), and promotional content (30%)
      - Follows current content trends and best practices
      - Addresses audience pain points and interests

      Format the response as a JSON object with this structure:
      {
        "days": [
          {
            "day": 1,
            "title": "Your Why Story",
            "prompt": "Share the personal story behind why you started your brand. Include the pivotal moment that sparked your passion and how it connects to your audience's journey.",
            "format": "Talking-head Reel",
            "chichiTip": "Use B-roll footage of your workspace or early content to make it more visually engaging. Pin your comment to encourage others to share their why.",
            "hooks": ["The moment I knew I had to change everything...", "Nobody talks about this part of starting a business", "3 years ago, I almost gave up on my dreams"],
            "bestTime": "7-9 PM (peak engagement hours)",
            "cta": "Comment 'WHY' and share what drives you in your journey"
          }
          // ... continue for all 7 days
        ]
      }
    `;

    try {
      // Call OpenAI API
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openAIApiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are a strategic content planner and social media expert. You create comprehensive, actionable 7-day content plans that align with business goals, current trends, and audience psychology. Your plans should be diverse, engaging, and practical to execute with clear strategic reasoning."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.8,
          max_tokens: 2000
        })
      });

      const data = await response.json();
      
      if (data.error) {
        console.error("OpenAI API error:", data.error);
        
        // Check specifically for quota exceeded error
        if (data.error.type === "insufficient_quota" || 
            data.error.message?.includes("exceeded your current quota")) {
          return new Response(
            JSON.stringify({ 
              error: "OpenAI API quota exceeded. Please check your billing details or try again later.",
              errorType: "quota_exceeded"
            }),
            { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        
        throw new Error(data.error.message || "Error calling OpenAI API");
      }

      // Parse the response from OpenAI
      const content = data.choices[0].message.content;
      
      // Try to parse the JSON from the response
      let parsedContent;
      try {
        // First try direct parsing if the response is already JSON
        parsedContent = JSON.parse(content);
      } catch (e) {
        console.log("Response is not direct JSON, attempting to extract JSON structure");
        
        // Otherwise try to extract JSON from text
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            parsedContent = JSON.parse(jsonMatch[0]);
          } catch (e2) {
            console.error("Failed to parse extracted JSON:", e2);
            throw new Error("Failed to parse response from OpenAI");
          }
        } else {
          throw new Error("No valid JSON structure found in response");
        }
      }

      // Validate that we have 7 days
      if (!parsedContent.days || parsedContent.days.length !== 7) {
        throw new Error("Invalid content plan structure - expected 7 days");
      }

      // Return the formatted content plan
      return new Response(
        JSON.stringify(parsedContent),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
      
    } catch (apiError) {
      console.error("API call error:", apiError);
      
      // Provide a fallback response that works even if OpenAI is down
      if (apiError.message?.includes("quota") || apiError.toString().includes("quota")) {
        return new Response(
          JSON.stringify({ 
            error: "OpenAI API quota exceeded. Please check your billing details or try again later.",
            errorType: "quota_exceeded"
          }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw apiError;
    }

  } catch (error) {
    console.error("Error in generate-content-plan function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "An error occurred while generating content plan" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
