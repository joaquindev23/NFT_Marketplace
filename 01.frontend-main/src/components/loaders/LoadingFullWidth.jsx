import React from 'react';

const LoadingFullWidth = () => {
  <div className=" -z-10 mx-auto flex w-full select-none flex-col gap-5  p-2 sm:h-64 sm:flex-row sm:p-4 ">
    <div className="-z-10 h-52 animate-pulse  bg-gray-300 sm:h-full sm:w-72" />
    <div className="-z-10 flex flex-1 flex-col gap-5 sm:p-2">
      <div className="-z-10 flex flex-1 flex-col gap-3">
        <div className="-z-10 h-14 w-full animate-pulse bg-gray-300" />
        <div className="-z-10 h-3 w-full animate-pulse bg-gray-300" />
        <div className="-z-10 h-3 w-full animate-pulse bg-gray-300" />
        <div className="-z-10 h-3 w-full animate-pulse bg-gray-300" />
        <div className="-z-10 h-3 w-full animate-pulse bg-gray-300" />
      </div>
      <div className="-z-10 mt-auto flex gap-3">
        <div className="-z-10 h-8 w-20 animate-pulse bg-gray-300" />
        <div className="-z-10 h-8 w-20 animate-pulse bg-gray-300" />
        <div className="-z-10 ml-auto h-8 w-20 animate-pulse bg-gray-300" />
      </div>
    </div>
  </div>;
};

export default LoadingFullWidth;
