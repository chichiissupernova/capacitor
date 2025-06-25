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
    const { audience, niche, contentGoal } = await req.json();
    
    if (!audience || !niche || !contentGoal) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Generating content idea for audience: ${audience}, niche: ${niche}, goal: ${contentGoal}`);
    
    // Create prompt for OpenAI
    const prompt = `
      Generate a social media content idea for a creator with the following details:

      Target Audience: ${audience}
      Niche/Expertise: ${niche}
      Content Goal: ${contentGoal}

      Please provide:
      1. A catchy post title (15 words max)
      2. A compelling hook or opening sentence for reels or to grab attention (max 30 words)
      3. A caption starter with 2-3 sentences to elaborate (max 50 words)
      4. A call to action suggestion that aligns with the content goal (max 15 words)

      Format the response as a JSON object with the keys: title, hook, captionStarter, cta
    `;

    // If API quota is exceeded, provide a fallback response
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
              content: "You are a creative content strategist that helps creators come up with engaging social media ideas. Your responses should be brief, engaging, and formatted as requested."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.8,
          max_tokens: 500
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
        
        // Otherwise try to extract JSON from text - we're looking for a JSON structure in the response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            parsedContent = JSON.parse(jsonMatch[0]);
          } catch (e2) {
            console.error("Failed to parse extracted JSON:", e2);
            throw new Error("Failed to parse response from OpenAI");
          }
        } else {
          // If no JSON structure, create one from the text by analyzing the content
          // This is a fallback if the model doesn't return proper JSON
          const titleMatch = content.match(/title:?\s*([^\n]+)/i);
          const hookMatch = content.match(/hook:?\s*([^\n]+)/i);
          const captionStarterMatch = content.match(/caption starter:?\s*([^\n]+)/i);
          const ctaMatch = content.match(/call to action:?\s*([^\n]+)/i);

          parsedContent = {
            title: titleMatch ? titleMatch[1].trim() : "Untitled Content Idea",
            hook: hookMatch ? hookMatch[1].trim() : "No hook provided",
            captionStarter: captionStarterMatch ? captionStarterMatch[1].trim() : "No caption starter provided",
            cta: ctaMatch ? ctaMatch[1].trim() : "No call to action provided"
          };
        }
      }

      // Return the formatted content idea
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
    console.error("Error in generate-content-ideas function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "An error occurred while generating content ideas" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
