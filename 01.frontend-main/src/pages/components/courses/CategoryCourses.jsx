import React, { useEffect } from 'react';
import Link from 'next/link';

import LoadingMoon from '@/components/loaders/LoadingMoon';
import CourseCardHorizontal from '@/components/CourseCardHorizontal';

export default function CategoryCourses({
  category,
  fetchCourses,
  currentPage,
  selectedCourses,
  loading,
}) {
  // Add this useEffect hook
  useEffect(() => {
    if (category) {
      fetchCourses(currentPage, '', category.slug);
    }
  }, [category, fetchCourses, currentPage]);

  return (
    <>
      <div className="">
        <div className=" flex flex-wrap items-center justify-between sm:flex-nowrap">
          <div className="">
            <h3 className="text-lg font-bold leading-6 text-gray-900 md:text-3xl">
              {category && category.title}
            </h3>
            <p className="mt-4 text-lg text-gray-500">{category && category.description}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingMoon />
      ) : selectedCourses ? (
        selectedCourses.map((course) => (
          <div key={course.id} className="p-4">
            <CourseCardHorizontal data={course} />
          </div>
        ))
      ) : (
        <div />
      )}
      <Link
        href={`/categories/c/${category && category.slug}`}
        className="focus:ring-indigo-500 dark:bg-dark-bg dark:text-dark-accent hover:dark:bg-dark-main hover:dark:text-dark-primary dark:border-dark-border mt-4 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
      >
        Explore {category && category.name}
      </Link>
    </>
  );
}
