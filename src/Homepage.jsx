import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import NewsCard from "./components/NewsCard";
import { supabase } from "./supabaseClient";
import dancing from "./assets/dancing.jpeg";
import ada from "./assets/Ada_Lovelace.jpg"

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div
      className="absolute inset-0 bg-black/50 flex items-center justify-center z-50"
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
    const link= 'https://en.wikipedia.org/wiki/Dancing_plague_of_1518'
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
          ><img src={ada} alt= " dancing" className="w-14 h-14 object-cover border-2 border-black rounded-lg shrink-0"/>
            <div>
              <p className="font-bold text-black text-3xl">Ada Lovelace</p>
            </div>
          </button>

          {/* Weird Fact Card — opens modal */}
          <button
            onClick={() => setFactOpen(true)}
            className=" border-4 border-black rounded-2xl px-4 py-3 shadow-[6px_6px_0px_black] flex items-center gap-4 text-left hover:translate-y-[-2px] transition-transform"
          ><img src={dancing} alt= " dancing" className="w-14 h-14 object-cover border-2 border-black rounded-lg shrink-0"/>
            <p className="text-black font-bold text-3xl">Strange Historical Fact</p>
            <p className="text-black text-xl">The Dancing Plague of 1518</p>
          </button>
        </div>
      </div>
{/* Profile Modal */}
      <Modal isOpen={profileOpen} onClose={() => setProfileOpen(false)}>
        {/* Image banner */}
        <figure className="w-full h-60 border-black border-b-2">
          <div className="w-full h-full bg-pink-400 flex items-center justify-center">
            <img src={ada} alt="Ada Lovelace" className="w-full border-2 h-full object-cover" />
          </div>
        </figure>
        <div className="px-6 py-5 text-left relative">
          <p className="text-base mb-2 text-black-500">Ada Lovelace</p>
          <p className="text-xs mb-4 text-black-700 leading-relaxed">
            Ada Lovelace (born December 10, 1815, Piccadilly Terrace, Middlesex [now in London], England—died November 27, 1852, Marylebone, London) was an English mathematician, an associate of Charles Babbage, for whose prototype of a digital computer she created a program. She has been called the first computer programmer. The second Tuesday of October is traditionally celebrated as Ada Lovelace Day, during which women’s contributions to science, technology, engineering, and mathematics are honored.
          </p>
          <strong className="text-sm">View Full Profile</strong>
        </div>
      </Modal>

      {/* Weird Fact Modal */}
      <Modal isOpen={factOpen} onClose={() => setFactOpen(false)}>
        {/* Image banner */}
        <figure className="w-full h-36 border-black border-b-2">
          <img src={dancing} alt="dancing" className="w-full border-2 h-full object-cover" />
        </figure>
        <div className="px-6 py-5 text-left">
          <p className="text-base mb-2 text-gray-500">Strange Historical Fact</p>
          <h1 className="text-[32px] mb-3 font-bold leading-tight">The Dancing Plague of 1518</h1>
          <p className="text-xs mb-4 text-gray-700 leading-relaxed line-clamp-5">
            The dancing plague of 1518 was an event in which hundreds of citizens of Strasbourg
            (then a free city within the Holy Roman Empire, now in France) danced uncontrollably
            and apparently unwillingly for days on end. The mania lasted for about two months
            before ending as mysteriously as it began.
          </p>
          <a href= {link} className="block-cursor pointer">
          <strong className="text-sm">Read More</strong>
          </a>
        </div>
      </Modal>
    </div>
  );
};

export default Homepage;
