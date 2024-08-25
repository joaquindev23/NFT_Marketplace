import Image from 'next/image';
import React, { Fragment, useState, useRef, useEffect } from 'react';
import { PencilIcon, PlayCircleIcon } from '@heroicons/react/24/outline';
import { Dialog, Transition } from '@headlessui/react';
import DOMPurify from 'dompurify';
import EditEpisodeContent from '@/api/manage/curriculum/episodes/EditContent';
import RichTextEditor from '@/components/RichTextEditor';

export default function ArticleTableContent({
  FetchInstructorSections,
  episode,
  setOpen,
  setSections,
  courseUUID,
}) {
  const [openReplace, setOpenReplace] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [videoContent, setVideoContent] = useState(false);
  const [edit, setEdit] = useState(false);
  const cancelButtonRef = useRef(null);

  const handleRemoveContent = async () => {
    await EditEpisodeContent(episode.id, '');
    const sectionsData = await FetchInstructorSections(courseUUID);
    setSections(sectionsData);
    setOpen(false);
  };

  const handleEditContent = async (e) => {
    e.preventDefault();
    await EditEpisodeContent(episode.id, videoContent);
    const sectionsData = await FetchInstructorSections(courseUUID);
    setSections(sectionsData);
    setOpen(false);
  };

  const [sanitizedDescription, setSanitizedDescription] = useState('');

  useEffect(() => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = DOMPurify.sanitize(episode.content);
    setSanitizedDescription(tempDiv.textContent);
  }, [episode]);

  return (
    <>
      {edit ? (
        <form
          onSubmit={(e) => {
            handleEditContent(e);
          }}
          className="pb-14"
        >
          {/* <label htmlFor="email" className="block text-sm font-bold text-gray-900">
                    Article Content
                </label> */}
          <RichTextEditor data={setVideoContent} />

          <div className="float-right mt-4 space-x-2">
            <button
              type="button"
              onClick={() => {
                setEdit(false);
              }}
              className="inline-flex cursor-pointer items-center border border-transparent px-4 py-2 text-sm font-medium text-black hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center border border-transparent bg-black px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-gray-900"
            >
              Save Article
            </button>
          </div>
        </form>
      ) : (
        <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
          <div className="ml-4 mt-2">
            <div className="flex">
              <div className="mr-4 flex-shrink-0 self-center">
                <Image
                  alt=""
                  src="/assets/img/placeholder/article.png"
                  className="h-16 w-16"
                  width={256}
                  height={256}
                />
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setEdit(true);
                  }}
                  className="mt-1 flex dark:text-dark-accent hover:dark:text-dark-primary text-purple-700 hover:text-purple-900"
                >
                  <PencilIcon className="mr-2 inline-flex h-5 w-5" />
                  Edit Content
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOpenReplace(true);
                  }}
                  className="mt-1 flex dark:text-dark-accent hover:dark:text-dark-primary text-purple-700 hover:text-purple-900"
                >
                  <PlayCircleIcon className="mr-2 inline-flex h-5 w-5" />
                  Replace with video
                </button>
              </div>
            </div>
          </div>
          <div className="ml-4 mt-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => {
                setOpenPreview(true);
              }}
              className="relative inline-flex items-center  border border-transparent bg-black px-4 py-2 text-sm font-medium text-white"
            >
              Preview
            </button>
          </div>
        </div>
      )}

      <Transition.Root show={openPreview} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpenPreview}>
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
                enter="ease-out duration-100"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-75"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6">
                  <div className="prose prose-lg prose-indigo mx-auto text-gray-700">
                    {sanitizedDescription}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      <Transition.Root show={openReplace} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setOpenReplace}
        >
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
                        Update this lecture to video
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          The content of this lecture will be deleted, but the description and any
                          downloadable resources will remain. You will be prompted to add a video
                          file and re-publish as a video lecture.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-black px-4 py-2 text-base font-medium text-white sm:col-start-2 sm:text-sm"
                      onClick={() => {
                        handleRemoveContent();
                        setOpenReplace(false);
                      }}
                    >
                      OK
                    </button>
                    <button
                      type="button"
                      className="focus:ring-indigo-500 mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                      onClick={() => setOpenReplace(false)}
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
    </>
  );
}
