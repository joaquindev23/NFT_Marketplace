import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CircleLoader } from 'react-spinners';
// eslint-disable-next-line
import { v4 as uuidv4 } from 'uuid';
// eslint-disable-next-line
import _ from 'lodash';

import {
  addRequisite,
  deleteProductRequisite,
  onchangeProductRequisite,
  onchangeProductRequisites,
  removeRequisite,
  updateDraggablesRequisite,
} from '@/redux/actions/products/products';

export default function RequirementsSec({ product, loading, productUUID, setHasChangesRequisite }) {
  const productRequisites = product && product.requisites;

  const reduxRequisites = useSelector((state) => state.products.requisites);

  const [draggable, setDraggable] = useState(true);
  const dispatch = useDispatch();

  const [requisitesList, setRequisitesList] = useState(
    productRequisites && productRequisites.length !== 0 ? productRequisites : reduxRequisites,
  );

  const [originalRequisites, setOriginalRequisites] = useState([]);
  useEffect(() => {
    setRequisitesList(
      productRequisites && productRequisites.length !== 0 ? productRequisites : reduxRequisites,
    );
    dispatch(
      onchangeProductRequisites(
        productRequisites && productRequisites.length !== 0 ? productRequisites : reduxRequisites,
      ),
    );
    setOriginalRequisites(JSON.parse(JSON.stringify(requisitesList)));
    // eslint-disable-next-line
  }, [product]);

  // useEffect(() => {
  //   setRequisitesList(
  //     productRequisites && productRequisites.length !== 0 ? productRequisites : reduxRequisites,
  //   );
  //   dispatch(
  //     onchangeProductRequisites(
  //       productRequisites && productRequisites.length !== 0 ? productRequisites : reduxRequisites,
  //     ),
  //   );
  //   // eslint-disable-next-line
  // }, [product]);

  const newID = requisitesList.length;
  const handleRequisitesAdd = () => {
    const newItem = { id: uuidv4(), position_id: newID, title: '' };
    setRequisitesList([...requisitesList, newItem]);
    dispatch(addRequisite(newItem));
  };

  const handleRequisitesRemove = (index) => {
    setRequisitesList(requisitesList.filter((item, i) => i !== index));
    dispatch(removeRequisite(index));
  };

  async function handleRequisitesDelete(item) {
    dispatch(deleteProductRequisite(productUUID, item.id));
  }

  const onChange = (e, index) => {
    setDraggable(true);
    const { name, value } = e.target;
    const list = [...requisitesList];
    list[index][name] = value;
    setRequisitesList(list);
    dispatch(onchangeProductRequisite(requisitesList));
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
    const _requisitesList = [...requisitesList];
    const draggedItemContent = _requisitesList.splice(dragItem.current, 1)[0];
    _requisitesList.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setRequisitesList(_requisitesList);
    dispatch(updateDraggablesRequisite(_requisitesList));

    const listItem = document.getElementById(item.id);
    listItem.classList.remove('bg-gray-50');
  };

  useEffect(() => {
    for (let i = 0; i < requisitesList.length; i += 1) {
      const item = requisitesList[i];
      if (item.title === '') {
        setDraggable(false);
      }
    }
  }, [requisitesList]);

  useEffect(() => {
    // Check if any of the items have an empty title or hex property
    const hasEmptyItem = requisitesList.some((item) => !item.title);

    if (
      originalRequisites.length !== 0 &&
      !_.isEqual(originalRequisites, requisitesList) &&
      !hasEmptyItem
    ) {
      setHasChangesRequisite(true);
    } else {
      setHasChangesRequisite(false);
    }
  }, [requisitesList, originalRequisites, setHasChangesRequisite]);

  return (
    <div className="block">
      <p className="py-2  text-lg font-bold leading-6 dark:text-dark-txt text-gray-900">
        What are the prerequisites or other items that this one requires?
      </p>
      <div className="text-md dark:text-dark-txt-secondary">
        List the abilities and items that buyers may require in order to utilize your product
        effectively. If there are no criteria, utilize this space to decrease the barrier for
        newcomers.
      </div>
      <ul className=" space-y-4 py-4 ">
        {loading ? (
          <div className="grid w-full place-items-center py-4">
            <CircleLoader
              className="items-center justify-center text-center"
              loading={loading}
              size={35}
              color="#1c1d1f"
            />
          </div>
        ) : (
          <>
            {requisitesList.map((item, index) => (
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
                    placeholder={
                      item.title ? item.title : `Example: A monitor or TV with an HDMI port`
                    }
                  />
                </div>
                {requisitesList.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => {
                      handleRequisitesRemove(index);
                      handleRequisitesDelete(item);
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
          if (requisitesList[0].title !== '') {
            handleRequisitesAdd();
          }
        }}
        className="mt-2 font-bold dark:text-dark-accent text-purple-700"
      >
        + Add more to your response
      </button>
    </div>
  );
}
