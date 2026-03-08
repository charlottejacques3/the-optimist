import React from "react";
import Header from "./components/Header";

const Homepage = () => {
  return (
    <div className="min-h-screen bg-teal-400 font-sans">
        <Header />
              {/* Header 
      <div className="bg-[#e8e0c8] px-6 py-3 flex items-center justify-between border-b-4 border-black">
        <div>
          <p className="text-sm font-medium text-black">The</p>
          <h1 className="text-4xl font-bold font-serif text-black italic leading-tight">Optimist</h1>
          <p className="text-sm italic text-black">The world isn't all bad</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-yellow-300 border-2 border-black rounded-full px-16 py-2 h-10 w-64" />
          <button className="bg-pink-400 border-2 border-black rounded-full w-14 h-14 text-xs font-bold text-black leading-tight">
            SIGN<br />IN
          </button>
        </div>
      </div>*/}

      {/* Body */}
      <div className="flex gap-6 p-6">
        {/* Main Card */}
        <div className="bg-[#e8e0c8] border-4 border-black rounded-2xl p-4 flex-1 shadow-[6px_6px_0px_black]">
          <div className="bg-teal-400 border-2 border-black rounded-lg h-48 w-full mb-4" />
          <h2 className="text-4xl font-bold text-black mb-2">Headline</h2>
          <p className="text-sm text-black">body text here</p>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4 w-72">
          {/* Streak */}
          <div className="bg-[#e8e0c8] border-4 border-black rounded-2xl px-6 py-4 shadow-[6px_6px_0px_black] flex items-center justify-center">
            <span className="text-5xl font-bold text-black font-serif">Streak</span>
          </div>

          {/* Pink Card */}
          <div className="bg-pink-400 border-4 border-black rounded-2xl px-4 py-3 shadow-[6px_6px_0px_black] flex items-center gap-4">
            <div className="bg-teal-400 border-2 border-black rounded-lg w-14 h-14 flex-shrink-0" />
            <div>
              <p className="font-bold text-black text-sm">{"{Name}"}</p>
              <p className="text-black text-sm">infoinfoinfo</p>
            </div>
          </div>

          {/* Blue Card */}
          <div className="bg-blue-700 border-4 border-black rounded-2xl px-4 py-3 shadow-[6px_6px_0px_black] flex items-center gap-4">
            <div className="bg-teal-400 border-2 border-black rounded-lg w-14 h-14 flex-shrink-0" />
            <p className="text-white font-bold text-sm">Weird Fact</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
