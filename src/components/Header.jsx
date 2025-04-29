import React from 'react';

const Header = ({ title }) => {
  return (
    <div className="w-full text-center mb-8">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{title}</h1>
    </div>
  );
};

export default Header;