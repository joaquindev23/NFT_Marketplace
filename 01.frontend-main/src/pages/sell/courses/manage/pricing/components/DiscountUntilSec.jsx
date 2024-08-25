import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import { onchangeCourseDiscountUntil } from '@/redux/actions/courses/courses';

export default function DiscountUntilSec({ setHasChangesDiscountUntil }) {
  const dispatch = useDispatch();

  const course = useSelector((state) => state.courses.course);
  const details = course && course.details;

  const reduxDiscountUntil = useSelector((state) => state.courses.discount_until);
  const [discountUntil, setDiscountUntil] = useState('');

  const [originalDiscountUntil, setoriginalDiscountUntil] = useState('');
  useEffect(() => {
    setDiscountUntil(
      details && details.discount_until
        ? moment(details.discount_until).format('YYYY-MM-DD')
        : reduxDiscountUntil
        ? moment(reduxDiscountUntil).format('YYYY-MM-DD')
        : '',
    );
    setoriginalDiscountUntil(JSON.parse(JSON.stringify(discountUntil)));
    // eslint-disable-next-line
  }, [course]);

  useEffect(() => {
    if (!_.isEqual(originalDiscountUntil, discountUntil)) {
      setHasChangesDiscountUntil(true);
    } else {
      setHasChangesDiscountUntil(false);
    }
  }, [discountUntil, originalDiscountUntil, setHasChangesDiscountUntil]);

  return (
    <div>
      <span className="text-md mb-2 block font-bold text-gray-900 dark:text-dark-txt-secondary">
        Discount: <span className="font-base text-md">{moment(discountUntil).format('ll')}</span>
      </span>
      <div className="relative mt-1 ">
        <input
          type="date"
          value={discountUntil}
          onChange={(e) => {
            setDiscountUntil(e.target.value);
            dispatch(onchangeCourseDiscountUntil(e.target.value));
          }}
          className="ring-none w-44 border px-2 dark:border-dark-border dark:bg-dark-bg dark:text-dark-txt-secondary border-gray-700 py-3 outline-none focus:border-gray-500 focus:outline-transparent focus:ring-transparent"
          aria-describedby="price-currency"
        />
      </div>
    </div>
  );
}
