import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import NewsCard from "./components/NewsCard";
import { supabase } from "./supabaseClient";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-[#e8e0c8] border-4 border-black rounded-2xl p-6 shadow-[8px_8px_0px_black] max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="float-right bg-black text-white rounded-full w-8 h-8 font-bold text-lg leading-none mb-2"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};


const Homepage = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [factOpen, setFactOpen] = useState(false);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      let { data, error } = await supabase.from("articles").select("*");
      if (error) console.log(error.message);
      else setArticles(data);
      console.log(data.headline)
    };
    fetchArticles();
  }, []);
                    
  return (
    <div className="min-h-screen bg-teal-400 font-sans">
      <Header />

      {/* Body — 2/3 + 1/3 split */}
      <div className="flex gap-6 p-6">
        {/* Main Column — 2/3 */}
        <div className="flex flex-col gap-4 w-2/3">
                        
          {articles.map((article, i) => (
            <NewsCard
              key={i}
              imageUrl={article.image_url}
              headline={article.headline}
              body={article.summary}
              link={article.url}
            />
          ))}

        </div>
        {/* Sidebar — 1/3 */}
        <div className="flex flex-col gap-4 w-1/3">
          {/* Streak */}
          <div className="bg-[#ffde59] border-4 border-black rounded-2xl px-6 py-4 shadow-[6px_6px_0px_black] flex items-center justify-center">
            <span className="text-3xl">🔥</span>
            <span className="text-xl font-bold text-black font-serif">
              4 day Streak
            </span>
          </div>

          {/* Pink Card — opens modal */}
          <button
            onClick={() => setProfileOpen(true)}
            className="bg-pink-400 border-4 border-black rounded-2xl px-4 py-3 shadow-[6px_6px_0px_black] flex items-center gap-4 text-left hover:translate-y-[-2px] transition-transform"
          >
            <div className="bg-teal-400 border-2 border-black rounded-lg w-14 h-14 shrink-0" />
            <div>
              <p className="font-bold text-black text-3xl">{"{Name}"}</p>
              <p className="text-black text-xl">infoinfoinfo</p>
            </div>
          </button>

          {/* Weird Fact Card — opens modal */}
          <button
            onClick={() => setFactOpen(true)}
            className="bg-blue-700 border-4 border-black rounded-2xl px-4 py-3 shadow-[6px_6px_0px_black] flex items-center gap-4 text-left hover:translate-y-[-2px] transition-transform"
          >
            <div className="bg-teal-400 border-2 border-black rounded-lg w-14 h-14 shrink-0" />
            <p className="text-white font-bold text-3xl">Weird Fact</p>
            <p className="text-black text-xl">infoinfoinfo</p>
          </button>
        </div>
      </div>
      {/* Profile Modal */}
      <Modal isOpen={profileOpen} onClose={() => setProfileOpen(false)}>
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-teal-400 border-2 border-black rounded-lg w-20 h-20 shrink-0" />
          <div>
            <h3 className="text-2xl font-bold text-black">{"{Name}"}</h3>
            <p className="text-black text-sm">
              Extended profile info goes here.
            </p>
          </div>
        </div>
        <p className="text-black text-sm">
          More details, stats, or content for this person.
        </p>
      </Modal>

      {/* Weird Fact Modal */}
      <Modal isOpen={factOpen} onClose={() => setFactOpen(false)}>
        <h3 className="text-2xl font-bold text-black mb-3">
          🤯 Weird History Fact
        </h3>
        <p className="text-black text-sm leading-relaxed">
          Your weird fact content goes here. Replace this with whatever
          surprising historical tidbit you want to surface to readers today.
        </p>
      </Modal>
    </div>
  );
};

export default Homepage;
