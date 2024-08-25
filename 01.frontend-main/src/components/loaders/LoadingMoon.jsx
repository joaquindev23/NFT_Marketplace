import MoonLoader from 'react-spinners/MoonLoader';
import React from 'react';

export default function LoadingMoon({ size, color }) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <MoonLoader loading color={`${color}`} size={size} />
    </div>
  );
}
