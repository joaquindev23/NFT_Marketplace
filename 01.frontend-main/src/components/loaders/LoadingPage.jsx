import React from 'react';
import LoadingFullWidth from './LoadingFullWidth';

function LoadingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ">
      {/* We've used 3xl here, but feel free to try other max-widths based on your needs */}
      <div className="mx-auto max-w-7xl">
        {
          <div className="grid items-start gap-2 sm:grid-cols-3">
            {/* Right Sidebar */}

            {/* Details */}
            <div className=" col-span-2 p-4 ">
              <LoadingFullWidth />
              <LoadingFullWidth />
            </div>

            {/* Video Sticky */}
            <div className="col-span-2 pt-8 sm:sticky sm:top-24 sm:col-auto md:top-16 md:row-span-3">
              <div className="animate-pulse p-2">
                <div className="h-52 w-full bg-gray-300 dark:bg-dark-third " />
                <div className="-z-10 flex flex-1 flex-col gap-5 sm:p-2">
                  <div className="-z-10 flex flex-1 flex-col gap-3">
                    <div className="-z-10 h-3 w-full animate-pulse bg-gray-300" />
                    <div className="-z-10 h-3 w-full animate-pulse bg-gray-300" />
                    <div className="-z-10 h-3 w-full animate-pulse bg-gray-300" />
                    <div className="-z-10 h-3 w-full animate-pulse bg-gray-300" />
                  </div>
                  <div className="-z-10 mt-auto flex gap-3">
                    <div className="-z-10 h-8 w-20 animate-pulse  bg-gray-300" />
                    <div className="-z-10 h-8 w-20 animate-pulse  bg-gray-300" />
                    <div className="-z-10 ml-auto h-8 w-20 animate-pulse  bg-gray-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
      <br />
      <br />
    </div>
  );
}

export default LoadingPage;
