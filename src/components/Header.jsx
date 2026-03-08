import React from "react";
import { useState } from "react";
import {Menu} from "lucide-react";
import DropDown from "./Dropdown";
const Header = () => {
  const [hovered, setHovered] = useState(false);
    const user = true; // Placeholder for user authentication state
  return (

    <div
      className="flex border-3 border-black items-center justify-between px-10 py-4 mb-5 "
      style={{ backgroundColor: "#f5f0e0" }}
    >
      {/* Left - Logo */}
      <div>
        <p className="text-black text-2xl font-['Berkshire_Swash']">The</p>
        <h1 className="text-black text-4xl font-['Berkshire_Swash'] font-bold italic">
          Optimist
        </h1>
        <p className="text-black font-['Glass_Antiqua'] text-3xl italic">
          The world isn't all bad
        </p>
      </div>

      {/* Right - Sign in */}
      {user ? (
        <DropDown  />
      ) : (
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
      )}
    </div>
  );
};

export default Header;
