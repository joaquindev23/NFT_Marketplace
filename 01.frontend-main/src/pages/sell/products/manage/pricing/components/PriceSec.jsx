import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { onchangeProductPrice } from '@/redux/actions/products/products';

export default function PriceSec({ setHasChangesPrice }) {
  const dispatch = useDispatch();

  const product = useSelector((state) => state.products.product);
  const details = product && product.details;

  const reduxPrice = useSelector((state) => state.products.price);
  const [price, setPrice] = useState('');

  const [originalprice, setOriginalprice] = useState('');
  useEffect(() => {
    setPrice(details && details.price ? details.price : reduxPrice);
    setOriginalprice(JSON.parse(JSON.stringify(price)));
    // eslint-disable-next-line
  }, [product]);

  useEffect(() => {
    if (!_.isEqual(originalprice, price)) {
      setHasChangesPrice(true);
    } else {
      setHasChangesPrice(false);
    }
  }, [price, originalprice, setHasChangesPrice]);

  return (
    <div>
      <span className="text-md mb-2 block font-bold dark:text-dark-txt-secondary">
        Product price
      </span>
      <div className="relative mt-1 ">
        <input
          type="number"
          value={price}
          maxLength={1000000}
          onChange={(e) => {
            setPrice(e.target.value);
            dispatch(onchangeProductPrice(e.target.value));
          }}
          className="ring-none w-64 border dark:border-dark-border dark:bg-dark-bg dark:text-dark-txt-secondary border-gray-700 py-3 pl-8 outline-none focus:border-gray-500 focus:outline-transparent focus:ring-transparent"
          placeholder="69.90"
          aria-describedby="price-currency"
        />
        <div className="pointer-events-none absolute inset-y-0 left-0 ml-3 flex items-center pr-3">
          <span className="text-md text-gray-500 dark:text-dark-txt" id="price-currency">
            $:
          </span>
        </div>
      </div>
    </div>
  );
}
