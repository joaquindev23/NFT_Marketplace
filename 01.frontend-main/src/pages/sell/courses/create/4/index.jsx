import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { Popover } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';
import slugify from 'react-slugify';
// import { ListBulletIcon, AcademicCapIcon, BuildingLibraryIcon } from '@heroicons/react/24/outline';

import Navbar from '../components/Navbar';
import { createCourse, setCourseStep4 } from '@/redux/actions/create/create';
// import { setCourseStep1 } from '../../../../redux/actions/create/create';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function CreateCourse4() {
  const router = useRouter();

  const myUser = useSelector((state) => state.auth.user);
  const wallet = useSelector((state) => state.auth.wallet);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const dispatch = useDispatch();

  const dedication = useSelector((state) => state.create.dedication);
  const type = useSelector((state) => state.create.type);
  const category = useSelector((state) => state.create.category);
  const subCategory = useSelector((state) => state.create.categorySecondary);
  const topic = useSelector((state) => state.create.categoryTertiary);
  const title = useSelector((state) => state.create.title);
  const course = useSelector((state) => state.create.course);

  useEffect(() => {
    if (course) {
      router.push(`/sell/courses/manage/goals/${course.id}`);
    }
  }, [course]);

  const plans = [
    { id: 'small', name: 'starter', description: "I'm very busy right now (0-2 hours)" },
    { id: 'medium', name: 'hobbyist', description: "I'll work on this on the side (2-4 hours)" },
    { id: 'large', name: 'freelancer', description: "I have lot's of flexibility (4-6 hours)" },
    {
      id: 'xlarge',
      name: 'entrepreneur',
      description: 'This is what i do for a living (6+ hours)',
    },
  ];

  useEffect(() => {
    if (!isAuthenticated || (!type && myUser && myUser.role !== 'seller')) {
      router.push('/');
    }
  }, []);

  return (
    <div className="dark:bg-dark-main">
      <Navbar myUser={myUser} title="Step 4 of 4" />
      <div className="overflow-hidden  bg-gray-200">
        <div className="h-1 dark:bg-dark-primary bg-purple-800" style={{ width: '100%' }} />
      </div>
      <div className="grid w-full place-items-center py-14">
        <h2 className="font-bold mx-12 text-xl dark:text-dark-txt md:mx-0 md:text-2xl">
          Ho much time can you invest in creating this training?
        </h2>
        <p className="font-regular mx-12 mt-4 text-sm md:mx-0 dark:text-dark-txt-secondary md:text-lg">
          The power of the dark side does not discriminate, whether it be a lot or a little, we will
          guide you to reach your goals.
        </p>
        <div className="mt-12">
          <fieldset>
            <legend className="sr-only">Plan</legend>
            <div className="space-y-2">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className="relative  flex w-96 cursor-pointer items-start border border-gray-700 p-4 md:w-[750px]"
                >
                  <div className="flex h-5 cursor-pointer items-center">
                    <input
                      id={plan.id}
                      aria-describedby={`${plan.id}-description`}
                      name="plan"
                      type="radio"
                      value={plan.id}
                      onChange={() => {
                        dispatch(setCourseStep4(plan.name));
                      }}
                      className={classNames(
                        'h-5 w-5 cursor-pointer border-2 focus:ring-2 focus:ring-opacity-50 focus:outline-none rounded-full',
                        'border-gray-700 dark:border-dark-border',
                        'text-gray-600 dark:text-dark-txt',
                        'focus:ring-gray-500 dark:focus:ring-dark-primary',
                      )}
                    />
                    <label
                      htmlFor={plan.id}
                      className={classNames(
                        'text-md ml-4 cursor-pointer font-bold',
                        'text-gray-900 dark:text-dark-txt',
                      )}
                    >
                      {plan.description}
                    </label>
                  </div>
                  <div className="ml-3" />
                </div>
              ))}
            </div>
          </fieldset>
        </div>
      </div>

      <Popover
        as="footer"
        className={({ open }) =>
          classNames(
            open ? 'fixed inset-0 overflow-y-auto' : '',
            ' fixed inset-x-0 bottom-0 z-30 w-full border dark:border-dark-border bg-white  py-4 shadow-2xl dark:bg-dark-main dark:shadow-none lg:overflow-y-visible',
          )
        }
      >
        <div className="px-8 sm:flex sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => {
              router.back();
            }}
            className="text-lg font-medium leading-6 dark:text-dark-txt text-gray-900"
          >
            Previous
          </button>
          <div className="mt-3 sm:mt-0 sm:ml-4">
            {dedication ? (
              <button
                type="button"
                onClick={() => {
                  const fetchData = async () => {
                    dispatch(
                      createCourse(
                        type,
                        title,
                        slugify(category),
                        slugify(subCategory),
                        slugify(topic),
                        dedication,
                        myUser,
                        wallet.address,
                        wallet.polygon_address,
                      ),
                    );
                  };
                  fetchData();
                }}
                className={classNames(
                  'text-md inline-flex items-center px-4 py-3 font-black',
                  'border border-transparent',
                  'bg-dark text-white hover:bg-gray-700',
                  'dark:bg-dark-primary dark:hover:bg-dark-accent',
                )}
              >
                Create Course
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
