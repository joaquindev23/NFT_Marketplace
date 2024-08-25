import React from 'react';
import CourseCardHorizontal from '@/components/CourseCardHorizontal';

export default function RelatedCoursesList({ courses }) {
  return (
    <div>
      {courses &&
        courses.map((course, index) => (
          <CourseCardHorizontal data={course} key={course.id} index={index} />
        ))}
      <button
        type="button"
        // onClick={() => setOpen(true)}
        className="mt-4 inline-flex w-full items-center justify-center border border-gray-500 px-4 py-2 text-base font-medium text-black shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2"
      >
        Show more
      </button>
    </div>
  );
}
