import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DeleteCourse from '@/api/manage/courses/Delete';
import { ToastSuccess } from '@/components/ToastSuccess';
import ManageCourseLayout from '../components/ManageCourseLayout';
import { getCourse, updateCourseStatus } from '@/redux/actions/courses/courses';
import Navbar from '../course_structure/components/Navbar';
import Details from './components/Details';
import LoadingMoon from '@/components/loaders/LoadingMoon';

export default function Settings() {
  const router = useRouter();
  const { courseUUID } = router.query;

  const myUser = useSelector((state) => state.auth.user);
  const wallet = useSelector((state) => state.auth.wallet);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const course = useSelector((state) => state.courses.course);
  const details = course && course.details;

  const dispatch = useDispatch();

  const fetchCourse = useCallback(async () => {
    dispatch(getCourse(courseUUID));
  }, [dispatch, courseUUID]);

  useEffect(() => {
    if (courseUUID) {
      fetchCourse(courseUUID);
    }
  }, [fetchCourse, courseUUID]);

  const [canPublish, setCanPublish] = useState(false);
  useEffect(() => {
    if (details) {
      if (
        details.goals &&
        details.course_structure &&
        details.setup &&
        details.film &&
        details.curriculum &&
        // details.captions&&
        details.accessibility &&
        details.landing_page &&
        details.price &&
        details.promotions &&
        details.allow_messages &&
        details.nft_address &&
        details.nft_address !== '0' &&
        details.nft_address !== null
      ) {
        setCanPublish(true);
      } else {
        setCanPublish(false);
      }
    }
  }, [details]);

  const canDelete = details && details.can_delete;
  const [loading, setLoading] = useState(false);
  async function handleDelete() {
    if (canDelete) {
      setLoading(true);
      const res = await DeleteCourse(courseUUID[0]);
      ToastSuccess(res);
      setLoading(false);
      router.push('/sell/courses/');
    }
  }

  const handlePublish = async () => {
    if (canPublish) {
      if (details.nft_address !== '0') {
        setLoading(true);
        if (details.status === 'published') {
          await dispatch(updateCourseStatus(courseUUID[0], false));
        } else {
          await dispatch(updateCourseStatus(courseUUID[0], true));
        }
        await fetchCourse();
        setLoading(false);
      }
    }
  };

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
        title="Settings"
      >
        <div className="border-b dark:border-dark-border border-gray-200 pb-5">
          <h2 className="mt-6 text-lg font-bold dark:text-dark-txt">Course Status</h2>
          <p className="text-md mt-2 max-w-4xl font-medium dark:text-dark-txt-secondary text-gray-700">
            {details && details.status === 'published' ? (
              <>This course is published on the boomslag marketplace.</>
            ) : (
              <>This course is not published on the boomslag marketplace.</>
            )}
          </p>
          <div className="mt-6 grid grid-cols-4">
            {loading ? (
              <button
                type="button"
                className=" w-full border dark:border-dark-border border-gray-900 py-3 font-bold dark:text-dark-txt-secondary text-dark hover:border-gray-500 hover:text-gray-500"
              >
                <LoadingMoon size={20} color="#0D1117" />{' '}
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePublish}
                disabled={!canPublish}
                className=" w-full border dark:border-dark-border border-gray-900 py-3 font-bold dark:text-dark-txt-secondary text-dark hover:border-gray-500 hover:text-gray-500"
              >
                {details && details.status === 'published' ? 'Draft' : 'Publish'} Course
              </button>
            )}
            <span className="col-span-3 ml-4 dark:text-dark-txt-secondary">
              New students cannot find your course via search, but existing students can still
              access content.
            </span>
          </div>
          <div className="mt-6 grid grid-cols-4">
            {loading ? (
              <button
                type="button"
                className=" w-full border border-gray-900 py-3 font-bold text-dark hover:border-gray-500 hover:text-gray-500"
              >
                <LoadingMoon size={20} color="#0D1117" />
              </button>
            ) : (
              <button
                type="submit"
                onClick={handleDelete}
                disabled={!canDelete}
                className=" w-full border border-gray-900 py-3 font-bold text-dark hover:border-gray-500 hover:text-gray-500"
              >
                Delete
              </button>
            )}
            <span className="col-span-3 ml-4">
              We promise students lifetime access, so courses cannot be deleted after students have
              enrolled.
            </span>
          </div>
        </div>
        <div className="mt-4">
          <Details details={details} />
        </div>
      </ManageCourseLayout>
    </div>
  );
}
