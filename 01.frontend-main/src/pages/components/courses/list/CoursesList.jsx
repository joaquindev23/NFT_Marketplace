import React from 'react';

import CourseCard from '../../../../components/CourseCard';

export default function CoursesList({ courses }) {
  return (
    <div>
      <div className="relative">
        <div className="relative -mb-24 w-full overflow-x-auto ">
          <ul className="inline-flex space-x-8 ">
            {courses ? (
              courses.map((course, index) => <CourseCard key={index} data={course} />)
            ) : (
              <div>loading</div>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
