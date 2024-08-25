import React, { useEffect, useRef, useState } from 'react';
import { Tab } from '@headlessui/react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import ReactDropzone from 'react-dropzone';
// import { CircleLoader } from 'react-spinners/CircleLoader';
import {
  deleteProductImage,
  onchangeProductDocument,
  updateDraggablesImage,
} from '@/redux/actions/products/products';
// import { onchangeProductDocument, onchangeProductImageFilename } from "../../../../../redux/actions/products/products";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function DocumentationSec({ product, productUUID, setHasChangesDocs }) {
  const productDocuments = product && product.documents;
  const reduxDocuments = useSelector((state) => state.products.documents);

  const dispatch = useDispatch();

  const [documentsList, setDocumentsList] = useState(
    productDocuments && productDocuments.length !== 0 ? productDocuments : reduxDocuments,
  );

  const [originalDocuments, setOriginalDocuments] = useState([]);
  useEffect(() => {
    setDocumentsList(
      productDocuments && productDocuments.length !== 0 ? productDocuments : reduxDocuments,
    );
    dispatch(
      onchangeProductDocument(
        productDocuments && productDocuments.length !== 0 ? productDocuments : reduxDocuments,
      ),
    );
    setOriginalDocuments(JSON.parse(JSON.stringify(documentsList)));
    // eslint-disable-next-line
  }, [product]);

  const [base64Files, setBase64Files] = useState([]);

  const handleDrop = (acceptedFiles) => {
    const newItems = acceptedFiles.map((file, index) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return new Promise((resolve, reject) => {
        reader.onload = () => {
          resolve({
            id: uuidv4(),
            position_id: index,
            title: file.name,
            file: reader.result,
          });
        };
        reader.onerror = (error) => {
          reject(error);
        };
      });
    });

    Promise.all(newItems)
      .then((items) => {
        setDocumentsList([...documentsList, ...items]);
        setBase64Files([...base64Files, ...items]);
        dispatch(onchangeProductDocument([...base64Files, ...items]));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDelete = (index) => {
    setDocumentsList(documentsList.filter((image, i) => i !== index));
  };

  async function handleImageDelete(item) {
    // dispatch(deleteProductImage(productUUID, item));
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
    // Duplicate items
    const _documentsList = [...documentsList];

    // Remove and save the draged item content
    const draggedItemContent = _documentsList.splice(dragItem.current, 1)[0];

    // Switch the position
    _documentsList.splice(dragOverItem.current, 0, draggedItemContent);

    // reset the position ref
    dragItem.current = null;
    dragOverItem.current = null;

    // Update the actual array
    setDocumentsList(_documentsList);
    dispatch(updateDraggablesImage(_documentsList));

    const listItem = document.getElementById(item.id);
    listItem.classList.remove('bg-gray-50');
  };

  useEffect(() => {
    if (base64Files.length > 0) dispatch(onchangeProductDocument(base64Files));
  }, [base64Files, dispatch]);

  useEffect(() => {
    dispatch(onchangeProductDocument(documentsList));
  }, [documentsList, dispatch]);

  useEffect(() => {
    // Check if any of the items have an empty title or hex property
    if (!_.isEqual(originalDocuments, documentsList)) {
      setHasChangesDocs(true);
    } else {
      setHasChangesDocs(false);
    }
  }, [documentsList, originalDocuments, setHasChangesDocs]);

  return (
    <div>
      <span className="text-md mb-2 block font-bold dark:text-dark-txt text-gray-900">
        Documents
      </span>
      <div className="grid gap-x-2 md:grid-cols-2">
        <div className="w-full">
          {/* Image gallery */}
          <Tab.Group as="div" className="flex flex-col-reverse">
            {/* Image selector */}
            <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
              <Tab.List className="grid grid-cols-4 gap-6">
                {documentsList.map((image) => (
                  <Tab
                    key={image.id}
                    className="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
                  >
                    {({ selected }) => (
                      <>
                        <span className="sr-only"> {image.title} </span>
                        <span className="absolute inset-0 overflow-hidden rounded-md">
                          <img
                            src={image.file}
                            alt=""
                            className="h-full w-full object-cover object-center"
                          />
                        </span>
                        <span
                          className={classNames(
                            selected ? 'ring-indigo-500' : 'ring-transparent',
                            'pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2',
                          )}
                          aria-hidden="true"
                        />
                      </>
                    )}
                  </Tab>
                ))}
              </Tab.List>
            </div>

            <Tab.Panels className="aspect-w-0.5 aspect-h-0.5 w-full">
              {documentsList.map((image) => (
                <Tab.Panel key={image.id}>
                  <img
                    src={image.file}
                    alt=""
                    className="h-64 w-full object-cover object-center sm:rounded-lg"
                  />
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </div>
        <div className="w-full">
          <p className="font-base text-sm dark:text-dark-txt-secondary">
            Upload your Product image here. It must meet our{' '}
            <Link
              href="/teaching_hub/article"
              className="text-purple-600 dark:text-dark-accent dark:hover:text-dark-primary underline"
            >
              Product image quality standards
            </Link>{' '}
            to be accepted. Important guidelines: 750x422 pixels; .jpg, .jpeg,. gif, or .png. no
            text on the image.
          </p>
          <div className="mb-2 w-full">
            <ReactDropzone onDrop={handleDrop}>
              {({ getRootProps, getInputProps }) => (
                <div
                  className="form-control
                            text-md 

                            m-0
                            mt-2
                            block
                            w-full
                            cursor-pointer
                            rounded
                            border-2 border-dashed
                             border-gray-200
                            bg-white
                            dark:bg-dark-second
                            dark:border-dark-border
                            dark:text-dark-txt-secondary
                            hover:dark:bg-dark-third
                            bg-clip-padding p-4
                            text-gray-700
                            transition
                            ease-in-out
                            hover:border-gray-300
                            hover:bg-gray-50
                            focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none"
                  {...getRootProps()}
                >
                  <input {...getInputProps()} />
                  Drag and drop or click to upload documents
                </div>
              )}
            </ReactDropzone>
            <div className="mt-2 h-1 w-full bg-gray-300 dark:bg-dark-second">
              {/* <div
                    style={{ width: `${percentageVideo}%` }}
                    className={`h-full ${percentageVideo < 70 ? 'bg-rose-600' : 'bg-green-600'}`}
                /> */}
            </div>
          </div>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
            {documentsList.map((item, index) => (
              <li
                key={item.id}
                id={item.id}
                draggable
                onDragStart={(e) => onDragStart(e, index, item)}
                onDragEnter={(e) => onDragEnter(e, index)}
                onDragEnd={(e) => onDragEnd(e, index, item)}
                onDragOver={(e) => e.preventDefault()}
                className="relative"
              >
                <div className="group aspect-w-10 aspect-h-7 block w-full overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={item.file}
                    alt=""
                    className="pointer-events-none object-cover group-hover:opacity-75"
                  />
                </div>
                <p className="pointer-events-none mt-2 block truncate text-sm font-medium dark:text-dark-txt-secondary text-gray-900">
                  {item.title}
                </p>
                <button
                  type="button"
                  className="block text-sm font-medium dark:text-dark-txt-secondary text-gray-500"
                >
                  <i
                    className="bx bx-trash text-xl"
                    onClick={() => {
                      handleDelete(index);
                      documentsList.length > 0 ? handleImageDelete(item.id) : null;
                    }}
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
