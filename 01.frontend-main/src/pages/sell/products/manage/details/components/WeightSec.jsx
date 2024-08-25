import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CircleLoader } from 'react-spinners';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import {
  addWeight,
  deleteProductWeight,
  onchangeProductWeight,
  removeWeight,
  updateDraggablesWeight,
} from '@/redux/actions/products/products';

export default function WeightSec({ product, loading, productUUID, setHasChangesWeights }) {
  const productWeights = product && product.weights;
  const reduxWeightsList = useSelector((state) => state.products.weights);

  const [draggable, setDraggable] = useState(true);
  const dispatch = useDispatch();

  const [weightList, setWeightsList] = useState(
    productWeights && productWeights.length !== 0 ? productWeights : reduxWeightsList,
  );

  const [originalWeights, setOriginalWeights] = useState([]);
  useEffect(() => {
    setWeightsList(
      productWeights && productWeights.length !== 0 ? productWeights : reduxWeightsList,
    );
    dispatch(
      onchangeProductWeight(
        productWeights && productWeights.length !== 0 ? productWeights : reduxWeightsList,
      ),
    );
    setOriginalWeights(JSON.parse(JSON.stringify(weightList)));
    // eslint-disable-next-line
  }, [product]);

  const newID = weightList.length;
  const newItem = {
    id: uuidv4(),
    position_id: newID,
    title: '',
    hex: '#000000',
    price: 0.0,
    stock: 0,
  };
  const handleWeightAdd = () => {
    setWeightsList([...weightList, newItem]);
    dispatch(addWeight(newItem));
  };

  const handleWeightRemove = (index) => {
    const list = [...weightList];
    list.splice(index, 1);
    setWeightsList(list);
    dispatch(removeWeight(index));
  };

  async function handleWeightDelete(item) {
    dispatch(deleteProductWeight(productUUID[0], item.id));
  }

  const onChange = (e, index, inputType) => {
    setDraggable(true);
    const { name, value } = e.target;
    const list = [...weightList];
    if (inputType === 'text') {
      list[index][name] = value;
    } else if (inputType === 'price') {
      // eslint-disable-next-line
      list[index]['price'] = value;
    } else if (inputType === 'stock') {
      // eslint-disable-next-line
      list[index]['stock'] = value;
    }
    setWeightsList(list);
    dispatch(onchangeProductWeight(list));
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
    const _weightList = [...weightList];

    // Remove and save the draged item content
    const draggedItemContent = _weightList.splice(dragItem.current, 1)[0];

    // Switch the position
    _weightList.splice(dragOverItem.current, 0, draggedItemContent);

    // reset the position ref
    dragItem.current = null;
    dragOverItem.current = null;

    // Update the actual array
    setWeightsList(_weightList);
    dispatch(updateDraggablesWeight(_weightList));

    const listItem = document.getElementById(item.id);
    listItem.classList.remove('bg-gray-50');
  };

  useEffect(() => {
    dispatch(onchangeProductWeight(weightList));
  }, [weightList, dispatch]);

  useEffect(() => {
    // Check if any of the items have an empty title or hex property
    const hasEmptyItem = weightList.some((item) => !item.title);

    if (!_.isEqual(originalWeights, weightList) && !hasEmptyItem) {
      setHasChangesWeights(true);
    } else {
      setHasChangesWeights(false);
    }
  }, [weightList, originalWeights, setHasChangesWeights]);

  return (
    <div className="">
      <div className="px-8">
        <p className="py-2 dark:text-dark-txt text-lg font-bold leading-6 text-gray-900">
          Is your product sold by weight?
        </p>
        <div className="text-md dark:text-dark-txt-secondary">
          Add any Weight your product might have.
        </div>
        <ul className=" space-y-4 py-4 ">
          {loading ? (
            <div className="grid w-full place-items-center py-4">
              <CircleLoader
                className="items-center justify-center text-center"
                loading={loading}
                size={35}
                Weight="#1c1d1f"
              />
            </div>
          ) : (
            <>
              {weightList.map((item, index) => (
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
                        g:
                      </div>
                      <input
                        type="number"
                        value={item.title}
                        onChange={(e) => {
                          onChange(e, index, 'text');
                        }}
                        required
                        name="title"
                        className="ring-none w-full border-l border-t border-b dark:placeholder-dark-txt-secondary dark:border-dark-border border-gray-400 py-3 outline-none dark:bg-dark-second pl-6 focus:border-gray-500 focus:outline-transparent focus:ring-transparent"
                        placeholder={item.title ? item.title : `3.5`}
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
                        placeholder={item.price ? item.price : `50`}
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
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      handleWeightRemove(index);
                      handleWeightDelete(item);
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
                </li>
              ))}
            </>
          )}
        </ul>
        <button
          type="button"
          onClick={() => {
            // if (weightList[0].title !== '') {
            // }
            handleWeightAdd();
          }}
          className="mt-2 font-bold dark:text-dark-accent text-purple-700"
        >
          + Add more Weights
        </button>
      </div>
    </div>
  );
}
