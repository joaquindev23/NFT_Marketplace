import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {} from '@heroicons/react/24/outline';
import { ChevronDownIcon, StarIcon } from '@heroicons/react/20/solid';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Reviews({
  reviews,
  details,
  handleViewMoreReviews,
  reviewsCount,
  reviewsPageSize,
}) {
  const filterReviews = (numStars) => {
    // filter_reviews(courseUUID, numStars)
  };

  const getReviews = () => {
    // get_reviews(courseUUID)
  };

  return (
    <div className="">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:max-w-7xl">
        <div className=" py-2 sm:flex sm:items-center sm:justify-between">
          {/* <StarIcon
                  className="inline-flex h-7 w-7 flex-shrink-0 text-yellow-500"
                /> */}
          <h1 className="font-gilroy-black text-2xl tracking-tight text-gray-900 dark:text-dark-txt">
            Reviews{' '}
          </h1>
          <div className="  sm:ml-4">
            {details && details.student_rating_no} Ratings
            <Menu as="div" className="relative z-10 inline-block text-left">
              <div>
                <Menu.Button className="font-gilroy-semibold group inline-flex justify-center  rounded-xl px-2 py-1.5 text-sm text-gray-700  hover:text-gray-900 dark:border-dark-second dark:text-dark-txt">
                  Filter
                  <ChevronDownIcon
                    className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500 dark:text-dark-txt"
                    aria-hidden="true"
                  />
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-left rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-dark-main">
                  <div className="py-1">
                    <Menu.Item>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm font-gilroy-light mb-3 ml-6 mt-2 dark:text-dark-txt"
                        onClick={getReviews}
                      >
                        Show all
                      </button>
                    </Menu.Item>
                    <Menu.Item>
                      <button
                        type="button"
                        className="mb-1 text-center"
                        style={{ cursor: 'pointer' }}
                        onClick={() => filterReviews(5)}
                      >
                        <StarIcon className="text-almond-600" rating={5.0} />
                      </button>
                    </Menu.Item>
                    <Menu.Item>
                      <button
                        type="button"
                        className="mb-1 text-center"
                        style={{ cursor: 'pointer' }}
                        onClick={() => filterReviews(4.0)}
                      >
                        <StarIcon className="text-almond-600" rating={4.0} />
                      </button>
                    </Menu.Item>
                    <Menu.Item>
                      <button
                        type="button"
                        className="mb-1 text-center"
                        style={{ cursor: 'pointer' }}
                        onClick={() => filterReviews(3.0)}
                      >
                        <StarIcon className="text-almond-600" rating={3.0} />
                      </button>
                    </Menu.Item>
                    <Menu.Item>
                      <button
                        type="button"
                        className="mb-1 text-center"
                        style={{ cursor: 'pointer' }}
                        onClick={() => filterReviews(2.0)}
                      >
                        <StarIcon className="text-almond-600" rating={2.0} />
                      </button>
                    </Menu.Item>
                    <Menu.Item>
                      <button
                        type="button"
                        className="mb-1 text-center"
                        style={{ cursor: 'pointer' }}
                        onClick={() => filterReviews(1.0)}
                      >
                        <StarIcon className="text-almond-600" rating={1.0} />
                      </button>
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>

        <section
          aria-labelledby="filter-heading"
          className=" border-gray-200 py-6 dark:border-dark-second"
        >
          <div className="mx-auto mt-8 w-full max-w-7xl  space-x-8 px-4 sm:px-6 lg:px-8">
            {reviews &&
              reviews.map((review) => (
                <div key={review.id} className="w-full py-2">
                  <div className="flex items-center">
                    <img src={review.thumbnail} className="h-12 w-12 rounded-full" alt="" />
                    <div className="ml-4">
                      <h4 className="text-sm font-bold dark:text-dark-txt text-gray-900">
                        {review.user}
                      </h4>
                      <div className="mt-1 flex items-center">
                        {[0, 1, 2, 3, 4].map((rating) => (
                          <StarIcon
                            key={rating}
                            className={classNames(
                              review.rating > rating ? 'text-almond-600' : 'text-gray-300',
                              'h-5 w-5 flex-shrink-0',
                            )}
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                      <p className="sr-only">{review.rating} out of 5 stars</p>
                    </div>
                  </div>

                  <div
                    className="mt-4 space-y-6 text-base italic dark:text-dark-txt-secondary text-gray-600"
                    dangerouslySetInnerHTML={{ __html: review.comment }}
                  />
                </div>
              ))}
          </div>
        </section>
      </div>
      {reviewsCount > reviewsPageSize && (
        <button
          onClick={handleViewMoreReviews}
          type="button"
          className="inline-flex w-full  items-center justify-center border border-gray-500 px-4 py-2 text-base font-medium text-black shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2"
        >
          Show more
        </button>
      )}
    </div>
  );
}
