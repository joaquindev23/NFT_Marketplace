import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SetCourseHandle from '@/api/manage/courses/SetCourse';
import ManageCourseLayout from '../components/ManageCourseLayout';
import { getCourse } from '@/redux/actions/courses/courses';

import Navbar from '../course_structure/components/Navbar';
import { useRouter } from 'next/router';

export default function Film() {
  const router = useRouter();
  const courseUUID = router.query.courseUUID;

  const myUser = useSelector((state) => state.auth.user);
  const wallet = useSelector((state) => state.auth.wallet);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const dispatch = useDispatch();

  const course = useSelector((state) => state.courses.course);

  const fetchCourse = useCallback(async () => {
    await SetCourseHandle(courseUUID[0], true, 'film');
    dispatch(getCourse(courseUUID));
  }, [dispatch, courseUUID]);

  useEffect(() => {
    if (courseUUID && course && course.details && course.details.film === false) {
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
        fetchCourse={fetchCourse}
        title="Film & edit"
      >
        <section className="w-full  p-0 md:p-6">
          <div className="grid md:grid-cols-12">
            <div className="px-8  py-16 md:col-span-7">
              <p className="my-6 text-2xl font-black dark:text-dark-txt text-gray-700">
                Young Lord Zenith, as you journey further down the path of the dark side, the art of
                film and editing will become crucial in your quest for mastery of the ecommerce
                universe.
              </p>
              <p className=" text-lg font-medium dark:text-dark-txt-secondary text-gray-700 ">
                Remember, the power of the force is not only in the striking of a deal, but also in
                the presentation of that deal.
              </p>
            </div>
            <div className="dark:bg-dark-third bg-white shadow-featured md:col-span-5">
              <div className="grid h-auto place-items-center p-12 ">
                <img alt="img" src="/assets/img/placeholder/production.png" className="h-32 w-32" />
                <p className="my-6 text-xl font-black dark:text-dark-txt text-gray-700">
                  You’re in good company
                </p>
                <p className=" text-mg justify-center text-center font-medium dark:text-dark-txt-secondary text-gray-700">
                  Chat and get production help with other Boomslag instructors
                </p>
                <button
                  type="button"
                  className="text-md mt-6 p-3 font-bold border dark:hover:text-dark-accent border-gray-700 hover:bg-gray-50 dark:border-dark-border dark:hover:bg-dark-second dark:text-dark-txt  rounded transition-colors"
                >
                  Join the community
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full ">
          <div className="">
            <div className="mx-auto px-8 py-8 lg:px-14">
              <p className="text-xl font-black tracking-tight dark:text-dark-txt text-gray-900 md:text-2xl">
                Tips
              </p>
              <div className="mt-2">
                <dl className="">
                  <div className="pt-6 pb-2 ">
                    <dt className="text-base font-bold dark:text-dark-txt text-gray-900 md:col-span-5">
                      Firstly, take breaks and review your footage frequently.
                    </dt>
                    <dd className="mt-2 md:col-span-7 ">
                      <p className="text-base text-gray-700 dark:text-dark-txt-secondary">
                        The force can be taxing and you must pace yourself, lest you become
                        overwhelmed by its power. As you review your footage, you will begin to
                        understand the nuances of your own presence on camera and how to best
                        harness it.
                      </p>
                    </dd>
                  </div>
                  <div className="pt-6 pb-2 ">
                    <dt className="text-base font-bold dark:text-dark-txt text-gray-900 md:col-span-5">
                      In addition, building rapport with your audience is vital.
                    </dt>
                    <dd className="mt-2 md:col-span-7 ">
                      <p className="text-base dark:text-dark-txt-secondary text-gray-700">
                        As you speak, you must connect with them on a deeper level, allowing them to
                        feel the weight of your words and the power of your will.
                      </p>
                    </dd>
                  </div>
                  <div className="pt-6 pb-2 ">
                    <dt className="text-base font-bold dark:text-dark-txt text-gray-900 md:col-span-5">
                      Being on camera takes practice, my young apprentice.
                    </dt>
                    <dd className="mt-2 md:col-span-7 ">
                      <p className="text-base dark:text-dark-txt-secondary text-gray-700">
                        The more you film, the more comfortable you will become and the more natural
                        your delivery will be. Embrace your mistakes and use them as opportunities
                        for growth and self-reflection.
                      </p>
                    </dd>
                  </div>
                  <div className="pt-6 pb-2 ">
                    <dt className="text-base font-bold dark:text-dark-txt text-gray-900 md:col-span-5">
                      When editing, be sure to set yourself up for success.
                    </dt>
                    <dd className="mt-2 md:col-span-7 ">
                      <p className="text-base dark:text-dark-txt-secondary text-gray-700">
                        Organize your files and mark the footage that you will use. This will make
                        the editing process much more efficient.
                      </p>
                    </dd>
                  </div>
                  <div className="pt-6 pb-2 ">
                    <dt className="text-base font-bold dark:text-dark-txt text-gray-900 md:col-span-5">
                      Also, create audio marks for yourself.
                    </dt>
                    <dd className="mt-2 md:col-span-7 ">
                      <p className="text-base dark:text-dark-txt-secondary text-gray-700">
                        This will allow you to match your footage with the audio, ensuring a
                        seamless final product.
                      </p>
                    </dd>
                  </div>
                  <div className="pt-6 pb-2 ">
                    <dt className="text-base font-bold dark:text-dark-txt text-gray-900 md:col-span-5">
                      Lastly, when recording screencasts
                    </dt>
                    <dd className="mt-2 md:col-span-7 ">
                      <p className="text-base dark:text-dark-txt-secondary text-gray-700">
                        be sure to clean up your desktop and remove any unnecessary distractions.
                        Remember, you are a Sith Lord and must present yourself as such, with
                        precision and power.
                      </p>
                    </dd>
                  </div>
                  <div className="pt-6 pb-2 ">
                    <dd className="mt-2 md:col-span-7 ">
                      <p className="text-base dark:text-dark-txt-secondary text-gray-700">
                        May the force be with you, Lord Zenith, as you craft and sell your online
                        courses, using the dark side of the force to control the ecommerce universe
                        and make your first million dollars.
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
                      to="/teach-hub/instructors/courses/test-video"
                      className="text-base font-bold text-purple-600 underline underline-offset-4 hover:text-purple-700 md:col-span-5"
                    >
                      Create a test video
                    </Link>
                    <dd className="mt-2 md:col-span-7 ">
                      <p className="text-base text-gray-700">
                        Get feedback before filming your whole course
                      </p>
                    </dd>
                  </div>
                  <div className="pt-6 pb-2 ">
                    <Link
                      to="/teach-hub/instructors/courses/quality-av"
                      className="text-base font-bold text-purple-600 underline underline-offset-4 hover:text-purple-700 md:col-span-5"
                    >
                      Teaching Center: Guide to quality A/V
                    </Link>
                    <dd className="mt-2 md:col-span-7 ">
                      <p className="text-base text-gray-700">Film and edit with confidence</p>
                    </dd>
                  </div>
                  <div className="pt-6 pb-2 ">
                    <Link
                      to="/teach-hub/instructors/courses/trust-and-safety"
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
                </dl>
              </div>
            </div>
          </div>
        </section> */}
      </ManageCourseLayout>
    </div>
  );
}
