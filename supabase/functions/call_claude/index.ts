import "@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "jsr:@supabase/supabase-js@2/cors";
import Anthropic from "npm:@anthropic-ai/sdk";
import { callNewsAPI } from "./news_api.js";

console.log("Hello from Functions!")

const prompt = {
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    tools: [
      {
        name: "news_api",
        description: "A tool to search for news articles based on keywords and date ranges.",
        input_schema: {
          type: "object",
          properties: {
            keywords: {
              type: "array",
              items: { type: "string" },
              description: "A list of keywords to search for in news articles."
            },
          }, 
          required: ["keywords"]
        }
      }
    ],
    messages: [
      { 
        role: "user", 
        content: "Call News API with the following keywords: rescue and economics" 
      }
    ],
  }

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  try {
    const { input } = await req.json();
    const client = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY')! });

    const message = await client.messages
      .create(prompt)
      .catch(async (error) => {
        if (error instanceof Anthropic.APIError) {
          const errorDetails = await error.response.json();
          console.log("API Error:", errorDetails);
        } else {
          throw error;
        }
      });

    console.log("Initial response:", message);

    console.log("Stop reason:", message.stop_reason);

    if (message.stop_reason === "tool_use") {
      const toolName = message.content[1].name;
      const toolParams = message.content[1].input;
      if (toolName === "news_api") {
        const newsResult = await callNewsAPI(toolParams.keywords);
        console.log("News API result:", newsResult);
      }
    }

    const text = message.content[0].text;

    return new Response(JSON.stringify(text), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
})
