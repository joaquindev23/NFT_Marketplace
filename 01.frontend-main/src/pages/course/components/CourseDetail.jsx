import React from 'react';

import CourseContentSec from './CourseContentSec';

export default function CourseDetailComponent({
  sections,
  totalLectures,
  totalLength,
  handleViewMoreSections,
  sectionsCount,
  sectionsPageSize,
}) {
  return (
    <div className="">
      <h2 className="mb-2 text-xl font-black text-gray-800 dark:text-dark-txt md:text-2xl">
        Course Content
      </h2>

      <ul className="flex w-full text-xs font-medium dark:text-dark-txt-secondary md:text-sm">
        <li className="mr-1 inline-block ">{sections && sections.length} sections</li>
        <li className="mr-1  inline-block">• {totalLectures} lectures</li>
        <li className="mr-1  inline-block">• {totalLength} h total length</li>
      </ul>

      <div className="my-4 dark:text-dark-txt">
        {
          // eslint-disable-next-line
          sections ? (
            sections.map((section) => <CourseContentSec section={section} key={section.id} />)
          ) : (
            <div />
          )
        }
      </div>
      {sectionsCount > sectionsPageSize && (
        <button
          onClick={handleViewMoreSections}
          type="button"
          className="inline-flex w-full  items-center justify-center border dark:border-dark-third dark:bg-dark-second dark:hover:bg-dark-main dark:text-dark-txt border-gray-500 px-4 py-2 text-base font-medium text-black shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2"
        >
          Show more
        </button>
      )}
    </div>
  );
}
