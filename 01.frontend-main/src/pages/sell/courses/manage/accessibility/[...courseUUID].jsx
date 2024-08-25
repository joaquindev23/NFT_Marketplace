import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SetCourseHandle from '@/api/manage/courses/SetCourse';
import ManageCourseLayout from '../components/ManageCourseLayout';
import { getCourse } from '@/redux/actions/courses/courses';
import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

import Navbar from '../course_structure/components/Navbar';
import { useRouter } from 'next/router';

const faqs = [
  {
    id: 1,
    question: 'Closed captions accessibility checklist',
    answer:
      "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
    checked: false,
    checklist_text: 'Captions in this course meet these guidelines',
  },
  {
    id: 2,
    question: 'Audio content accessibility checklist',
    answer:
      "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
    checked: false,
    checklist_text: 'Audio content in this course meets this guidelines',
  },
  {
    id: 3,
    question: 'Course materials accessibility checklist',
    answer:
      "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
    checked: false,
    checklist_text: 'Materials attached to this course meet these guidelines',
  },
  // More questions...
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Accessibility() {
  const router = useRouter();
  const courseUUID = router.query.courseUUID;

  const myUser = useSelector((state) => state.auth.user);
  const wallet = useSelector((state) => state.auth.wallet);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const dispatch = useDispatch();

  const course = useSelector((state) => state.courses.course);

  const fetchCourse = useCallback(async () => {
    await SetCourseHandle(courseUUID[0], true, 'accessibility');
    dispatch(getCourse(courseUUID));
  }, [dispatch, courseUUID]);

  useEffect(() => {
    if (courseUUID && course && course.details && course.details.accessibility === false) {
      fetchCourse(courseUUID);
    }
  }, [fetchCourse, courseUUID, course]);

  return (
    <div>
      <Navbar user={myUser} course={course} courseUUID={courseUUID} />
      <div className="lg:pt-14 " />
      <ManageCourseLayout
        myUser={myUser}
        isAuthenticated={isAuthenticated}
        course={course}
        wallet={wallet}
        courseUUID={courseUUID}
        title="Accessibility"
        fetchCourse={fetchCourse}
      >
        <section className="w-full p-0 md:p-6">
          <div className="grid md:grid-cols-12">
            <div className="px-8  py-16 md:col-span-7">
              <p className="my-6 text-2xl font-black dark:text-dark-txt text-gray-700">
                As a future Sith Lord, you must understand the importance of ensuring that all
                apprentices have equal access to the knowledge and power of the Dark Side.
              </p>
              <p className=" text-lg font-medium text-gray-700 dark:text-dark-txt-secondary ">
                That is why, when creating our online course, we must take into consideration the
                needs of all learners, including those with disabilities.
              </p>
            </div>
            <div className="bg-white dark:bg-dark-third shadow-featured md:col-span-5">
              <div className="grid h-auto place-items-center p-12 ">
                <img alt="img" src="/assets/img/placeholder/production.png" className="h-32 w-32" />
                <p className="my-6 text-xl font-black dark:text-dark-txt text-gray-700">
                  Enhance your learning
                </p>
                <p className=" text-mg justify-center text-center font-medium dark:text-dark-txt-secondary text-gray-700">
                  Visit our teaching center
                </p>
                <button
                  type="button"
                  className="text-md mt-6 p-3 font-bold border dark:hover:text-dark-accent border-gray-700 hover:bg-gray-50 dark:border-dark-border dark:hover:bg-dark-second dark:text-dark-txt  rounded transition-colors "
                >
                  Teaching center
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full ">
          <div className="">
            <div className="mx-auto px-8 py-8 lg:px-14">
              <p className="text-xl font-bold tracking-tight dark:text-dark-txt text-gray-900 md:text-2xl">
                Accessibility checklist
              </p>
              <div className="mt-2">
                <dl className="">
                  <div className="pt-6 pb-2 ">
                    <dd className="mt-2 md:col-span-7 ">
                      <p className="text-base dark:text-dark-txt-secondary text-gray-700">
                        One way to ensure accessibility is to use an accessibility checklist. This
                        will help us identify any potential barriers to accessibility in our course
                        and take steps to remove them. This includes things like adding alt text to
                        images, providing captions for videos, and making sure the text is high
                        contrast and easy to read.
                      </p>
                    </dd>
                  </div>
                  <div className="pt-6 pb-2 ">
                    <dd className="mt-2 md:col-span-7 ">
                      <p className="text-base dark:text-dark-txt-secondary text-gray-700">
                        My young apprentice, Lord Zenith, as we strive to rule the galaxy of
                        commerce, it is important that our courses are accessible to all forms of
                        alien life. To ensure that our courses are accessible to all, I have created
                        a checklist for you to follow:
                      </p>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>
        <div className="-mb-6 w-full p-8">
          <div className="mx-auto w-full max-w-full sm:pb-12">
            <div className="mx-auto max-w-full dark:divide-dark-border divide-y-2 divide-gray-200">
              <dl className="mt-6 space-y-6 divide-y dark:divide-dark-border divide-gray-200">
                {faqs.map((faq) => (
                  <div key={faq.id}>
                    <Disclosure as="div" key={faq.question} className="pt-6">
                      {({ open }) => (
                        <>
                          <dt className="text-lg">
                            <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-400">
                              <span className="text-xl font-bold dark:text-dark-txt text-gray-900">
                                {faq.question}
                              </span>
                              <span className="ml-6 flex h-7 items-center">
                                <ChevronDownIcon
                                  className={classNames(
                                    open ? '-rotate-180' : 'rotate-0',
                                    'h-6 w-6 transform',
                                  )}
                                  aria-hidden="true"
                                />
                              </span>
                            </Disclosure.Button>
                          </dt>
                          <Disclosure.Panel as="dd" className="mt-2 pr-12">
                            <p className="text-base dark:text-dark-txt-secondary text-gray-500">
                              {faq.answer}
                            </p>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                    <fieldset className="space-y-5">
                      <div className="relative flex items-start">
                        <div className="mt-6 flex h-5 items-center">
                          <input
                            name="checkbox"
                            value={faq.id}
                            type="checkbox"
                            className="h-4 w-4 rounded dark:border-dark-border dark:text-dark-txt border-gray-300 text-gray-900 focus:ring-gray-900"
                          />
                        </div>
                        <div className="ml-3 mt-6 text-sm">
                          <label
                            htmlFor="candidates"
                            className="font-medium dark:text-dark-txt-secondary text-gray-900"
                          >
                            {faq.checklist_text}
                          </label>
                        </div>
                      </div>
                    </fieldset>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </ManageCourseLayout>
    </div>
  );
}
