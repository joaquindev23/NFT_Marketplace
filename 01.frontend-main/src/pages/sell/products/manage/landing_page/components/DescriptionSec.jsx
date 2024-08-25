import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import SimpleEditor from '@/components/SimpleEditor';
import { onchangeProductDescription } from '@/redux/actions/products/products';

export default function DescriptionSec({ setHasChangesDescription }) {
  const dispatch = useDispatch();

  const product = useSelector((state) => state.products.product);
  const details = product && product.details;

  const reduxDescription = useSelector((state) => state.products.description);
  const [description, setDescription] = useState('');

  const [originalDescription, setOriginalDescription] = useState('');
  useEffect(() => {
    setDescription(details && details.description ? details.description : reduxDescription);
    setOriginalDescription(JSON.parse(JSON.stringify(description)));
    // eslint-disable-next-line
  }, [product]);

  const [content, setContent] = useState(
    details && details.description && details.description.length > 0
      ? details && details.description
      : reduxDescription,
  );
  const contentCount = content.replace(/<[^>]+>/g, '').length;

  useEffect(() => {
    if (dispatch !== undefined && dispatch !== null) {
      dispatch(onchangeProductDescription(content));
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
        Product description
      </span>
      <div className="relative mt-1 rounded-md dark:bg-dark-second bg-white shadow-sm">
        <div className="relative">
          <SimpleEditor
            data={content}
            setData={setContent}
            placeholder={
              details && details.description
                ? details.description
                : 'Insert your Product description'
            }
          />
          <div className="pointer-events-none absolute bottom-0 right-0 mb-2 mr-3">
            <span
              className="text-gray-500 dark:text-dark-txt-secondary sm:text-sm"
              id="price-currency"
            >
              {contentCount} of 1200
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
