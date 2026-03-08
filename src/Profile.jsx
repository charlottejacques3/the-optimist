import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./components/Header";
import { supabase } from "./supabaseClient";

const topics = [
  "animals", "climate", "human Rights", "women's rights",
  "community ", "rescue ", "economics",
  "cute stories"
];

const Profile = () => {
  const [selected, setSelected] = useState([]);
  const [initialTopics, setInitialTopics] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);

  // Load existing preferences on mount
  useEffect(() => {
    const loadPreferences = async () => {
      setFetching(true);
      const { data: { claims } } = await supabase.auth.getUser();
      const userId = claims?.sub;

      if (!userId) {
        setFetching(false);
        return;
      }

      const { data, error } = await supabase
        .from("preferences")
        .select("topics")
        .eq("id", userId)
        .single();

      if (!error && data?.topics) {
        const saved = data.topics.split(",").filter(Boolean);
        setSelected(saved);
        setInitialTopics(saved);
      }

      setFetching(false);
    };

    loadPreferences();
  }, []);

  const toggleTopic = (topic) => {
    setSelected((prev) => {
      if (prev.includes(topic)) return prev.filter((t) => t !== topic);
      if (prev.length >= 5) return prev;
      return [...prev, topic];
    });
  };

  const hasChanges = JSON.stringify([...selected].sort()) !== JSON.stringify([...initialTopics].sort());
  const isUpdate = initialTopics.length > 0;

  const handleContinue = async () => {
    setLoading(true);
    setError(null);

    const { data: { claims } } = await supabase.auth.getClaims();
    const userId = claims?.sub;

    if (!userId) {
      setError("User not found. Please log in again.");
      setLoading(false);
      return;
    }

    const { error: supabaseError } = await supabase
      .from("preferences")
      .upsert(
        { id: userId, topics: selected.join(","), updated_at: new Date().toISOString() },
        { onConflict: "id" }
      );

    if (supabaseError) {
      setError("Failed to save preferences, please try again.");
      console.error(supabaseError);
      setLoading(false);
      return;
    }

    setInitialTopics(selected);
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-teal-400 font-sans">
      <Header />
      <div className="flex items-center justify-center p-6">
        <div className="bg-[#f5f0e0] border-4 border-black rounded-2xl shadow-[8px_8px_0px_black] p-8 w-full max-w-2xl">
          <h2 className="text-3xl font-bold text-center mb-2">
            {isUpdate ? "Update Your Topics" : "Choose Your Topics"}
          </h2>
          <p className="text-center text-black mb-6">{selected.length}/5 selected</p>

          {fetching ? (
            <div className="flex justify-center items-center h-48 text-xl font-semibold text-gray-500">
              Loading your preferences...
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {topics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => toggleTopic(topic)}
                  className={`h-32 rounded-2xl border-4 border-black font-bold text-lg shadow-[4px_4px_0px_black] transition-all
                    ${selected.includes(topic)
                      ? "bg-teal-400 text-white translate-y-[2px] shadow-none"
                      : "bg-pink-400 text-white hover:translate-y-[-2px]"
                    }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          )}

          {/* Change summary */}
          {isUpdate && hasChanges && !fetching && (
            <p className="mt-4 text-sm text-center text-gray-600 font-medium">
              ✏️ You have unsaved changes
            </p>
          )}
          {isUpdate && !hasChanges && !fetching && (
            <p className="mt-4 text-sm text-center text-gray-500 font-medium">
              ✓ No changes from your current preferences
            </p>
          )}

          {error && (
            <p className="mt-4 text-red-600 font-semibold text-center">{error}</p>
          )}

          <button
            className="mt-6 w-full bg-[#ffde59] border-4 border-black rounded-xl py-3 font-bold text-xl shadow-[4px_4px_0px_black] hover:translate-y-[-2px] transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
            onClick={handleContinue}
            disabled={loading || selected.length === 0 || (isUpdate && !hasChanges)}
          >
            {loading ? "Saving..." : isUpdate ? "Update Preferences →" : "Continue →"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;