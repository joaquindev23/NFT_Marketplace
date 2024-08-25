import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import SetCourseHandle from '@/api/manage/courses/SetCourse';
// import SetCourseHandle from '@/api/manage/courses/SetCourse';
import ManageCourseLayout from '../components/ManageCourseLayout';
import {
  getCourse,
  updateCourseRequisite,
  updateCourseWhatlearnt,
  updateCourseWhoIsFor,
} from '@/redux/actions/courses/courses';
import Navbar from './components/Navbar';
import RequirementsSec from './components/RequirementsSec';
import WhatLearntSec from './components/WhatLearntSec';
import WhoIsForSec from './components/WhoIsForSec';

export default function Goals() {
  const router = useRouter();
  const { courseUUID } = router.query;

  const myUser = useSelector((state) => state.auth.user);
  const wallet = useSelector((state) => state.auth.wallet);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const course = useSelector((state) => state.courses.course);

  const whatLearnt = useSelector((state) => state.courses.whatlearnt);
  const whoIsFor = useSelector((state) => state.courses.whoIsFor);
  const requisites = useSelector((state) => state.courses.requisites);

  const [loading, setLoading] = useState(false);
  const [hasChangesWhatLearnt, setHasChangesWhatLearnt] = useState(false);
  const [hasChangesRequisite, setHasChangesRequisite] = useState(false);
  const [hasChangesWhoIsFor, setHasChangesWhoIsFor] = useState(false);

  const dispatch = useDispatch();
  const fetchCourse = useCallback(async () => {
    dispatch(getCourse(courseUUID));
  }, [dispatch, courseUUID]);

  useEffect(() => {
    if (courseUUID) {
      fetchCourse(courseUUID);
    }
  }, [fetchCourse, courseUUID]);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    if (course && course.details && course.details.goals === false) {
      await SetCourseHandle(courseUUID[0], true, 'goals');
    }

    const promises = [];

    if (hasChangesWhatLearnt) {
      promises.push(dispatch(updateCourseWhatlearnt(courseUUID[0], whatLearnt)));
    }

    if (hasChangesWhoIsFor) {
      promises.push(dispatch(updateCourseWhoIsFor(courseUUID[0], whoIsFor)));
    }

    if (hasChangesRequisite) {
      promises.push(dispatch(updateCourseRequisite(courseUUID[0], requisites)));
    }

    await Promise.all(promises);

    setLoading(false);
    setHasChangesWhatLearnt(false);
    setHasChangesRequisite(false);
    setHasChangesWhoIsFor(false);
  }, [
    hasChangesWhatLearnt,
    hasChangesWhoIsFor,
    hasChangesRequisite,
    courseUUID,
    whatLearnt,
    whoIsFor,
    requisites,
    dispatch,
    course,
  ]);

  return (
    <div>
      <Navbar
        user={myUser}
        isAuthenticated={isAuthenticated}
        course={course}
        courseUUID={courseUUID}
        loading={loading}
        setLoading={setLoading}
        fetchCourse={fetchCourse}
        hasChangesRequisite={hasChangesRequisite}
        hasChangesWhoIsFor={hasChangesWhoIsFor}
        hasChangesWhatLearnt={hasChangesWhatLearnt}
        handleSubmit={handleSubmit}
      />
      <div className="lg:pt-14 " />

      <ManageCourseLayout
        myUser={myUser}
        isAuthenticated={isAuthenticated}
        course={course}
        courseUUID={courseUUID}
        fetchCourse={fetchCourse}
        wallet={wallet}
        title="Intended learners"
      >
        <div className="space-y-4">
          <section className="w-full  p-0 md:p-6">
            <div className="grid md:grid-cols-12">
              <div className="px-8  py-16 md:col-span-7">
                <p className="my-6 text-2xl font-black dark:text-dark-txt text-gray-700">
                  Ahoy, Lord Zenith! I be Captain Vader, and I welcome ye to the world of ecommerce
                  and the dark side of the force, matey.
                </p>
                <p className="text-lg font-medium dark:text-dark-txt-secondary text-gray-700">
                  As yer trusty mentor, I'll be guidin' ye on yer journey to plunderin' yer first
                  million doubloons. We be usin' the power of the force to create and sell online
                  courses and subscriptions, as well as other treasures like physical loot and video
                  games. The key to success in ecommerce be knowin' yer audience and providin' 'em
                  with what they be cravin' and needin'.
                </p>
              </div>
              <div className=" md:col-span-5">
                <div className="grid h-auto place-items-center dark:bg-dark-third bg-white p-12 shadow-featured">
                  <img
                    alt="img"
                    src="/assets/img/placeholder/darth-vader.png"
                    className="h-32 w-32"
                  />
                  <p className="my-6 text-xl font-black text-gray-700 dark:text-dark-txt">
                    Your journey begins
                  </p>
                  <p className=" text-mg justify-center text-center font-medium dark:text-dark-txt-secondary text-gray-700">
                    Tips and guidelines for identifying a target audience
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

          <section className="w-full py-4">
            <div className="">
              <div className="mx-auto px-8  lg:px-14">
                <p className="text-xl font-black tracking-tight dark:text-dark-txt text-gray-900 md:text-2xl">
                  Listen to me carefully my young apprentice...
                </p>
                <div className="mt-2">
                  <dl className="">
                    <div className="pt-6 pb-2 ">
                      <dt className="text-base font-bold dark:text-dark-txt text-gray-900 md:col-span-5">
                        Analytics 'n Persuasion.
                      </dt>
                      <dd className="mt-2 md:col-span-7 ">
                        <p className="text-base text-gray-700 dark:text-dark-txt-secondary">
                          As a Zenith, ye be learnin' to use the power of persuasion 'n manipulation
                          to drive sales 'n increase booty. Ye'll also learn how to use data 'n
                          analytics to track yer progress and make informed decisions.
                        </p>
                      </dd>
                    </div>
                    <div className="pt-6 pb-2 ">
                      <dt className="text-base font-bold dark:text-dark-txt text-gray-900 md:col-span-5">
                        It'll be a hard journey.
                      </dt>
                      <dd className="mt-2 md:col-span-7 ">
                        <p className="text-base text-gray-700 dark:text-dark-txt-secondary">
                          But remember, Lord Zenith, the path to power 'n wealth be not always an
                          easy one. There'll be obstacles 'n challenges along the way. But with
                          patience, dedication, 'n the guidance of the force, ye'll overcome 'em.
                        </p>
                      </dd>
                    </div>
                    <div className="pt-6 pb-2 ">
                      <dd className="mt-2 md:col-span-7 ">
                        <p className="text-base text-gray-700 dark:text-dark-txt-secondary">
                          May the force be with ye, Lord Zenith, on yer journey to becomin' a
                          successful ecommerce Sith Lord.
                        </p>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </section>

          <section className="w-full ">
            <div className="mx-auto px-8 lg:px-14">
              <div className="pb-4">
                <div className="space-y-4 py-4">
                  <WhoIsForSec
                    setHasChangesWhoIsFor={setHasChangesWhoIsFor}
                    loading={loading}
                    course={course}
                    courseUUID={courseUUID}
                  />
                  <WhatLearntSec
                    setHasChangesWhatLearnt={setHasChangesWhatLearnt}
                    loading={loading}
                    course={course}
                    courseUUID={courseUUID}
                  />
                  <RequirementsSec
                    setHasChangesRequisite={setHasChangesRequisite}
                    loading={loading}
                    course={course}
                    courseUUID={courseUUID}
                  />
                </div>
                <p
                  className="dark:text-dark-txt-secondary
                "
                >
                  Finally, it is important to remember that creating an online course is an art,
                  much like using the force. It requires patience, dedication and attention to
                  detail. Stay true to your purpose and the force will guide you.
                </p>
              </div>
            </div>
          </section>
        </div>
      </ManageCourseLayout>
    </div>
  );
}
