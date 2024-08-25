import React from 'react';
import { CheckBadgeIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import Link from 'next/link';

export default function PopularInstructors({ instructors }) {
  return (
    <div>
      <div className="mb-4 py-5 ">
        <h3 className="text-2xl font-bold leading-6 text-gray-900 dark:text-dark-txt">
          Popular Instructors
        </h3>
      </div>

      {instructors &&
        instructors.map((user) => (
          <div
            key={user.id}
            className="w-full cursor-pointer rounded-xl border border-white bg-white p-5 hover:border-gray-300 hover:bg-gray-100 dark:border-dark-third dark:bg-dark-main dark:text-dark-txt dark:hover:bg-dark-second "
          >
            <Link href={`/@${user.slug}`} className="grid grid-cols-3">
              <div className="col-span-1">
                <Image
                  width={50}
                  height={50}
                  className="h-20 w-20 rounded-full object-cover"
                  src={user.picture}
                  alt="profile"
                />
              </div>
              <div className="relative col-span-2 mx-5">
                <p className="text-md font-bold text-gray-900 dark:text-dark-txt md:text-lg">
                  {user.username}
                  {user.verified ? (
                    <CheckBadgeIcon
                      className="ml-1 mb-0.5 inline-flex h-4 w-4 text-blue-500"
                      aria-hidden="true"
                    />
                  ) : (
                    <div />
                  )}
                </p>
                {/* <p className="font-medium md:text-sm text-xs text-gray-900 dark:text-dark-txt">Profession</p> */}
                <div className=" flex items-center">
                  <h3 className="text-yellow-600 my-1 text-sm">
                    <span className="text-yellow-600 mr-1 inline-flex font-semibold">
                      {user.student_rating}
                    </span>
                    <span className="mr-2 inline-flex">user.student_rating</span>
                    <span className="inline-flex text-xs text-gray-400 dark:text-dark-txt">
                      ({user.student_rating_no}) ratings
                    </span>
                  </h3>
                </div>
                <p className="mt-1 text-xs font-medium text-gray-500 dark:text-dark-txt md:text-xs">
                  <span className="font-black text-gray-900">{user.students}</span> students
                </p>
                <p className="mt-1 text-xs font-medium text-gray-500 dark:text-dark-txt md:text-xs">
                  <span className="font-black text-gray-900">{user.courses}</span> courses
                </p>
              </div>
            </Link>
          </div>
        ))}
    </div>
  );
}
