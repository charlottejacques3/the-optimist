import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY
);

function App() {

  const callClaude = async () => {
    const { data, error } = await supabase.functions.invoke('call_claude', {
      body: { input: 'Hello Claude' },
    });
    if (error) {
      console.error("Error calling function:", error);
    } else {
      console.log(data);
    }
  }

  return (
    <>
      <button onClick={callClaude}>Call Claude</button>
    </>
  )
}

export default App
