import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import {
  addWhoIsFor,
  deleteCourseWhoIsFor,
  onchangeCourseWhoIsFor,
  removeWhoIsFor,
  updateDraggablesWhoIsFor,
} from '@/redux/actions/courses/courses';

export default function WhoIsForSec({ course, courseUUID, setHasChangesWhoIsFor }) {
  const courseWhoIsFor = course && course.who_is_for;
  const reduxWhoIsFor = useSelector((state) => state.courses.whoIsFor);
  const [draggable, setDraggable] = useState(true);
  const dispatch = useDispatch();

  const [whoIsForList, setWhoIsForList] = useState(
    courseWhoIsFor && courseWhoIsFor.length !== 0 ? courseWhoIsFor : reduxWhoIsFor,
  );

  const [originalWhoIsFor, setOriginalWhoIsFor] = useState([]);
  useEffect(() => {
    setWhoIsForList(courseWhoIsFor && courseWhoIsFor.length !== 0 ? courseWhoIsFor : reduxWhoIsFor);
    dispatch(
      onchangeCourseWhoIsFor(
        courseWhoIsFor && courseWhoIsFor.length !== 0 ? courseWhoIsFor : reduxWhoIsFor,
      ),
    );
    setOriginalWhoIsFor(JSON.parse(JSON.stringify(whoIsForList)));
    // eslint-disable-next-line
  }, [course]);

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
    dispatch(deleteCourseWhoIsFor(courseUUID[0], item.id));
  }

  const onChange = (e, index) => {
    setDraggable(true);
    const { name, value } = e.target;
    setWhoIsForList((prev) => {
      const list = [...prev];
      list[index][name] = value;
      dispatch(onchangeCourseWhoIsFor(list));
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
        Who is this course for?
      </p>
      <p className="text-md dark:text-dark-txt-secondary">
        First and foremost, it is important to understand the intended learners for your course. Who
        are you creating this course for? What are their needs and wants? What are their pain
        points? Answering these questions will help you to create a course that is tailored to your
        target audience, and will be more likely to resonate with them.
      </p>
      <ul className=" space-y-4 py-4 ">
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
              <div className="absolute right-0 mt-3.5 mr-4 text-gray-400">
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
                className="ring-none w-full border dark:border-dark-border border-gray-700 py-3 outline-none dark:bg-dark-second pl-4 focus:border-gray-500 focus:outline-transparent focus:ring-transparent"
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
