import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { onchangeCourseTaught } from '@/redux/actions/courses/courses';

export default function TaughtSec({ setHasChangesTaught }) {
  const dispatch = useDispatch();

  const course = useSelector((state) => state.courses.course);
  const details = course && course.details;

  const reduxTaught = useSelector((state) => state.courses.taught);
  const [taught, setTaught] = useState('');

  const [originalTaught, setOriginalTaught] = useState('');
  useEffect(() => {
    setTaught(details && details.taught ? details.taught : reduxTaught);
    setOriginalTaught(JSON.parse(JSON.stringify(taught)));
    // eslint-disable-next-line
  }, [course]);

  useEffect(() => {
    if (!_.isEqual(originalTaught, taught)) {
      setHasChangesTaught(true);
    } else {
      setHasChangesTaught(false);
    }
  }, [taught, originalTaught, setHasChangesTaught]);

  return (
    <div>
      <span className="text-md mb-2 block font-bold dark:text-dark-txt text-gray-900">
        What is primarily taught in this course?
      </span>
      <div className="relative mt-1 ">
        <input
          type="text"
          value={taught}
          maxLength={60}
          onChange={(e) => {
            setTaught(e.target.value);
            dispatch(onchangeCourseTaught(e.target.value));
          }}
          className="ring-none w-full border dark:border-dark-border border-gray-700 py-3 outline-none dark:bg-dark-second pl-4 focus:border-gray-500 focus:outline-transparent focus:ring-transparent"
          placeholder="Python Web Development"
          aria-describedby="price-currency"
        />
      </div>
    </div>
  );
}
