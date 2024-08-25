import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { CircleLoader } from 'react-spinners';
// eslint-disable-next-line
import _ from 'lodash';
// eslint-disable-next-line
import { v4 as uuidv4 } from 'uuid';

import {
  addWhoIsFor,
  deleteProductWhoIsFor,
  onchangeProductWhoIsFor,
  removeWhoIsFor,
  updateDraggablesWhoIsFor,
} from '@/redux/actions/products/products';

export default function WhoIsForSec({ product, loading, productUUID, setHasChangesWhoIsFor }) {
  const productWhoIsFor = product && product.who_is_for;
  const reduxWhoIsFor = useSelector((state) => state.products.whoIsFor);
  const [draggable, setDraggable] = useState(true);
  const dispatch = useDispatch();

  const [whoIsForList, setWhoIsForList] = useState(
    productWhoIsFor && productWhoIsFor.length !== 0 ? productWhoIsFor : reduxWhoIsFor,
  );

  const [originalWhoIsFor, setOriginalWhoIsFor] = useState([]);
  useEffect(() => {
    setWhoIsForList(
      productWhoIsFor && productWhoIsFor.length !== 0 ? productWhoIsFor : reduxWhoIsFor,
    );
    dispatch(
      onchangeProductWhoIsFor(
        productWhoIsFor && productWhoIsFor.length !== 0 ? productWhoIsFor : reduxWhoIsFor,
      ),
    );
    setOriginalWhoIsFor(JSON.parse(JSON.stringify(whoIsForList)));
    // eslint-disable-next-line
  }, [product]);

  // useEffect(() => {
  //   setWhoIsForList(
  //     productWhoIsFor && productWhoIsFor.length !== 0 ? productWhoIsFor : reduxWhoIsFor,
  //   );
  //   dispatch(
  //     onchangeProductWhoIsFor(
  //       productWhoIsFor && productWhoIsFor.length !== 0 ? productWhoIsFor : reduxWhoIsFor,
  //     ),
  //   );
  //   // eslint-disable-next-line
  // }, [product]);

  const newID = whoIsForList.length;
  const handleWhoIsForAdd = () => {
    const newItem = { id: uuidv4(), position_id: newID, title: '' };
    setWhoIsForList((prev) => {
      dispatch(addWhoIsFor(newItem));
      return [...prev, newItem];
    });
  };

  const handleWhoIsForRemove = (index) => {
    setWhoIsForList((prev) => {
      dispatch(removeWhoIsFor(index));
      return prev.filter((item, i) => i !== index);
    });
  };

  async function handleWhoIsForDelete(item) {
    dispatch(deleteProductWhoIsFor(productUUID, item.id));
  }

  const onChange = (e, index) => {
    setDraggable(true);
    const { name, value } = e.target;
    setWhoIsForList((prev) => {
      const list = [...prev];
      list[index][name] = value;
      dispatch(onchangeProductWhoIsFor(list));
      return list;
    });
  };

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
    // Duplicate items
    // eslint-disable-next-line
    const _whoIsForList = [...whoIsForList];

    // Remove and save the draged item content
    const draggedItemContent = _whoIsForList.splice(dragItem.current, 1)[0];

    // Switch the position
    _whoIsForList.splice(dragOverItem.current, 0, draggedItemContent);

    // reset the position ref
    dragItem.current = null;
    dragOverItem.current = null;

    // Update the actual array
    setWhoIsForList(_whoIsForList);
    dispatch(updateDraggablesWhoIsFor(_whoIsForList));

    const listItem = document.getElementById(item.id);
    listItem.classList.remove('bg-gray-50');
  };

  useEffect(() => {
    for (let i = 0; i < whoIsForList.length; i += 1) {
      const item = whoIsForList[i];
      if (item.title === '') {
        setDraggable(false);
      }
    }
  }, [whoIsForList]);

  useEffect(() => {
    // Check if any of the items have an empty title or hex property
    const hasEmptyItem = whoIsForList.some((item) => !item.title);

    if (
      originalWhoIsFor.length !== 0 &&
      !_.isEqual(originalWhoIsFor, whoIsForList) &&
      !hasEmptyItem
    ) {
      setHasChangesWhoIsFor(true);
    } else {
      setHasChangesWhoIsFor(false);
    }
  }, [whoIsForList, originalWhoIsFor, setHasChangesWhoIsFor]);

  return (
    <div className="">
      <p className="py-2  text-lg font-bold leading-6 dark:text-dark-txt text-gray-900">
        Who is this product for?
      </p>
      <div className="text-md dark:text-dark-txt-secondary">
        Write a detailed explanation of your product&apos;s{' '}
        <Link
          href="/teach-hub/sellers/products/target-audience"
          className="dark:text-dark-accent dark:hover:text-dark-primary text-purple-700 underline underline-offset-4"
        >
          intended audience
        </Link>{' '}
        and why they will find it useful. This will assist you in attracting the appropriate
        audience to your goods.
      </div>
      <ul className=" space-y-4 py-4 ">
        {loading ? (
          <div className="grid w-full place-items-center py-4">
            <CircleLoader
              className="items-center justify-center text-center"
              loading={loading}
              WhoIsFor={35}
              color="#1c1d1f"
            />
          </div>
        ) : (
          <>
            {whoIsForList.map((item, index) => (
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
                    required
                    maxLength={60}
                    name="title"
                    className="ring-none w-full border dark:placeholder-dark-txt-secondary dark:border-dark-border border-gray-700 py-3 outline-none dark:bg-dark-second pl-4 focus:border-gray-500 focus:outline-transparent focus:ring-transparent"
                    placeholder={item.title ? item.title : `Example: Students`}
                  />
                </div>
                {whoIsForList.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => {
                      handleWhoIsForRemove(index);
                      handleWhoIsForDelete(item);
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
          if (whoIsForList[0].title !== '') {
            handleWhoIsForAdd();
          }
        }}
        className="mt-2 font-bold dark:text-dark-accent text-purple-700"
      >
        + Add more to your response
      </button>
    </div>
  );
}
