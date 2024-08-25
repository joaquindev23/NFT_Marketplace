import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { onchangeProductTitle } from '@/redux/actions/products/products';

export default function TitleSec({ setHasChangesTitle }) {
  const dispatch = useDispatch();

  const product = useSelector((state) => state.products.product);
  const details = product && product.details;

  const reduxTitle = useSelector((state) => state.products.title);
  const [title, setTitle] = useState('');

  const [originalTitle, setOriginalTitle] = useState('');
  useEffect(() => {
    setTitle(details && details.title ? details.title : reduxTitle);
    setOriginalTitle(JSON.parse(JSON.stringify(title)));
    // eslint-disable-next-line
  }, [product]);

  useEffect(() => {
    if (originalTitle.length !== 0 && !_.isEqual(originalTitle, title)) {
      setHasChangesTitle(true);
    } else {
      setHasChangesTitle(false);
    }
  }, [title, originalTitle, setHasChangesTitle]);

  return (
    <div>
      <span className="text-md mb-2 block font-bold dark:text-dark-txt text-gray-900">
        Product title
      </span>
      <div className="relative mt-1 rounded-md shadow-sm">
        <input
          type="text"
          value={title}
          maxLength={60}
          onChange={(e) => {
            setTitle(e.target.value);
            dispatch(onchangeProductTitle(e.target.value));
          }}
          className="ring-none w-full border dark:placeholder-dark-txt-secondary dark:border-dark-border border-gray-400 py-3 outline-none dark:bg-dark-second pl-4  focus:border-gray-500 focus:outline-transparent focus:ring-transparent"
          placeholder={title}
          aria-describedby="price-currency"
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <span
            className="text-gray-500 dark:text-dark-txt-secondary sm:text-sm"
            id="price-currency"
          >
            {title.length} of 60
          </span>
        </div>
      </div>
    </div>
  );
}
