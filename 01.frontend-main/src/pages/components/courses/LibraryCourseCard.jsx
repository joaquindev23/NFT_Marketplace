import React from 'react';
import Link from 'next/link';
import slugify from 'react-slugify';
import Image from 'next/image';

export default function LibraryCourseCard({ data }) {
  return (
    <div className="flex flex-col justify-center">
      <div className="relative flex flex-col   space-y-1 w-72 transition duration-100 ease-in-out p-3 max-w-xs  mx-auto border border-white bg-white">
        {/* Image */}
        <div className="w-full  bg-white grid place-items-center">
          <Link href={`/courses/study/${slugify(data && data.course_uuid)}`}>
            <Image
              width={256}
              height={256}
              src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80"
              alt={
                data && data.title.length > 46
                  ? data && data.title.slice(0, 45)
                  : data && data.title
              }
              className="border rounded-xl"
            />
          </Link>
        </div>

        <div className="w-full  bg-white flex flex-col space-y-2 p-3">
          {/* Title */}
          <h3 className="font-bold text-gray-800 hover:text-purple-600 text-md">
            <Link href={`/courses/study/${slugify(data && data.course_uuid)}`}>
              {data && data.title.length > 46
                ? data && data.title.slice(0, 45)
                : data && data.title}
            </Link>
          </h3>

          <div className="h-1 w-full mt-2 bg-gray-300 dark:bg-dark-second">
            <div
              style={{ width: `75%` }}
              className={`h-full ${75 < 70 ? 'bg-rose-600' : 'bg-purple-600'}`}
            />
          </div>

          {/* Badges */}
          <div className="flex justify-between item-center">
            <p className="text-gray-500 font-medium md:block">
              <Link href={`/courses/study/${slugify(data && data.course_uuid)}`}>Start Course</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
