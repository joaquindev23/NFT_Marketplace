import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CircleLoader } from 'react-spinners';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import {
  addShipping,
  deleteProductShipping,
  onchangeProductShipping,
  removeShipping,
  updateDraggablesShipping,
} from '@/redux/actions/products/products';

export default function ShippingSec({ product, loading, productUUID, setHasChangesShipping }) {
  const productShipping = product && product.shipping;

  const reduxShipping = useSelector((state) => state.products.shipping);

  const [draggable, setDraggable] = useState(true);
  const dispatch = useDispatch();

  const [shippingList, setShippingList] = useState(
    productShipping && productShipping.length !== 0 ? productShipping : reduxShipping,
  );

  const [originalShipping, setOriginalShipping] = useState([]);
  useEffect(() => {
    setShippingList(
      productShipping && productShipping.length !== 0 ? productShipping : reduxShipping,
    );
    dispatch(
      onchangeProductShipping(
        productShipping && productShipping.length !== 0 ? productShipping : reduxShipping,
      ),
    );
    setOriginalShipping(JSON.parse(JSON.stringify(shippingList)));
    // eslint-disable-next-line
  }, [product]);

  const newID = shippingList.length;
  const handleShippingAdd = () => {
    const newItem = { id: uuidv4(), position_id: newID, title: '', price: 0.0, time: 0 };
    setShippingList([...shippingList, newItem]);
    dispatch(addShipping(newItem));
  };

  const handleShippingRemove = (index) => {
    setShippingList(shippingList.filter((item, i) => i !== index));
    dispatch(removeShipping(index));
  };

  async function handleShippingDelete(item) {
    dispatch(deleteProductShipping(productUUID[0], item.id));
  }

  const onChange = (e, index, inputType) => {
    setDraggable(true);
    const { name, value } = e.target;
    const list = [...shippingList];
    if (inputType === 'text') {
      list[index][name] = value;
    } else if (inputType === 'price') {
      // Parse the value to an integer, remove leading zeroes, and convert it back to a string
      let parsedValue = parseInt(value, 10);
      // Check if the parsed value is a valid number, otherwise set it to 0
      parsedValue = isNaN(parsedValue) ? 0 : parsedValue.toString();
      list[index]['price'] = parsedValue;
    } else if (inputType === 'time') {
      // Parse the value to an integer, remove leading zeroes, and convert it back to a string
      let parsedValue = parseInt(value, 10);
      // Check if the parsed value is a valid number, otherwise set it to 0
      parsedValue = isNaN(parsedValue) ? 0 : parsedValue.toString();
      list[index]['time'] = parsedValue;
    }
    setShippingList(list);
    dispatch(onchangeProductShipping(list));
  };
  // Save Reference for dragItem and dragOverItem
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const onDragStart = (e, index, item) => {
    const listItem = document.getElementById(item.id);
    listItem.classList.add('bg-gray-50');
    dragItem.current = index;
  };

  const onDragEnter = (e, index) => {
    dragOverItem.current = index;
  };

  const onDragEnd = (e, index, item) => {
    const _shippingList = [...shippingList];
    const draggedItemContent = _shippingList.splice(dragItem.current, 1)[0];
    _shippingList.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setShippingList(_shippingList);
    dispatch(updateDraggablesShipping(_shippingList));

    const listItem = document.getElementById(item.id);
    listItem.classList.remove('bg-gray-50');
  };

  useEffect(() => {
    for (let i = 0; i < shippingList.length; i += 1) {
      const item = shippingList[i];
      if (item.title === '') {
        setDraggable(false);
      }
    }
  }, [shippingList]);

  useEffect(() => {
    // Check if any of the items have an empty title or hex property
    const hasEmptyItem = shippingList.some((item) => !item.title);

    if (
      originalShipping.length !== 0 &&
      !_.isEqual(originalShipping, shippingList) &&
      !hasEmptyItem
    ) {
      setHasChangesShipping(true);
    } else {
      setHasChangesShipping(false);
    }
  }, [shippingList, originalShipping, setHasChangesShipping]);

  return (
    <div className="block">
      <div className="px-8">
        <p className="py-2  text-lg font-bold leading-6 dark:text-dark-txt text-gray-900">
          What are the Shipping of your product?
        </p>
        <div className="text-md dark:text-dark-txt-secondary">
          List any Shipping option your product might have.
        </div>
        <ul className=" space-y-4 py-4 ">
          {loading ? (
            <div className="grid w-full place-items-center py-4">
              <CircleLoader
                className="items-center justify-center text-center"
                loading={loading}
                Shipping={35}
                color="#1c1d1f"
              />
            </div>
          ) : (
            <>
              {shippingList.map((item, index) => (
                <li
                  key={index}
                  id={item.id}
                  draggable={draggable}
                  onDragStart={(e) => onDragStart(e, index, item)}
                  onDragEnter={(e) => onDragEnter(e, index)}
                  onDragEnd={(e) => onDragEnd(e, index, item)}
                  onDragOver={(e) => e.preventDefault()}
                  className=" flex transition duration-300 ease-in-out"
                >
                  <div className="relative flex w-full">
                    <div className="relative w-full">
                      <div className="absolute left-0 mt-3 ml-2 dark:text-dark-txt text-gray-400">
                        Name:
                      </div>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          onChange(e, index, 'text');
                        }}
                        required
                        maxLength={20}
                        name="title"
                        className="ring-none w-64 border dark:border-dark-border dark:bg-dark-bg dark:text-dark-txt-secondary dark:placeholder-dark-txt-secondary border-gray-700 py-3 pl-16 outline-none focus:border-gray-500 focus:outline-transparent focus:ring-transparent"
                        placeholder="Standard"
                      />
                    </div>
                    <div className="relative w-full">
                      <div className="absolute left-0 mt-3 ml-2 text-gray-400">Days:</div>
                      <input
                        type="number"
                        value={item.time}
                        onChange={(e) => {
                          onChange(e, index, 'time');
                        }}
                        required
                        name="time"
                        className="ring-none w-64 border dark:border-dark-border dark:bg-dark-bg dark:text-dark-txt-secondary dark:placeholder-dark-txt-secondary border-gray-700 py-3 pl-14 outline-none focus:border-gray-500 focus:outline-transparent focus:ring-transparent"
                        placeholder="5"
                      />
                    </div>
                    <div className="relative w-full">
                      <div className="absolute left-0 mt-[12.5px] ml-2 text-gray-400">$</div>
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) => {
                          onChange(e, index, 'price');
                        }}
                        required
                        name="price"
                        className="ring-none w-48 border dark:border-dark-border dark:bg-dark-bg dark:text-dark-txt-secondary dark:placeholder-dark-txt-secondary border-gray-700 py-3 pl-6 outline-none focus:border-gray-500 focus:outline-transparent focus:ring-transparent"
                        placeholder={item.price ? item.price : `50`}
                      />
                    </div>
                    {shippingList.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => {
                          handleShippingRemove(index);
                          handleShippingDelete(item);
                        }}
                        className="inline-flex border dark:border-dark-border border-gray-700 dark:hover:bg-dark-third hover:bg-gray-50"
                      >
                        <i className="bx bx-trash mx-3 mt-2 text-2xl text-gray-700 dark:text-dark-txt-secondary" />
                      </button>
                    ) : (
                      <div className="inline-flex cursor-not-allowed border dark:border-dark-border border-gray-700 dark:hover:bg-dark-third hover:bg-gray-50">
                        <i className="bx bx-trash mx-3 mt-2 text-2xl text-gray-700 dark:text-dark-txt-secondary" />
                      </div>
                    )}

                    <button
                      type="button"
                      className="hidden cursor-move  border-t border-b border-r dark:border-dark-border border-gray-700 dark:hover:bg-dark-third hover:bg-gray-50 md:inline-flex"
                    >
                      <i className="bx bx-menu mx-3 mt-2 text-2xl text-gray-700 dark:text-dark-txt-secondary" />
                    </button>
                  </div>
                </li>
              ))}
            </>
          )}
        </ul>
        <button
          type="button"
          onClick={() => {
            if (shippingList[0].title !== '') {
              handleShippingAdd();
            }
          }}
          className="mt-2 font-bold dark:text-dark-accent text-purple-700"
        >
          + Add more Shipping
        </button>
      </div>
    </div>
  );
}
