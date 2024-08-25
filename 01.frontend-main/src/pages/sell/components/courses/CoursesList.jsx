import StandardPagination from '@/components/pagination/StandardPagination';
import CourseCardHorizontal from '@/components/sell/CourseCardHorizontal';

function CourseList({ pageSize, courses, count, currentPage, setCurrentPage }) {
  return (
    <div className="overflow-hidden px-8 ">
      <ul className="gap-2 space-y-2">
        {courses &&
          courses.map((course, index) => (
            <CourseCardHorizontal key={course.id} index={index} data={course} />
          ))}
      </ul>
      <StandardPagination
        data={courses}
        count={count}
        pageSize={pageSize}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
export default CourseList;
