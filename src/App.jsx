
import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY
);

function App() {
  const [count, setCount] = useState(0);
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
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1 className="text-3xl font-bold">Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
  <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full">
    <h1 className="text-3xl font-bold text-purple-600 mb-2">Tailwind Works! 🎉</h1>
    <p className="text-gray-500 text-sm mb-4">If this card looks styled, you're good to go.</p>
    <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-lg w-full transition-colors">
      Click me
    </button>
 <button onClick={callClaude}>Call Claude</button>
  </div>
</div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more</p>
      </>
  )};

export default App;
