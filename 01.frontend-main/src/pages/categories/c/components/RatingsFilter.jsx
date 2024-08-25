import React, { useState } from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/20/solid';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function RatingsFilter({ setRating }) {
  const [ratingSelected, setRatingSelected] = useState(0);

  return (
    <Disclosure defaultOpen>
      {({ open }) => (
        <>
          <Disclosure.Button className=" flex w-full justify-between rounded-lg border-y  px-4 py-3 text-left text-xl font-bold  text-gray-900 dark:border-dark-third dark:text-dark-txt">
            <span>Ratings</span>
            <ChevronUpIcon
              className={`${
                open ? 'rotate-180 transform' : ''
              } mt-1 h-5 w-5 text-gray-500 dark:text-dark-txt`}
            />
          </Disclosure.Button>
          <Disclosure.Panel className="px-4 py-2 text-sm text-gray-500">
            <div className="w-full py-1">
              <button
                type="button"
                className="mb-1 flex space-x-1"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setRating('5');
                  setRatingSelected(5);
                }}
              >
                {ratingSelected === 5 ? (
                  <i className="bx bx-radio-circle-marked text-2xl text-gray-700 dark:text-dark-txt" />
                ) : (
                  <i className="bx bx-radio-circle text-2xl text-gray-700 dark:text-dark-txt" />
                )}

                <div className="ml-1 mt-1.5 flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={classNames(
                        rating < 5 ? 'text-almond-600' : 'text-gray-200',
                        'h-5 w-5 flex-shrink-0',
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <div className="text-sm text-gray-700 dark:text-dark-txt mt-1.5">5</div>
              </button>
              <button
                type="button"
                className="mb-1 flex space-x-1"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setRating('4');
                  setRatingSelected(4);
                }}
              >
                {ratingSelected === 4 ? (
                  <i className="bx bx-radio-circle-marked text-2xl text-gray-700 dark:text-dark-txt" />
                ) : (
                  <i className="bx bx-radio-circle text-2xl text-gray-700 dark:text-dark-txt" />
                )}

                <div className="ml-1 mt-1.5 flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={classNames(
                        rating < 4 ? 'text-almond-600' : 'text-gray-200',
                        'h-5 w-5 flex-shrink-0',
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <div className="text-sm text-gray-700 dark:text-dark-txt mt-1.5">4</div>
              </button>
              <button
                type="button"
                className="mb-1 flex space-x-1"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setRating('3');
                  setRatingSelected(3);
                }}
              >
                {ratingSelected === 3 ? (
                  <i className="bx bx-radio-circle-marked text-2xl text-gray-700 dark:text-dark-txt" />
                ) : (
                  <i className="bx bx-radio-circle text-2xl text-gray-700 dark:text-dark-txt" />
                )}

                <div className="ml-1 mt-1.5 flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={classNames(
                        rating < 3 ? 'text-almond-600' : 'text-gray-200',
                        'h-5 w-5 flex-shrink-0',
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <div className="text-sm text-gray-700 dark:text-dark-txt mt-1.5">3</div>
              </button>
              <button
                type="button"
                className="mb-1 flex space-x-1"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setRating('2');
                  setRatingSelected(2);
                }}
              >
                {ratingSelected === 2 ? (
                  <i className="bx bx-radio-circle-marked text-2xl text-gray-700 dark:text-dark-txt" />
                ) : (
                  <i className="bx bx-radio-circle text-2xl text-gray-700 dark:text-dark-txt" />
                )}

                <div className="ml-1 mt-1.5 flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={classNames(
                        rating < 2 ? 'text-almond-600' : 'text-gray-200',
                        'h-5 w-5 flex-shrink-0',
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <div className="text-sm text-gray-700 dark:text-dark-txt mt-1.5">2</div>
              </button>
              <button
                type="button"
                className="mb-1 flex space-x-1"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setRating('1');
                  setRatingSelected(1);
                }}
              >
                {ratingSelected === 1 ? (
                  <i className="bx bx-radio-circle-marked text-2xl text-gray-700 dark:text-dark-txt" />
                ) : (
                  <i className="bx bx-radio-circle text-2xl text-gray-700 dark:text-dark-txt" />
                )}

                <div className="ml-1 mt-1.5 flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={classNames(
                        rating < 1 ? 'text-almond-600' : 'text-gray-200',
                        'h-5 w-5 flex-shrink-0',
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <div className="text-sm text-gray-700 dark:text-dark-txt mt-1.5">1</div>
              </button>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
