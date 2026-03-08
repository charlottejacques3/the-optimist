import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import squiggles from './assets/squiggles.png';

const LandingPage = ({ username, onLogin }) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [inputUser, setInputUser] = useState("");
  const [inputPass, setInputPass] = useState("");
  const [inputConfirm, setInputConfirm] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (!inputUser.trim() || !inputPass.trim()) {
      setError("Please enter both fields.");
      return;
    }
    // TODO: replace with real auth (Supabase, Firebase, etc.)
    onLogin(inputUser);
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    if (!inputUser.trim() || !inputPass.trim() || !inputConfirm.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    if (inputPass !== inputConfirm) {
      setError("Passwords don't match.");
      return;
    }
    // TODO: replace with real sign-up (Supabase, Firebase, etc.)
    onLogin(inputUser);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError("");
    setInputUser("");
    setInputPass("");
    setInputConfirm("");
  };

  const inputClass =
    "rounded-lg px-4 py-2 bg-black/30 placeholder-white/70 text-white outline-none focus:bg-black/40 transition";
  const btnClass =
    "h-12 border-black border-2 p-2.5 bg-[#A6FAFF] hover:bg-[#79F7FF] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:bg-[#00E1EF] text-lg font-['Glass_Antiqua'] rounded-full";

  return (
    <div
      className="relative w-screen h-screen"
      onClick={username ? () => navigate("/home") : undefined}
      style={{ cursor: username ? "pointer" : "default" }}
    >
      <img src={squiggles} alt="squiggles" className="w-full h-full object-cover" />

      <div className="absolute inset-0 flex items-center justify-center">
        {username ? (
          <h1 className="text-6xl font-bold text-Black font-['Glass_Antiqua'] drop-shadow-lg">
            Good morning, {username}!
          </h1>
        ) : (
          <div
            className="border-black border-2 rounded-md p-10 flex flex-col gap-5 w-80 shadow-[8px_8px_0px_rgba(0,0,0,1)] bg-yellow-500"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-3xl font-bold text-black text-center tracking-wide drop-shadow font-['Glass_Antiqua']">
              {mode === "login" ? "Welcome" : "Create Account"}
            </h2>

            <input
              type="text"
              placeholder="Username"
              value={inputUser}
              onChange={(e) => setInputUser(e.target.value)}
              className={inputClass}
            />
            <input
              type="password"
              placeholder="Password"
              value={inputPass}
              onChange={(e) => setInputPass(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && mode === "login" && handleLogin(e)}
              className={inputClass}
            />

            {mode === "signup" && (
              <input
                type="password"
                placeholder="Confirm Password"
                value={inputConfirm}
                onChange={(e) => setInputConfirm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSignUp(e)}
                className={inputClass}
              />
            )}

            {error && (
              <p className="text-red-700 text-sm text-center font-semibold">{error}</p>
            )}

            <button
              onClick={mode === "login" ? handleLogin : handleSignUp}
              className={btnClass}
            >
              {mode === "login" ? "Sign In" : "Sign Up"}
            </button>

            <p className="text-center text-sm text-black/70 font-['Glass_Antiqua']">
              {mode === "login" ? (
                <>
                  Don't have an account?{" "}
                  <button
                    onClick={() => switchMode("signup")}
                    className="font-bold text-xl text-black underline hover:text-black/60 transition"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => switchMode("login")}
                    className="font-bold text-md text-black underline hover:text-black/60 transition"
                  >
                    Sign In
                  </button>
                </>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;