import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { onchangeCourseComparePrice } from '@/redux/actions/courses/courses';

export default function ComparePriceSec({ setHasChangesComparePrice }) {
  const dispatch = useDispatch();

  const course = useSelector((state) => state.courses.course);
  const details = course && course.details;

  const reduxComparePrice = useSelector((state) => state.courses.compare_price);
  const [comparePrice, setComparePrice] = useState('');

  const [originalComparePrice, setOriginalComparePrice] = useState('');
  useEffect(() => {
    setComparePrice(details && details.compare_price ? details.compare_price : reduxComparePrice);
    setOriginalComparePrice(JSON.parse(JSON.stringify(comparePrice)));
    // eslint-disable-next-line
  }, [course]);

  useEffect(() => {
    if (!_.isEqual(originalComparePrice, comparePrice)) {
      setHasChangesComparePrice(true);
    } else {
      setHasChangesComparePrice(false);
    }
  }, [comparePrice, originalComparePrice, setHasChangesComparePrice]);

  return (
    <div>
      <span className="text-md mb-2 block font-bold text-gray-900 dark:text-dark-txt-secondary">
        Discount price (optional)
      </span>
      <div className="relative mt-1 ">
        <input
          type="number"
          value={comparePrice}
          maxLength={1000000}
          onChange={(e) => {
            setComparePrice(e.target.value);
            dispatch(onchangeCourseComparePrice(e.target.value));
          }}
          className="ring-none w-64 border dark:border-dark-border dark:bg-dark-bg dark:text-dark-txt-secondary border-gray-700 py-3 pl-6 outline-none focus:border-gray-500 focus:outline-transparent focus:ring-transparent"
          placeholder="69.90"
          aria-describedby="price-currency"
        />
        <div className="pointer-events-none absolute inset-y-0 left-0 ml-3 flex items-center pr-3">
          <span className="text-md text-gray-500 dark:text-dark-txt" id="price-currency">
            $
          </span>
        </div>
      </div>
    </div>
  );
}
