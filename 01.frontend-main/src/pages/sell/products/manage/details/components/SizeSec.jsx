import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CircleLoader } from 'react-spinners';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import {
  addSize,
  deleteProductSize,
  onchangeProductSizes,
  removeSize,
  updateDraggablesSize,
} from '@/redux/actions/products/products';

export default function SizeSec({ product, loading, productUUID, setHasChangesSizes }) {
  const productSizes = product && product.sizes;

  const reduxSizesList = useSelector((state) => state.products.sizes);

  const [draggable, setDraggable] = useState(true);
  const dispatch = useDispatch();

  const [sizesList, setsizesList] = useState(
    productSizes && productSizes.length !== 0 ? productSizes : reduxSizesList,
  );

  const [originalSizes, setOriginalSizes] = useState([]);
  useEffect(() => {
    setsizesList(productSizes && productSizes.length !== 0 ? productSizes : reduxSizesList);
    dispatch(
      onchangeProductSizes(
        productSizes && productSizes.length !== 0 ? productSizes : reduxSizesList,
      ),
    );
    setOriginalSizes(JSON.parse(JSON.stringify(sizesList)));
    // eslint-disable-next-line
  }, [product]);

  const newID = sizesList.length;
  const handleSizesAdd = () => {
    const newItem = { id: uuidv4(), position_id: newID, title: '', price: 0.0, stock: 0 };
    setsizesList([...sizesList, newItem]);
    dispatch(addSize(newItem));
  };

  const handleSizesRemove = (index) => {
    setsizesList(sizesList.filter((item, i) => i !== index));
    dispatch(removeSize(index));
  };

  async function handleSizesDelete(item) {
    dispatch(deleteProductSize(productUUID[0], item.id));
  }

  const onChange = (e, index, inputType) => {
    setDraggable(true);
    const { name, value } = e.target;
    const list = [...sizesList];
    if (inputType === 'text') {
      list[index][name] = value;
    } else if (inputType === 'price') {
      // eslint-disable-next-line
      list[index]['price'] = value;
    } else if (inputType === 'stock') {
      // eslint-disable-next-line
      list[index]['stock'] = value;
    }
    setsizesList(list);
    dispatch(onchangeProductSizes(list));
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
    const _sizesList = [...sizesList];
    const draggedItemContent = _sizesList.splice(dragItem.current, 1)[0];
    _sizesList.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setsizesList(_sizesList);
    dispatch(updateDraggablesSize(_sizesList));

    const listItem = document.getElementById(item.id);
    listItem.classList.remove('bg-gray-50');
  };

  useEffect(() => {
    for (let i = 0; i < sizesList.length; i += 1) {
      const item = sizesList[i];
      if (item.title === '') {
        setDraggable(false);
      }
    }
  }, [sizesList]);

  useEffect(() => {
    // Check if any of the items have an empty title or hex property
    const hasEmptyItem = sizesList.some((item) => !item.title);

    if (originalSizes.length !== 0 && !_.isEqual(originalSizes, sizesList) && !hasEmptyItem) {
      setHasChangesSizes(true);
    } else {
      setHasChangesSizes(false);
    }
  }, [sizesList, originalSizes, setHasChangesSizes]);

  return (
    <div className="block">
      <div className="px-8">
        <p className="py-2  text-lg font-bold leading-6 dark:text-dark-txt text-gray-900">
          What are the sizes of your product?
        </p>
        <div className="text-md dark:text-dark-txt-secondary">
          List any size option your product might have.
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
              {sizesList.map((item, index) => (
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
                  <div className="relative flex w-full">
                    <div className="relative w-full">
                      <div className="absolute left-0 mt-3 ml-2 dark:text-dark-txt text-gray-400">
                        Size:
                      </div>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          onChange(e, index, 'text');
                        }}
                        required
                        name="title"
                        className="ring-none w-full border-l border-t border-b dark:placeholder-dark-txt-secondary dark:border-dark-border border-gray-400 py-3 outline-none dark:bg-dark-second pl-20 focus:border-gray-500 focus:outline-transparent focus:ring-transparent"
                        placeholder={item.title ? item.title : `SM`}
                      />
                    </div>
                    <div className="relative w-full">
                      <div className="absolute left-0 mt-[12.5px] ml-2 dark:text-dark-txt text-gray-400">
                        $
                      </div>
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) => {
                          onChange(e, index, 'price');
                        }}
                        required
                        name="price"
                        className="ring-none w-full border-l border-t border-b dark:placeholder-dark-txt-secondary dark:border-dark-border border-gray-400 py-3 outline-none dark:bg-dark-second pl-6 focus:border-gray-500 focus:outline-transparent focus:ring-transparent"
                        placeholder={item.price ? item.price : `Price increase: 5`}
                      />
                    </div>
                    <div className="relative w-full">
                      <div className="absolute left-0 mt-[12.5px] ml-2 dark:text-dark-txt text-gray-400">
                        Stock:
                      </div>
                      <input
                        type="number"
                        value={item.stock}
                        onChange={(e) => {
                          onChange(e, index, 'stock');
                        }}
                        required
                        name="stock"
                        className="ring-none w-full border dark:placeholder-dark-txt-secondary dark:border-dark-border border-gray-400 py-3 outline-none dark:bg-dark-second pl-16 focus:border-gray-500 focus:outline-transparent focus:ring-transparent"
                        placeholder={item.stock ? item.stock : `23`}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        handleSizesRemove(index);
                        handleSizesDelete(item);
                      }}
                      className="inline-flex border-t border-b border-r dark:border-dark-border border-gray-400 dark:hover:bg-dark-third hover:bg-gray-50"
                    >
                      <i className="bx bx-trash mx-3 mt-2 text-2xl text-gray-700 dark:text-dark-txt-secondary" />
                    </button>
                    <button
                      type="button"
                      className="hidden cursor-move  border-t border-b border-r dark:border-dark-border border-gray-400 dark:hover:bg-dark-third hover:bg-gray-50 md:inline-flex"
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
            // if (sizesList[0].title !== '') {
            // }
            handleSizesAdd();
          }}
          className="mt-2 font-bold dark:text-dark-accent text-purple-700"
        >
          + Add more sizes
        </button>
      </div>
    </div>
  );
}
