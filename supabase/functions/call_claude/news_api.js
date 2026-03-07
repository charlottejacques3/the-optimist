import NewsAPI from "npm:newsapi";

const moreKeywords = {
  "animals": 
    ["bird", "wildlife", "sanctuary", "conservation", "endangered", "habitat", "preservation", "mammal", "whale", "fish", "biodiversity", "extinct"],
  "climate":
    ["climate change", "global warming", "carbon footprint", "sustainability", "renewable energy", "greenhouse gas", "emissions", "climate action", "climate crisis", "climate policy", "tree", "wildlife", "conservation", "preservation"],
  "human rights":  
    ["food", "water", "shelter", "education", "healthcare", "equality", "justice", "freedom", "dignity"],
  "women's rights":
    ["gender", "representation", "first female", "women's health"],
  "community":
    ["community", "local", "grassroots", "nonprofit", "charity", "social impact", "civic engagement"],
  "rescue":
    ["rescue", "emergency", "disaster relief", "humanitarian aid", "search and rescue", "save"],
  "economics":
    ["growth", "employment"],
  "cute stories":
    ["family", "love"]
}


export const callNewsAPI = async (keywords) => {
  console.log("Calling News API with keywords:", keywords);
  const allKeywords = [];
  keywords.forEach((keyword) => {
    allKeywords.push(... moreKeywords[keyword]);
  });

  // find the date
  const today = new Date();
  today.setHours(6, 0, 0, 0); // set to 6AM
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const today6am = today.toISOString();
  const yesterday6am = yesterday.toISOString();
  console.log(today6am, yesterday6am);

  const newsAPI = new NewsAPI(process.env.NEWS_API_KEY);
  newsAPI.v2.everything({
    q: allKeywords.join(" OR "),
  });
}