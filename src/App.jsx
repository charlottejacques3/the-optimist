
import {
  Navigate,
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";

import Homepage from "./Homepage";
import LandingPage from "./LandingPage";
import Profile from "./Profile";
import { supabase } from "./supabaseClient";
import { useState, useEffect } from "react";

function App() {
  const [claims, setClaims] = useState(null);
  const [loading, setLoading] = useState(true); // add this

  useEffect(() => {
    supabase.auth.getClaims().then(({ data: { claims } }) => {
      setClaims(claims);
      setLoading(false); // add this
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      supabase.auth.getClaims().then(({ data: { claims } }) => {
        setClaims(claims);
        setLoading(false);
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return null; // wait before rendering any routes

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage username={null} />} />
        {claims ? (
          <>
            <Route path="/home" element={<Homepage />} />
            <Route path="/profile" element={<Profile />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/" replace />} />
        )}
      </Routes>
    </Router>
  );
}
export default App;
