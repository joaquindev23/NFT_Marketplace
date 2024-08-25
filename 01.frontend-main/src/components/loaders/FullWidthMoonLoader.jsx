import React from 'react';
import CircleLoader from 'react-spinners/CircleLoader';

export default function FullWidthMoonLoader() {
  return (
    <div className="grid w-full place-items-center py-16">
      <CircleLoader
        className="items-center justify-center text-center"
        loading
        size={35}
        color="#1c1d1f"
      />
    </div>
  );
}
