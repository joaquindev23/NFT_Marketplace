import Link from 'next/link';
import React from 'react';

export default function PopularProductCategories({ categories }) {
  return (
    <div className=" lg:mx-auto lg:max-w-7xl lg:px-8">
      {/* Heading */}
      <div className=" ">
        <div className="-ml-4 -mt-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
          <div className="ml-4">
            <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-dark-txt">
              Shop by category
            </h3>
          </div>
        </div>
      </div>
      <div className="mt-2 flex">
        <ul className="md:grid block w-full md:grid-cols-4 gap-2">
          {categories &&
            categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/p/${category.slug}`}
                type="button"
                className="text-ms focus:ring-indigo-500 mx-0.5 my-0.5 inline-flex items-center justify-center border border-gray-300 dark:border-dark-second dark:bg-dark-bg dark:text-dark-txt hover:dark:bg-dark-main dark:hover:text-dark-primary bg-white px-6 py-3 font-bold text-gray-900 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                {category.name}
              </Link>
            ))}
        </ul>
      </div>
    </div>
  );
}
