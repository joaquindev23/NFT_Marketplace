import React, { useState } from 'react';
import slugify from 'react-slugify';

import Link from 'next/link';
import Image from 'next/image';

export default function CourseCard({ data }) {
  const {
    id = null,
    category = '',
    student_rating = 0,
    student_rating_no = 0,
    slug = '',
    short_description = '',
    discount = false,
    price = 0,
    compare_price = 0,
    title = '',
    thumbnail = '',
  } = data ?? {};

  const [hover, setHover] = useState(false);

  const handleMouseEnter = () => {
    setHover(true);
  };
  const handleMouseLeave = () => {
    setHover(false);
  };

  function calculateDiscountPercentage(originalPrice, discountedPrice) {
    if (originalPrice === 0) return 0;
    return parseInt(((originalPrice - discountedPrice) / originalPrice) * 100, 10);
  }

  return (
    <li
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="inline-flex w-64 flex-col text-center lg:w-full border-2 border-dark-bg dark:border-dark-second dark:bg-dark-bg bg-white dark:shadow-none shadow-neubrutalism-md transition duration-300 ease-in-out hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neubrutalism-xl"
    >
      <div className="group relative">
        {/* Image */}
        <Link
          href={`/course/${data && data.slug}`}
          className="relative grid w-full place-items-center "
        >
          <Image
            width={512}
            height={512}
            id={`img-shadow${data && data.id}`}
            src={data && data.thumbnail}
            alt={data && data.title.length > 46 ? data.title.slice(0, 45) : data.title}
            className="object-cover h-40"
          />
          <div
            id={`img-shadow${data && data.id}`}
            className="bg-gray-350 absolute inset-0 mix-blend-multiply"
            aria-hidden="true"
          />
        </Link>
        <div className="flex  w-full flex-col space-y-1  p-3">
          {/* Badges */}
          <div className="item-center -mt-1 flex justify-between">
            <Link
              href={`/categories/c/${slugify(data && data.category)}`}
              className="hidden font-medium dark:text-dark-txt-secondary text-gray-500 hover:underline hover:underline-offset-2 md:block"
            >
              {data && data.category}
            </Link>
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-almond-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>

              <p className="ml-1 select-none text-sm font-bold dark:text-dark-txt-secondary text-gray-600">
                {data && data.student_rating}
                <span className="font-normal dark:text-dark-txt text-gray-500">
                  {' '}
                  ({data && data.student_rating_no} reviews)
                </span>
              </p>
            </div>
          </div>
          {/* Description */}
          <Link
            href={`/course/${data && data.slug}`}
            className={`text-md justify-start text-left font-bold  ${
              hover ? 'text-iris-500 dark:text-dark-primary' : 'text-gray-800 dark:text-dark-txt'
            }`}
          >
            {data && data.title}
          </Link>
          <p className="select-none justify-start text-left text-base dark:text-dark-txt-secondary text-gray-500">
            {data && data.short_description && data.short_description.length > 46
              ? data.short_description.slice(0, 60)
              : data.short_description}
          </p>
          <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
            <div className="ml-4">
              <div className="select-none text-sm font-bold text-gray-800 dark:text-dark-txt">
                <div className="">
                  {data && data.discount ? (
                    <p className="mt-2 text-gray-800 dark:text-dark-txt">
                      {' '}
                      <strong>${data && data.price}</strong> /{' '}
                      <span className="line-through">{data && data.compare_price}</span>
                    </p>
                  ) : (
                    <p className="mt-2 text-gray-800 dark:text-dark-txt">
                      <strong>${data && data.price}</strong>
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="ml-4 flex-shrink-0">
              {data && data.discount ? (
                <p className="inline-flex items-center rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-800">
                  {calculateDiscountPercentage(data.price, data.compare_price)}% Off
                </p>
              ) : (
                <div />
              )}
            </div>
            <div className="ml-4  flex-shrink-0">
              <div className="flex gap-x-2">
                {data && data.best_seller ? (
                  <div className="inline-flex rounded-full bg-almond-200 px-3 py-1 text-xs font-medium text-almond-800  ">
                    Bestseller
                  </div>
                ) : (
                  <div />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
