import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { CircleLoader } from 'react-spinners';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import SimpleEditor from '@/components/SimpleEditor';
import {
  addDetail,
  deleteProductDetail,
  onchangeProductDetails,
  removeDetail,
  updateDraggablesDetail,
} from '@/redux/actions/products/products';

export default function DetailsSec({ product, loading, productUUID, setHasChangesDetails }) {
  const productDetails = product && product.detail;

  const reduxDetailsList = useSelector((state) => state.products.detail);

  const dispatch = useDispatch();
  const [draggable, setDraggable] = useState(true);

  const [detailsList, setDetailsList] = useState(
    productDetails && productDetails.length > 0 ? productDetails : reduxDetailsList,
  );

  const [originalDetails, setOriginalDetails] = useState([]);
  useEffect(() => {
    setDetailsList(
      productDetails && productDetails.length !== 0 ? productDetails : reduxDetailsList,
    );
    dispatch(
      onchangeProductDetails(
        productDetails && productDetails.length !== 0 ? productDetails : reduxDetailsList,
      ),
    );
    setOriginalDetails(JSON.parse(JSON.stringify(detailsList)));
    // eslint-disable-next-line
  }, [product]);

  const newID = detailsList.length;
  const handleDetailsAdd = () => {
    const newItem = { id: uuidv4(), position_id: newID, title: '', body: '' };
    dispatch(addDetail(newItem));
    setDetailsList([...detailsList, newItem]);
  };

  const handleDetailsRemove = (index) => {
    const newList = [...detailsList];
    newList.splice(index, 1);
    setDetailsList(newList);
    dispatch(onchangeProductDetails(newList));
    dispatch(removeDetail(index));
  };

  const onChange = (e, index) => {
    setDraggable(true);
    const { name, value } = e.target;
    const list = [...detailsList];
    list[index][name] = value;
    setDetailsList(list);
    dispatch(onchangeProductDetails(list));
  };

  const [charCounts, setCharCounts] = useState({});

  function handleBodyChange(newContent, index, item) {
    const list = [...detailsList];
    list[index].body = newContent;
    setDetailsList(list);
    const newCharCounts = { ...charCounts };
    newCharCounts[item.id] = newContent.replace(/<[^>]+>/g, '').length;
    setCharCounts(newCharCounts);
    dispatch(onchangeProductDetails(list));
  }

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

  // Handle drag sorting
  const onDragEnd = (e, index, item) => {
    const _detailsList = [...detailsList];
    const draggedItemContent = _detailsList.splice(dragItem.current, 1)[0];
    _detailsList.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setDetailsList(_detailsList);
    dispatch(onchangeProductDetails(_detailsList));
    dispatch(updateDraggablesDetail(_detailsList));
    const listItem = document.getElementById(item.id);
    listItem.classList.remove('bg-gray-50');
  };

  useEffect(() => {
    for (let i = 0; i < detailsList.length; i += 1) {
      const item = detailsList[i];
      if (item.title === '' && item.body === '') {
        setDraggable(false);
      }
    }
  }, [detailsList]);

  useEffect(() => {
    // Check if any of the items have an empty title or hex property
    const hasEmptyItem = detailsList.some((item) => !item.title || !item.body);

    if (originalDetails.length !== 0 && !_.isEqual(originalDetails, detailsList) && !hasEmptyItem) {
      setHasChangesDetails(true);
    } else {
      setHasChangesDetails(false);
    }
  }, [detailsList, originalDetails, setHasChangesDetails]);

  return (
    <div className="block">
      <div className="px-8">
        <p className="py-2 dark:text-dark-txt text-lg font-bold leading-6 text-gray-900">
          What are the secrets of your product? What details shall you reveal to entice the buyers?
        </p>
        <div className="text-md dark:text-dark-txt-secondary">
          <Link
            className="dark:text-dark-accent dark:hover:text-dark-primary text-purple-700 underline underline-offset-4"
            href="/teach-hub/instructors/courses/learning-objectives"
          >
            Four at least
          </Link>{' '}
          must you share so they may anticipate the power they will wield upon purchasing
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
              {detailsList.map((item, index) => (
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
                    <div>
                      <div className="relative flex">
                        <div className="absolute right-0 mt-3.5 mr-28 dark:text-dark-txt-secondary text-gray-400">
                          {item.title && item.title.length === 0 ? '0' : item.title.length} of 60
                        </div>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => {
                            onChange(e, index);
                          }}
                          maxLength={60}
                          required
                          name="title"
                          className="ring-none w-full border dark:placeholder-dark-txt-secondary dark:border-dark-border border-gray-400 py-3 outline-none dark:bg-dark-second pl-4  focus:border-gray-500 focus:outline-transparent focus:ring-transparent"
                          placeholder={item.title || `Example: ${item.example}`}
                        />
                        {detailsList.length > 4 ? (
                          <button
                            type="button"
                            onClick={() => {
                              handleDetailsRemove(index);
                              dispatch(deleteProductDetail(productUUID, item.id));
                            }}
                            className="inline-flex border-t border-b border-r dark:border-dark-border border-gray-400 dark:hover:bg-dark-third hover:bg-gray-50"
                          >
                            <i className="bx bx-trash mx-3 mt-2 text-2xl text-gray-700 dark:text-dark-txt-secondary" />
                          </button>
                        ) : (
                          <div className="inline-flex cursor-not-allowed border-t border-b border-r dark:border-dark-border border-gray-400 dark:hover:bg-dark-third hover:bg-gray-50">
                            <i className="bx bx-trash mx-3 mt-2 text-2xl text-gray-700 dark:text-dark-txt-secondary" />
                          </div>
                        )}

                        <button
                          type="button"
                          className="hidden cursor-move  border-t border-b border-r dark:border-dark-border border-gray-400 dark:hover:bg-dark-third hover:bg-gray-50 md:inline-flex"
                        >
                          <i className="bx bx-menu mx-3 mt-2 text-2xl text-gray-700 dark:text-dark-txt-secondary" />
                        </button>
                      </div>
                      <div className="relative mt-1  rounded-md dark:bg-dark-second bg-white shadow-sm">
                        <SimpleEditor
                          data={item.body}
                          setData={(newContent) => handleBodyChange(newContent, index, item)}
                          placeholder={item.body || item.placeholder}
                          maxLength={1200}
                        />
                      </div>
                      <div className="mt-1 text-right text-gray-500 sm:text-sm dark:text-dark-txt-secondary">
                        {charCounts[item.id] || 0} of 1200
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </>
          )}
        </ul>
        {detailsList.length >= 4 &&
        detailsList.slice(0, 4).every((detail) => detail.title !== '') ? (
          <button
            type="button"
            onClick={() => {
              handleDetailsAdd();
            }}
            className="mt-2 font-bold dark:text-dark-accent text-purple-700"
          >
            + Add more to your response
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
