import { Tab } from '@headlessui/react';
import React from 'react';
import LoadingMoon from '@/components/loaders/LoadingMoon';
import CourseCard from '../../../../components/CourseCard';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function CourseTabs({ coursesSold, coursesArrival, coursesViews }) {
  return (
    <div>
      <div className="mb-4 ">
        <h3 className="text-2xl font-worksans-bold leading-6 dark:text-dark-txt text-gray-900">
          Courses to get you started
        </h3>
      </div>

      <div className="w-full max-w-full  py-4 sm:px-0">
        <Tab.Group>
          <Tab.List className=" space-x-1 grid md:grid-cols-12 grid-cols-3 p-1">
            <Tab
              className={({ selected }) =>
                classNames(
                  'w-full py-2.5 text-md leading-5 md:col-span-2 col-span-1 ',
                  '',
                  selected
                    ? 'flex items-center justify-center space-x-2 p-1 font-bold  dark:text-dark-txt text-black  border-b-2 border-gray-900 dark:bg-dark-third'
                    : 'flex items-center justify-center md:space-x-2  font-semibold p-1 border-b-2 border-gray-50 hover:border-gray-200  dark:text-dark-txt text-gray-600 dark:hover:bg-dark-third',
                )
              }
            >
              Popular
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  'w-full py-2.5 text-md leading-5 md:col-span-2 col-span-1 ',
                  '',
                  selected
                    ? 'flex items-center justify-center space-x-2 p-1 font-bold  dark:text-dark-txt text-black  border-b-2 border-gray-900 dark:bg-dark-third'
                    : 'flex items-center justify-center md:space-x-2  font-semibold p-1 border-b-2 border-gray-50 hover:border-gray-200  dark:text-dark-txt text-gray-600 dark:hover:bg-dark-third',
                )
              }
            >
              New
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  'w-full py-2.5 text-md leading-5 md:col-span-2 col-span-1 ',
                  '',
                  selected
                    ? 'flex items-center justify-center space-x-2 p-1 font-bold  dark:text-dark-txt text-black  border-b-2 border-gray-900 dark:bg-dark-third'
                    : 'flex items-center justify-center md:space-x-2  font-semibold p-1 border-b-2 border-gray-50 hover:border-gray-200  dark:text-dark-txt text-gray-600 dark:hover:bg-dark-third',
                )
              }
            >
              Trending
            </Tab>
          </Tab.List>

          <Tab.Panels className="">
            <Tab.Panel className={classNames('rounded-xl  p-3', '')}>
              {coursesSold ? (
                <div className="relative mt-8">
                  <div className="relative -mb-6 w-full overflow-x-auto pb-6">
                    <ul className="mx-4 p-1 inline-flex space-x-8 sm:mx-6 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-x-8 lg:space-x-2">
                      {coursesSold.map((data) => (
                        <div key={data.course_uuid} className="group relative">
                          <CourseCard key={data.course_uuid} data={data} />
                        </div>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <LoadingMoon size={25} />
              )}
            </Tab.Panel>
            <Tab.Panel className={classNames('rounded-xl  p-3', '')}>
              {coursesArrival ? (
                <div className="relative -mb-6 w-full overflow-x-auto pb-6">
                  <div className="relative inline-flex rounded-md p-3 ">
                    {coursesArrival.map((data) => (
                      <div key={data.course_uuid} className="group relative">
                        <CourseCard key={data.course_uuid} data={data} />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <LoadingMoon size={25} />
              )}
            </Tab.Panel>
            <Tab.Panel className={classNames('rounded-xl  p-3', '')}>
              {coursesViews ? (
                <div className="relative -mb-6 w-full overflow-x-auto pb-6">
                  <div className="relative inline-flex rounded-md p-3 ">
                    {coursesViews.map((data) => (
                      <div key={data.course_uuid} className="group relative">
                        <CourseCard key={data.course_uuid} data={data} />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <LoadingMoon size={25} />
              )}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}
