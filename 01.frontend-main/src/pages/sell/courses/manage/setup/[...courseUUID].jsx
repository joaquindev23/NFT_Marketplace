import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SetCourseHandle from '@/api/manage/courses/SetCourse';
import ManageCourseLayout from '../components/ManageCourseLayout';
import { getCourse } from '@/redux/actions/courses/courses';

import Navbar from '../course_structure/components/Navbar';
import { useRouter } from 'next/router';

export default function Setup() {
  const router = useRouter();
  const courseUUID = router.query.courseUUID;

  const myUser = useSelector((state) => state.auth.user);
  const wallet = useSelector((state) => state.auth.wallet);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const course = useSelector((state) => state.courses.course);

  const dispatch = useDispatch();

  const fetchCourse = useCallback(async () => {
    await SetCourseHandle(courseUUID[0], true, 'setup');

    dispatch(getCourse(courseUUID));
  }, [dispatch, courseUUID]);

  useEffect(() => {
    if (courseUUID && course && course.details && course.details.setup === false) {
      fetchCourse(courseUUID);
    }
  }, [fetchCourse, courseUUID, course]);

  return (
    <div>
      <Navbar user={myUser} course={course} courseUUID={courseUUID} />
      <div className="lg:pt-14 " />
      <ManageCourseLayout
        wallet={wallet}
        myUser={myUser}
        isAuthenticated={isAuthenticated}
        fetchCourse={fetchCourse}
        course={course}
        courseUUID={courseUUID}
        title="Setup & test video"
      >
        <section className="w-full p-0 md:p-6">
          <div className="grid md:grid-cols-12">
            <div className="px-8  py-16 md:col-span-7">
              <p className="my-6 text-2xl font-black dark:text-dark-txt text-gray-700">
                As we structure your course, we must first set clear goals for what our learners
                will accomplish.
              </p>
              <p className=" text-lg font-medium dark:text-dark-txt-secondary text-gray-700 ">
                These goals will guide us in determining the content to include in the course and
                how to teach it to aid in achieving success.
              </p>
            </div>
            <div className="dark:bg-dark-third bg-white md:col-span-5">
              <div className="grid h-auto place-items-center p-12 shadow-featured">
                <img alt="img" src="/assets/img/placeholder/production.png" className="h-32 w-32" />
                <p className="my-6 text-xl font-black dark:text-dark-txt text-gray-700">
                  Free expert video help
                </p>
                <p className=" text-mg justify-center text-center dark:text-dark-txt-secondary font-medium text-gray-700">
                  Get personalized advice on your audio and video
                </p>
                <button
                  type="button"
                  className="text-md mt-6 p-3 font-bold border dark:hover:text-dark-accent border-gray-700 hover:bg-gray-50 dark:border-dark-border dark:hover:bg-dark-second dark:text-dark-txt  rounded transition-colors"
                >
                  Create a test video
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full ">
          <div className="">
            <div className="mx-auto px-8 py-8 lg:px-14">
              <p className="text-xl font-bold tracking-tight text-gray-900 md:text-2xl">Tips</p>
              <div className="mt-2">
                <dl className="">
                  <div className="pt-6 pb-2 ">
                    <dt className="text-base font-bold dark:text-dark-txt text-gray-900 md:col-span-5">
                      Outline skills to be taught.
                    </dt>
                    <dd className="mt-2 md:col-span-7 ">
                      <p className="text-base dark:text-dark-txt-secondary text-gray-700">
                        Next, we will create an outline of the skills to be taught and how they will
                        be taught. We will group related lectures into sections, with each section
                        having at least three lectures and one assignment or practical activity.
                        This structure will provide a clear and logical flow for our learners.
                      </p>
                    </dd>
                  </div>
                  <div className="pt-6 pb-2 ">
                    <dt className="text-base font-bold dark:text-dark-txt text-gray-900 md:col-span-5">
                      Introduce yourself.
                    </dt>
                    <dd className="mt-2 md:col-span-7 ">
                      <p className="text-base dark:text-dark-txt-secondary text-gray-700">
                        As we begin our course, it is important to create momentum and introduce
                        ourselves to our learners. This can be done by giving them something
                        exciting to look forward to within the first 10 minutes of the course. Each
                        section should have a clear learning objective, and lectures should cover
                        one concept at a time to keep our learners engaged and focused.
                      </p>
                    </dd>
                  </div>
                  <div className="pt-6 pb-2 ">
                    <dt className="text-base font-bold dark:text-dark-txt text-gray-900 md:col-span-5">
                      Equipment can be simple.
                    </dt>
                    <dd className="mt-2 md:col-span-7 ">
                      <p className="text-base dark:text-dark-txt-secondary text-gray-700">
                        A smartphone camera can capture HD video and audio can be recorded on
                        another phone or external microphone. The most important piece of equipment
                        is a good microphone, which can be easily obtained at an affordable price.
                      </p>
                    </dd>
                  </div>
                  <div className="pt-6 pb-2 ">
                    <dt className="text-base font-bold dark:text-dark-txt text-gray-900 md:col-span-5">
                      Make a studio.
                    </dt>
                    <dd className="mt-2 md:col-span-7 ">
                      <p className="text-base dark:text-dark-txt-secondary text-gray-700">
                        To create a professional studio, clean up the background and arrange props.
                        Lighting should be three-point lighting, with two lamps in front and one
                        behind aimed at the background.
                      </p>
                    </dd>
                  </div>
                  <div className="pt-6 pb-2 ">
                    <dt className="text-base font-bold dark:text-dark-txt text-gray-900 md:col-span-5">
                      Reduce noise and echo.
                    </dt>
                    <dd className="mt-2 md:col-span-7 ">
                      <p className="text-base dark:text-dark-txt-secondary text-gray-700">
                        To reduce noise and echo, turn off fans or air vents and record at a time
                        when it is quiet.
                      </p>
                    </dd>
                  </div>
                  <div className="pt-6 pb-2 ">
                    <dt className="text-base font-bold dark:text-dark-txt text-gray-900 md:col-span-5">
                      Be creative.
                    </dt>
                    <dd className="mt-2 md:col-span-7 ">
                      <p className="text-base dark:text-dark-txt-secondary text-gray-700">
                        Finally, be creative and have fun with it, our learners will not see behind
                        the scenes, and we can make a great course. Remember, Lord Zenith, the force
                        is strong with you, and together we will achieve great success in ecommerce.
                      </p>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>

        {/* <section className="w-full ">
          <div className="">
            <div className="mx-auto py-2 px-8 pt-8 lg:px-14 ">
              <h2 className="pb-4 text-xl font-black tracking-tight text-gray-900 md:text-2xl">
                Requirements
              </h2>
              <div className="mt-2">
                <ul className="list-disc px-4">
                  <li className="px-4 py-2 sm:px-0">
                    Film and export in HD to create videos of at least 720p, or 1080p if possible
                  </li>
                  <li className="px-4 py-2 sm:px-0">
                    Audio should come out of both the left and right channels and be synced to your
                    video
                  </li>
                  <li className="px-4 py-2 sm:px-0">
                    Audio should be free of echo and background noise so as not to be distracting to
                    students
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section> */}

        {/* <section className="w-full ">
          <div className="">
            <div className="mx-auto py-12 px-8 lg:py-16 lg:px-14">
              <h2 className="text-xl font-black tracking-tight text-gray-900 md:text-2xl">
                Resources
              </h2>
              <div className="mt-2">
                <dl className="">
                  <div className="pt-6 pb-2 ">
                    <Link
                      href="/teach-hub/instructors/courses/trust-and-safety"
                      className="text-base font-bold text-purple-600 underline underline-offset-4 hover:text-purple-700 md:col-span-5"
                    >
                      Trust & Safety
                    </Link>
                    <dd className="mt-2 md:col-span-7 ">
                      <p className="text-base text-gray-700">
                        Our policies for instructors and students
                      </p>
                    </dd>
                  </div>
                  <div className="pt-6 pb-2 ">
                    <Link
                      href="/teach-hub/instructors/community"
                      className="text-base font-bold text-purple-600 underline underline-offset-4 hover:text-purple-700 md:col-span-5"
                    >
                      Join the instructor community
                    </Link>
                    <dd className="mt-2 md:col-span-7 ">
                      <p className="text-base text-gray-700">
                        A place to connect with other instructors
                      </p>
                    </dd>
                  </div>
                  <div className="pt-6 pb-2 ">
                    <Link
                      href="/teach-hub/instructors/courses/home-studio"
                      className="text-base font-bold text-purple-600 underline underline-offset-4 hover:text-purple-700 md:col-span-5"
                    >
                      Teaching Center: Guide to equipment
                    </Link>
                    <dd className="mt-2 md:col-span-7 ">
                      <p className="text-base text-gray-700">Make a home studio on a budget</p>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section> */}
      </ManageCourseLayout>
    </div>
  );
}
