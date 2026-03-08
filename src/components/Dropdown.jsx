import React, { useState } from "react";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const DropDown = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    console.log('logout')
    navigate("/");
  }

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        className="p-2 rounded-full border-2 border-black hover:bg-black/10 transition-colors focus:outline-none"
        id="menu-button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen(!open)}
      >
        <Menu size={28} color="black" />
      </button>

      {open && (
        <div
          className="w-48 absolute right-0 z-10 mt-2 origin-top-right bg-[#f5f0e0] shadow-[2px_2px_0px_rgba(0,0,0,1)] border-black border-2 divide-y divide-black"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div role="none">
            <button
              onClick={() => navigate("/profile")}
              className="block w-full text-left px-4 py-2 text-l border-black border-b-2 hover:bg-[#B8FF9F] hover:font-medium"
            >
              Profile
            </button>
            <button
              onClick={() => navigate("/login")}
              className="block w-full text-left px-4 py-2 text-l border-black border-b-2 hover:bg-[#B8FF9F] hover:font-medium"
            >
              Settings
            </button>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-[#B8FF9F] hover:font-medium"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropDown;
