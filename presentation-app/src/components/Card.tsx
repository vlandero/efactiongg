import React from 'react';

type CardProps = {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
};

export const Card: React.FC<CardProps> = ({ title, description, imageUrl, link }) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white hover:bg-gray-100 transition-all duration-300">
      <img className="w-full h-48 object-cover" src={imageUrl} alt={title} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{title}</div>
        <p className="text-gray-700 text-base">{description}</p>
      </div>
      <div className="px-6 py-4">
        <a
          href={link}
          className="inline-block bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 transition-all duration-200"
        >
          Learn More
        </a>
      </div>
    </div>
  );
};
