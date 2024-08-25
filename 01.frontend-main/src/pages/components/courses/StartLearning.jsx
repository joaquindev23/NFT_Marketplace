import React from 'react';

export default function StartLearning({ isAuthenticated, courses, Link }) {
  return (
    <div className="relative mx-auto max-w-7xl  px-4 sm:px-6 lg:px-8 ">
      {/* Heading */}
      <div className=" ">
        <div className="-ml-4 -mt-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
          <div className="ml-4 ">
            <h3 className="font-recife-bold text-3xl tracking-tight text-gray-900 dark:text-dark-txt">
              Continue learning
            </h3>
          </div>
        </div>
      </div>
      Course card horizontal
    </div>
  );
}
