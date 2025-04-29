import React from 'react';
import { AlertCircle } from 'lucide-react';
import Button from './Button';

const ErrorView = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center h-60 px-4">
      <AlertCircle size={40} className="text-red-500 mb-4" />
      <p className="text-gray-700 mb-6 text-center">{message}</p>
      <Button onClick={onRetry}>Try Again</Button>
    </div>
  );
};

export default ErrorView;