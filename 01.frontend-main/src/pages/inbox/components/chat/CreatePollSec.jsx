import { Menu, Popover, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  ChevronDownIcon,
  GifIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  ScaleIcon,
  TrashIcon,
} from '@heroicons/react/20/solid';
import React, { Fragment, useRef, useState } from 'react';

export default function CreatePollSec({
  question,
  setQuestion,
  options,
  setOptions,
  poll,
  setPoll,
}) {
  const buttonRef = useRef(null);
  const handleClosePopover = () => {
    if (buttonRef.current) {
      buttonRef.current.click(); // programmatically clicks the button to close the Popover
    }
  };

  const [dragging, setDragging] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const handleAddOption = () => {
    setOptions([...options, { text: '', checked: false }]);
  };

  const handleOptionChange = (index, text) => {
    setOptions((prevOptions) => {
      const newOptions = [...prevOptions];
      newOptions[index].text = text;
      return newOptions;
    });
  };

  const handleRemoveOption = (index) => {
    setOptions((prevOptions) => {
      const newOptions = [...prevOptions];
      newOptions.splice(index, 1);
      return newOptions;
    });
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (event, index) => {
    event.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    if (draggedIndex !== dragOverIndex) {
      const newOptions = [...options];
      const movedOption = newOptions.splice(draggedIndex, 1)[0];
      newOptions.splice(dragOverIndex, 0, movedOption);
      setOptions(newOptions);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPoll({
      question,
      options: options.map((option) => option.text),
    });
    handleClosePopover();
  };

  return (
    <div className="flex-items flex">
      <Popover as="div" className="relative inline-block text-left">
        {({ open }) => (
          <>
            <div>
              <Popover.Button
                ref={buttonRef}
                className={`
            ${open ? '' : 'text-opacity-90'}
            relative -m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500
          `}
              >
                <span className="flex items-center justify-center">
                  <span>
                    <ScaleIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                    <span className="sr-only"> Add your gif </span>
                  </span>
                </span>
              </Popover.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel
                className="
      absolute z-20 mt-2 w-screen max-w-xl origin-top-left transform rounded-lg border border-gray-200 bg-white shadow-lg ring-1 ring-black ring-opacity-5
    "
                style={{ top: '-19rem' }}
              >
                <div className=" h-80 overflow-y-auto rounded-lg">
                  <form
                    onSubmit={handleSubmit}
                    className="divide-y divide-gray-200 overflow-hidden  bg-white "
                  >
                    <div className="px-4 py-5 sm:px-6">
                      {/* Header Content goes here */}
                      <div className="border-b-300 flex w-full border">
                        <div className="flex w-full flex-grow items-stretch space-x-1">
                          <input
                            type="text"
                            value={question}
                            onChange={(e) => {
                              setQuestion(e.target.value);
                            }}
                            className="text-md block w-full border border-gray-700 outline-none ring ring-transparent focus:border-gray-700 focus:outline-transparent focus:ring-transparent"
                            placeholder="Poll Question"
                          />
                          <button
                            type="button"
                            onClick={handleAddOption}
                            className="rounded bg-white py-1 px-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                          >
                            Add
                          </button>
                          <button
                            type="submit"
                            className="rounded bg-white py-1 px-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                          >
                            {poll ? 'Save' : 'Create'}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-5 sm:p-6">
                      {/* Content goes here */}
                      <ul className="space-y-2">
                        {options &&
                          options.map((option, index) => (
                            <li
                              draggable={dragging}
                              onDragEnd={handleDragEnd}
                              onDragOver={(event) => handleDragOver(event, index)}
                              onDragStart={() => handleDragStart(index)}
                              className="flex w-full items-center bg-white"
                              key={index}
                            >
                              <input
                                type="text"
                                className="w-full"
                                placeholder="Poll Option"
                                value={option.text}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                              />
                              <button
                                type="button"
                                className="hover:text-red-400 ml-4 text-gray-400"
                                onClick={() => handleRemoveOption(index)}
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                              <button
                                type="button"
                                className="hover:text-red-400 ml-4 text-gray-400"
                                onMouseDown={() => setDragging(true)}
                                onMouseUp={() => setDragging(false)}
                              >
                                <Bars3Icon className="h-5 w-5" />
                              </button>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </form>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
}
