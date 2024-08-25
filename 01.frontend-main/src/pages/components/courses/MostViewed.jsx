import React from 'react';
import CourseCard from '../../../components/CourseCard';

export default function MostViewed({ courses }) {
  return (
    <div className="bg-white">
      <div className="py-16 sm:py-24 lg:mx-auto lg:max-w-7xl lg:px-8">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-0">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Students are viewing</h2>
        </div>
      </div>
      <div className="relative">
        <div className="relative  w-full overflow-x-auto pb-6">
          <ul className="mx-4 p-1 inline-flex space-x-8 sm:mx-6 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-x-8 lg:space-x-2">
            {courses && courses.map((course) => <CourseCard key={course.id} data={course} />)}
          </ul>
        </div>
      </div>
    </div>
  );
}
