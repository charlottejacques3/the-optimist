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
const[loadingArticles,setLoadingArticles] = useState(true);
const[articleError, setArticleError] = useState(null);
  const [claudeResponse, setClaudeResponse] = useState(null);

  const callClaude = async () => {
    const { data, error } = await supabase.functions.invoke('call_claude', {
      body: { "keywords": ["rescue", "women's rights", "climate", "community"] } ,
    });
    if (error) {
      console.error("Error calling function:", error);
    } else {
      console.log(data);
      setClaudeResponse(data);
    }
  };

  useEffect(() => {
    const loadArticles = async () => {
        setLoadingArticles(true);
        setArticleError(null);

        try{
            //get user
            const { data: {user } } = await supabase.auth.getUser();
            if(!user) throw new Error("User not logged in.");

            //check for articles newwer than 24 hours
            const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
            const {data: recentArticles,error:fetchError } = await supabase
            .from("articles")
            .select("*")
            .eq("user_id", user.id)
            .gte("created_at", cutoff)
            .order("created_at",{ ascending: false});

            if(fetchError) throw new Error(fetchError.message);

            if (recentArticles && recentArticles.length > 0) {
                setArticles(recentArticles);
            }else{//get user preferences
                const { data: prefs, error: prefsError } = await supabase
                .from("preferences")
                .select("topics")
                .eq("id", user.id)
                .single();

                if(prefsError) throw new Error(prefsError.message);

                const keywords = prefs?.topics?.split(",").filter(Boolean) ?? [];
                 const { data, error: claudeError } = await supabase.functions.invoke("call_claude", {
          body: { keywords, user_id: user.id },  // pass user_id so edge function can tag articles
        });

        if (claudeError) throw new Error(claudeError.message);
                const fetchArticles = data?.articles ?? data;
                setArticles(fetchArticles);
    }
} catch (err) {
    console.error(err);
    setArticleError("Couldnt read articles")
}finally{
    setLoadingArticles(false);
}
};
loadArticles();
},[]);
                    
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
