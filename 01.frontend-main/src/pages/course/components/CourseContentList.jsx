import React from 'react';
import CourseContentItem from './CourseContentItem';

function CourseContentList({ hidden, data, section }) {
  return (
    <div>
      <div className={hidden ? 'hidden' : 'border border-gray-300 dark:border-dark-second'}>
        {section && section.learning_objective && (
          <p className="p-4 text-sm ">{section.learning_objective}</p>
        )}
        {data ? (
          data.map((episode) => <CourseContentItem data={episode} key={episode.id} />)
        ) : (
          <div />
        )}
        <div className="mb-1" />
      </div>
    </div>
  );
}

export default CourseContentList;
