import React from "react";
import { useState } from "react";

const Header = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="flex items-center justify-between px-6 py-3"
      style={{ backgroundColor: "#f5f0e0" }}
    >
      {/* Left - Logo */}
      <div>
        <p className="text-black text-xs font-['Berkshire_Swash']">The</p>
        <h1
          className="text-black text-2xl font-['Berkshire_Swash'] font-bold italic"
        >
          Optimist
        </h1>
        <p className="text-black font-['Glass_Antiqua'] text-xs italic">
          The world isn't all bad
        </p>
      </div>

      {/* Center - Search bar */}
      <div className="flex-1 mx-8">
        <input
          className="w-full border-black border-2 p-2.5 focus:outline-none rounded-full"
          style={{ backgroundColor: "#f5e642" }}
          placeholder="Search..."
        />
      </div>

      {/* Right - Sign in */}
      <button
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          backgroundColor: hovered ? "#c800d4" : "#e040fb",
          border: "2px solid black",
          transition: "background-color 0.2s",
        }}
        className="h-12 px-6 rounded-full font-bold text-white"
      >
        SIGN IN
      </button>
    </div>
  );
};

export default Header;
