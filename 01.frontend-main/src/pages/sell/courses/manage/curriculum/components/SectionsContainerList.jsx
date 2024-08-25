import React from 'react';
import SectionsContainerItem from './SectionsContainerItem';

export default function SectionsContainerList({
  sections,
  setSections,
  FetchInstructorSections,
  courseUUID,
}) {
  return (
    <ul className="grid space-y-4">
      {sections &&
        sections.map((section, index) => (
          <SectionsContainerItem
            index={index}
            key={section.id}
            section={section}
            sections={sections}
            setSections={setSections}
            FetchInstructorSections={FetchInstructorSections}
            courseUUID={courseUUID}
          />
        ))}
    </ul>
  );
}
