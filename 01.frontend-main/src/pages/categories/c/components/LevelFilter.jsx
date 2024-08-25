import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';

export default function LevelFilter({ setLevel }) {
  const [selected, setSelected] = useState('');

  const handleClick = (value) => {
    setLevel(value);
    setSelected(value);
  };

  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className=" flex w-full justify-between rounded-lg border-y  px-4 py-3 text-left text-xl font-bold text-gray-900 dark:border-dark-third dark:text-dark-txt">
            <span>Level</span>
            <ChevronUpIcon
              className={`${
                open ? 'rotate-180 transform' : ''
              } mt-1 h-5 w-5 text-gray-500 dark:text-dark-txt`}
            />
          </Disclosure.Button>

          <Disclosure.Panel className="px-4 py-2 text-sm text-gray-500">
            <div className="w-full py-1">
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => {
                    handleClick('All');
                  }}
                  className="flex w-full cursor-pointer space-x-1"
                >
                  {selected === 'All' ? (
                    <i className="bx bx-checkbox-square text-2xl dark:text-dark-txt text-gray-700" />
                  ) : (
                    <i className="bx bx-checkbox text-2xl dark:text-dark-txt text-gray-700" />
                  )}
                  <div className="mt-1.5 text-sm dark:text-dark-txt-secondary text-gray-700">
                    All levels
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleClick('Beginner');
                  }}
                  className="flex w-full cursor-pointer space-x-1"
                >
                  {selected === 'Beginner' ? (
                    <i className="bx bx-checkbox-square text-2xl dark:text-dark-txt text-gray-700" />
                  ) : (
                    <i className="bx bx-checkbox text-2xl dark:text-dark-txt text-gray-700" />
                  )}
                  <div className="mt-1.5 text-sm dark:text-dark-txt-secondary text-gray-700">
                    Beginner
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleClick('Intermediate');
                  }}
                  className="flex w-full cursor-pointer space-x-1"
                >
                  {selected === 'Intermediate' ? (
                    <i className="bx bx-checkbox-square text-2xl dark:text-dark-txt text-gray-700" />
                  ) : (
                    <i className="bx bx-checkbox text-2xl dark:text-dark-txt text-gray-700" />
                  )}
                  <div className="mt-1.5 text-sm dark:text-dark-txt-secondary text-gray-700">
                    Intermediate
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleClick('Expert');
                  }}
                  className="flex w-full cursor-pointer space-x-1"
                >
                  {selected === 'Expert' ? (
                    <i className="bx bx-checkbox-square text-2xl dark:text-dark-txt text-gray-700" />
                  ) : (
                    <i className="bx bx-checkbox text-2xl dark:text-dark-txt text-gray-700" />
                  )}
                  <div className="mt-1.5 text-sm dark:text-dark-txt-secondary text-gray-700">
                    Expert
                  </div>
                </button>
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
