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
  const [historicalFigure, setHistoricalFigure] = useState(null);
  const [dayInHistory, setDayInHistory] = useState(null);

  const getHistoricalFigure = async () => {
    const { data, error } = await supabase.functions.invoke('historical_figure', {});
    if (error) {
      console.error("Error calling function:", error);
    } else {
      console.log(data);
      return data;
    }
  };

    const getDayInHistory = async () => {
    const { data, error } = await supabase.functions.invoke('day_in_history', {});
    if (error) {
      console.error("Error calling function:", error);
    } else {
      console.log(data);
      return data;
    }
  };

  useEffect(() => {
    
    const now = new Date();
    const dateString = now.toISOString().substring(5, 10);
    console.log("Current date string:", dateString);

    const fetchArticles = async () => {
      let { data, error } = await supabase.from("articles").select("*");
      if (error) console.log(error.message);
      else setArticles(data);
      console.log(data.headline)
    };

    const fetchHistoricalFigure = async () => {
      let { data, error } = await supabase.from("historical_figures").select("*").eq("date", dateString).limit(1).single();
      console.log("Supabase query result:", { data, error });
      if (error) {
        console.log(error.message);
        if (error.code === "PGRST116") {
          console.log("No historical figure found for today in the database.");
          const fromClaude = await getDayInHistory();
          if (fromClaude) {
            setHistoricalFigure(fromClaude);
          }
        }
      }
      else if (data) {
        setHistoricalFigure(data);
      } else {
        // console.log("No historical figure found for today.");
      }
    };

    const fetchDayInHistory = async () => {
      let { data, error } = await supabase.from("day_in_history").select("*").eq("date", dateString).limit(1).single();
      console.log("Supabase query result:", { data, error });
      if (error) {
        console.log(error.message);
        if (error.code === "PGRST116") {
          console.log("No day in history found for today in the database.");
          const fromClaude = await getDayInHistory();
          if (fromClaude) {
            setDayInHistory(fromClaude);
          }
        }
      }
      else if (data) {
        setDayInHistory(data);
      } else {
        console.log("No day in history figure found for today.");
      }
    };

    fetchArticles();
    fetchHistoricalFigure();
    fetchDayInHistory();
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
          {historicalFigure && (
            <button
              onClick={() => setProfileOpen(true)}
              className="bg-pink-400 border-4 cursor-pointer border-black rounded-2xl px-4 py-3 shadow-[6px_6px_0px_black] flex items-center gap-4 text-left hover:translate-y-[-2px] transition-transform"
            ><img src={historicalFigure.image} alt= " dancing" className="w-14 h-14 object-cover border-2 border-black rounded-lg shrink-0"/>
              <div>
                <p className="font-bold text-black text-3xl">{historicalFigure.name}</p>
              </div>
            </button>)}

          {/* Weird Fact Card — opens modal */}
          {dayInHistory && (
            <button
              onClick={() => setFactOpen(true)}
              className=" border-4 border-black cursor-pointer rounded-2xl px-4 py-3 shadow-[6px_6px_0px_black] flex items-center gap-4 text-left hover:translate-y-[-2px] transition-transform"
            ><img src={dayInHistory.image} alt= " dancing" className="w-14 h-14 object-cover border-2 border-black rounded-lg shrink-0"/>
              <p className="text-black font-bold text-3xl">Today in History</p>
            <p className="text-black text-xl">{dayInHistory.name}</p>
          </button>)}
        </div>
      </div>
{/* Profile Modal */}
      <Modal isOpen={profileOpen} onClose={() => setProfileOpen(false)}>
        {/* Image banner */}
        {historicalFigure ? 
        <><figure className="w-full h-60 border-black border-b-2">
          <div className="w-full h-full bg-pink-400 flex items-center justify-center">
            <img src={historicalFigure.image} alt={historicalFigure.name} className="w-full border-2 h-full object-cover" />
          </div>
        </figure>
        <div className="px-6 py-5 text-left relative">
          
          <h1 className="text-[32px] mb-3 mt-5 font-bold leading-tight">{historicalFigure.name}</h1>
          <p className="text-xs mb-4 text-black-700 leading-relaxed">
            {historicalFigure.summary}
          </p>
        </div></> : <p className="text-center text-gray-500">Loading...</p>}
      </Modal>

      {/* Weird Fact Modal */}
      <Modal isOpen={factOpen} onClose={() => setFactOpen(false)}>
        {/* Image banner */}
        { dayInHistory ?
        <>
        <figure className="w-full h-36 border-black border-b-2">
          <img src={dayInHistory.image} alt="dancing" className="w-full border-2 h-full object-cover" />
        </figure>
        <div className="px-6 py-5 text-left">
          <h1 className="text-[32px] mt-5 mb-3 font-bold leading-tight">{dayInHistory.name}</h1>
          <p className="text-xs mb-4 text-gray-700 leading-relaxed line-clamp-5">
            {dayInHistory.summary}
          </p>
        </div>
        </> : <p className="text-center text-gray-500">Loading...</p>}
      </Modal>
    </div>
  );
};

export default Homepage;
