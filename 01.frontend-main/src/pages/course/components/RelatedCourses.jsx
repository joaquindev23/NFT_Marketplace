import React from 'react';
import LoadingMoon from '@/components/loaders/LoadingMoon';
import RelatedCoursesList from './RelatedCoursesList';

function RelatedCourses({ courses }) {
  return (
    <div className="ml-0 max-w-full py-4 md:ml-8">
      <div className="flex items-center justify-between space-x-4">
        <h2 className="mb-4 text-2xl font-black text-gray-900 dark:text-dark-txt">
          Students also bought
        </h2>
        {/* Button here */}
      </div>
      {courses ? <RelatedCoursesList courses={courses} /> : <LoadingMoon />}
    </div>
  );
}

export default RelatedCourses;
