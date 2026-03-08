
import {
  Navigate,
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";

import Homepage from "./Homepage";
import LandingPage from "./LandingPage";


function App() {
  const username = "Test User";
  {
    /* const [count, setCount] = useState(0);
  const [claudeResponse, setClaudeResponse] = useState(null);

  const callClaude = async () => {
    const { data, error } = await supabase.functions.invoke("call_claude", {
      body: { input: "Hello Claude" },
    });
    if (error) {
      console.error("Error calling function:", error);
    } else {
      console.log(data);
      setClaudeResponse(data);
    }
  };*/
  }

  return (
    <Router>
      {/* Define routes */}
      <Routes>
        <Route path="/" element={<LandingPage username={username} />} />
        <Route path="/home" element={<Homepage />} />
      </Routes>
      {/*<div
        style={{ backgroundColor: "rgba(5, 150, 105, var(--tw-bg-opacity))" }}
      >
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

      {/* Tailwind test card }
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm mx-auto mt-8">
        <h2 className="text-3xl font-bold text-purple-600 mb-2">
          Tailwind Works! 🎉
        </h2>
        <p className="text-gray-500 text-sm mb-4">
          If this card looks styled, you're good to go.
        </p>
        <button
          onClick={callClaude}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-lg w-full transition-colors"
        >
          Call Claude
        </button>
        {claudeResponse && (
          <p className="mt-4 text-green-600 text-sm">
            {JSON.stringify(claudeResponse)}
          </p>
        )}
      </div>

      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>*/}
    </Router>
  );
}

export default App;
