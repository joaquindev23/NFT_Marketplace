import React from 'react';

import Link from 'next/link';
import { CircleLoader } from 'react-spinners';
import StatusComponent from '../../../../products/manage/components/StatusComponent';

export default function Navbar({
  course,
  courseUUID,
  hasChangesTitle,
  hasChangesSubTitle,
  hasChangesDescription,
  hasChangesLevel,
  hasChangesLanguage,
  hasChangesCategory,
  hasChangesTaught,
  hasChangesImages,
  hasChangesVideos,
  loading,
  handleSubmit,
}) {
  const details = course && course.details;
  return (
    <header className="z-30 w-full bg-dark pt-4 shadow-navbar dark:bg-dark-main dark:shadow-none md:py-2 lg:fixed lg:overflow-y-visible">
      <div className="mx-auto max-w-full px-4 ">
        <div className="relative grid  py-2 md:flex md:grid-cols-12 md:gap-8 md:py-0">
          <div className="flex md:static md:inset-y-0 md:left-0 md:col-span-3">
            <div className="flex flex-shrink-0 items-center">
              {/* Dark Image */}
              <Link
                href="/sell/courses"
                className="flex cursor-pointer text-white hover:text-dark-txt"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
                <span className="hidden md:flex">Back to Courses</span>
              </Link>
            </div>

            <StatusComponent data={course} />
            <div className="mt-2.5 ml-4 hidden md:flex">
              <span className="truncate text-xs text-dark-txt md:text-sm xl:inline-flex">
                {details && details.total_duration} min of video content uploaded
              </span>
            </div>
          </div>

          <div className="min-w-0 flex-1 sm:px-0 md:col-span-6 md:px-8">
            <div className="flex items-center px-6 py-4 sm:mx-0 sm:max-w-none md:mx-auto md:max-w-3xl md:px-0">
              <div className="w-full ">
                <div className="-ml-4 -mt-2 flex flex-wrap  items-center justify-between sm:flex-nowrap md:hidden">
                  <div className="ml-4 mt-2">
                    <span className="text-sm text-dark-txt md:hidden md:text-sm xl:inline-flex ">
                      {' '}
                      {details && details.total_duration} min of video content{' '}
                    </span>
                  </div>
                  <div className="ml-4 mt-2 flex-shrink-0">
                    {hasChangesTitle ||
                    hasChangesSubTitle ||
                    hasChangesDescription ||
                    hasChangesLevel ||
                    hasChangesLanguage ||
                    hasChangesCategory ||
                    hasChangesTaught ||
                    hasChangesImages ||
                    hasChangesVideos ? (
                      <div className="inline-flex md:hidden">
                        {loading ? (
                          <button
                            type="button"
                            onClick={handleSubmit}
                            className="text-md ml-0 inline-flex items-center bg-white px-6 py-1.5 font-bold text-dark hover:bg-gray-50 sm:ml-4 md:hidden"
                          >
                            <CircleLoader loading={loading} size={25} color="#1c1d1f" />
                          </button>
                        ) : (
                          <button
                            type="submit"
                            className="text-md ml-0 inline-flex items-center bg-white px-6 py-1.5 font-bold text-dark hover:bg-gray-50 sm:ml-4 md:hidden"
                          >
                            Save
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="text-md ml-0 inline-flex cursor-not-allowed items-center bg-gray-500 px-6 py-1.5 font-bold text-dark hover:bg-gray-50 sm:ml-4 md:hidden">
                        Save
                      </div>
                    )}

                    <Link
                      href={`/sell/courses/manage/settings/${courseUUID}`}
                      className=" text-md ml-4 inline-flex items-center py-2 font-bold text-white"
                    >
                      <i className="bx bxs-cog text-2xl text-white hover:text-dark-txt" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="ml-6 hidden md:col-span-2 md:ml-0 md:flex md:items-center md:justify-end">
            {hasChangesTitle ||
            hasChangesSubTitle ||
            hasChangesDescription ||
            hasChangesLevel ||
            hasChangesLanguage ||
            hasChangesCategory ||
            hasChangesTaught ||
            hasChangesImages ||
            hasChangesVideos ? (
              <div>
                {loading ? (
                  <div className="text-md mr-4 inline-flex items-center bg-white px-6 py-1.5 font-bold text-dark hover:bg-gray-50">
                    <CircleLoader loading={loading} size={25} color="#1c1d1f" />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="text-md mr-4 inline-flex items-center bg-white px-6 py-1.5 font-bold text-dark hover:bg-gray-50"
                  >
                    Save
                  </button>
                )}
              </div>
            ) : (
              <div className="hover:bg-gray-60 text-md mr-4 inline-flex cursor-not-allowed items-center bg-gray-500 px-6 py-1.5 font-bold text-dark">
                Save
              </div>
            )}
            <Link
              href={`/sell/courses/manage/settings/${courseUUID}`}
              className=" text-md inline-flex  items-center py-2 font-bold text-white"
            >
              <i className="bx bxs-cog text-2xl text-white hover:text-dark-txt" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
