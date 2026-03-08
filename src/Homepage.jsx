import React,{useState} from "react";
import Header from "./components/Header";
import NewsCard from "./components/NewsCard";


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
const articles = [
  {
    imageUrl: null,
    date: "May 15th, 2023",
    headline:
      "Optimism on the Rise: Global Survey Shows 70% of People Feeling More Positive",
    body: "A recent global survey conducted by the World Happiness Institute has revealed a significant increase in optimism among people worldwide. The survey, which polled over 100,000 individuals across 50 countries, found that 70% of respondents reported feeling more positive about the future compared to previous years. Experts attribute this rise in optimism to various factors, including advancements in technology, increased access to information, and a growing focus on mental health and well-being. The survey also highlighted that younger generations are particularly optimistic, with 80% of respondents aged 18-30 expressing a positive outlook on life. This trend towards optimism is seen as a hopeful sign for the future, suggesting that people are finding reasons to be hopeful despite ongoing global challenges.",
  },
  {
    imageUrl: null,
    date: "June 2nd, 2023",
    headline: "New Study Finds That Optimism Can Boost Immune System Function",
    body: "A groundbreaking study published in the Journal of Psychoneuroimmunology has found that optimism can have a significant impact on immune system function. The study, conducted by researchers at the University of California, involved a group of 200 participants who were assessed for their levels of optimism using a standardized questionnaire. The participants were then exposed to a common cold virus and monitored for symptoms and immune response. The results showed that those with higher levels of optimism had a stronger immune response, with increased production of antibodies and a shorter duration of symptoms compared to those with lower levels of optimism. The researchers suggest that optimism may help reduce stress and inflammation in the body, which can enhance immune function. This study adds to the growing body of evidence supporting the idea that a positive mindset can have tangible health benefits.",
  },
];
const Homepage = () => {
    const [profileOpen, setProfileOpen] = useState(false);
    const [factOpen, setFactOpen] = useState(false);

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
              image={article.image}
              headline={article.headline}
              body={article.body}
            />
          ))}
        </div>

        {/* Sidebar — 1/3 */}
        <div className="flex flex-col gap-4 w-1/3">

      {/* Streak */}
          <div className="bg-[#ffde59] border-4 border-black rounded-2xl px-6 py-4 shadow-[6px_6px_0px_black] flex items-center justify-center">
            <span  className="text-7xl">🔥</span>
                <span className = "text-5xl font-bold text-black font-serif">4 day Streak</span>
          </div>

          {/* Pink Card — opens modal */}
          <button
            onClick={() => setProfileOpen(true)}
            className="bg-pink-400 border-4 border-black rounded-2xl px-4 py-3 shadow-[6px_6px_0px_black] flex items-center gap-4 text-left hover:translate-y-[-2px] transition-transform"
          >
            <div className="bg-teal-400 border-2 border-black rounded-lg w-14 h-14 shrink-0" />
            <div>
              <p className="font-bold text-black text-sm">{"{Name}"}</p>
              <p className="text-black text-sm">infoinfoinfo</p>
            </div>
          </button>

          {/* Weird Fact Card — opens modal */}
          <button
            onClick={() => setFactOpen(true)}
            className="bg-blue-700 border-4 border-black rounded-2xl px-4 py-3 shadow-[6px_6px_0px_black] flex items-center gap-4 text-left hover:translate-y-[-2px] transition-transform"
          >
            <div className="bg-teal-400 border-2 border-black rounded-lg w-14 h-14 shrink-0" />
            <p className="text-white font-bold text-sm">Weird Fact</p>
          </button>
        </div>
        </div>
      {/* Profile Modal */}
      <Modal isOpen={profileOpen} onClose={() => setProfileOpen(false)}>
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-teal-400 border-2 border-black rounded-lg w-20 h-20 shrink-0" />
          <div>
            <h3 className="text-2xl font-bold text-black">{"{Name}"}</h3>
            <p className="text-black text-sm">Extended profile info goes here.</p>
          </div>
        </div>
        <p className="text-black text-sm">More details, stats, or content for this person.</p>
      </Modal>

      {/* Weird Fact Modal */}
      <Modal isOpen={factOpen} onClose={() => setFactOpen(false)}>
        <h3 className="text-2xl font-bold text-black mb-3">🤯 Weird History Fact</h3>
        <p className="text-black text-sm leading-relaxed">
          Your weird fact content goes here. Replace this with whatever surprising historical
          tidbit you want to surface to readers today.
        </p>
      </Modal>
    </div>
  );
};


export default Homepage;
