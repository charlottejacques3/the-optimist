import "@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "jsr:@supabase/supabase-js@2/cors";
import Anthropic from "npm:@anthropic-ai/sdk";
import { createClient } from "npm:@supabase/supabase-js@2";
import { cleanJson } from "../parse_json.js";

console.log("Hello from Historical Figures!");
const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SB_PUBLISHABLE_KEY')!);

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  try {
    const client = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY')! });


    // find historical figures
    const now = new Date();
    const dateString = now.toISOString().substring(5, 10);
    const historicalFigureResponse = await client.messages
      .create({
        model: "claude-haiku-4-5-20251001", //claude-sonnet-4-20250514",
        max_tokens: 1024,
        messages: [{
          role: "user",
          content:`Please find an underrepresented historical figure who has the following birthday in MM-DD format: ${dateString}. To qualify as an "underrepresented historical figure", a person must identify as at least one of the following:
        - Woman
        - Black, Indigenous, or person of colour
        - LGBTQ+
        - Disabled.
        For the identified historical figure, please provide the following information in raw JSON format ONLY. Never use markdown formatting, code blocks, or backticks.
        {
          "name": <full name>, 
          "date_string": <their date of birth formatted as a text string (e.g. September 4th, 1950),
          "date": <their date of birth formatted as a YYYY-MM-DD string>,
          "summary": <3-4 sentence summary of their life, accomplishments, and legacy>,
          "image": <an URL pointing to an image of them>"
        }
        `}],
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
    console.log(historicalFigureResponse.content[0].text);
    const historicalFiguresJson = cleanJson(historicalFigureResponse.content[0].text);
    console.log(historicalFiguresJson);

    const { data, error } = await supabase.from('historical_figures').insert(historicalFiguresJson);
    if (error) {
      console.log(error.message);
    } else {
      console.log('success', data);
    }

    return new Response(JSON.stringify(historicalFiguresJson), {
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
