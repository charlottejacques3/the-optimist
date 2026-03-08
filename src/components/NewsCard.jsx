import React from 'react';

const NewsCard = ({headline, body,  imageUrl, link}) => {
    return (
        <div class="w-300 h-full border-black border-2 rounded-md hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] bg-white">
           <a href={link} class="block cursor-pointer">
              <article class="w-full h-full">
                 <figure class="w-full h-1/2 border-black border-b-2">
            <img
               src={imageUrl || "https://neo-brutalism-ui-library.vercel.app/assets/neo-brutalism-image3-6c6a875b.jpg"}
               alt="thumbnail"
               class="w-full h-full object-cover"
               />
         </figure>
         <div class="px-6 py-5 text-left h-full">
            <h1 class="text-7xl mb-4">{headline}</h1>
            <p class="text-3xl mb-4 line-clamp-4">
                {body}
            </p>
         </div>
      </article>
   </a>
</div>
    );
};

export default NewsCard;