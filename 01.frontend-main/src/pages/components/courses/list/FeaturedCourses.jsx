import React from 'react';
// eslint-disable-next-line
import LoadingMoon from '@/components/loaders/LoadingMoon';
import CourseCard from '@/components/CourseCard';

export default function FeaturedCourses({ data }) {
  return (
    <div className="bg-white">
      <div className="py-16 sm:py-24 lg:mx-auto lg:max-w-7xl lg:px-8">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-0">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Trending courses</h2>
          {/* <a
            href="#"
            className="hidden text-sm font-semibold text-indigo-600 hover:text-indigo-500 sm:block"
          >
            See everything
            <span aria-hidden="true"> &rarr;</span>
          </a> */}
        </div>

        <div className="relative mt-8">
          <div className="relative -mb-6 w-full overflow-x-auto pb-6">
            <ul className="mx-4 p-1 inline-flex space-x-8 sm:mx-6 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-x-8 lg:space-x-2">
              {data ? (
                data.map((course, index) => (
                  <CourseCard key={course.id} index={index} data={course} />
                ))
              ) : (
                <LoadingMoon size={20} color="#1c1d1f" />
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex px-4 sm:hidden">
          <a href="#" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">
            See everything
            <span aria-hidden="true"> &rarr;</span>
          </a>
        </div>
      </div>
    </div>
  );
}
