import "@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "jsr:@supabase/supabase-js@2/cors";
import Anthropic from "npm:@anthropic-ai/sdk";
import { callNewsAPI } from "./news_api.js";
import { callArticleSearch } from "./call_search.js";

console.log("Hello from Functions!")

const tools = [
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
  },
  {
    name: "article_search",
    description: "A tool to get news article content", 
    input_schema: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "The URL of the news article to retrieve."
        }
      },
      required: ["url"]
    }
  }
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  try {
    const { input } = await req.json();
    const client = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY')! });

    const messages = [{ 
      role: "user", 
      content: "Call News API with the following keywords: rescue and economics" 
    }];

    // if minimal text content is found, do not
    const stepInstructions = {
      1: "For each of the news articles found, call the article search tool to get the text content at the URL, and then perform a sentiment analysis with the provided system instructions.",
      2: `You now have the full text of each article. For each one, provide:
      - A sentiment score (positive / neutral / negative)
      - A one-sentence justification
      - The article URL for reference
      Format the output as JSON.`
    }

    let iteration = 0;
    let finalResponse;

    while (iteration < 3) {
      iteration++;
      const response = await client.messages
        .create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1024,
          tools: tools,
          messages: messages,
        })
        .catch(async (error) => {
          if (error instanceof Anthropic.APIError) {
            const errorDetails = await error.response;
            console.log("API Error:", error);
          } else {
            throw error;
          }
          return;
        });

      console.log("Initial response:", response);
      messages.push({ role: "assistant", content: response.content });

      if (response.stop_reason !== "tool_use") {
        finalResponse = response.content.find(b => b.type === "text")?.text;
        break;
      }

      const toolResults = [];
      for (const block of response.content) {
        if (block.type != "tool_use") continue;

        const toolName = block.name;
        const toolParams = block.input;
        let result;
        if (toolName === "news_api") {
          result = await callNewsAPI(toolParams.keywords);
        } else if (toolName === "article_search") {
          result = await callArticleSearch(toolParams.url);
        }
        toolResults.push({
          type: "tool_result",
          tool_use_id: block.id,
          content: JSON.stringify(result)
        });
      }

      const nextMessage = [...toolResults];

      const extraInstruction = stepInstructions[iteration];
      if (extraInstruction) {
        nextMessage.push({ type: "text", text: extraInstruction });
      }

      messages.push({ role: "user", content: nextMessage });
    }

    return new Response(JSON.stringify("hello"), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message, stack: error.stack }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
