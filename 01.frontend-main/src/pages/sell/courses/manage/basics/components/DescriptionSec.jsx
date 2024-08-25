import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import SimpleEditor from '@/components/SimpleEditor';
import { onchangeCourseDescription } from '@/redux/actions/courses/courses';

export default function DescriptionSec({ setHasChangesDescription }) {
  const dispatch = useDispatch();

  const course = useSelector((state) => state.courses.course);
  const details = course && course.details;

  const reduxDescription = useSelector((state) => state.courses.description);
  const [description, setDescription] = useState('');

  const [originalDescription, setOriginalDescription] = useState('');
  useEffect(() => {
    setDescription(details && details.description ? details.description : reduxDescription);
    setOriginalDescription(JSON.parse(JSON.stringify(description)));
    // eslint-disable-next-line
  }, [course]);

  const [content, setContent] = useState(
    details && details.description && details.description.length > 0
      ? details && details.description
      : reduxDescription,
  );
  const contentCount = content.replace(/<[^>]+>/g, '').length;

  useEffect(() => {
    if (dispatch !== undefined && dispatch !== null) {
      dispatch(onchangeCourseDescription(content));
    }
    // eslint-disable-next-line
  }, [content]);

  useEffect(() => {
    if (!_.isEqual(originalDescription, content)) {
      setHasChangesDescription(true);
    } else {
      setHasChangesDescription(false);
    }
  }, [content, originalDescription, setHasChangesDescription]);

  return (
    <div>
      <span className="mb-2 block font-bold dark:text-dark-txt text-gray-900">
        Course description
      </span>
      <div className="relative mt-1 rounded-md dark:bg-dark-second shadow-sm">
        <div className="pointer-events-none absolute bottom-0 right-0 mb-2 flex items-center pr-3">
          <span className="text-gray-500 sm:text-sm" id="price-currency">
            {contentCount} of 1200
          </span>
        </div>
        <SimpleEditor
          maxLength={1200}
          data={(details && details.description) || content}
          setData={setContent}
          placeholder={
            details && details.description ? details.desription : 'Insert your course description'
          }
        />
      </div>
    </div>
  );
}
