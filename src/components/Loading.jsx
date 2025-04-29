import React from 'react';
import { Loader } from 'lucide-react';

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-60">
      <Loader size={40} className="text-blue-500 spin mb-4" />
      <p className="text-gray-600">Loading lists...</p>
    </div>
  );
};

export default Loading;