import React from 'react';
import ResourceContentItem from './ResourceContentItem';

export default function ResourceContentList({
  FetchInstructorSections,
  sections,
  setSections,
  episodes,
  episode,
  section,
  courseUUID,
}) {
  const resources = episode && episode.resources;

  return (
    <ul className="">
      {resources &&
        resources.map((resource, index) => (
          <ResourceContentItem
            key={resource.id}
            index={index}
            resource={resource}
            FetchInstructorSections={FetchInstructorSections}
            sections={sections}
            setSections={setSections}
            episodes={episodes}
            episode={episode}
            section={section}
            courseUUID={courseUUID}
          />
        ))}
    </ul>
  );
}
