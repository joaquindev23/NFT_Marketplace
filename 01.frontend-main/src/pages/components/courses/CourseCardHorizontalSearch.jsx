import { StarIcon } from '@heroicons/react/20/solid';
import DOMPurify from 'isomorphic-dompurify';
import React from 'react';
import slugify from 'react-slugify';
import Tippy from '@tippyjs/react';
import Link from 'next/link';
import Image from 'next/image';
// import moment from 'moment'
// import { useSelector } from 'react-redux'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function CourseCardHorizontalSearch({ data }) {
  if (!data) {
    return null; // Or return a loading spinner or an error message, as appropriate
  }
  const handleImageShowShadow = () => {
    const imageShadow = document.getElementById(`img-shadow${data && data.id}`);
    imageShadow.classList.add('bg-gray-350');
  };
  const handleImageRemoveShadow = () => {
    const imageShadow = document.getElementById(`img-shadow${data && data.id}`);
    imageShadow.classList.remove('bg-gray-350');
  };

  return (
    <Tippy
      animation="scale"
      theme="light"
      interactive
      placement="top"
      duration={[75, 50]}
      offset={[0, 10]}
      className="hidden md:flex"
      content={
        <div className="relative w-96 space-y-2 p-4">
          <p className="text-lg font-semibold  text-gray-900">What you&apos;ll learn</p>
          <ul className="list-disc space-y-1 py-1 px-4 text-base text-gray-700">
            {data &&
              data.get_whatlearnt.map((whatlearnt) => (
                <li key={whatlearnt.title}>{whatlearnt.title}</li>
              ))}
          </ul>
          {/* Cart */}
          <p>Cart HEre</p>
        </div>
      }
    >
      <Link
        href={`/course/${slugify(data && data.slug)}`}
        onMouseEnter={handleImageShowShadow}
        onMouseLeave={handleImageRemoveShadow}
        className="flex flex-col justify-center "
      >
        <div className="relative mx-auto flex max-w-xs flex-col space-y-3 border border-white bg-white transition  duration-100 ease-in-out md:max-w-full md:flex-row md:space-x-5 md:space-y-0">
          <div className="relative grid w-full place-items-center bg-gray-50 md:w-5/12">
            <Image
              width={256}
              height={256}
              src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80"
              alt={
                data && data.title.length > 46
                  ? data && data.title.slice(0, 45)
                  : data && data.title
              }
              className="h-full object-cover"
            />

            <div
              id={`img-shadow${data && data.id}`}
              className="bg-gray-350 absolute inset-0 mix-blend-multiply"
              aria-hidden="true"
            />
          </div>
          <div className="flex  w-full flex-col bg-white  ">
            <div className="item-center flex justify-between">
              <p className="text-md font-bold  text-gray-800">
                {data && data.title.length > 60
                  ? data && data.title.slice(0, 59)
                  : data && data.title}
              </p>

              <div className="flex items-center">
                <p className="text-md select-none font-bold text-gray-800">
                  ${parseFloat(data && data.price)}
                  {/* <span className="font-normal text-gray-600 text-base">/night</span> */}
                </p>
              </div>
            </div>
            <div className="item-center flex justify-between">
              <p
                className=" select-none text-sm text-gray-700"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(data && data && data.short_description),
                }}
              />

              <div className="flex items-center">
                {data && data.compare_price && (
                  <p className="text-md select-none font-bold text-gray-800">
                    ${parseFloat(data && data.price)}
                    {/* <span className="font-normal text-gray-600 text-base">/night</span> */}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-1 flex flex-wrap items-center justify-between sm:flex-nowrap">
              <div className="">
                <p className="text-xs text-gray-500">{data && data.author.username}</p>
              </div>
              <div className="ml-4 flex-shrink-0">
                <div className="flex gap-x-2" />
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between sm:flex-nowrap">
              <div className="">
                <h3 className="flex space-x-2">
                  <span className="text-yellow-600 text-md inline-flex font-semibold">
                    {data && data.student_rating}
                  </span>
                  <div className="ml-1 flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <StarIcon
                        key={rating}
                        className={classNames(
                          data && data.student_rating > rating
                            ? 'text-yellow-400'
                            : 'text-gray-200',
                          'h-5 w-5 flex-shrink-0',
                        )}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <span className="inline-flex text-xs text-gray-400 dark:text-dark-txt">
                    ({data && data.student_rating_no})
                  </span>
                </h3>
              </div>
              <div className="ml-4  flex-shrink-0">
                <div className="flex gap-x-2" />
              </div>
            </div>
            <div className="mt-1 flex flex-wrap items-center justify-between sm:flex-nowrap">
              <p className="inline-flex text-xs text-gray-500">
                {data && data.total_duration} total hours &middot; {data && data.total_lectures}{' '}
                lectures &middot; {data && data.level}
              </p>
              <div className="ml-4  flex-shrink-0">
                <div className="flex gap-x-2" />
              </div>
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
              {data && data.best_seller && (
                <span className="relative inline-flex items-center bg-[#eceb98] px-2.5 py-0.5 text-xs font-bold text-[#314d22]">
                  Bestseller
                </span>
              )}
              <div className="ml-4  flex-shrink-0">
                <div className="flex gap-x-2" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </Tippy>
  );
}
