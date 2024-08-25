import React from 'react';
import { StarIcon } from '@heroicons/react/20/solid';
import StandardPagination from '@/components/pagination/StandardPagination';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function ReviewsSec({
  review,
  reviews,
  reviewsCount,
  reviewsPage,
  setReviewsPage,
  reviewsPageSize,
  reviewsCounts,
  reviewsTotalCount,
  reviewsAvg,
  setSelectedRating,
  isOpenReview,
  setIsOpenReview,
}) {
  return (
    <div className="">
      <div className="mx-auto max-w-2xl py-12 px-4  sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-12 lg:gap-x-8 lg:px-12">
        <div className="lg:col-span-4">
          <h2 className="text-2xl font-bold tracking-tight dark:text-dark-txt text-gray-900">
            Customer Reviews
          </h2>

          <div className="mt-3 flex items-center">
            <div>
              <div className="flex items-center">
                {[0, 1, 2, 3, 4].map((rating) => (
                  <StarIcon
                    key={rating}
                    className={classNames(
                      reviewsAvg > rating ? 'text-yellow-500' : 'text-gray-300',
                      'h-5 w-5 flex-shrink-0',
                    )}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p className="sr-only">{reviewsAvg && reviewsAvg.toFixed(1)} out of 5 stars</p>
            </div>
            <p className="ml-2 text-sm dark:text-dark-txt-secondary text-gray-900">
              Based on {reviewsTotalCount} reviews
            </p>
          </div>

          <div className="mt-6">
            <h3 className="sr-only">Review data</h3>

            <dl className="space-y-3">
              {reviewsCounts &&
                reviewsCounts.map((count) => (
                  <div
                    key={count.rating}
                    className="flex cursor-pointer items-center text-sm dark:text-dark-txt-secondary"
                    onClick={() => setSelectedRating(count.rating)}
                  >
                    <dt className="flex flex-1 items-center">
                      <p className="w-3 font-medium text-gray-900 dark:text-dark-txt-secondary">
                        {count.rating}
                        <span className="sr-only"> star reviews</span>
                      </p>
                      <div aria-hidden="true" className="ml-1 flex flex-1 items-center">
                        <StarIcon
                          className={classNames(
                            count.count > 0 ? 'text-yellow-500' : 'text-gray-300',
                            'h-5 w-5 flex-shrink-0',
                          )}
                          aria-hidden="true"
                        />

                        <div className="relative ml-3 flex-1">
                          <div className="h-3 rounded-full border border-gray-200 bg-gray-100" />
                          {count.count > 0 ? (
                            <div
                              className="absolute inset-y-0 rounded-full border border-almond-400 bg-yellow-400"
                              style={{
                                width: `calc(${count.count} / ${reviewsTotalCount} * 100%)`,
                              }}
                            />
                          ) : null}
                        </div>
                      </div>
                    </dt>
                    <dd className="ml-3 w-10 text-right text-sm tabular-nums dark:text-dark-txt-secondary text-gray-900">
                      {Math.round((count.count / reviewsTotalCount) * 100)}%
                    </dd>
                  </div>
                ))}
            </dl>
          </div>

          <div className="mt-10">
            <p className="text-lg font-medium dark:text-dark-txt text-gray-900">
              {review ? 'Edit your review' : 'Leave a rating'}
            </p>
            <p className="mt-1 text-sm text-gray-600 dark:text-dark-txt-secondary">
              If you’ve used this product, share your thoughts with other customers
            </p>

            <button
              type="button"
              onClick={() => {
                setIsOpenReview(true);
              }}
              className="mt-6 inline-flex w-full items-center justify-center rounded-md border dark:border-none dark:text-white dark:bg-dark-primary  border-gray-300 bg-white py-2 px-8 text-sm font-medium text-gray-900 hover:bg-gray-50 sm:w-auto lg:w-full"
            >
              Write a review
            </button>
          </div>
        </div>

        <div className="mt-16 lg:col-span-7 lg:col-start-6 lg:mt-0">
          <h3 className="sr-only">Recent reviews</h3>

          <div className="flow-root">
            <div className="-my-12 divide-y divide-gray-200">
              {reviews &&
                reviews.map((review) => (
                  <div key={review.id} className="py-12">
                    <div className="flex items-center">
                      <span className="inline-block h-12 w-auto overflow-hidden rounded-full bg-gray-100">
                        <svg
                          className="h-full w-full text-gray-300"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </span>
                      <div className="ml-4">
                        <h4 className="text-sm font-bold dark:text-dark-txt text-gray-900">
                          {review.user}
                        </h4>
                        <div className="mt-1 flex items-center">
                          {[0, 1, 2, 3, 4].map((rating) => (
                            <StarIcon
                              key={rating}
                              className={classNames(
                                review.rating > rating ? 'text-yellow-500' : 'text-gray-300',
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
            <StandardPagination
              data={reviews && reviews}
              count={reviewsCount && reviewsCount}
              pageSize={reviewsPageSize}
              currentPage={reviewsPage}
              setCurrentPage={setReviewsPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
