import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { onchangeProductStock } from '@/redux/actions/products/products';
import GetNFTStock from '@/api/tokens/GetNFTStock';

export default function StockSec({ setHasChangesStock }) {
  const dispatch = useDispatch();

  const product = useSelector((state) => state.products.product);
  const productWeights = product && product.weights;
  const details = product && product.details;

  const nftAddress = details && details.nft_address;
  const ticketId = details && details.token_id;
  const [stock, setStock] = useState(0);

  // Function to calculate the total stock based on the product weights
  const calculateTotalStock = (weights) => {
    return weights.reduce((total, weight) => total + weight.stock, 0);
  };
  useEffect(() => {
    if (productWeights && productWeights.length > 0) {
      setStock(calculateTotalStock(productWeights));
    }
  }, [productWeights]);
  useEffect(() => {
    const fetchData = async () => {
      if (nftAddress !== '0') {
        const res = await GetNFTStock(nftAddress, ticketId);
        if (res && res.status === 200) {
          setStock(res.data.results);
        }
      }
    };
    fetchData();
  }, [nftAddress, ticketId]);

  const [originalStock, setOriginalStock] = useState('');
  useEffect(() => {
    setOriginalStock(JSON.parse(JSON.stringify(stock)));
    // eslint-disable-next-line
  }, [product]);

  useEffect(() => {
    if (!_.isEqual(originalStock, stock)) {
      setHasChangesStock(true);
    } else {
      setHasChangesStock(false);
    }
  }, [stock, originalStock, setHasChangesStock]);

  return (
    <div>
      {nftAddress !== '0' ? (
        <span className="text-md mb-2 block font-bold dark:text-dark-txt text-gray-900">
          Product stock: <span>(You will pay a very small gas fee)</span>
        </span>
      ) : (
        <span className="text-md mb-2 block font-bold dark:text-dark-txt text-gray-900">
          Product stock
        </span>
      )}
      <div className="relative mt-1 ">
        {productWeights && productWeights.length > 0 ? (
          <div className="dark:text-dark-txt">
            {stock}{' '}
            <span className="text-sm text-gray-700 dark:text-dark-txt-secondary">
              handled by Weight
            </span>
          </div>
        ) : (
          <input
            type="number"
            value={stock}
            maxLength={1000}
            onChange={(e) => {
              let inputValue = e.target.value;

              // If the input is empty, set the value to 0
              if (inputValue === '') {
                inputValue = '0';
              }

              // Ensure the input value is a number and remove leading zeros
              inputValue = parseInt(inputValue, 10).toString();

              setStock(inputValue);
              dispatch(onchangeProductStock(inputValue));
            }}
            className="ring-none w-44 border dark:placeholder-dark-txt-secondary dark:border-dark-border border-gray-700 py-3 outline-none dark:bg-dark-second pl-4  focus:border-gray-500 focus:outline-transparent focus:ring-transparent"
            placeholder="Stock: 23"
            aria-describedby="price-currency"
          />
        )}
      </div>
    </div>
  );
}
