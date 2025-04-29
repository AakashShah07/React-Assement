import React from 'react';

const Button = ({ 
  onClick, 
  children, 
  variant = 'primary',
  className = '',
  disabled = false
}) => {
  const baseClasses = "py-2 px-6 rounded-md font-medium focus:outline-none";
  
  const variantClasses = {
    primary: "bg-blue-500 text-white hover:bg-blue-600 primary-btn",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 primary-btn"
  };
  
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;