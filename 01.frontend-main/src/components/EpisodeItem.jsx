import React, { useRef, useState, Fragment, useEffect } from 'react';
import { Dialog, Transition, RadioGroup, Tab } from '@headlessui/react';
import {
  PencilIcon,
  TrashIcon,
  AcademicCapIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  DocumentIcon,
  PlayCircleIcon,
} from '@heroicons/react/24/outline';
import DOMPurify from 'dompurify';
import { BellAlertIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import Link from 'next/link';
import { CircleLoader } from 'react-spinners';
import ReactDropzone from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';
import RichTextEditor from '@/components/RichTextEditor';
import ResourceContentList from '../pages/sell/courses/manage/curriculum/components/ResourceContentList';
import ArticleTableContent from '../pages/sell/courses/manage/curriculum/components/ArticleTableContent';
import FileTableContent from '../pages/sell/courses/manage/curriculum/components/FileTableContent';
import EditEpisodeTitle from '@/api/manage/curriculum/episodes/EditTitle';
import EditEpisodeDescription from '@/api/manage/curriculum/episodes/EditDescription';
import EditEpisodeContent from '@/api/manage/curriculum/episodes/EditContent';
import DeleteEpisode from '@/api/manage/curriculum/episodes/Delete';
import CreateExternalResource from '@/api/manage/curriculum/episodes/CreateExternalResource';
import LoadingMoon from '@/components/loaders/LoadingMoon';
import { ToastError } from '@/components/ToastError';

const mailingLists = [
  { id: 1, title: 'Video', description: '', users: '621 users', icon: AcademicCapIcon },
  { id: 2, title: 'Article', description: '', users: '1200 users', icon: DocumentIcon },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function EpisodeItem({
  episode,
  index,
  setSections,
  sections,
  section,
  FetchInstructorSections,
  courseUUID,
}) {
  const episodes = section && section.episodes;

  const [selectedMailingLists, setSelectedMailingLists] = useState(mailingLists[0]);
  const [open, setOpen] = useState(false);

  const [openDeleteLecture, setOpenDeleteLecture] = useState(false);
  const cancelButtonRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [loadingFile, setLoadingFile] = useState(false);
  const [resourceFile, setResourceFile] = useState();

  const [editDescription, setEditDescription] = useState(false);
  const [addDescription, setAddDescription] = useState(false);
  const [description, setDescription] = useState('');
  const [addResource, setAddResource] = useState(false);
  const [addContent, setAddContent] = useState(false);
  const [editLecture, setEditLecture] = useState(false);
  const [videoContent, setVideoContent] = useState(false);

  const [percentage, setPercentage] = useState(0);
  const [resourceFileFileName, setResourceFileFileName] = useState();
  const ref = useRef();

  const [video, setVideo] = useState();
  const [salesVideoFileName, setSalesVideoFileName] = useState();
  const refVideo = useRef();
  const resetVideoInput = () => {
    refVideo.current.value = '';
  };

  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles.find(
      (file) =>
        file.size <= 2 * 1024 * 1024 * 1024 &&
        (file.type === 'video/mp4' || file.type === 'video/mpeg'),
    );

    if (!file) {
      ToastError('Video must be Max 2GB and .mp4 or .mpeg');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setVideo({
        id: uuidv4(),
        title: file.name,
        file: reader.result,
      });
    };
    reader.onerror = (error) => {
      console.log(error);
    };
  };

  const [loadingDescription, setLoadingDescription] = useState(false);

  const handleEditDescription = async (e) => {
    e.preventDefault();

    setLoadingDescription(true);

    const newEpisode = { ...episode };
    newEpisode.description = description;

    const body = JSON.stringify({
      episodeUUID: episode.id,
      description,
    });

    try {
      const res = await fetch('/api/sell/courses/episodes/editDescription', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });

      if (res.status === 200) {
        const sectionsData = await FetchInstructorSections(courseUUID);
        setSections(sectionsData);
      }
    } catch (err) {
      console.log(err);
    }
    setLoadingDescription(false);
    setAddDescription(false);
    setEditDescription(false);
  };

  const handleEditContent = async (e) => {
    e.preventDefault();
    setLoadingFile(true);

    const body = JSON.stringify({
      episodeUUID: episode.id,
      content: videoContent,
    });

    try {
      const res = await fetch('/api/sell/courses/episodes/addContent', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });

      if (res.status === 200) {
        const sectionsData = await FetchInstructorSections(courseUUID);
        setSections(sectionsData);
      }
    } catch (err) {
      console.log(err);
    }

    setLoadingFile(false);
    setAddContent(false);
  };

  const [loadingResource, setLoadingResource] = useState(false);

  const handleResourceAdd = async () => {
    setLoadingResource(true);

    const formData = new FormData();
    formData.append('file', resourceFile);
    formData.append('fileName', resourceFileFileName);
    formData.append('episodeUUID', episode.id);

    try {
      const res = await axios.put('/api/sell/courses/episodes/addResource', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const percentCompleted = Math.round((loaded * 100) / total);
          setPercentage(percentCompleted);
        },
      });

      if (res.status === 200) {
        const sectionsData = await FetchInstructorSections(courseUUID);
        setSections(sectionsData);
        setLoadingResource(false);
        setAddResource(false);
        setResourceFile(null);
        setResourceFileFileName(null);
        setPercentage(0);
      }
    } catch (err) {
      console.log(err);
      setPercentage(0);
      setLoadingResource(false);
      setAddResource(false);
      setResourceFile(null);
      setResourceFileFileName(null);
    }
  };

  const handleLectureRemove = async () => {
    await DeleteEpisode(episode.id);
    const sectionsData = await FetchInstructorSections(courseUUID);
    setSections(sectionsData);
  };

  const handleVideoAdd = async (e) => {
    e.preventDefault();

    const controller = new AbortController();
    const abortSignal = controller.signal;

    setLoadingFile(true);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      signal: abortSignal,
      onUploadProgress: (data) => {
        setPercentage(Math.round((data.loaded / data.total) * 100));
      },
    };

    const formData = new FormData();
    formData.append('video', video.file);
    formData.append('filename', video.title);
    formData.append('episodeUUID', episode.id);

    try {
      const res = await axios.put('/api/sell/courses/episodes/addVideo', formData, config);

      if (res.status === 200) {
        const sectionsData = await FetchInstructorSections(courseUUID[0]);
        setSections(sectionsData);
        setPercentage(0);
      }
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log('Request canceled', err.message);
      } else {
        console.log(err);
      }
    } finally {
      controller.abort();
    }

    setLoadingFile(false);
    setAddContent(false);
    setPercentage(0);
    setVideo(null);
    setSalesVideoFileName(null);
  };

  const [urlTitle, setURLTitle] = useState('');
  const [url, setURL] = useState('');

  const handleResourceExternalAdd = async () => {
    setLoadingResource(true);
    await CreateExternalResource(urlTitle, url, episode.id);
    const sectionsData = await FetchInstructorSections(courseUUID);
    setSections(sectionsData);
    setLoadingResource(false);
    setURLTitle('');
    setURL('');
    setAddResource(false);
    setResourceFile(null);
    setResourceFileFileName(null);
  };

  const reset = () => {
    ref.current.value = '';
  };
  const MAX_FILE_SIZE = 2000000000; // 2 GB

  const fileSelectedHandler = (e) => {
    const file = e.target.files[0];

    if (!file) {
      reset();
      return;
    }

    if (file.type !== 'application/x-zip-compressed') {
      alert('Please select a .ZIP file.');
      reset();
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      alert(
        'The selected file is too large. Please select a .ZIP file with a size of 2 GB or lower.',
      );
      reset();
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    setResourceFile(file);
    setResourceFileFileName(file.name);
  };

  const handleOpen = () => {
    if (open) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  };

  const handleOpenContent = () => {
    if (addContent) {
      setAddContent(false);
      setOpen(false);
    } else {
      setAddContent(true);
      setOpen(false);
    }
  };

  const handleOpenEditDescription = () => {
    if (editDescription) {
      setEditDescription(false);
    } else {
      setEditDescription(true);
    }
  };

  const handleOpenResource = () => {
    setAddResource(true); /// ADD RESOURCE
    setAddDescription(false);
  };

  const handleOpenDescription = () => {
    setAddDescription(true); // ADD DESCRIPTION
    setAddResource(false);
  };

  const [lectureTitle, setLectureTitle] = useState('');

  const handleEditLecture = async (e) => {
    e.preventDefault();
    setLoading(true);
    const update = { ...episode };
    update.title = lectureTitle;

    await EditEpisodeTitle(update.id, lectureTitle);

    const sectionsData = await FetchInstructorSections(courseUUID);
    setSections(sectionsData);

    setEditLecture(false);
    setLoading(false);
    setLectureTitle('');
  };

  const [sanitizedDescription, setSanitizedDescription] = useState('');

  useEffect(() => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = DOMPurify.sanitize(episode.description);
    setSanitizedDescription(tempDiv.textContent);
  }, [episode]);

  return (
    <div className="">
      {editLecture ? (
        <div className="w-full cursor-move border dark:border-dark-border border-gray-500 dark:bg-dark-third bg-white p-2 px-4">
          <form onSubmit={handleEditLecture} className="w-full  pb-16  ">
            <div className="grid grid-cols-12">
              <p className="text-md col-span-12 mt-0 font-bold md:col-span-2 md:mt-3">
                Lecture {index + 1}:
              </p>
              <div className="relative col-span-12 mt-1 rounded-md shadow-sm md:col-span-10">
                <input
                  type="text"
                  value={lectureTitle}
                  onChange={(e) => {
                    setLectureTitle(e.target.value);
                  }}
                  className="ring-none w-full border dark:border-dark-border border-gray-700 py-3 outline-none dark:bg-dark-second pl-4 focus:border-gray-500 focus:outline-transparent focus:ring-transparent"
                  placeholder={episode.title}
                  aria-describedby="price-currency"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-gray-500 sm:text-sm" id="price-currency">
                    {lectureTitle.length} of 60
                  </span>
                </div>
              </div>
            </div>
            <div className="float-right  mt-4 space-x-2">
              <button
                type="button"
                onClick={() => {
                  setEditLecture(false);
                }}
                className="inline-flex cursor-pointer items-center border border-transparent px-4 py-2 text-sm font-medium text-black dark:text-dark-txt hover:bg-gray-50 dark:hover:bg-dark-second"
              >
                Cancel
              </button>
              {loading ? (
                <div className="inline-flex items-center border border-transparent bg-black px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-gray-900">
                  <LoadingMoon loading size={20} color="#fff" />
                </div>
              ) : (
                <button
                  type="submit"
                  className="inline-flex items-center border border-transparent bg-black dark:bg-dark-primary px-4 py-2 text-sm font-bold text-white  shadow-sm hover:bg-gray-900 dark:hover:bg-dark-accent"
                >
                  Save lecture
                </button>
              )}
            </div>
          </form>
        </div>
      ) : (
        <li className="w-full cursor-move border dark:border-dark-border border-gray-500 dark:bg-dark-second bg-white p-2 px-4">
          <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between py-2 sm:flex-nowrap">
            <div className="ml-4 mt-2 flex">
              <div className="text-md flex font-medium leading-6 dark:text-dark-txt text-gray-900">
                {episode.published || episode.file || episode.content ? (
                  <CheckCircleIcon className="mt-1 mr-2 inline-flex h-4 w-4 text-forest-green-400" />
                ) : (
                  <BellAlertIcon className="mt-1 mr-2 inline-flex h-4 w-4 text-almond-600" />
                )}
                Lecture {index + 1})
                {episode.file && <PlayCircleIcon className="ml-2 mr-1 mt-1 inline-flex h-4 w-4" />}
                {episode.content && episode.content.length !== 0 && (
                  <DocumentIcon className="ml-2 mr-1 mt-1 inline-flex h-4 w-4" />
                )}
                {!episode.file && !(episode.content && episode.content.length !== 0) && <div />}{' '}
                <span className="ml-1">{episode.title}</span>
              </div>
              <PencilIcon
                onClick={() => {
                  setEditLecture(true);
                }}
                className="ml-2 mt-1 inline-flex h-3.5 w-3.5 cursor-pointer"
              />

              {episodes.length === 1 ? (
                <div />
              ) : (
                <TrashIcon
                  onClick={() => {
                    setOpenDeleteLecture(true);
                  }}
                  className="ml-2 mt-1 inline-flex h-3.5 w-3.5 cursor-pointer"
                />
              )}
            </div>
            <div className="ml-4 mt-2 flex-shrink-0">
              {episode.content === '' && episode.file === null ? (
                <button
                  type="button"
                  onClick={handleOpenContent}
                  className="relative -my-2 inline-flex items-center border border-gray-700 dark:border-dark-border dark:bg-dark-primary dark:text-white rounded-xl bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
                >
                  + Content
                </button>
              ) : (
                <div />
              )}
              {open ? (
                <ChevronUpIcon
                  onClick={handleOpen}
                  className="ml-4 inline-flex h-5 w-5 cursor-pointer"
                />
              ) : (
                <ChevronDownIcon
                  onClick={handleOpen}
                  className="ml-4 inline-flex h-5 w-5 cursor-pointer"
                />
              )}
            </div>
          </div>
        </li>
      )}

      {/* Add Description / Resources */}
      {open ? (
        <div className="space-y-2 border-l border-b border-r dark:border-dark-border dark:bg-dark-bg border-gray-500 bg-white p-2 px-4 pb-3">
          {episode.file ? (
            <FileTableContent
              FetchInstructorSections={FetchInstructorSections}
              episode={episode}
              setOpen={setOpen}
              section={section}
              sections={sections}
              setSections={setSections}
              courseUUID={courseUUID}
            />
          ) : (
            <div />
          )}
          {episode.content && episode.content.length !== 0 ? (
            <ArticleTableContent
              FetchInstructorSections={FetchInstructorSections}
              episode={episode}
              setOpen={setOpen}
              sections={sections}
              setSections={setSections}
              courseUUID={courseUUID}
            />
          ) : (
            <div />
          )}
          {!addResource &&
            episode.description.length !== 0 &&
            (editDescription ? (
              <form
                onSubmit={(e) => {
                  handleEditDescription(e);
                }}
                className="pb-12"
              >
                <div className="">
                  <div className="relative col-span-12 mt-1 rounded-md shadow-sm md:col-span-10">
                    <span className="block text-sm font-bold dark:text-dark-txt text-gray-700">
                      Lecture Description
                    </span>
                    <RichTextEditor data={setDescription} />
                  </div>
                </div>
                <div className="float-right  mt-4 space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditDescription(false);
                    }}
                    className="inline-flex cursor-pointer items-center border border-transparent px-4 py-2 text-sm font-medium text-black dark:text-dark-txt hover:bg-gray-50 dark:hover:bg-dark-second"
                  >
                    Cancel
                  </button>
                  {loadingDescription ? (
                    <button
                      type="button"
                      className="inline-flex items-center border border-transparent bg-black dark:bg-dark-primary px-4 py-2 text-sm font-bold text-white  shadow-sm hover:bg-gray-900 dark:hover:bg-dark-accent"
                    >
                      <CircleLoader
                        loading={loadingDescription}
                        className="inline-flex"
                        size={20}
                        color="#ffffff"
                      />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="inline-flex items-center border border-transparent bg-black dark:bg-dark-primary px-4 py-2 text-sm font-bold text-white  shadow-sm hover:bg-gray-900 dark:hover:bg-dark-accent"
                    >
                      Save
                    </button>
                  )}
                </div>
              </form>
            ) : (
              <button
                type="button"
                onClick={handleOpenEditDescription}
                className="w-full cursor-pointer border-b border-gray-200 dark:bg-dark-bg dark:border-dark-border bg-white px-2 py-2 hover:bg-gray-50"
              >
                <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
                  <div className="ml-4 mt-2">
                    <p className="prose text-sm font-medium leading-6 dark:text-dark-txt text-gray-900">
                      {sanitizedDescription}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          {!(!addResource && episode.description.length !== 0) && <div />}

          {!addResource && episode.resources.length !== 0 ? (
            <div className="">
              <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-bold leading-6 dark:text-dark-txt text-gray-900">
                  Downloadable materials
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  <ResourceContentList
                    FetchInstructorSections={FetchInstructorSections}
                    sections={sections}
                    setSections={setSections}
                    episodes={episodes}
                    episode={episode}
                    section={section}
                    courseUUID={courseUUID}
                  />
                </dd>
              </div>
            </div>
          ) : (
            <div />
          )}

          <div className="w-full">
            {addDescription && (
              <form
                onSubmit={(e) => {
                  handleEditDescription(e);
                }}
                className="pb-12"
              >
                <div className="">
                  <div className="relative col-span-12 mt-1 rounded-md shadow-sm md:col-span-10">
                    <span className="block text-sm font-bold dark:text-dark-txt text-gray-700">
                      Lecture Description
                    </span>
                    <RichTextEditor data={setDescription} />
                  </div>
                </div>
                <div className="float-right  mt-4 space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAddDescription(false);
                    }}
                    className="inline-flex cursor-pointer items-center border border-transparent px-4 py-2 text-sm font-medium text-black dark:text-dark-txt hover:bg-gray-50 dark:hover:bg-dark-second"
                  >
                    Cancel
                  </button>
                  {loadingDescription ? (
                    <button
                      type="button"
                      className="inline-flex items-center border border-transparent bg-black dark:bg-dark-primary px-4 py-2 text-sm font-bold text-white  shadow-sm hover:bg-gray-900 dark:hover:bg-dark-accent"
                    >
                      <CircleLoader
                        loading={loadingDescription}
                        className="inline-flex"
                        size={20}
                        color="#ffffff"
                      />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="inline-flex items-center border border-transparent bg-black dark:bg-dark-primary px-4 py-2 text-sm font-bold text-white  shadow-sm hover:bg-gray-900 dark:hover:bg-dark-accent"
                    >
                      Add description
                    </button>
                  )}
                </div>
              </form>
            )}
            {!addResource && episode.description.length === 0 && (
              <button
                type="button"
                onClick={handleOpenDescription}
                className="relative block items-center border border-gray-700 bg-white px-4 py-2 text-sm font-bold text-gray-900 hover:bg-gray-50"
              >
                + Description
              </button>
            )}
            {!addDescription && !(!addResource && episode.description.length === 0) && <div />}
          </div>

          <div className="w-full">
            {addResource && (
              <Tab.Group>
                <Tab.List className=" grid grid-cols-3 space-x-1 md:grid-cols-12">
                  <Tab
                    className={({ selected }) =>
                      classNames(
                        'col-span-1 w-full py-2.5 text-sm leading-5 md:col-span-2',
                        '',
                        selected
                          ? 'flex items-center justify-center space-x-2 border-b-4 border-gray-900 p-1 font-bold text-black focus:outline-none dark:text-dark-txt dark:border-dark-primary'
                          : 'flex items-center justify-center border-b-2 border-gray-50 p-1 font-semibold text-gray-600 hover:border-gray-200 dark:border-dark-third dark:text-dark-txt dark:hover:border-dark-border md:space-x-2',
                      )
                    }
                  >
                    Downloadable
                  </Tab>
                  {/* <Tab
                                                className={({ selected }) =>
                                                classNames(
                                                    'w-full py-2.5 text-md leading-5 md:col-span-2 col-span-1 ',
                                                    '',
                                                    selected
                                                        ? 'flex items-center justify-center space-x-2 p-1 font-bold  dark:text-dark-txt text-black  border-b-4 border-gray-900 dark:bg-dark-third'
                                                        : 'flex items-center justify-center md:space-x-2  font-semibold p-1 border-b-2 border-gray-50 hover:border-gray-200  dark:text-dark-txt text-gray-600 dark:hover:bg-dark-third'
                                                )
                                                }
                                                >
                                                Library
                                            </Tab> */}
                  <Tab
                    className={({ selected }) =>
                      classNames(
                        'col-span-1 w-full py-2.5 text-sm leading-5 md:col-span-2',
                        '',
                        selected
                          ? 'flex items-center justify-center space-x-2 border-b-4 border-gray-900 p-1 font-bold text-black focus:outline-none dark:text-dark-txt dark:border-dark-primary'
                          : 'flex items-center justify-center border-b-2 border-gray-50 p-1 font-semibold text-gray-600 hover:border-gray-200 dark:border-dark-third dark:text-dark-txt dark:hover:border-dark-border md:space-x-2',
                      )
                    }
                  >
                    External
                  </Tab>
                </Tab.List>

                <Tab.Panels className="">
                  <Tab.Panel className={classNames('rounded-xl  p-3', '')}>
                    <div className="pb-12">
                      <div className="flex justify-center">
                        <div className="mb-2 w-full">
                          <input
                            className="form-control
                                    m-0
                                    block
                                    w-full
                                    rounded
                                    border
                                    border-solid
                                    border-gray-300 dark:border-dark-border
                                    dark:bg-dark-second
                                    dark:text-dark-txt
                                    bg-white bg-clip-padding
                                    px-3 py-1.5 text-base
                                    font-normal
                                    text-gray-700
                                    transition
                                    ease-in-out
                                    focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none"
                            ref={ref}
                            onChange={(e) => fileSelectedHandler(e)}
                            required
                            type="file"
                            id="formFile"
                          />
                          <div className="mt-2 h-1 w-full bg-gray-300 dark:bg-dark-second">
                            <div
                              style={{ width: `${percentage}%` }}
                              className={`h-full ${
                                percentage < 70 ? 'bg-rose-600' : 'bg-green-600'
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                      <p className="font-regular -mb-2 text-xs dark:text-dark-txt-secondary text-gray-500">
                        <span className="font-bold text-gray-600 dark:text-dark-txt">Note: </span>A
                        resource is for any type of document that can be used to help students in
                        the lecture. This file is going to be seen as a lecture extra. Make sure
                        everything is legible and the file size is less than 1 GiB.
                      </p>
                      <div className="float-right mt-4 space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setAddResource(false);
                            setResourceFile(null);
                            setResourceFileFileName(null);
                          }}
                          className="inline-flex cursor-pointer items-center border border-transparent px-4 py-2 text-sm font-medium text-black dark:text-dark-txt hover:bg-gray-50 dark:hover:bg-dark-second"
                        >
                          Cancel
                        </button>
                        {loadingResource ? (
                          <div className="inline-flex items-center border border-transparent bg-black px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-gray-900">
                            <CircleLoader
                              loading={loadingResource}
                              className="inline-flex"
                              size={20}
                              color="#ffffff"
                            />
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              handleResourceAdd();
                            }}
                            className="inline-flex items-center border border-transparent bg-black dark:bg-dark-primary px-4 py-2 text-sm font-bold text-white  shadow-sm hover:bg-gray-900 dark:hover:bg-dark-accent"
                          >
                            Add resource
                          </button>
                        )}
                      </div>
                    </div>
                  </Tab.Panel>
                  {/* <Tab.Panel
                                                
                                                    className={classNames(
                                                        'rounded-xl  p-3',
                                                        ''
                                                    )}
                                                >
                                                    From library
                                                    <div className="float-right mt-4 space-x-2">
                                                        <div
                                                            onClick={()=>{setAddResource(false)}}
                                                            className="cursor-pointer inline-flex items-center border border-transparent hover:bg-gray-50 px-4 py-2 text-sm font-medium text-black"
                                                        >
                                                            Cancel
                                                        </div>
                                                        <button
                                                            type="submit"
                                                            className="inline-flex items-center border border-transparent hover:bg-gray-900 bg-black px-4 py-2 text-sm font-bold text-white shadow-sm"
                                                        >
                                                            Add resource
                                                        </button>

                                                        </div>
                                                </Tab.Panel> */}
                  <Tab.Panel className={classNames('rounded-xl  p-3', '')}>
                    <div className="pb-12">
                      <div className="flex justify-center">
                        <div className="mb-2 w-full">
                          <div className="relative col-span-12 mt-1 rounded-md shadow-sm">
                            <span className="block text-sm font-bold text-gray-700">Title</span>
                            <input
                              type="text"
                              value={urlTitle}
                              onChange={(e) => {
                                setURLTitle(e.target.value);
                              }}
                              className="ring-none w-full border border-gray-700 py-3 outline-none focus:border-gray-500 focus:outline-transparent focus:ring-transparent"
                              aria-describedby="price-currency"
                            />
                            <div className="pointer-events-none absolute inset-y-0 right-0  flex items-center pr-3">
                              <span className="mt-5 text-gray-500 sm:text-sm" id="price-currency">
                                {urlTitle.length} of 60
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-center">
                        <div className="mb-2 w-full">
                          <div className="relative col-span-12 mt-1 rounded-md shadow-sm">
                            <span className="block text-sm font-bold text-gray-700">URL</span>
                            <input
                              type="text"
                              name="url"
                              value={url}
                              onChange={(e) => {
                                setURL(e.target.value);
                              }}
                              className="ring-none w-full border border-gray-700 py-3 outline-none focus:border-gray-500 focus:outline-transparent focus:ring-transparent"
                              aria-describedby="price-currency"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="float-right mt-4 space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setAddResource(false);
                            setResourceFile(null);
                            setResourceFileFileName(null);
                          }}
                          className="inline-flex cursor-pointer items-center border border-transparent px-4 py-2 text-sm font-medium text-black hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        {loadingResource ? (
                          <div className="inline-flex items-center border border-transparent bg-black px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-gray-900">
                            <CircleLoader
                              loading={loadingResource}
                              className="inline-flex"
                              size={20}
                              color="#1e1f48"
                            />
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              handleResourceExternalAdd();
                            }}
                            className="inline-flex items-center border border-transparent bg-black px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-gray-900"
                          >
                            Add resource
                          </button>
                        )}
                      </div>
                    </div>
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            )}
            {!addDescription && (
              <button
                type="button"
                onClick={handleOpenResource}
                className="relative block items-center border border-gray-700 bg-white px-4 py-2 text-sm font-bold text-gray-900 hover:bg-gray-50"
              >
                + Resource
              </button>
            )}
            {!addResource && !addDescription && <div />}
          </div>
        </div>
      ) : (
        <div />
      )}

      {addContent ? (
        <div className="space-y-2 border-l border-b border-r border-gray-500 dark:border-dark-border dark:bg-dark-bg bg-white p-2 px-4 pb-3">
          <p className="text-center text-sm dark:text-dark-txt-secondary">
            Select the main type of content. Files and links can be added as resources.{' '}
            <Link
              className="text-purple-600 dark:text-dark-accent underline underline-offset-2 hover:text-purple-700"
              href="/teaching-hub/content-types"
            >
              Learn about content types.
            </Link>
          </p>
          <RadioGroup value={selectedMailingLists} onChange={setSelectedMailingLists}>
            {/* <RadioGroup.Label className="text-base font-medium text-gray-900">Select a mailing list</RadioGroup.Label> */}

            <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4">
              {mailingLists.map((mailingList) => (
                <RadioGroup.Option
                  key={mailingList.id}
                  value={mailingList}
                  // onClick={()=>{
                  //     dispatch(set_course_step_1(mailingList))
                  // }}
                  className={({ checked }) =>
                    classNames(
                      checked ? 'border-transparent' : 'border-gray-300 dark:border-dark-border',
                      // mailingList.id === type && type.id ? 'border-gray-900 ring-2 ring-gray-900' : '',
                      'relative flex h-64 cursor-pointer rounded-lg border bg-white dark:bg-dark-second p-4 shadow-sm hover:dark:bg-dark-third hover:bg-gray-50 focus:outline-none',
                    )
                  }
                >
                  {({ checked, active }) => (
                    <>
                      <span className="flex flex-1 ">
                        <span className="flex flex-col items-center justify-center ">
                          <div className="flex items-center justify-center dark:text-dark-txt text-dark ">
                            <mailingList.icon className="h-8 w-8" aria-hidden="true" />
                          </div>
                          <RadioGroup.Label
                            as="span"
                            className="text-md mt-4 block items-center justify-center text-center font-bold dark:text-dark-txt-secondary text-gray-900"
                          >
                            {mailingList.title}
                          </RadioGroup.Label>
                          <RadioGroup.Description
                            as="span"
                            className="mt-1 flex w-48 items-center justify-center text-center text-sm text-gray-700"
                          >
                            {mailingList.description}
                          </RadioGroup.Description>
                        </span>
                      </span>
                      <span
                        className={classNames(
                          active ? 'border' : 'border-2',
                          checked
                            ? 'border-gray-900 dark:border-dark-border'
                            : 'border-transparent',
                          'pointer-events-none absolute -inset-px rounded-lg',
                        )}
                        aria-hidden="true"
                      />
                    </>
                  )}
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>
          {selectedMailingLists.id === 1 ? (
            <form
              onSubmit={(e) => {
                handleVideoAdd(e);
              }}
              className="pb-14"
            >
              <div className="flex justify-center">
                <div className="mb-2 w-full">
                  <ReactDropzone onDrop={handleDrop}>
                    {({ getRootProps, getInputProps }) => (
                      <div
                        className="relative form-control text-md m-0 mt-2 block w-full cursor-pointer rounded border-2 border-dashed border-gray-200 bg-white dark:bg-dark-second dark:border-dark-border dark:text-dark-txt-secondary hover:dark:bg-dark-third bg-clip-padding p-4 text-gray-700 transition ease-in-out hover:border-gray-300 hover:bg-gray-50 focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none"
                        {...getRootProps()}
                      >
                        <input {...getInputProps()} />
                        {video ? (
                          <>
                            <video
                              src={video.file}
                              className="w-full h-auto"
                              controls
                              preload="metadata"
                            />
                            <button
                              type="button"
                              className="absolute top-0 right-0 p-1 m-1 bg-red-500 text-white rounded-full focus:outline-none"
                              onClick={() => setVideo(null)}
                            >
                              <i className="fas fa-times" />
                            </button>
                          </>
                        ) : (
                          'Drag and drop or click to upload video'
                        )}
                      </div>
                    )}
                  </ReactDropzone>
                  <div className="mt-2 h-1 w-full bg-gray-300 dark:bg-dark-second">
                    <div
                      style={{ width: `${percentage}%` }}
                      className={`h-full ${percentage < 70 ? 'bg-rose-600' : 'bg-green-600'}`}
                    />
                  </div>
                </div>
              </div>
              <p className="font-regular -mb-2 text-xs dark:text-dark-txt-secondary text-gray-500">
                <span className="font-bold text-gray-600 dark:text-dark-txt">Note: </span>
                All files should be at least 720p, .mp4 and less than 2.0 GB.
              </p>
              <div className="float-right mt-4 space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setAddContent(false);
                  }}
                  className="inline-flex cursor-pointer items-center border border-transparent px-4 py-2 text-sm font-medium text-black dark:text-dark-txt hover:bg-gray-50 dark:hover:bg-dark-second"
                >
                  Cancel
                </button>
                {loadingFile ? (
                  <div className="inline-flex items-center border border-transparent bg-black px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-gray-900">
                    <CircleLoader
                      loading={loadingFile}
                      className="inline-flex"
                      size={20}
                      color="#ffffff"
                    />
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="inline-flex items-center border border-transparent bg-black dark:bg-dark-primary px-4 py-2 text-sm font-bold text-white  shadow-sm hover:bg-gray-900 dark:hover:bg-dark-accent"
                  >
                    Add Video
                  </button>
                )}
              </div>
            </form>
          ) : (
            <div />
          )}

          {selectedMailingLists.id === 2 ? (
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
                    setAddContent(false);
                  }}
                  className="inline-flex cursor-pointer items-center border border-transparent px-4 py-2 text-sm font-medium text-black dark:text-dark-txt hover:bg-gray-50 dark:hover:bg-dark-second"
                >
                  Cancel
                </button>
                {loadingFile ? (
                  <div className="inline-flex items-center border border-transparent bg-black px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-gray-900">
                    <CircleLoader
                      loading={loadingFile}
                      className="inline-flex"
                      size={20}
                      color="#ffffff"
                    />
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="inline-flex items-center border border-transparent bg-black dark:bg-dark-primary px-4 py-2 text-sm font-bold text-white  shadow-sm hover:bg-gray-900 dark:hover:bg-dark-accent"
                  >
                    Add Article
                  </button>
                )}
              </div>
            </form>
          ) : (
            <div />
          )}
        </div>
      ) : (
        <div />
      )}

      <Transition.Root show={openDeleteLecture} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setOpenDeleteLecture}
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
                        Please confirm
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          You are about to remove a curriculum item. Are you sure you want to
                          continue?
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-black px-4 py-2 text-base font-medium text-white sm:col-start-2 sm:text-sm"
                      onClick={() => {
                        handleLectureRemove(index);
                        setOpenDeleteLecture(false);
                      }}
                    >
                      OK
                    </button>
                    <button
                      type="button"
                      className="focus:ring-indigo-500 mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                      onClick={() => setOpenDeleteLecture(false)}
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
    </div>
  );
}
