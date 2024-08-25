import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { onchangeProductSubTitle } from '@/redux/actions/products/products';

export default function SubTitleSec({ setHasChangesSubTitle }) {
  const dispatch = useDispatch();

  const product = useSelector((state) => state.products.product);
  const details = product && product.details;

  const reduxTitle = useSelector((state) => state.products.sub_title);
  const [subTitle, setSubTitle] = useState('');

  const [originalSubTitle, setOriginalSubTitle] = useState('');
  useEffect(() => {
    setSubTitle(details && details.short_description ? details.short_description : reduxTitle);
    setOriginalSubTitle(JSON.parse(JSON.stringify(subTitle)));
    // eslint-disable-next-line
  }, [product]);

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
        Product subtitle
      </span>
      <div className="relative mt-1 rounded-md shadow-sm">
        <input
          type="text"
          value={subTitle || (details && details.short_description) || ''}
          maxLength={120}
          onChange={(e) => {
            setSubTitle(e.target.value);
            dispatch(onchangeProductSubTitle(e.target.value));
          }}
          className="ring-none w-full border dark:placeholder-dark-txt-secondary dark:border-dark-border border-gray-400 py-3 outline-none dark:bg-dark-second pl-4  focus:border-gray-500 focus:outline-transparent focus:ring-transparent"
          placeholder={(details && details.sub_title) || 'Insert your Product subtitle.'}
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
