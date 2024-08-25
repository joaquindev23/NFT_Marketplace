import React, { useState } from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

import CreateCourseSection from '@/api/manage/curriculum/sections/Create';
import LoadingMoon from '@/components/loaders/LoadingMoon';
import SectionsContainerList from './SectionsContainerList';

export default function SectionsContainerSec({
  sections,
  setSections,
  FetchInstructorSections,
  courseUUID,
}) {
  const [addSection, setAddSection] = useState(false);
  const [loading, setLoading] = useState(false);

  const [sectionTitle, setSectionTitle] = useState('');
  const [learningObjective, setLearningObjective] = useState('');

  async function fetchData() {
    const sectionsData = await FetchInstructorSections(courseUUID);
    if (sectionsData) {
      setSections(sectionsData);
    }
  }

  const courseid = courseUUID && courseUUID[0];

  const handleSectionAdd = async (e) => {
    e.preventDefault();
    setLoading(true);

    const body = JSON.stringify({
      title: sectionTitle,
      learningObjective,
      number: sections.length + 1,
      courseUUID: courseid,
    });

    try {
      const res = await fetch('/api/sell/courses/sections/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });

      if (res.status === 201) {
        const sectionsData = await FetchInstructorSections(courseUUID[0]);
        setSections(sectionsData);
      }
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
    setAddSection(false);
    setSectionTitle('');
    setLearningObjective('');
  };

  return (
    <div className="w-full p-8 ">
      {/* Add Section ABOVE */}
      <div className="my-2 grid w-full grid-cols-12">
        <div id="section-left" className="col-span-1 hidden" />
        {addSection ? (
          <button
            id="section-plus"
            type="button"
            onClick={() => {
              setAddSection(false);
            }}
            className="col-span-1 inline-flex translate-x-1 items-center rounded-r-full border-2 border-dotted dark:border-dark-border border-gray-400 bg-white dark:bg-dark-bg p-1 text-black dark:text-dark-txt shadow-md transition duration-300 ease-in-out hover:bg-gray-50 dark:hover:bg-dark-second"
          >
            <XMarkIcon className="ml-0 h-6 w-6 md:ml-4" aria-hidden="true" />
          </button>
        ) : (
          <button
            id="section-plus"
            type="button"
            onClick={() => {
              setAddSection(true);
            }}
            className="col-span-1 inline-flex translate-x-1 items-center rounded-r-full border-2 border-dotted dark:border-dark-border border-gray-400 bg-white dark:bg-dark-bg p-1 text-black dark:text-dark-txt shadow-md transition duration-300 ease-in-out hover:bg-gray-50 dark:hover:bg-dark-second"
          >
            <PlusIcon className="ml-0 h-6 w-6 md:ml-4" aria-hidden="true" />
          </button>
        )}
        <div id="section-plus-fill" className="col-span-11 inline-flex w-full p-5 " />
      </div>

      {/* Add Section Form */}
      {addSection ? (
        <div className="mb-4 w-full border border-gray-700 dark:bg-dark-second bg-white py-4">
          <form onSubmit={handleSectionAdd} className="grid grid-cols-12">
            <h3 className="text-md col-span-2 ml-4 inline-flex font-bold leading-6 dark:text-dark-txt text-gray-900">
              New section:{' '}
            </h3>
            <div className="relative col-span-10 w-full px-4">
              <div>
                <div className="absolute right-0 mt-2.5 mr-6 text-gray-400 dark:text-dark-txt-secondary">
                  {sectionTitle.length} of 60
                </div>
                <input
                  type="text"
                  value={sectionTitle}
                  onChange={(e) => setSectionTitle(e.target.value)}
                  required
                  name="title"
                  className="ring-none w-full border dark:border-dark-border border-gray-700 py-3 outline-none dark:bg-dark-second pl-4 focus:border-gray-500 focus:outline-transparent focus:ring-transparent"
                  placeholder="Enter a title"
                />
              </div>
              <div className="mt-4">
                <div className="block text-sm font-bold dark:text-dark-txt-secondary text-gray-900">
                  What will students be able to do at the end of this section?
                </div>
                <div className="absolute right-0 mt-2.5 mr-6 text-gray-400 dark:text-dark-txt-secondary">
                  {learningObjective.length} of 60
                </div>
                <input
                  type="text"
                  value={learningObjective}
                  onChange={(e) => setLearningObjective(e.target.value)}
                  name="learning_objective"
                  className="ring-none w-full border dark:border-dark-border border-gray-700 py-3 outline-none dark:bg-dark-second pl-4 focus:border-gray-500 focus:outline-transparent focus:ring-transparent"
                  placeholder="Enter a learning objective"
                />
              </div>
              <div className="float-right mt-4 flex space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setAddSection(false);
                  }}
                  className="inline-flex cursor-pointer items-center border border-transparent px-4 py-2 text-sm font-medium text-black dark:text-dark-txt hover:bg-gray-50 dark:hover:bg-dark-second"
                >
                  Cancel
                </button>
                {loading ? (
                  <div className="inline-flex items-center border border-transparent bg-black dark:bg-dark-primary px-4 py-2 text-sm font-bold text-white dark:text-dark-txt shadow-sm hover:bg-gray-900 dark:hover:bg-dark-accent">
                    <LoadingMoon size={20} color="#fff" />
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="inline-flex items-center border border-transparent bg-black dark:bg-dark-primary px-4 py-2 text-sm font-bold text-white  shadow-sm hover:bg-gray-900 dark:hover:bg-dark-accent"
                  >
                    Add section
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div />
      )}
      <SectionsContainerList
        sections={sections}
        setSections={setSections}
        FetchInstructorSections={FetchInstructorSections}
        courseUUID={courseUUID}
      />
    </div>
  );
}
