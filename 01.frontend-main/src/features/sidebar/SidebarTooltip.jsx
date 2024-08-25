import React from 'react';

export default function SidebarTooltip({ children }) {
  return (
    <div
      className="absolute left-14 m-2 w-auto min-w-max origin-left scale-0 rounded-md
    bg-gray-900 p-2 
    text-xs font-bold 
    text-white shadow-md transition-all duration-100"
    >
      {children}
    </div>
  );
}
