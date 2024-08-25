import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CircleLoader } from 'react-spinners';
import FetchInstructorSections from '@/api/FetchInstructorSections';
import ManageCourseLayout from '../components/ManageCourseLayout';
import { getCourse } from '@/redux/actions/courses/courses';
import { dismissCurriculumAlert } from '@/redux/actions/create/create';
import Navbar from './components/Navbar';
import SectionsContainerSec from './components/SectionsContainerSec';
import { useRouter } from 'next/router';

export default function Curriculum() {
  const router = useRouter();
  const courseUUID = router.query.courseUUID;

  const [loading, setLoading] = useState(false);

  const myUser = useSelector((state) => state.auth.user);
  const wallet = useSelector((state) => state.auth.wallet);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const dispatch = useDispatch();

  const course = useSelector((state) => state.courses.course);
  const [sections, setSections] = useState([]);

  const curriculumAlert = useSelector((state) => state.create.curriculum_alert);

  useEffect(() => {
    if (courseUUID) {
      async function fetchData() {
        setLoading(true);
        const sectionsData = await FetchInstructorSections(courseUUID);
        if (sectionsData) {
          setSections(sectionsData);
        }
        setLoading(false);
      }
      fetchData();
    }
  }, [courseUUID]);

  const fetchCourse = useCallback(() => {
    dispatch(getCourse(courseUUID));
  }, [dispatch, courseUUID]);

  useEffect(() => {
    if (courseUUID) {
      fetchCourse(courseUUID);
    }
  }, [fetchCourse, courseUUID]);

  return (
    <div>
      <Navbar
        sections={sections}
        course={course}
        courseUUID={courseUUID}
        fetchCourse={fetchCourse}
        loading={loading}
        setLoading={setLoading}
      />
      <div className="lg:pt-14 " />
      <ManageCourseLayout
        myUser={myUser}
        isAuthenticated={isAuthenticated}
        course={course}
        wallet={wallet}
        courseUUID={courseUUID}
        title="Curriculum"
        fetchCourse={fetchCourse}
      >
        {curriculumAlert ? (
          <div className="-mb-6 w-full p-8">
            <div className="w-full dark:bg-dark-third bg-white px-6 pt-6 shadow-button">
              <div className="flex">
                <ExclamationCircleIcon className="mr-4 h-6 w-6" />
                <p className="text-md inline-flex font-bold dark:text-dark-txt-secondary">
                  Here’s where you add course content—like lectures, course sections, assignments,
                  and more. Click a + icon on the left to get started.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  dispatch(dismissCurriculumAlert());
                }}
                className="ml-8 mt-4 mb-6 bg-black py-3 px-5 text-sm font-bold  text-white hover:bg-gray-900"
              >
                Dismiss
              </button>
            </div>
          </div>
        ) : (
          <div />
        )}

        <div className="border-b dark:border-dark-border border-gray-200 pb-5 pr-12 pl-8">
          <p className="text-md mt-6 max-w-4xl font-medium text-gray-700 dark:text-dark-txt-secondary">
            Start putting together your course by creating sections, lectures and practice (quizzes,
            coding exercises and assignments).
          </p>
          <p className="text-md mt-2 max-w-4xl font-medium text-gray-700 dark:text-dark-txt-secondary">
            If you plan to make your course available for free, the entire duration of video content
            must be less than 2 hours.
          </p>
        </div>

        {loading ? (
          <div className="grid w-full place-items-center py-12">
            <CircleLoader
              className="items-center justify-center text-center"
              loading={loading}
              size={35}
              color="#1c1d1f"
            />
          </div>
        ) : (
          <SectionsContainerSec
            sections={sections}
            setSections={setSections}
            FetchInstructorSections={FetchInstructorSections}
            courseUUID={courseUUID}
          />
        )}
      </ManageCourseLayout>
    </div>
  );
}
