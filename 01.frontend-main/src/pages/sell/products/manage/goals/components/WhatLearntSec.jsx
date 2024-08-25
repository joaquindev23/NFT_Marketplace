import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
// eslint-disable-next-line
import _ from 'lodash';
// eslint-disable-next-line
import { v4 as uuidv4 } from 'uuid';
import { CircleLoader } from 'react-spinners';

import {
  addWhatLearnt,
  deleteProductWhatLearnt,
  onchangeProductWhatLearnt,
  removeWhatLearnt,
  updateDraggablesWhatLearnt,
} from '@/redux/actions/products/products';

export default function WhatLearntSec({ product, loading, productUUID, setHasChangesWhatLearnt }) {
  const productWhatLearnt = product && product.whatlearnt;

  const reduxWhatLearnt = useSelector((state) => state.products.whatlearnt);

  const [draggable, setDraggable] = useState(true);
  const dispatch = useDispatch();

  const [whatLearntList, setWhatLearntList] = useState(
    productWhatLearnt && productWhatLearnt.length !== 0 ? productWhatLearnt : reduxWhatLearnt,
  );

  const [originalWhatLearnt, setOriginalWhatLearnt] = useState([]);
  useEffect(() => {
    setWhatLearntList(
      productWhatLearnt && productWhatLearnt.length !== 0 ? productWhatLearnt : reduxWhatLearnt,
    );
    dispatch(
      onchangeProductWhatLearnt(
        productWhatLearnt && productWhatLearnt.length !== 0 ? productWhatLearnt : reduxWhatLearnt,
      ),
    );
    setOriginalWhatLearnt(JSON.parse(JSON.stringify(whatLearntList)));
    // eslint-disable-next-line
  }, [product]);

  // useEffect(() => {
  //   setWhatLearntList(
  //     productWhatLearnt && productWhatLearnt.length !== 0 ? productWhatLearnt : reduxWhatLearnt,
  //   );
  //   dispatch(
  //     onchangeProductWhatLearnt(
  //       productWhatLearnt && productWhatLearnt.length !== 0 ? productWhatLearnt : reduxWhatLearnt,
  //     ),
  //   );
  //   // eslint-disable-next-line
  // }, [product]);

  const newID = whatLearntList.length;
  const handleWhatLearntAdd = () => {
    const newItem = { id: uuidv4(), position_id: newID, title: '' };
    setWhatLearntList([...whatLearntList, newItem]);
    dispatch(addWhatLearnt(newItem));
  };

  const handleWhatLearntRemove = (index) => {
    setWhatLearntList(whatLearntList.filter((item, i) => i !== index));
    dispatch(removeWhatLearnt(index));
  };

  async function handleWhatLearntDelete(item) {
    dispatch(deleteProductWhatLearnt(productUUID, item.id));
  }

  const onChange = (e, index) => {
    setDraggable(true);
    const { name, value } = e.target;
    const list = [...whatLearntList];
    list[index][name] = value;
    setWhatLearntList(list);
    dispatch(onchangeProductWhatLearnt(whatLearntList));
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
    // eslint-disable-next-line
    const _whatLearntList = [...whatLearntList];
    const draggedItemContent = _whatLearntList.splice(dragItem.current, 1)[0];
    _whatLearntList.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setWhatLearntList(_whatLearntList);
    dispatch(updateDraggablesWhatLearnt(_whatLearntList));

    const listItem = document.getElementById(item.id);
    listItem.classList.remove('bg-gray-50');
  };

  useEffect(() => {
    for (let i = 0; i < whatLearntList.length; i += 1) {
      const item = whatLearntList[i];
      if (item.title === '') {
        setDraggable(false);
      }
    }
  }, [whatLearntList]);

  useEffect(() => {
    // Check if any of the items have an empty title or hex property
    const hasEmptyItem = whatLearntList.some((item) => !item.title);

    if (
      originalWhatLearnt.length !== 0 &&
      !_.isEqual(originalWhatLearnt, whatLearntList) &&
      !hasEmptyItem
    ) {
      setHasChangesWhatLearnt(true);
    } else {
      setHasChangesWhatLearnt(false);
    }
  }, [whatLearntList, originalWhatLearnt, setHasChangesWhatLearnt]);

  return (
    <div className="block">
      <p className="py-2  text-lg font-bold leading-6 dark:text-dark-txt text-gray-900">
        What are your consumers able to accomplish with your product?
      </p>
      <div className="text-md dark:text-dark-txt-secondary">
        You must enter at least{' '}
        <Link
          className="text-purple-700 dark:text-dark-accent dark:hover:text-dark-primary underline underline-offset-4"
          href="/teach-hub/instructors/courses/learning-objectives"
        >
          4 use cases
        </Link>{' '}
        from which buyers might anticipate to benefit after purchasing your solution.
      </div>
      <ul className=" space-y-4 py-4 ">
        {loading ? (
          <div className="grid w-full place-items-center py-4">
            <CircleLoader
              className="items-center justify-center text-center"
              loading={loading}
              WhatLearnt={35}
              color="#1c1d1f"
            />
          </div>
        ) : (
          <>
            {whatLearntList.map((item, index) => (
              <li
                key={item.id}
                id={item.id}
                draggable={draggable}
                onDragStart={(e) => onDragStart(e, index, item)}
                onDragEnter={(e) => onDragEnter(e, index)}
                onDragEnd={(e) => onDragEnd(e, index, item)}
                onDragOver={(e) => e.preventDefault()}
                className=" flex transition duration-300 ease-in-out"
              >
                <div className="relative w-full">
                  <div className="absolute right-0 mt-3.5 mr-4 dark:text-dark-txt-secondary text-gray-400">
                    {item.title && item.title.length === 0 ? '0' : item.title.length} of 60
                  </div>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => {
                      onChange(e, index, item);
                    }}
                    maxLength={60}
                    required
                    name="title"
                    className="ring-none w-full border dark:placeholder-dark-txt-secondary dark:border-dark-border border-gray-700 py-3 outline-none dark:bg-dark-second pl-4 focus:border-gray-500 focus:outline-transparent focus:ring-transparent"
                    placeholder={item.title || `Example: ${item.example}`}
                  />
                </div>
                {whatLearntList.length > 4 ? (
                  <button
                    type="button"
                    onClick={() => {
                      handleWhatLearntRemove(index);
                      handleWhatLearntDelete(item);
                    }}
                    className="inline-flex border-t border-b border-r dark:border-dark-border border-gray-700 dark:hover:bg-dark-third hover:bg-gray-50"
                  >
                    <i className="bx bx-trash mx-3 mt-2 text-2xl text-gray-700 dark:text-dark-txt-secondary" />
                  </button>
                ) : (
                  <div className="inline-flex cursor-not-allowed border-t border-b border-r dark:border-dark-border border-gray-700 dark:hover:bg-dark-third hover:bg-gray-50">
                    <i className="bx bx-trash mx-3 mt-2 text-2xl text-gray-700 dark:text-dark-txt-secondary" />
                  </div>
                )}

                <button
                  type="button"
                  className="hidden cursor-move  border-t border-b border-r dark:border-dark-border border-gray-700 dark:hover:bg-dark-third hover:bg-gray-50 md:inline-flex"
                >
                  <i className="bx bx-menu mx-3 mt-2 text-2xl text-gray-700 dark:text-dark-txt-secondary" />
                </button>
              </li>
            ))}
          </>
        )}
      </ul>
      <button
        type="button"
        onClick={() => {
          if (
            whatLearntList[0].title !== '' &&
            whatLearntList[1].title !== '' &&
            whatLearntList[2].title !== '' &&
            whatLearntList[3].title !== ''
          ) {
            handleWhatLearntAdd();
          }
        }}
        className="mt-2 font-bold dark:text-dark-accent text-purple-700"
      >
        + Add more to your response
      </button>
    </div>
  );
}
