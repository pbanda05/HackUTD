import React from 'react';

export function Button({ children, className = '', ...props }) {
  return (
    <button
      className={`px-4 py-2 rounded-lg font-semibold transition-colors cursor-pointer relative z-10 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

