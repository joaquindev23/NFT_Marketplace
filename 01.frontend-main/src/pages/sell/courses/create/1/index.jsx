import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { RadioGroup, Popover } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';
import { AcademicCapIcon } from '@heroicons/react/24/outline';

import Navbar from '../components/Navbar';
import { createCourseFail, setCourseStep1 } from '@/redux/actions/create/create';

const mailingLists = [
  {
    id: 1,
    title: 'Course',
    description: 'Create rich learning experiences with the help of video lectures, quizzes, etc.',
    users: '621 users',
    icon: AcademicCapIcon,
  },
  // {
  //   id: 2,
  //   title: 'Practical Test',
  //   description: 'Help students prepare for certification ecams by providing practice questions.',
  //   users: '1200 users',
  //   icon: ListBulletIcon,
  // },
  // {
  //   id: 3,
  //   title: 'Academy',
  //   description:
  //     'Users embark on a learning journey with lessons, quizzes, exams, grades and homework.',
  //   users: '2740 users',
  //   icon: BuildingLibraryIcon,
  // },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function CreateCourse1() {
  const router = useRouter();

  const myUser = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const dispatch = useDispatch();
  const type = useSelector((state) => state.create.type);

  const [selectedMailingLists, setSelectedMailingLists] = useState(type);

  useEffect(() => {
    dispatch(createCourseFail());
    if (!isAuthenticated || (!type && myUser && myUser.role !== 'seller')) {
      router.push('/');
    }
  }, [dispatch]);

  return (
    <div className="dark:bg-dark-main">
      <Navbar myUser={myUser} title="Step 1 of 4" />
      <div className="overflow-hidden  bg-gray-200">
        <div className="h-1 dark:bg-dark-primary bg-purple-800" style={{ width: '25%' }} />
      </div>
      <div className=" grid w-full place-items-center py-14">
        <h2 className="font-recife-bold mx-12 dark:text-dark-txt text-2xl md:mx-0 md:text-4xl">
          Choose your path wisely, young apprentice.
        </h2>
        <p className="text-lg text-gray-700 dark:text-dark-txt-secondary">
          What kind of training will you offer to those who seek the knowledge of the dark side?
        </p>
        <div className="mt-12">
          <RadioGroup value={selectedMailingLists} onChange={setSelectedMailingLists}>
            {/* <RadioGroup.Label className="text-base font-medium text-gray-900">Select a mailing list</RadioGroup.Label> */}

            <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4">
              {mailingLists.map((mailingList) => (
                <RadioGroup.Option
                  key={mailingList.id}
                  value={mailingList}
                  onClick={() => {
                    dispatch(setCourseStep1(mailingList));
                  }}
                  className={({ checked }) =>
                    classNames(
                      checked
                        ? 'dark:border-dark-primary dark:ring-dark-primary dark:outline-dark-primary outline-2'
                        : 'border-gray-300 dark:border-dark-border',
                      mailingList.id === type && type.id
                        ? 'border-gray-900 ring-2 ring-gray-900'
                        : '',
                      'relative flex h-64 cursor-pointer rounded-lg border dark:border-dark-second p-4 shadow-sm focus:outline-none',
                      'bg-white dark:bg-dark-main',
                      'hover:bg-gray-50 dark:hover:bg-dark-bg',
                    )
                  }
                >
                  {({ checked, active }) => (
                    <>
                      <span className="flex flex-1 ">
                        <span className="flex flex-col items-center justify-center ">
                          <div className="flex items-center justify-center dark:text-dark-txt text-dark ">
                            <mailingList.icon className="h-8 w-8" aria-hidden="true" />
                          </div>
                          <RadioGroup.Label
                            as="span"
                            className="text-md mt-4 block items-center justify-center text-center font-bold dark:text-dark-txt text-gray-900"
                          >
                            {mailingList.title}
                          </RadioGroup.Label>
                          <RadioGroup.Description
                            as="span"
                            className="mt-1 flex w-48 items-center justify-center text-center text-sm dark:text-dark-txt-secondary text-gray-700"
                          >
                            {mailingList.description}
                          </RadioGroup.Description>
                        </span>
                      </span>
                      <span
                        className={classNames(
                          active ? 'border' : 'border-2',
                          checked
                            ? 'border-gray-900 dark:border-dark-border'
                            : 'border-transparent',
                          'pointer-events-none absolute -inset-px rounded-lg',
                        )}
                        aria-hidden="true"
                      />
                    </>
                  )}
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>
        </div>
      </div>

      <Popover
        as="footer"
        className={({ open }) =>
          classNames(
            open ? 'fixed inset-0 overflow-y-auto ' : '',
            'fixed inset-x-0 bottom-0 z-30 w-full py-4 shadow-2xl lg:overflow-y-visible',
            'border dark:border-dark-border ',
            'bg-white  dark:bg-dark-main',
            'shadow-2xl dark:shadow-none ',
          )
        }
      >
        <div className=" px-8 sm:flex sm:items-center sm:justify-between">
          <div className="text-lg font-medium leading-6 text-gray-900 dark:text-dark-txt" />
          <div className="mt-3 sm:mt-0 sm:ml-4">
            {type ? (
              <button
                type="button"
                onClick={() => {
                  router.push('/sell/courses/create/2');
                }}
                className={classNames(
                  'text-md inline-flex items-center px-4 py-3 font-black',
                  'border border-transparent',
                  'bg-dark text-white hover:bg-gray-700',
                  'dark:bg-dark-primary dark:hover:bg-dark-accent',
                )}
              >
                Continue
              </button>
            ) : (
              <div className="text-md inline-flex select-none items-center border border-transparent bg-gray-300 px-4 py-3 font-black text-white dark:bg-dark-third dark:text-dark-txt">
                Continue
              </div>
            )}
          </div>
        </div>
      </Popover>
    </div>
  );
}
