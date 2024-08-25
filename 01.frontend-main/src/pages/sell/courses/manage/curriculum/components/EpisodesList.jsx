import React from 'react';
import EpisodeItem from '@/components/EpisodeItem';

export default function EpisodesList({
  section,
  sections,
  setSections,
  FetchInstructorSections,
  courseUUID,
}) {
  return (
    <ul className="space-y-4 pl-12">
      {section &&
        section.episodes.map((episode, index) => (
          <EpisodeItem
            key={index}
            episode={episode}
            index={index}
            setSections={setSections}
            sections={sections}
            section={section}
            FetchInstructorSections={FetchInstructorSections}
            courseUUID={courseUUID}
          />
        ))}
    </ul>
  );
}
