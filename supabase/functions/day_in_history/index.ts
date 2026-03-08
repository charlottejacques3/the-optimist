import "@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "jsr:@supabase/supabase-js@2/cors";
import Anthropic from "npm:@anthropic-ai/sdk";
import { createClient } from "npm:@supabase/supabase-js@2";
import { cleanJson } from "../parse_json.js";

console.log("Hello from Day in History!");
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


    // find "this day in history"
    const dayInHistoryResponse = await client.messages
      .create({
        model: "claude-haiku-4-5-20251001", //claude-sonnet-4-20250514",
        max_tokens: 1024,
        messages: [{
          role: "user",
          content:`Please find an interesting, typically unknown historical event that occurred on this day in MM-DD format: ${dateString}. Please ensure the historical event is not negetive or controversial in nature. Examples of the type of event I'm looking for include: the discovery of a new species, the invention of a new technology, the founding of a city, the birth of an influential artist, etc.
        For the identified historical event, please provide the following information in raw JSON format ONLY. Never use markdown formatting, code blocks, or backticks.
        {
          "name": <event name>, 
          "date_string": <the date of the event formatted as a text string (e.g. September 4th, 1950),
          "date": <the date of the event formatted as a MM-DD string>,
          "summary": <3-4 sentence summary of the event and its significance>,
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

      console.log(dayInHistoryResponse.content[0].text);
      const dayInHistoryJson = cleanJson(dayInHistoryResponse.content[0].text);
      console.log(dayInHistoryJson);

      
      const { data, error } = await supabase.from('day_in_history').insert(dayInHistoryJson);
      if (error) {
        console.log(error.message);
      } else {
        console.log('success', data);
      }

    return new Response(JSON.stringify(dayInHistoryJson), {
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
