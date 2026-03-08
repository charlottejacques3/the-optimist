import "@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "jsr:@supabase/supabase-js@2/cors";
import Anthropic from "npm:@anthropic-ai/sdk";
import { callNewsAPI, getAllKeywords, moreKeywords } from "./news_api.js";
import { callArticleSearch } from "./call_search.js";
import { createClient } from "npm:@supabase/supabase-js@2";

console.log("Hello from Functions!");
const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SB_PUBLISHABLE_KEY')!);

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
    const { keywords } = await req.json();
    const client = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY')! });

    const messages = [{ 
      role: "user", 
      content: `Call News API with the following keywords: ${keywords}` 
    }];

    let allKeywords = {};
    keywords.forEach((keyword) => {
     allKeywords[keyword] = moreKeywords[keyword]; 
    })

    // if minimal text content is found, do not
    const stepInstructions = {
      1: "For EVERY one of the news articles found, call the article search tool to get the text content at the URL. If the article cannot be accessed or does not contain enough text content, skip it and move on to the next one.",
      2: `Note: do not explain your work, only return JSON output as explained below. Never use markdown formatting, code blocks, or backticks. Return only raw, valid JSON with no preamble or explanation.
      
      You now have the full text of each article. If an article does not have enough text content to analyze, skip over it. For EVERY article, do the following:
      1. Determine a sentiment score on a range of 1-5 (very positive being 5, very negative being 1). 
      2. Determine a relevance score on a range of 1-5 (very relevant being 5, very irrelevant being 1) based on whether the article actually discusses topics related to one or more of the following groups of keywords: ${allKeywords}.
      3. Use the following formula to calculate a total score for each article: Total Score = (Sentiment Score)*2 + (Relevance Score).
      4. IF AND ONLY IF the total score is greater than or equal to 12 AND its sentiment score is greater than or equal to 4, add the article's details to a JSON output structured as follows:
        { 
          "url": <article URL>,
          "headline": <article headline>,
          "summary": <generate a short summary of the article in 2-3 sentences>,
        }
      
      If any of the above conditions are not met, discard the article. Follow these guidelines exactly, and do not adjust scores arbitrarily. 
      
      After parsing through all the articles, sort the JSON output so that the articles with the highest total scores are displayed first.
      The final JSON output should have the form:
      {
        "articles": [
          {
            "url": <url1>,
            "headline": <headline1>,
            "summary": <summary1>
          },
          {
            "url": <url2>,
            "headline": <headline2>,
            "summary": <summary2>
          },
        ], 
        //etc
      }
      `,
      // Format the output as an array of article URLs, and ONLY include article URLs where the total score is greater than or equal to 8. Sort the array so that the articles with the highest score are listed first. At the end, trim the array to only contain the top three articles with the highest scores.`,

      // 3: `You should now have a list of article URLs that are relevant to the topic and have a positive sentiment. Use the article search tool to read over the article again. Since the keyword search may not have yielded accurate results, read over the article to see whether it is relevant to the given keywords: ${keywords}. If the article is relevant, keep it in the list. If it is not relevant, remove it from the list. Keep going through this until you find five relevant articles. At this point, provide a final list of article URLs that are both relevant and have a positive sentiment.`
    }

    let iteration = 0;
    let finalResponse;
    let parsed;

    while (iteration < 3) {
      iteration++;
      const response = await client.messages
        .create({
          model: "claude-haiku-4-5-20251001", //claude-sonnet-4-20250514",
          max_tokens: 4096,
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

      // end of workflow if no tool use, otherwise continue with next iteration
      if (response.stop_reason !== "tool_use") {
        finalResponse = response.content.find(b => b.type === "text")?.text;
        if (finalResponse) {
          // More flexible regex to handle various markdown formats
          const cleaned = finalResponse
            .replace(/^[\s]*```[\w]*\s*/gm, '')  // Remove opening fence with optional language tag
            .replace(/```[\s]*$/gm, '')           // Remove closing fence
            .trim();
          try {
            parsed = JSON.parse(cleaned);
            console.log("Successfully parsed JSON:", parsed);
          } catch (e) {
            console.error("Failed to parse JSON. Raw content:", cleaned);
            throw e;
          }

          // save to db
          console.log("here");
          if (parsed.articles && Array.isArray(parsed.articles)) {
            console.log(parsed.articles);
            const { data, error } = await supabase.from('articles').insert(parsed.articles);
            if (error) {
              console.log(error.message);
            } else {
              console.log('success', data);
            }
          } else {
            console.log("Parsed content does not contain 'articles' array:", parsed);
          }

          break;
        }
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

    return new Response(JSON.stringify(parsed), {
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
