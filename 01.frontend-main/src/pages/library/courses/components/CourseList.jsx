import React from 'react';
import StandardPagination from '../../../../components/pagination/StandardPagination';
import CourseCard from './CourseCard';

function CourseList({ pageSize, courses, count, currentPage, setCurrentPage }) {
  return (
    <div className="overflow-hidden ">
      <ul className="gap-2 space-2 px-8 py-12 flex flex-wrap">
        {courses &&
          courses.map((course, index) => <CourseCard key={index} index={index} data={course} />)}
      </ul>
      {courses && courses.length === pageSize && (
        <StandardPagination
          data={courses}
          count={count}
          pageSize={pageSize}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
}
export default CourseList;
