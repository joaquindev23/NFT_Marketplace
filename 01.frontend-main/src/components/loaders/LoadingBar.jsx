import React from 'react';

function LoadingBar() {
  return (
    <div className="flex animate-pulse flex-row items-center justify-center space-x-5">
      <div className="flex flex-col space-y-3">
        <div className="w-36 bg-gray-200 h-6 rounded-md " />
      </div>
    </div>
  );
}

export default LoadingBar;
