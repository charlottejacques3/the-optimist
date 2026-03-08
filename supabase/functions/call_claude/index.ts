import "@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "jsr:@supabase/supabase-js@2/cors";
import Anthropic from "npm:@anthropic-ai/sdk";
import { callNewsAPI, getAllKeywords, moreKeywords } from "./news_api.js";
import { callArticleSearch } from "./call_search.js";
import { createClient } from "npm:@supabase/supabase-js@2";
import { cleanJson } from "../parse_json.js";

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
    //const { keywords } = await req.json();
    const { keywords , user_id } = await req.json();
    const client = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY')! });

    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    console.log(token);
    let { data, error } = await supabase.auth.getUser(token);
    const uid = data.user.id;
    console.log(uid);

    const messages = [{ 
      role: "user", 
      content: `Call News API with the following keywords: ${keywords}` 
    }];

    let allKeywords = {};
    keywords.forEach((keyword) => {
     allKeywords[keyword] = moreKeywords[keyword]; 
    })

    const stepInstructions = {
      1: `Call the article_search tool for EVERY SINGLE article URL returned. 
      Do not batch, do not summarize, do not stop early. Do not return any text responses in between, only tool calls.
      You must call article_search once per URL before proceeding. 
      If the article cannot be accessed or does not contain enough text content, skip it and move on to the next one.
      The number of articles parsed + the number of articles skipped added together should equal the total number of URLs returned by the news_api tool.`,
      
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
      
      After parsing through all the articles, sort the JSON output so that the articles with the highest total scores are displayed first. Add a maximum of 5 articles to the final JSON output, even if more than 5 articles meet the criteria.If fewer than 5 articles meet the criteria, only show the ones that meet the criteria. 
      The final JSON output should have the following format:
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
          parsed = cleanJson(finalResponse);
          // const cleaned = finalResponse
          //   .replace(/^[\s]*```[\w]*\s*/gm, '')
          //   .replace(/```[\s]*$/gm, '')          
          //   .trim();
          // try {
          //   parsed = JSON.parse(cleaned);
          //   console.log("Successfully parsed JSON:", parsed);
          // } catch (e) {
          //   console.error("Failed to parse JSON. Raw content:", cleaned);
          //   throw e;
          // }

          // save to db
          console.log("here");
          if (parsed.articles && Array.isArray(parsed.articles)) {
            console.log(parsed.articles);
            const articlesWithUser = parsed.articles.map(a => ({ ...a, user_id }));
            const { data, error } = await supabase.from('articles').insert(articlesWithUser);
            //const { data, error } = await supabase.from('articles').insert(parsed.articles);
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


    // // find historical figures
    // const now = new Date();
    // const dateString = now.toISOString().substring(5, 10);
    // const historicalFigureResponse = await client.messages
    //   .create({
    //     model: "claude-haiku-4-5-20251001", //claude-sonnet-4-20250514",
    //     max_tokens: 1024,
    //     messages: [{
    //       role: "user",
    //       content:`Please find an underrepresented historical figure who has the following birthday in MM-DD format: ${dateString}. To qualify as an "underrepresented historical figure", a person must identify as at least one of the following:
    //     - Woman
    //     - Black, Indigenous, or person of colour
    //     - LGBTQ+
    //     - Disabled.
    //     For the identified historical figure, please provide the following information in raw JSON format ONLY. Never use markdown formatting, code blocks, or backticks.
    //     {
    //       "name": <full name>, 
    //       "birthdate": <their date of birth formatted as a text string (e.g. September 4th, 1950),
    //       "summary": <3-4 sentence summary of their life, accomplishments, and legacy>,
    //       "image": <an URL pointing to an image of them>"
    //     }
    //     `}],
    //   })
    //   .catch(async (error) => {
    //     if (error instanceof Anthropic.APIError) {
    //       const errorDetails = await error.response;
    //       console.log("API Error:", error);
    //     } else {
    //       throw error;
    //     }
    //     return;
    //   });
    // // const historicalFigure = historicalFigureResponse.content.find(b => b.type === "text")?.text;
    // console.log(historicalFigureResponse.content[0].text);
    // const historicalFiguresJson = cleanJson(historicalFigureResponse.content[0].text);
    // console.log(historicalFiguresJson);

    // // find "this day in history"
    // const dayInHistoryResponse = await client.messages
    //   .create({
    //     model: "claude-haiku-4-5-20251001", //claude-sonnet-4-20250514",
    //     max_tokens: 1024,
    //     messages: [{
    //       role: "user",
    //       content:`Please find an interesting, typically unknown historical event that occurred on this day in MM-DD format: ${dateString}.
    //     For the identified historical event, please provide the following information in raw JSON format ONLY. Never use markdown formatting, code blocks, or backticks.
    //     {
    //       "event": <event name>, 
    //       "date": <the date of the event formatted as a text string (e.g. September 4th, 1950),
    //       "summary": <3-4 sentence summary of the event and its significance>,
    //     }
    //     `}],
    //   })
    //   .catch(async (error) => {
    //     if (error instanceof Anthropic.APIError) {
    //       const errorDetails = await error.response;
    //       console.log("API Error:", error);
    //     } else {
    //       throw error;
    //     }
    //     return;
    //   });

    //   console.log(dayInHistoryResponse.content[0].text);
    //   const dayInHistoryJson = cleanJson(dayInHistoryResponse.content[0].text);
    //   console.log(dayInHistoryJson);

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
