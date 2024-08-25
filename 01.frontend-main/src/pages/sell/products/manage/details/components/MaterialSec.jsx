import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CircleLoader } from 'react-spinners';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import {
  addMaterial,
  deleteProductMaterial,
  onchangeProductMaterial,
  removeMaterial,
  updateDraggablesMaterial,
} from '@/redux/actions/products/products';

export default function MaterialSec({ product, loading, productUUID, setHasChangesMaterials }) {
  const productMaterials = product && product.materials;
  const reduxmaterialsList = useSelector((state) => state.products.materials);

  const [draggable, setDraggable] = useState(true);
  const dispatch = useDispatch();

  const [materialsList, setMaterialsList] = useState(
    productMaterials && productMaterials.length !== 0 ? productMaterials : reduxmaterialsList,
  );

  const [originalMaterials, setOriginalMaterials] = useState([]);
  useEffect(() => {
    setMaterialsList(
      productMaterials && productMaterials.length !== 0 ? productMaterials : reduxmaterialsList,
    );
    dispatch(
      onchangeProductMaterial(
        productMaterials && productMaterials.length !== 0 ? productMaterials : reduxmaterialsList,
      ),
    );
    setOriginalMaterials(JSON.parse(JSON.stringify(materialsList)));
    // eslint-disable-next-line
  }, [product]);

  const newID = materialsList.length;
  const handleMaterialAdd = () => {
    const newItem = {
      id: uuidv4(),
      position_id: newID,
      title: '',
      image: '',
      stock: 0,
      price: 0.0,
    };
    setMaterialsList([...materialsList, newItem]);
    dispatch(addMaterial(newItem));
  };

  const handleMaterialRemove = (index) => {
    const list = [...materialsList];
    list.splice(index, 1);
    setMaterialsList(list);
    dispatch(removeMaterial(index));
  };

  async function handleMaterialDelete(item) {
    dispatch(deleteProductMaterial(productUUID[0], item.id));
  }

  const [previewPictures, setPreviewPictures] = useState([]);

  const pictureSelectedHandler = (e, index, callback) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    if (file.type === 'image/jpeg' || (file.type === 'image/png' && file.size <= 2000000)) {
      reader.onload = function ImageLoader() {
        let base64String = '';
        base64String = reader.result;
        callback(base64String);
      };

      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setPreviewPictures((prev) => {
          const newPreviewPictures = [...prev];
          newPreviewPictures[index] = reader.result;
          return newPreviewPictures;
        });
        callback(reader.result);
      };
    } else {
      alert('Please select an image type of JPG / JPEG with size 2MB or lower');
      e.target.value = null; // Reset the input value
      // Remove the preview picture for the current index
      setPreviewPictures((prev) => {
        const newPreviewPictures = [...prev];
        newPreviewPictures[index] = null;
        return newPreviewPictures;
      });
    }
  };

  const onChange = (e, index, inputType) => {
    setDraggable(true);
    const { name, value } = e.target;
    const list = [...materialsList];
    if (inputType === 'text') {
      list[index][name] = value;
    } else if (inputType === 'price') {
      // eslint-disable-next-line
      list[index]['price'] = value;
    } else if (inputType === 'image') {
      pictureSelectedHandler(e, index, (base64String) => {
        const list = [...materialsList];
        list[index].image = base64String;
        setMaterialsList(list);
        dispatch(onchangeProductMaterial(list));
      });
    }
    setMaterialsList(list);
    dispatch(onchangeProductMaterial(list));
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
    const _materialsList = [...materialsList];

    // Remove and save the draged item content
    const draggedItemContent = _materialsList.splice(dragItem.current, 1)[0];

    // Switch the position
    _materialsList.splice(dragOverItem.current, 0, draggedItemContent);

    // reset the position ref
    dragItem.current = null;
    dragOverItem.current = null;

    // Update the actual array
    setMaterialsList(_materialsList);
    dispatch(updateDraggablesMaterial(_materialsList));

    const listItem = document.getElementById(item.id);
    listItem.classList.remove('bg-gray-50');
  };

  useEffect(() => {
    dispatch(onchangeProductMaterial(materialsList));
  }, [materialsList, dispatch]);

  useEffect(() => {
    // Check if any of the items have an empty title or hex property
    const hasEmptyItem = materialsList.some((item) => !item.title);

    if (
      originalMaterials.length !== 0 &&
      !_.isEqual(originalMaterials, materialsList) &&
      !hasEmptyItem
    ) {
      setHasChangesMaterials(true);
    } else {
      setHasChangesMaterials(false);
    }
  }, [materialsList, originalMaterials, setHasChangesMaterials]);

  return (
    <div className="">
      <div className="px-8">
        <p className="py-2  text-lg font-bold leading-6 dark:text-dark-txt text-gray-900">
          Does your product have different materials?
        </p>
        <div className="text-md dark:text-dark-txt-secondary">
          Add any Material your product might have.
        </div>
        <ul className=" space-y-4 py-4 ">
          {loading ? (
            <div className="grid w-full place-items-center py-4">
              <CircleLoader
                className="items-center justify-center text-center"
                loading={loading}
                size={35}
                Material="#1c1d1f"
              />
            </div>
          ) : (
            <>
              {materialsList.map((item, index) => (
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
                        Name:
                      </div>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          onChange(e, index, 'text');
                        }}
                        required
                        name="title"
                        className="ring-none w-full border-l border-t border-b dark:placeholder-dark-txt-secondary dark:border-dark-border border-gray-400 py-3 outline-none dark:bg-dark-second pl-16 focus:border-gray-500 focus:outline-transparent focus:ring-transparent"
                        placeholder={item.title ? item.title : `Leather`}
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
                        className="ring-none w-full border dark:placeholder-dark-txt-secondary dark:border-dark-border border-gray-400 py-3 outline-none dark:bg-dark-second pl-6 focus:border-gray-500 focus:outline-transparent focus:ring-transparent"
                        placeholder={item.price ? item.price : `50`}
                      />
                    </div>
                    <div className="relative mb-3.5 flex w-full items-center">
                      <span className="mx-4 h-12 w-12 overflow-hidden rounded-full ">
                        {
                          // eslint-disable-next-line
                          previewPictures.length > 0 ? (
                            <img
                              className="inline-block h-12 w-12 rounded-full object-cover"
                              src={previewPictures[index]}
                              alt="preview"
                            />
                          ) : item.image ? (
                            <img
                              className="inline-block h-12 w-12 rounded-full object-cover"
                              src={item.image}
                              alt="preview"
                            />
                          ) : (
                            <svg
                              className="h-full w-full dark:text-dark-txt text-gray-300"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            />
                          )
                        }
                      </span>
                      <input
                        id="file-upload"
                        name="thumbnail"
                        onChange={(e) => onChange(e, index, 'image')}
                        type="file"
                        required
                        className="focus:ring-indigo-500 w-36 rounded-md border border-gray-300 dark:text-dark-txt dark:border-dark-second dark:bg-dark-third bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      handleMaterialRemove(index);
                      handleMaterialDelete(item);
                    }}
                    className="inline-flex border ml-2 mb-2.5 dark:border-dark-border border-gray-400 dark:hover:bg-dark-third hover:bg-gray-50"
                  >
                    <i className="bx bx-trash mx-3 mt-2 text-2xl text-gray-700 dark:text-dark-txt-secondary" />
                  </button>

                  <button
                    type="button"
                    className="hidden cursor-move mb-2.5 border-t border-b border-r dark:border-dark-border border-gray-400 dark:hover:bg-dark-third hover:bg-gray-50 md:inline-flex"
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
            // if (materialsList[0].title !== '') {
            // }
            handleMaterialAdd();
          }}
          className="mt-2 font-bold dark:text-dark-accent text-purple-700"
        >
          + Add more Materials
        </button>
      </div>
    </div>
  );
}
