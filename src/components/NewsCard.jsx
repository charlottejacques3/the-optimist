import React from 'react';

const NewsCard = ({headline, body, imageUrl, link}) => {
    return (
        <div className="w-full border-black border-2 rounded-md hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] bg-white overflow-hidden flex flex-col">
           <a href={link} className="block cursor-pointer">
              <article className="w-full flex flex-col">
                 <figure className="w-full h-48 shrink-0 border-black border-b-2">
                    <img
                       src={imageUrl || "https://neo-brutalism-ui-library.vercel.app/assets/neo-brutalism-image3-6c6a875b.jpg"}
                       alt="thumbnail"
                       className="w-full h-full object-cover"
                    />
                 </figure>
                 <div className="px-4 py-3 text-left">
                    <h1 className="text-lg font-bold mb-2 line-clamp-2">{headline}</h1>
                    <p className="text-sm mb-2 line-clamp-3">{body}</p>
                 </div>
              </article>
           </a>
        </div>
    );
};
export default NewsCard;