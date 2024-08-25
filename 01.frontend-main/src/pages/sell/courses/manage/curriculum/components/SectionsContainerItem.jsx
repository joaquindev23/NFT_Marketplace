import React, { useRef, useState, Fragment } from 'react';
import { Dialog, Transition, Switch } from '@headlessui/react';
import { CircleLoader } from 'react-spinners';
import { Bars3Icon, PencilIcon, PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';

import EditSection from '@/api/manage/curriculum/sections/Edit';
import DeleteSection from '@/api/manage/curriculum/sections/Delete';

import LoadingMoon from '@/components/loaders/LoadingMoon';
import RichTextEditor from '@/components/RichTextEditor';
import EpisodesList from './EpisodesList';
import CreateEpisode from '@/api/manage/curriculum/episodes/Create';

export default function SectionsContainerItem({
  FetchInstructorSections,
  courseUUID,
  sections,
  setSections,
  section,
  index,
}) {
  const [open, setOpen] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [editSection, setEditSection] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const cancelButtonRef = useRef(null);
  const [episodeAdd, setEpisodeAdd] = useState(false);
  const [addLecture, setAddLecture] = useState(false);
  const [addQuiz, setAddQuiz] = useState(false);
  const [addCodingExercise, setAddCodingExercise] = useState(false);
  const [addPracticeTest, setAddPracticeTest] = useState(false);
  const [addAssignment, setAddAssignment] = useState(false);

  const handleAddLecture = () => {
    setAddLecture(true);
    setAddQuiz(false);
    setAddCodingExercise(false);
    setAddPracticeTest(false);
    setAddAssignment(false);
  };

  const [episodeTitle, setEpisodeTitle] = useState('');
  const [sectionTitle, setSectionTitle] = useState('');
  const [learningObjective, setLearningObjective] = useState('');

  const courseid = courseUUID && courseUUID[0];

  const [loadingCreate, setLoadingCreate] = useState(false);

  const handleEpisodeAdd = async (e) => {
    e.preventDefault();
    setLoadingCreate(true);

    const body = JSON.stringify({
      title: episodeTitle,
      number: section && section.episodes && section.episodes.length + 1,
      sectionUUID: section && section.id,
      courseUUID: courseid,
    });

    try {
      const res = await fetch('/api/sell/courses/episodes/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });

      if (res.status === 201) {
        const sectionsData = await FetchInstructorSections(courseUUID);
        setSections(sectionsData);
      }
    } catch (err) {
      console.log(err);
    }

    setLoadingCreate(false);
    setEpisodeAdd(false);
    setAddLecture(false);
    setEpisodeTitle('');
  };

  const onSubmitEditSection = async (e) => {
    e.preventDefault();
    setLoading(true);
    await EditSection(
      sectionTitle,
      learningObjective,
      section && section.number,
      section && section.id,
    );
    const sectionsData = await FetchInstructorSections(courseUUID);
    setSections(sectionsData);
    setLoading(false);
    setEditSection(false);
    setSectionTitle('');
    setLearningObjective('');
  };

  const handleSectionRemove = async (sectionUUID) => {
    setLoading(true);
    await DeleteSection(sectionUUID);
    const sectionsData = await FetchInstructorSections(courseUUID);
    setSections(sectionsData);
    setLoading(false);
    setOpen(false);
  };

  const showSectionEdit = () => {
    const sectionEdit = document.getElementById(`section-edit${+index}`);
    sectionEdit.classList.add('flex');
    sectionEdit.classList.remove('hidden');
  };
  const hideSectionEdit = () => {
    const sectionEdit = document.getElementById(`section-edit${+index}`);
    sectionEdit.classList.remove('flex');
    sectionEdit.classList.add('hidden');
  };
  const showSectionMove = () => {
    const sectionMove = document.getElementById(`section-move${+index}`);
    sectionMove.classList.add('flex');
    sectionMove.classList.remove('hidden');
  };
  const hideSectionMove = () => {
    const sectionMove = document.getElementById(`section-move${+index}`);
    sectionMove.classList.remove('flex');
    sectionMove.classList.add('hidden');
  };

  return (
    <>
      <li className="border dark:border-dark-border dark:bg-dark-second border-gray-700 bg-gray-50 py-5 px-4">
        {editSection ? (
          <div className="mb-2 flex border dark:border-dark-border border-gray-500 dark:bg-dark-third bg-white p-2">
            <p className="text-md font-bold dark:text-dark-txt leading-6 text-gray-900">
              Section {section && section.number}: {section && section.title}
            </p>
            <form onSubmit={(e) => onSubmitEditSection(e, index)} className="w-full ">
              <div className="relative w-full">
                <div>
                  <div className="absolute right-0 mt-2.5 mr-6 text-gray-400">0 of 60</div>
                  <input
                    type="text"
                    required
                    value={sectionTitle}
                    onChange={(e) => setSectionTitle(e.target.value)}
                    className="ring-none w-full border dark:border-dark-border border-gray-700 py-3 outline-none dark:bg-dark-second pl-4 focus:border-gray-500 focus:outline-transparent focus:ring-transparent"
                    placeholder="Enter a title"
                  />
                </div>
                <div className="mt-4">
                  <span className="block text-sm font-bold dark:text-dark-txt text-gray-900">
                    What will students be able to do at the end of this section?
                  </span>
                  <div className="absolute right-0 mt-2.5 mr-6 text-gray-400">0 of 60</div>
                  <input
                    type="text"
                    value={learningObjective}
                    onChange={(e) => setLearningObjective(e.target.value)}
                    className="ring-none w-full border dark:border-dark-border border-gray-700 py-3 outline-none dark:bg-dark-second pl-4 focus:border-gray-500 focus:outline-transparent focus:ring-transparent"
                    placeholder="Enter a learning objective"
                  />
                </div>
                <div className="float-right  mt-4 space-x-2">
                  {loading ? (
                    <div />
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setEditSection(false);
                      }}
                      className="inline-flex cursor-pointer items-center border border-transparent px-4 py-2 text-sm font-medium text-black dark:text-dark-txt hover:bg-gray-50 dark:hover:bg-dark-second"
                    >
                      Cancel
                    </button>
                  )}
                  {loading ? (
                    <div className="inline-flex items-center border border-transparent bg-black px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-gray-900">
                      <LoadingMoon loading size={20} color="#fff" />
                    </div>
                  ) : (
                    <button
                      type="submit"
                      className="inline-flex items-center border border-transparent bg-black dark:bg-dark-primary px-4 py-2 text-sm font-bold text-white  shadow-sm hover:bg-gray-900 dark:hover:bg-dark-accent"
                    >
                      Save section
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        ) : (
          <div
            onMouseEnter={() => {
              showSectionMove();
              showSectionEdit();
            }}
            onMouseLeave={() => {
              hideSectionMove();
              hideSectionEdit();
            }}
            className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap"
          >
            <div className="ml-4 mt-2">
              <div className="flex cursor-move pb-5">
                <p className="text-md font-bold leading-6 dark:text-dark-txt text-gray-900">
                  Section {section && section.number}:{' '}
                  <span className="ml-1">{section && section.title}</span>
                </p>
                <div id={`section-edit${+index}`} className="mx-2 hidden space-x-2">
                  <PencilIcon
                    onClick={() => {
                      setEditSection(true);
                    }}
                    className="h-5 w-5 cursor-pointer dark:text-dark-txt"
                  />
                  {sections && sections.length === 1 ? (
                    <div />
                  ) : (
                    <TrashIcon
                      onClick={() => {
                        setOpen(true);
                      }}
                      className="h-5 w-5 cursor-pointer dark:text-dark-txt"
                    />
                  )}
                </div>
              </div>
            </div>
            <div id={`section-move${+index}`} className="ml-4 mb-4 hidden flex-shrink-0">
              <Bars3Icon className="h-5 w-5 cursor-move dark:text-dark-txt" />
            </div>
          </div>
        )}
        <EpisodesList
          section={section}
          FetchInstructorSections={FetchInstructorSections}
          sections={sections}
          setSections={setSections}
          courseUUID={courseUUID}
        />
        <div className="my-2" />
        {/* Add Episode */}
        <div className="grid w-full grid-cols-12">
          <div id={`episode-left${+index}`} className="col-span-1">
            {episodeAdd ? (
              <div
                id={`episode-plus${+index}`}
                className="col-span-1 inline-flex translate-x-1 items-center rounded-r-full border-2 border-dotted dark:border-dark-border border-gray-400 bg-white dark:bg-dark-bg p-1 text-black dark:text-dark-txt shadow-md transition duration-300 ease-in-out hover:bg-gray-50 dark:hover:bg-dark-second"
              >
                <XMarkIcon
                  onClick={() => {
                    setEpisodeAdd(false);

                    setAddLecture(false);
                    setAddQuiz(false);
                    setAddCodingExercise(false);
                    setAddPracticeTest(false);
                    setAddAssignment(false);
                  }}
                  className="ml-0 h-6 w-6 cursor-pointer md:ml-4"
                  aria-hidden="true"
                />
              </div>
            ) : (
              <div
                id={`episode-plus${+index}`}
                className="col-span-1 inline-flex translate-x-1 items-center rounded-r-full border-2 border-dotted dark:border-dark-border border-gray-400 bg-white dark:bg-dark-bg p-1 text-black dark:text-dark-txt shadow-md transition duration-300 ease-in-out hover:bg-gray-50 dark:hover:bg-dark-second"
              >
                <PlusIcon
                  onClick={() => {
                    setEpisodeAdd(true);

                    setAddLecture(false);
                    setAddQuiz(false);
                    setAddCodingExercise(false);
                    setAddPracticeTest(false);
                    setAddAssignment(false);
                  }}
                  className="ml-0 h-6 w-6 cursor-pointer md:ml-4"
                  aria-hidden="true"
                />
              </div>
            )}
          </div>
          <div className="col-span-11">
            <div className={`${episodeAdd ? '-mb-1' : 'p-5'} col-span-12 inline-flex w-full `}>
              {episodeAdd ? (
                <div className="ml-4 flex w-full space-x-4 overflow-x-auto border border-dotted border-gray-500 dark:border-dark-border dark:bg-dark-bg bg-white py-2 px-4 pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      handleAddLecture();
                    }}
                    className="flex border-b-2 border-transparent font-bold dark:text-dark-primary text-purple-600 hover:text-purple-700"
                  >
                    <i className="bx bx-plus mt-1  mr-1 inline-flex font-bold" />
                    <p
                      className={`${
                        addLecture
                          ? 'border-purple-600 dark:border-dark-primary'
                          : 'border-transparent'
                      }
                                                text-md inline-flex border-b-2 `}
                    >
                      Lecture
                    </p>
                  </button>
                  <button
                    type="button"
                    className="flex cursor-not-allowed font-bold  text-purple-400"
                  >
                    <i className="bx bx-plus mt-1  mr-1 inline-flex font-bold" />
                    <p
                      className={`${addQuiz ? 'border-purple-600' : 'border-transparent'}
                                                text-md inline-flex border-b-2 `}
                    >
                      Quiz
                    </p>
                  </button>
                  <button
                    type="button"
                    className="flex cursor-not-allowed font-bold  text-purple-400"
                  >
                    <i className="bx bx-plus mt-1  mr-1 inline-flex font-bold" />
                    <p
                      className={`${addCodingExercise ? 'border-purple-600' : 'border-transparent'}
                                                text-md inline-flex border-b-2 `}
                    >
                      Coding Exercise
                    </p>
                  </button>

                  <button
                    type="button"
                    className="flex cursor-not-allowed font-bold  text-purple-400"
                  >
                    <i className="bx bx-plus mt-1  mr-1 inline-flex font-bold" />
                    <p
                      className={`${addPracticeTest ? 'border-purple-600' : 'border-transparent'}
                                                text-md inline-flex border-b-2 `}
                    >
                      Practice Test
                    </p>
                  </button>
                  <button
                    type="button"
                    className="flex cursor-not-allowed font-bold  text-purple-400"
                  >
                    <i className="bx bx-plus mt-1  mr-1 inline-flex font-bold" />
                    <p
                      className={`${addAssignment ? 'border-purple-600' : 'border-transparent'}
                                                text-md inline-flex border-b-2 `}
                    >
                      Assignment
                    </p>
                  </button>
                </div>
              ) : (
                <div />
              )}
            </div>
          </div>
        </div>
        {/* Add Lecture */}
        {addLecture && (
          <form
            onSubmit={(e) => {
              handleEpisodeAdd(e);
            }}
            className="mt-2 w-full border border-dotted border-gray-500 dark:border-dark-border dark:bg-dark-second bg-white p-4 pb-16  "
          >
            <div className="grid grid-cols-12">
              <p className="text-md col-span-12 mt-0 font-bold md:col-span-2 ">New Lecture</p>
              <div className="relative col-span-12 mt-1 rounded-md shadow-sm md:col-span-10">
                <input
                  type="text"
                  value={episodeTitle}
                  onChange={(e) => {
                    setEpisodeTitle(e.target.value);
                  }}
                  className="ring-none w-full border dark:border-dark-border border-gray-700 py-3 outline-none dark:bg-dark-second pl-4 focus:border-gray-500 focus:outline-transparent focus:ring-transparent"
                  placeholder="Title"
                  aria-describedby="price-currency"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-gray-500 sm:text-sm" id="price-currency">
                    {episodeTitle && episodeTitle.length} of 60
                  </span>
                </div>
              </div>
            </div>
            <div className="float-right  mt-4 space-x-2">
              <button
                type="button"
                onClick={() => {
                  setAddLecture(false);
                }}
                className="inline-flex cursor-pointer items-center border border-transparent px-4 py-2 text-sm font-medium text-black dark:text-dark-txt hover:bg-gray-50 dark:hover:bg-dark-second"
              >
                Cancel
              </button>
              {loadingCreate ? (
                <div className="inline-flex items-center border border-transparent bg-black px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-gray-900">
                  <CircleLoader
                    className="items-center justify-center text-center"
                    loading={loadingCreate}
                    size={20}
                    color="#ffffff"
                  />
                </div>
              ) : (
                <button
                  type="submit"
                  className="inline-flex items-center border border-transparent bg-black dark:bg-dark-primary px-4 py-2 text-sm font-bold text-white  shadow-sm hover:bg-gray-900 dark:hover:bg-dark-accent"
                >
                  Add lecture
                </button>
              )}
            </div>
          </form>
        )}
        {addQuiz && (
          <form className="mt-2 w-full border border-dotted border-gray-500 bg-white p-4 pb-16  ">
            <div className="grid grid-cols-12">
              <p className="text-md col-span-12 mt-0 font-bold md:col-span-2 md:mt-3">New Quiz</p>
              <div className="relative col-span-12 mt-1 rounded-md shadow-sm md:col-span-10">
                <input
                  type="text"
                  name="price"
                  className="focus:border-indigo-500 focus:ring-indigo-500  block w-full border-gray-600 pl-7 pr-12 sm:text-sm"
                  placeholder="Title"
                  aria-describedby="price-currency"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-gray-500 sm:text-sm" id="price-currency">
                    0 of 60
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12">
              <p className="text-md col-span-12 mt-0 font-bold md:col-span-2 md:mt-3" />
              <div className="relative col-span-12 mt-1 rounded-md shadow-sm md:col-span-10">
                <span className="block text-sm font-medium text-gray-700">Description</span>
                <RichTextEditor data={setContent} />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-gray-500 sm:text-sm" id="price-currency">
                    {content && content.length} of 600
                  </span>
                </div>
              </div>
            </div>
            <div className="float-right  mt-4 space-x-2">
              <button
                type="button"
                onClick={() => {
                  setAddQuiz(false);
                }}
                className="inline-flex cursor-pointer items-center border border-transparent px-4 py-2 text-sm font-medium text-black hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center border border-transparent bg-black px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-gray-900"
              >
                Add quiz
              </button>
            </div>
          </form>
        )}
        {addCodingExercise && (
          <form className="mt-2 w-full border border-dotted border-gray-500 bg-white p-4 pb-16  ">
            <div className="grid grid-cols-12">
              <div className="relative col-span-12 mt-1 rounded-md shadow-sm">
                <input
                  type="text"
                  name="price"
                  className="focus:border-indigo-500 focus:ring-indigo-500  block w-full border-gray-600 pl-7 pr-12 sm:text-sm"
                  placeholder="Title"
                  aria-describedby="price-currency"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-gray-500 sm:text-sm" id="price-currency">
                    0 of 60
                  </span>
                </div>
              </div>
            </div>
            <div className="float-right  mt-4 space-x-2">
              <button
                type="button"
                onClick={() => {
                  setAddCodingExercise(false);
                }}
                className="inline-flex cursor-pointer items-center border border-transparent px-4 py-2 text-sm font-medium text-black hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center border border-transparent bg-black px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-gray-900"
              >
                Add Exercise
              </button>
            </div>
          </form>
        )}
        {addPracticeTest && (
          <form className="mt-2 w-full border border-dotted border-gray-500 bg-white p-4 pb-16  ">
            <div className="grid grid-cols-12">
              <p className="text-md col-span-12 mt-0 font-bold md:col-span-2 md:mt-3">
                Practice Test
              </p>
              <div className="relative col-span-12 mt-1 rounded-md shadow-sm md:col-span-10">
                <span className="block text-sm font-bold text-gray-700">Title</span>
                <input
                  type="text"
                  name="price"
                  className="focus:border-indigo-500 focus:ring-indigo-500  block w-full border-gray-600 pl-7 pr-12 sm:text-sm"
                  aria-describedby="price-currency"
                />
              </div>
            </div>
            <div className="grid grid-cols-12">
              <p className="text-md col-span-12 mt-0 font-bold md:col-span-2 md:mt-3" />
              <div className="relative col-span-12 mt-1 rounded-md shadow-sm md:col-span-10">
                <span className="block text-sm font-bold text-gray-700">Description</span>
                <RichTextEditor data={setContent} />
              </div>
            </div>
            <div className="grid grid-cols-12">
              <p className="text-md col-span-12 mt-0 font-bold md:col-span-2 md:mt-3" />
              <div className="relative col-span-12 mt-1 rounded-md shadow-sm md:col-span-10">
                <span className="block text-sm font-bold text-gray-700">Duration (minutes)</span>
                <input
                  type="number"
                  name="price"
                  className="focus:border-indigo-500 focus:ring-indigo-500  block w-full border-gray-600 pl-7 pr-12 sm:text-sm"
                  aria-describedby="price-currency"
                />
              </div>
            </div>
            <div className="grid grid-cols-12">
              <p className="text-md col-span-12 mt-0 font-bold md:col-span-2 md:mt-3" />
              <div className="relative col-span-12 mt-1 rounded-md shadow-sm md:col-span-10">
                <span className="block text-sm font-bold text-gray-700">
                  Minimum score to pass (percentage)
                </span>
                <input
                  type="number"
                  name="price"
                  className="focus:border-indigo-500 focus:ring-indigo-500  block w-full border-gray-600 pl-7 pr-12 sm:text-sm"
                  aria-describedby="price-currency"
                />
              </div>
            </div>
            <div className="grid grid-cols-12">
              <p className="text-md col-span-12 mt-0 font-bold md:col-span-2 md:mt-3" />
              <div className="relative col-span-12  mt-1 md:col-span-10">
                <span className="block text-sm font-bold text-gray-700">
                  Randomize question and answer order
                </span>
                <Switch
                  checked={enabled}
                  onChange={setEnabled}
                  className={`${enabled ? 'bg-gray-600' : 'bg-gray-200'}
                                            relative mt-1 inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                >
                  <span className="sr-only">Use setting</span>
                  <span
                    aria-hidden="true"
                    className={`${enabled ? 'translate-x-9' : 'translate-x-0'}
                                                pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                  />
                </Switch>
              </div>
            </div>

            <div className="float-right  mt-4 space-x-2">
              <button
                type="button"
                onClick={() => {
                  setAddPracticeTest(false);
                }}
                className="inline-flex cursor-pointer items-center border border-transparent px-4 py-2 text-sm font-medium text-black hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center border border-transparent bg-black px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-gray-900"
              >
                Add test
              </button>
            </div>
          </form>
        )}
        {addAssignment && (
          <form className="mt-2 w-full border border-dotted border-gray-500 bg-white p-4 pb-16  ">
            <div className="grid grid-cols-12">
              <div className="relative col-span-12 mt-1 rounded-md shadow-sm">
                <input
                  type="text"
                  name="price"
                  className="focus:border-indigo-500 focus:ring-indigo-500  block w-full border-gray-600 pl-7 pr-12 sm:text-sm"
                  placeholder="Title"
                  aria-describedby="price-currency"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-gray-500 sm:text-sm" id="price-currency">
                    0 of 60
                  </span>
                </div>
              </div>
            </div>
            <div className="float-right  mt-4 space-x-2">
              <button
                type="button"
                onClick={() => {
                  setAddAssignment(false);
                }}
                className="inline-flex cursor-pointer items-center border border-transparent px-4 py-2 text-sm font-medium text-black hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center border border-transparent bg-black px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-gray-900"
              >
                Add assignment
              </button>
            </div>
          </form>
        )}
      </li>

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
                          You are about to remove a curriculum item. Are you sure you want to
                          continue?
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    {loading ? (
                      <div className="inline-flex w-full justify-center rounded-md border border-transparent bg-black px-4 py-2 text-base font-medium text-white sm:col-start-2 sm:text-sm">
                        <LoadingMoon size={20} color="#fff" />
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-black px-4 py-2 text-base font-medium text-white sm:col-start-2 sm:text-sm"
                        onClick={() => {
                          handleSectionRemove(section && section.id);
                        }}
                      >
                        OK
                      </button>
                    )}
                    {loading ? (
                      <div />
                    ) : (
                      <button
                        type="button"
                        className="focus:ring-indigo-500 mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                        onClick={() => setOpen(false)}
                        ref={cancelButtonRef}
                      >
                        Cancel
                      </button>
                    )}
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
