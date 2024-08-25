import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SetCourseHandle from '@/api/manage/courses/SetCourse';
import ManageCourseLayout from '../components/ManageCourseLayout';
import { getCourse } from '@/redux/actions/courses/courses';
import Link from 'next/link';
import Navbar from './components/Navbar';
import { useRouter } from 'next/router';

export default function Structure() {
  const router = useRouter();
  const courseUUID = router.query.courseUUID;

  const myUser = useSelector((state) => state.auth.user);
  const wallet = useSelector((state) => state.auth.wallet);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const course = useSelector((state) => state.courses.course);

  const dispatch = useDispatch();

  const fetchCourse = useCallback(async () => {
    await SetCourseHandle(courseUUID[0], true, 'structure');
    dispatch(getCourse(courseUUID));
  }, [dispatch, courseUUID]);

  useEffect(() => {
    if (courseUUID && course && course.details && course.details.course_structure === false) {
      fetchCourse(courseUUID);
    }
  }, [fetchCourse, courseUUID, course]);

  return (
    <>
      <Navbar user={myUser} course={course} courseUUID={courseUUID} />
      <div className="lg:pt-14 " />
      <ManageCourseLayout
        wallet={wallet}
        myUser={myUser}
        isAuthenticated={isAuthenticated}
        course={course}
        courseUUID={courseUUID}
        fetchCourse={fetchCourse}
        title="Course structure"
      >
        <section className="w-full  p-0 md:p-6">
          <div className="grid md:grid-cols-12">
            <div className="px-8  py-16 md:col-span-7">
              <p className="my-6 text-2xl font-black dark:text-dark-txt text-gray-700">
                Matey Zenith, as a Sith Cap'n, 'tis crucial to chart a course for what our learners
                be achievin' in this here venture.
              </p>
              <p className=" text-lg font-medium dark:text-dark-txt-secondary text-gray-700 ">
                These aims, also be known as learnin' objectives or outcomes, will steer the
                framework of our curriculum and help us fathom what content to add to our lessons.
              </p>
            </div>
            <div className="dark:bg-dark-third bg-white md:col-span-5">
              <div className="grid h-auto place-items-center p-12 shadow-featured">
                <img alt="img" src="/assets/img/placeholder/bookshelf.png" className="h-32 w-32" />
                <p className="my-6 text-xl font-black dark:text-dark-txt text-gray-700">
                  Our library of resources
                </p>
                <p className=" text-mg justify-center text-center font-medium dark:text-dark-txt-secondary text-gray-700">
                  Tips and guides to structuring a course students love
                </p>
                <Link
                  href="/blog/teaching_center"
                  type="button"
                  className="text-md mt-6 p-3 font-bold border dark:hover:text-dark-accent border-gray-700 hover:bg-gray-50 dark:border-dark-border dark:hover:bg-dark-second dark:text-dark-txt  rounded transition-colors"
                >
                  Teaching center
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full ">
          <div className="">
            <div className="mx-auto px-8 py-8 lg:px-14">
              <h2 className="text-xl font-black tracking-tight dark:text-dark-txt text-gray-900 md:text-2xl">
                Tips
              </h2>
              <div className="mt-2">
                <dl className="">
                  <div className="pt-6 pb-2 ">
                    <dt className="text-base font-bold dark:text-dark-txt text-gray-900 md:col-span-5">
                      Create an outline.
                    </dt>
                    <dd className="mt-2 md:col-span-7 ">
                      <p className="text-base text-gray-700 dark:text-dark-txt-secondary">
                        To create a formidable course structure, we must first create an outline,
                        much like the blueprint of a Death Star. Decide what skills we will teach
                        and how we will teach them. Group related lectures into sections, each one
                        like a chamber of the dark side, with at least 3 lectures and including at
                        least one assignment or practical activity. This will aid our learners to
                        understand the content and apply it to their real-world scenarios.
                      </p>
                    </dd>
                  </div>
                  <div className="pt-6 pb-2 ">
                    <dt className="text-base font-bold dark:text-dark-txt text-gray-900 md:col-span-5">
                      Create momentum.
                    </dt>
                    <dd className="mt-2 md:col-span-7 ">
                      <p className="text-base text-gray-700 dark:text-dark-txt-secondary">
                        To create momentum and capture our learners attention, we must make an
                        introduction section that gives them something to be excited about in the
                        first 10 minutes, like a sneak peek of the power they will soon wield.
                      </p>
                    </dd>
                  </div>
                  <div className="pt-6 pb-2 ">
                    <dt className="text-base font-bold dark:text-dark-txt text-gray-900 md:col-span-5">
                      Clear learning objective.
                    </dt>
                    <dd className="mt-2 md:col-span-7 ">
                      <p className="text-base text-gray-700 dark:text-dark-txt-secondary">
                        Each section must have a clear learning objective, like a target for our
                        lightsaber. Introduce each section by describing the section&apos;s goal and
                        why it’s important. Give lectures and sections titles that reflect their
                        content and have a logical flow, like a map through the galaxy.
                      </p>
                    </dd>
                  </div>
                  <div className="pt-6 pb-2 ">
                    <dt className="text-base font-bold dark:text-dark-txt text-gray-900 md:col-span-5">
                      Lectures must cover one concept.
                    </dt>
                    <dd className="mt-2 md:col-span-7 ">
                      <p className="text-base text-gray-700 dark:text-dark-txt-secondary">
                        Lectures must cover one concept, like a single blast from a blaster. A good
                        lecture length is 2-7 minutes, to keep students interested and aid them in
                        studying in short bursts. Cover a single topic in each lecture so learners
                        can easily find and re-watch them later, like a memory in the holocron.
                      </p>
                    </dd>
                  </div>
                  <div className="pt-6 pb-2 ">
                    <dt className="text-base font-bold dark:text-dark-txt text-gray-900 md:col-span-5">
                      Mix and match lecture types.
                    </dt>
                    <dd className="mt-2 md:col-span-7 ">
                      <p className="text-base text-gray-700 dark:text-dark-txt-secondary">
                        To keep our learners engaged, we must mix and match our lecture types.
                        Alternate between filming ourselves, our screen, and slides or other
                        visuals. Showing ourselves can help learners feel connected to our teachings
                        and the force.
                      </p>
                    </dd>
                  </div>
                  <div className="pt-6 pb-2 ">
                    <dt className="text-base font-bold dark:text-dark-txt text-gray-900 md:col-span-5">
                      Practice activities.
                    </dt>
                    <dd className="mt-2 md:col-span-7 ">
                      <p className="text-base text-gray-700 dark:text-dark-txt-secondary">
                        Practice activities create hands-on learning, like training on the holodeck.
                        Help learners apply our lessons to their real world with projects,
                        assignments, coding exercises, or worksheets, like simulations of the
                        battles to come. Remember, the force is not just about knowledge but also
                        practice, and the more you practice the more powerful you become.
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
                    See the{' '}
                    <Link
                      className="text-purple-700 underline underline-offset-4 hover:text-purple-800"
                      to="/teach-hub/instructors/courses/requirements"
                    >
                      complete list
                    </Link>{' '}
                    of course quality requirements
                  </li>
                  <li className="px-4 py-2 sm:px-0">
                    Your course must have at least five lectures
                  </li>
                  <li className="px-4 py-2 sm:px-0">
                    All lectures must add up to at least 30+ minutes of total video
                  </li>
                  <li className="px-4 py-2 sm:px-0">
                    Your course is composed of valuable educational content and free of promotional
                    or distracting materials
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
                  <div className="pt-6 pb-2 ">
                    <Link
                      to="/teach-hub/instructors/community"
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
                      to="/courses/how-to-create-an-online-course"
                      className="text-base font-bold text-purple-600 underline underline-offset-4 hover:text-purple-700 md:col-span-5"
                    >
                      Official Boomslag Course: How to Create an Online Course
                    </Link>
                    <dd className="mt-2 md:col-span-7 ">
                      <p className="text-base text-gray-700">
                        Learn about course creation from the Boomslag Instructor Team and
                        experienced instructors
                      </p>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section> */}
      </ManageCourseLayout>
    </>
  );
}
