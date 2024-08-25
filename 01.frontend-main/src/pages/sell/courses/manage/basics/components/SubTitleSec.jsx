import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { onchangeCourseSubTitle } from '@/redux/actions/courses/courses';

export default function SubTitleSec({ setHasChangesSubTitle }) {
  const dispatch = useDispatch();

  const course = useSelector((state) => state.courses.course);
  const details = course && course.details;

  const reduxTitle = useSelector((state) => state.courses.sub_title);
  const [subTitle, setSubTitle] = useState('');

  const [originalSubTitle, setOriginalSubTitle] = useState('');
  useEffect(() => {
    setSubTitle(details && details.short_description ? details.short_description : reduxTitle);
    setOriginalSubTitle(JSON.parse(JSON.stringify(subTitle)));
    // eslint-disable-next-line
  }, [course]);

  useEffect(() => {
    if (!_.isEqual(originalSubTitle, subTitle)) {
      setHasChangesSubTitle(true);
    } else {
      setHasChangesSubTitle(false);
    }
  }, [subTitle, originalSubTitle, setHasChangesSubTitle]);

  return (
    <div>
      <span className="text-md mb-2 block font-bold dark:text-dark-txt text-gray-900">
        Course subtitle
      </span>
      <div className="relative mt-1 rounded-md shadow-sm">
        <input
          type="text"
          value={subTitle || (details && details.short_description) || ''}
          maxLength={120}
          onChange={(e) => {
            setSubTitle(e.target.value);
            dispatch(onchangeCourseSubTitle(e.target.value));
          }}
          className="ring-none w-full border dark:border-dark-border border-gray-700 py-3 outline-none dark:bg-dark-second pl-4 focus:border-gray-500 focus:outline-transparent focus:ring-transparent"
          placeholder={(details && details.sub_title) || 'Insert your course subtitle.'}
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <span
            className="text-gray-500 dark:text-dark-txt-secondary sm:text-sm"
            id="price-currency"
          >
            {subTitle.length} of 120
          </span>
        </div>
      </div>
    </div>
  );
}
