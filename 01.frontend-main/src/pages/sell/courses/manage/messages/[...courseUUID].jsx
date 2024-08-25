import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import SetCourseHandle from '@/api/manage/courses/SetCourse';
import ManageCourseLayout from '../components/ManageCourseLayout';
import Navbar from './components/Navbar';
import {
  getCourse,
  updateCourseCongratsMessage,
  updateCourseWelcomeMessage,
} from '@/redux/actions/courses/courses';
import WelcomeMessageSec from './components/WelcomeMessageSec';

export default function Messages() {
  const router = useRouter();
  const { courseUUID } = router.query;

  const myUser = useSelector((state) => state.auth.user);
  const wallet = useSelector((state) => state.auth.wallet);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const course = useSelector((state) => state.courses.course);
  const details = course && course.details;
  const [loading, setLoading] = useState(false);
  const [hasChangesWelcomeMessage, setHasChangesWelcomeMessage] = useState(false);
  const [hasChangesCongratsMessage, setHasChangesCongratsMessage] = useState(false);

  const dispatch = useDispatch();

  const fetchCourse = useCallback(async () => {
    dispatch(getCourse(courseUUID));
  }, [dispatch, courseUUID]);

  useEffect(() => {
    if (courseUUID) {
      fetchCourse(courseUUID);
    }
  }, [fetchCourse, courseUUID]);

  const [welcomeMessage, setWelcomeMessage] = useState((details && details.welcome_message) || '');
  const [congratsMessage, setCongratsMessage] = useState(
    (details && details.congrats_message) || '',
  );

  const handleSubmit = async () => {
    setLoading(true);

    if (courseUUID && course && course.details && course.details.allow_messages === false) {
      await SetCourseHandle(courseUUID[0], true, 'messages');
    }
    const promises = [];

    if (hasChangesWelcomeMessage) {
      promises.push(dispatch(updateCourseWelcomeMessage(courseUUID[0], welcomeMessage)));
    }
    if (hasChangesCongratsMessage) {
      promises.push(dispatch(updateCourseCongratsMessage(courseUUID[0], congratsMessage)));
    }

    await Promise.all(promises);

    // setIsSaved(true);
    setLoading(false);
    if (hasChangesWelcomeMessage) {
      setHasChangesWelcomeMessage(false);
    }
    if (hasChangesCongratsMessage) {
      setHasChangesCongratsMessage(false);
    }
  };

  const [originalWelcomeMessage, setOriginalWelcomeMessage] = useState('');
  useEffect(() => {
    setWelcomeMessage(details && details.welcome_message ? details.welcome_message : '');
    setOriginalWelcomeMessage(JSON.parse(JSON.stringify(welcomeMessage)));
    // eslint-disable-next-line
  }, [course]);

  useEffect(() => {
    if (!_.isEqual(originalWelcomeMessage, welcomeMessage)) {
      setHasChangesWelcomeMessage(true);
    } else {
      setHasChangesWelcomeMessage(false);
    }
  }, [welcomeMessage, originalWelcomeMessage, setHasChangesWelcomeMessage]);

  const [originalCongratsMessage, setOriginalCongratsMessage] = useState('');
  useEffect(() => {
    setCongratsMessage(details && details.congrats_message ? details.congrats_message : '');
    setOriginalCongratsMessage(JSON.parse(JSON.stringify(congratsMessage)));
    // eslint-disable-next-line
  }, [course]);

  useEffect(() => {
    if (!_.isEqual(originalCongratsMessage, congratsMessage)) {
      setHasChangesCongratsMessage(true);
    } else {
      setHasChangesCongratsMessage(false);
    }
  }, [congratsMessage, originalCongratsMessage, setHasChangesCongratsMessage]);

  return (
    <div>
      <Navbar
        user={myUser}
        isAuthenticated={isAuthenticated}
        course={course && course}
        courseUUID={courseUUID}
        loading={loading}
        handleSubmit={handleSubmit}
        setLoading={setLoading}
        hasChangesWelcomeMessage={hasChangesWelcomeMessage}
        hasChangesCongratsMessage={hasChangesCongratsMessage}
      />
      <div className="lg:pt-14 " />
      <ManageCourseLayout
        wallet={wallet}
        myUser={myUser}
        isAuthenticated={isAuthenticated}
        course={course}
        courseUUID={courseUUID}
        fetchCourse={fetchCourse}
        title="Messages"
      >
        <div className="">
          <p className="text-md mt-2 max-w-4xl font-medium text-gray-700 dark:text-dark-txt-secondary">
            Write messages to your students (optional) that will be sent automatically when they
            join or complete your course to encourage students to engage with course content. If you
            do not wish to send a welcome or congratulations message, leave the text box blank.
          </p>
        </div>
        <WelcomeMessageSec
          welcomeMessage={welcomeMessage}
          setWelcomeMessage={setWelcomeMessage}
          congratsMessage={congratsMessage}
          setCongratsMessage={setCongratsMessage}
          // sanitizedWelcomeMessage={sanitizedWelcomeMessage}
          // sanitizedCongratsMessage={sanitizedCongratsMessage}
        />
      </ManageCourseLayout>
    </div>
  );
}
