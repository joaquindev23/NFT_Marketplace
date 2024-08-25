import React, { useEffect, useRef, useState } from 'react';
import { Tab } from '@headlessui/react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import ReactDropzone from 'react-dropzone';
// import { CircleLoader } from 'react-spinners/CircleLoader';
import { deleteCourseImage } from '@/redux/actions/courses/courses';
import { ToastError } from '@/components/ToastError';
import Image from 'next/image';
// import { onchangeCourseImage, onchangeCourseImageFilename } from "@/redux/actions/Courses/Courses";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function ImageGallery({
  course,
  imagesList,
  setImagesList,
  setHasChangesImages,
  courseImages,
  courseUUID,
}) {
  const dispatch = useDispatch();

  const [originalImages, setOriginalImages] = useState([]);
  useEffect(() => {
    setImagesList(courseImages && courseImages.length !== 0 ? courseImages : []);
    setOriginalImages(JSON.parse(JSON.stringify(imagesList)));
  }, [course]);

  const [base64Images, setBase64Images] = useState([]);

  const handleDrop = (acceptedFiles) => {
    const newItems = [];
    acceptedFiles.forEach((file) => {
      if (file.size > 2 * 1024 * 1024) {
        ToastError('Image must be Max 2mb');
        return;
      }
      if (file.type !== 'image/jpeg') {
        ToastError('Only .jpg or .jpeg files are allowed');
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      const promise = new Promise((resolve, reject) => {
        reader.onload = () => {
          resolve({
            id: uuidv4(),
            position_id: newItems.length,
            title: file.name,
            file: reader.result,
          });
        };
        reader.onerror = (error) => {
          reject(error);
        };
      });

      newItems.push(promise);
    });

    if (newItems.length === 0) {
      return;
    }

    Promise.all(newItems)
      .then((items) => {
        setImagesList([...imagesList, ...items]);
        setBase64Images([...base64Images, ...items]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDelete = (index) => {
    setImagesList(imagesList.filter((image, i) => i !== index));
  };

  async function handleImageDelete(imageId) {
    dispatch(deleteCourseImage(courseUUID[0], imageId));
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
    const _imagesList = [...imagesList];

    // Remove and save the draged item content
    const draggedItemContent = _imagesList.splice(dragItem.current, 1)[0];

    // Switch the position
    _imagesList.splice(dragOverItem.current, 0, draggedItemContent);

    // reset the position ref
    dragItem.current = null;
    dragOverItem.current = null;

    // Update the actual array
    setImagesList(_imagesList);

    const listItem = document.getElementById(item.id);
    listItem.classList.remove('bg-gray-50');
  };

  useEffect(() => {
    if (!_.isEqual(originalImages, imagesList)) {
      setHasChangesImages(true);
    } else {
      setHasChangesImages(false);
    }
  }, [imagesList, originalImages, setHasChangesImages]);

  return (
    <div>
      <span className="text-md mb-2 block font-bold dark:text-dark-txt text-gray-900">
        Course images
      </span>
      <div className="grid gap-x-2 md:grid-cols-2">
        <div className="w-full">
          {/* Image gallery */}
          <Tab.Group as="div" className="flex flex-col-reverse">
            {/* Image selector */}
            <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
              <Tab.List className="grid grid-cols-4 gap-6">
                {imagesList &&
                  imagesList.map((image) => (
                    <Tab
                      key={image.id}
                      className="relative flex h-24 cursor-pointer items-center justify-center rounded-md dark:bg-dark-second dark:border-dark-border bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 "
                    >
                      {({ selected }) => (
                        <>
                          <span className="sr-only"> {image.title} </span>
                          <span className="absolute inset-0 overflow-hidden rounded-md">
                            <Image
                              width={256}
                              height={256}
                              src={image.file}
                              alt=""
                              className="h-full w-full object-cover object-center"
                            />
                          </span>
                          <span
                            className={classNames(
                              selected
                                ? 'border-iris-500 dark:border-dark-accent'
                                : 'dark:border-dark-border',
                              'pointer-events-none absolute inset-0 rounded-md border ring-none outline-none focus:ring-none focus:outline-none',
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
              {imagesList &&
                imagesList.map((image) => (
                  <Tab.Panel key={image.id}>
                    <Image
                      width={256}
                      height={256}
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
            Upload your Course image here. It must meet our{' '}
            <Link
              href="/teaching_hub/article"
              className="dark:text-dark-accent text-purple-600 underline"
            >
              Course image quality standards
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
                  Drag and drop or click to upload images
                </div>
              )}
            </ReactDropzone>
            <div className="mt-2 h-1 w-full dark:bg-dark-second bg-gray-300">
              {/* <div
                    style={{ width: `${percentageVideo}%` }}
                    className={`h-full ${percentageVideo < 70 ? 'bg-rose-600' : 'bg-green-600'}`}
                /> */}
            </div>
          </div>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
            {imagesList &&
              imagesList.map((item, index) => (
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
                    <Image
                      width={256}
                      height={256}
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
                        courseImages.length > 0 ? handleImageDelete(item.id) : null;
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
