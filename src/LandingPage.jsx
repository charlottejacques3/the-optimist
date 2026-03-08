import React from "react";
import { useNavigate} from "react-router-dom";
import squiggles from './assets/squiggles.png';
const LandingPage = ({username}) => {
  const navigate = useNavigate();
return(
<div className="relative w-screen h-screen cursor-pointer" onClick={() => navigate("/home")}>
      <img src={squiggles} alt="squiggles" className="w-full h-full object-cover" />
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="text-6xl font-bold text-white drop-shadow-lg">
          Good morning, {username}!
        </h1>
      </div>
    </div>
  );
};

export default LandingPage;