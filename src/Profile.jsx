import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';

const topics=[ 'Animals' , 'Climate' , 'Human Rights', 'Research', 'Women\'s Rights', 'Community Projects', 'Rescue Operations', 'Education', 'Economics', 'Sweet Stories', 'Entertainment'];
const Profile = () => {
    const [selected, setSelected] = useState([]);
    const navigate = useNavigate();

const toggleTopic = (topic) => {
  setSelected(prev => {
     if (prev.includes(topic)) return prev.filter(t => t !== topic); // deselect
    if (prev.length >= 5) return prev; // block if already 5 selected
    return [...prev, topic];
  });
};
  return (
    <div className="min-h-screen bg-teal-400 font-sans">
      <Header />
      <div className="flex items-center justify-center p-6">
        <div className="bg-[#f5f0e0] border-4 border-black rounded-2xl shadow-[8px_8px_0px_black] p-8 w-full max-w-2xl">
          <h2 className="text-3xl font-bold text-center mb-2">Choose Your Topics</h2>
<p className="text-center text-black mb-6">{selected.length}/5 selected</p>
          <div className="grid grid-cols-3 gap-4">
            {topics.map((topic) => (
              <button
                key={topic}
                onClick={() => toggleTopic(topic)}
                className={`h-32 rounded-2xl border-4 border-black font-bold text-lg shadow-[4px_4px_0px_black] transition-all
                  ${selected.includes(topic)
                    ? "bg-teal-400 text-white translate-y-[2px] shadow-none"
                    : "bg-pink-400 text-white hover:translate-y-[-2px]"
                  }`}
              >
                {topic}
              </button>
            ))}
          </div>
          <button className="mt-6 w-full bg-[#ffde59] border-4 border-black rounded-xl py-3 font-bold text-xl shadow-[4px_4px_0px_black] hover:translate-y-[-2px] transition-transform" onClick={() => navigate('/home')}>
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;