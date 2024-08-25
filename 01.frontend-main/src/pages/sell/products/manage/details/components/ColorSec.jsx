import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CircleLoader } from 'react-spinners';
import { v4 as uuidv4 } from 'uuid';
import { motion } from 'framer-motion';
import _ from 'lodash';
import {
  addColor,
  deleteProductColor,
  onchangeProductColors,
  removeColor,
  updateDraggablesColor,
} from '@/redux/actions/products/products';

export default function ColorSec({ product, loading, productUUID, setHasChangesColors }) {
  const productColor = product && product.colors;
  const reduxColorList = useSelector((state) => state.products.colors);

  const [draggable, setDraggable] = useState(true);
  const dispatch = useDispatch();

  const [colorList, setColorList] = useState(
    productColor && productColor.length !== 0 ? productColor : reduxColorList,
  );

  const [originalColors, setOriginalColors] = useState([]);
  useEffect(() => {
    setColorList(productColor && productColor.length !== 0 ? productColor : reduxColorList);
    dispatch(
      onchangeProductColors(
        productColor && productColor.length !== 0 ? productColor : reduxColorList,
      ),
    );
    setOriginalColors(JSON.parse(JSON.stringify(colorList)));
    // eslint-disable-next-line
  }, [product]);

  const newID = colorList.length;
  const handleColorAdd = () => {
    const newItem = { id: uuidv4(), position_id: newID, title: '', hex: '#000000' };
    setColorList([...colorList, newItem]);
    dispatch(addColor(newItem));
  };

  const handleColorRemove = (index) => {
    const list = [...colorList];
    list.splice(index, 1);
    setColorList(list);
    dispatch(removeColor(index));
  };

  async function handleColorDelete(item) {
    dispatch(deleteProductColor(productUUID[0], item.id));
  }

  const onChange = (e, index, inputType) => {
    setDraggable(true);
    const { name, value } = e.target;
    const list = [...colorList];
    if (inputType === 'text') {
      list[index][name] = value;
    } else if (inputType === 'color') {
      // eslint-disable-next-line
      list[index]['hex'] = value;
    }
    setColorList(list);
    dispatch(onchangeProductColors(list));
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

  // Handle drag sorting
  const onDragEnd = (e, index, item) => {
    // Duplicate items
    const _colorList = [...colorList];

    // Remove and save the draged item content
    const draggedItemContent = _colorList.splice(dragItem.current, 1)[0];

    // Switch the position
    _colorList.splice(dragOverItem.current, 0, draggedItemContent);

    // reset the position ref
    dragItem.current = null;
    dragOverItem.current = null;

    // Update the actual array
    setColorList(_colorList);
    dispatch(updateDraggablesColor(_colorList));

    const listItem = document.getElementById(item.id);
    listItem.classList.remove('bg-gray-50');
  };

  useEffect(() => {
    dispatch(onchangeProductColors(colorList));
  }, [colorList, dispatch]);

  useEffect(() => {
    // Check if any of the items have an empty title or hex property
    const hasEmptyItem = colorList.some((item) => !item.title || !item.hex);

    if (originalColors.length !== 0 && !_.isEqual(originalColors, colorList) && !hasEmptyItem) {
      setHasChangesColors(true);
    } else {
      setHasChangesColors(false);
    }
  }, [colorList, originalColors, setHasChangesColors]);

  return (
    <div className="">
      <div className="px-8">
        <p className="py-2  text-lg font-bold leading-6 dark:text-dark-txt text-gray-900">
          Does your product have colors?
        </p>
        <div className="text-md dark:text-dark-txt-secondary">
          Add any color your product might have.
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
              {colorList.map((item, index) => (
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
                      <div className="absolute right-0 mt-3.5 mr-4 dark:text-dark-txt-secondary text-gray-400">
                        {item.title && item.title.length === 0 ? '0' : item.title.length} of 60
                      </div>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          onChange(e, index, 'text');
                        }}
                        required
                        name="title"
                        className="ring-none w-full border dark:placeholder-dark-txt-secondary dark:border-dark-border border-gray-400 py-3 outline-none dark:bg-dark-second pl-2 focus:border-gray-500 focus:outline-transparent focus:ring-transparent"
                        placeholder={item.title ? item.title : `Example: Black`}
                      />
                    </div>
                    <motion.input
                      type="color"
                      name="hex"
                      className="ml-2 inline-flex  h-12 cursor-pointer rounded-full dark:bg-dark-bg bg-gray-200 text-gray-700"
                      value={item.hex}
                      onChange={(e) => {
                        onChange(e, index, 'color');
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      handleColorRemove(index);
                      handleColorDelete(item);
                    }}
                    className="inline-flex border ml-2 dark:border-dark-border border-gray-400 dark:hover:bg-dark-third hover:bg-gray-50"
                  >
                    <i className="bx bx-trash mx-3 mt-2 text-2xl text-gray-700 dark:text-dark-txt-secondary" />
                  </button>

                  <button
                    type="button"
                    className="hidden cursor-move  border-t border-b border-r dark:border-dark-border border-gray-400 dark:hover:bg-dark-third hover:bg-gray-50 md:inline-flex"
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
            // if (colorList[0].title !== '') {
            // }
            handleColorAdd();
            setHasChangesColors(false);
          }}
          className="mt-2 font-bold dark:text-dark-accent text-purple-700"
        >
          + Add more colors
        </button>
      </div>
    </div>
  );
}
