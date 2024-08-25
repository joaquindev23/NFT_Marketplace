import React, { useState, useRef, Fragment } from 'react';
import { CircleLoader } from 'react-spinners';
import { Dialog, Transition } from '@headlessui/react';
import { GlobeAltIcon, PaperClipIcon, TrashIcon } from '@heroicons/react/24/outline';
import DeleteResource from '@/api/manage/curriculum/episodes/DeleteResource';

export default function ResourceContentItem({
  index,
  resource,
  FetchInstructorSections,
  setSections,
  courseUUID,
}) {
  const [open, setOpen] = useState(false);

  const cancelButtonRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleResourceRemove = async () => {
    setLoading(true);
    await DeleteResource(resource && resource.id);
    setLoading(false);
    const sectionsData = await FetchInstructorSections(courseUUID);
    setSections(sectionsData);
  };

  return (
    <li className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
      <div className="flex w-0 flex-1 items-center">
        {resource && resource.file ? (
          <PaperClipIcon
            className="h-5 w-5 flex-shrink-0 dark:text-dark-txt text-gray-400"
            aria-hidden="true"
          />
        ) : (
          <GlobeAltIcon className="h-5 w-5 flex-shrink-0 text-light-blue" aria-hidden="true" />
        )}
        <a
          href={resource && resource.url}
          rel="noreferrer"
          target="_blank"
          className="ml-2 w-0 flex-1 truncate dark:text-dark-txt-secondary"
        >
          {resource && resource.title}
        </a>
      </div>
      <div className="ml-4 flex-shrink-0">
        {loading ? (
          <CircleLoader loading={loading} className="inline-flex" size={20} color="#1c1d1f" />
        ) : (
          <TrashIcon
            onClick={() => {
              setOpen(true);
            }}
            className="h-5 w-5 flex-shrink-0 cursor-pointer dark:text-dark-txt-secondary text-gray-700"
            aria-hidden="true"
          />
        )}
      </div>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                        Please confirm
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          You are about to remove a resource. Are you sure you want to continue?
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-black px-4 py-2 text-base font-medium text-white sm:col-start-2 sm:text-sm"
                      onClick={() => {
                        handleResourceRemove(index);
                        setOpen(false);
                      }}
                    >
                      OK
                    </button>
                    <button
                      type="button"
                      className="focus:ring-indigo-500 mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                      onClick={() => setOpen(false)}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </li>
  );
}
