import React, { Fragment, useState } from 'react';
import { CircleLoader } from 'react-spinners';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { Transition, Menu } from '@headlessui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import SimpleEditor from '@/components/SimpleEditor';
import CreateEpisodeQuestion from '@/api/courses/questions/Create';
import QuestionsList from './QuestionsList';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function QuestionsSec({
  loadingQuestions,
  episodeUUID,
  authState,
  questions,
  questionsCount,
  questionsPageSize,
  setQuestionsPageSize,
  currentQuestionsPage,
  setCurrentQuestionsPage,
  fetchCourseQuestions,
  maxQuestionsPageSize,
  setMaxQuestionsPageSize,
  filterQuestionsBy,
  setFilterQuestionsBy,
  orderQuestionsBy,
  setOrderQuestionsBy,
  fetchEpisodeQuestions,
  episode,
  setSrc,
  setVideoHidden,
  setContent,
  setTitle,
  setEpisode,
  setResources,
  setQuestionHidden,
  setResourceHidden,
  setQuestionsCount,
  setQuestions,
}) {
  const [loading, setLoading] = useState(false);
  const [viewCourseQuestions, setViewCourseQuestions] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
  });
  const { title } = formData;
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [formDataSearch, setFormDataSearch] = useState({
    searchTitle: '',
  });
  const { searchTitle } = formDataSearch;
  const onChangeSearch = (e) => {
    setFormDataSearch({ ...formDataSearch, [e.target.name]: e.target.value });
  };

  const [create, setCreate] = useState(false);

  const [body, setBody] = useState('');

  const handleCreate = () => {
    if (create) {
      setCreate(false);
    } else {
      setCreate(true);
    }
    setLoading(false);
    setFormData({
      title: '',
    });
    setBody('');
  };

  const onCreateQuestion = async (e) => {
    e.preventDefault();
    const res = await CreateEpisodeQuestion(episodeUUID, title, body);
    if (res.status === 200) {
      setQuestionsCount(res.data.count);
      setQuestions(res.data.results);
      setFormData({
        title: '',
      });
      setBody('');
    }
    // await fetchEpisodeQuestions(currentQuestionsPage, searchTitle);
    setCreate(false);
  };

  const onSubmitSearch = async (e) => {
    e.preventDefault();
    await fetchEpisodeQuestions(currentQuestionsPage, searchTitle);
  };

  return (
    <div className="px-10 py-6">
      {episodeUUID ? (
        <form onSubmit={onSubmitSearch} className="flex">
          <div className="relative flex flex-grow items-stretch focus-within:z-10">
            <input
              type="text"
              name="searchTitle"
              value={searchTitle}
              onChange={(e) => onChangeSearch(e)}
              className="text-md duration block dark:ring-dark-border dark:border-dark-border w-full border focus:ring-none focus:outline-none border-dark py-2.5 pl-4 font-medium transition ease-in-out dark:bg-dark-second dark:text-dark-txt"
              placeholder="Search questions"
            />
          </div>
          {loading ? (
            <div className="relative -ml-px inline-flex items-center space-x-2 border border-gray-900 bg-black px-4 py-2 text-sm font-medium">
              <CircleLoader loading={loading} className="inline-flex" size={15} color="#ffffff" />
            </div>
          ) : (
            <button
              type="submit"
              className="relative -ml-px inline-flex items-center space-x-2 border-l dark:ring-dark-border dark:border-dark-border dark:bg-dark-main bg-black px-4 py-2 text-sm font-medium text-white"
            >
              <MagnifyingGlassIcon className="h-5 w-5 text-white" aria-hidden="true" />
            </button>
          )}
        </form>
      ) : (
        <div className="dark:text-dark-txt">Select episode to ask question</div>
      )}

      <div className="mt-2 flex space-x-2">
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="inline-flex w-full justify-center border dark:border-dark-border border-gray-700 dark:text-dark-txt dark:bg-dark-main bg-white px-4 py-2.5 text-sm font-black text-gray-700  hover:bg-gray-50">
              {!episodeUUID || viewCourseQuestions ? 'All lectures' : 'Current lecture'}
              <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
            </Menu.Button>
          </div>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute left-0 z-10 mt-2 w-56 origin-top-right dark:bg-dark-main bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                {loadingQuestions ? (
                  <div className="grid w-full place-items-center py-6 ">
                    <CircleLoader
                      className="items-center justify-center text-center"
                      loading={loadingQuestions}
                      size={20}
                      color="#1c1d1f"
                    />
                  </div>
                ) : (
                  <>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          type="button"
                          onClick={() => {
                            fetchCourseQuestions(currentQuestionsPage, searchTitle);
                            setViewCourseQuestions(true);
                          }}
                          className={classNames(
                            active
                              ? 'bg-gray-100 dark:bg-dark-second text-gray-900 dark:text-dark-txt'
                              : 'text-gray-700 dark:text-dark-txt-secondary',
                            'block w-full cursor-pointer px-4 py-2 text-left text-sm ',
                          )}
                        >
                          All lectures
                        </button>
                      )}
                    </Menu.Item>
                    {episodeUUID && (
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            type="button"
                            onClick={() => {
                              fetchEpisodeQuestions(currentQuestionsPage, searchTitle);
                              setViewCourseQuestions(false);
                            }}
                            className={classNames(
                              active
                                ? 'bg-gray-100 dark:bg-dark-second text-gray-900 dark:text-dark-txt'
                                : 'text-gray-700 dark:text-dark-txt-secondary',
                              'block w-full cursor-pointer px-4 py-2 text-left text-sm ',
                            )}
                          >
                            Current lecture
                          </button>
                        )}
                      </Menu.Item>
                    )}
                  </>
                )}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>

        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="inline-flex w-auto justify-center border dark:border-dark-border border-gray-700 dark:text-dark-txt dark:bg-dark-main bg-white px-4 py-2.5 text-sm font-black text-gray-700  hover:bg-gray-50">
              Sort by {orderQuestionsBy === 'most_likes' ? 'most upvoted' : 'most recent'}
              <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
            </Menu.Button>
          </div>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute left-0 z-10 mt-2 w-56 origin-top-right dark:bg-dark-main bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                {loadingQuestions ? (
                  <div className="grid w-full place-items-center py-6 ">
                    <CircleLoader
                      className="items-center justify-center text-center"
                      loading={loadingQuestions}
                      size={20}
                      color="#1c1d1f"
                    />
                  </div>
                ) : (
                  <>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          type="button"
                          onClick={() => {
                            setOrderQuestionsBy('-created_date');
                          }}
                          className={classNames(
                            active
                              ? 'bg-gray-100 dark:bg-dark-second text-gray-900 dark:text-dark-txt'
                              : 'text-gray-700 dark:text-dark-txt-secondary',
                            'block w-full cursor-pointer px-4 py-2 text-left text-sm ',
                          )}
                        >
                          Most recent
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          type="button"
                          onClick={() => {
                            setOrderQuestionsBy('most_likes');
                          }}
                          className={classNames(
                            active
                              ? 'bg-gray-100 dark:bg-dark-second text-gray-900 dark:text-dark-txt'
                              : 'text-gray-700 dark:text-dark-txt-secondary',
                            'block w-full cursor-pointer px-4 py-2 text-left text-sm ',
                          )}
                        >
                          Most upvoted
                        </button>
                      )}
                    </Menu.Item>
                  </>
                )}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>

        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="inline-flex w-full justify-center border dark:border-dark-border border-gray-700 dark:text-dark-txt dark:bg-dark-main bg-white px-4 py-2.5 text-sm font-black text-gray-700  hover:bg-gray-50">
              Filter by {filterQuestionsBy === 'user' && 'my questions'}
              {filterQuestionsBy === 'no_answer' && 'without answers'}
              <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
            </Menu.Button>
          </div>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute left-0 z-10 mt-2 w-56 origin-top-right dark:bg-dark-main bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      type="button"
                      onClick={() => {
                        setFilterQuestionsBy(null);
                      }}
                      className={classNames(
                        active
                          ? 'bg-gray-100 dark:bg-dark-second text-gray-900 dark:text-dark-txt'
                          : 'text-gray-700 dark:text-dark-txt-secondary',
                        'block w-full cursor-pointer px-4 py-2 text-left text-sm ',
                      )}
                    >
                      Show all questions
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      type="button"
                      onClick={() => {
                        setFilterQuestionsBy('user');
                      }}
                      className={classNames(
                        active
                          ? 'bg-gray-100 dark:bg-dark-second text-gray-900 dark:text-dark-txt'
                          : 'text-gray-700 dark:text-dark-txt-secondary',
                        'block w-full cursor-pointer px-4 py-2 text-left text-sm ',
                      )}
                    >
                      Questions i asked
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      type="button"
                      onClick={() => {
                        setFilterQuestionsBy('no_answer');
                      }}
                      className={classNames(
                        active
                          ? 'bg-gray-100 dark:bg-dark-second text-gray-900 dark:text-dark-txt'
                          : 'text-gray-700 dark:text-dark-txt-secondary',
                        'block w-full cursor-pointer px-4 py-2 text-left text-sm ',
                      )}
                    >
                      Questions without answers
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      <div className="pt-8 pb-4">
        {!episodeUUID || viewCourseQuestions ? (
          <p className="text-lg font-black leading-6 dark:text-dark-txt text-gray-900">
            All questions in this course
          </p>
        ) : (
          <p className="text-lg font-black leading-6 dark:text-dark-txt text-gray-900">
            All questions in this lecture
          </p>
        )}
      </div>

      <ul className="">
        {loadingQuestions ? (
          <div className="grid w-full place-items-center py-8">
            <CircleLoader
              className="items-center justify-center text-center"
              loading={loadingQuestions}
              size={35}
              color="#1c1d1f"
            />
          </div>
        ) : (
          <>
            <QuestionsList
              episode={episode}
              authState={authState}
              setSrc={setSrc}
              fetchEpisodeQuestions={fetchEpisodeQuestions}
              setVideoHidden={setVideoHidden}
              setContent={setContent}
              setTitle={setTitle}
              setEpisode={setEpisode}
              setResources={setResources}
              setQuestionHidden={setQuestionHidden}
              setResourceHidden={setResourceHidden}
              questions={questions}
              questionsCount={questionsCount}
              questionsPageSize={questionsPageSize}
              setCurrentQuestionsPage={setCurrentQuestionsPage}
              currentQuestionsPage={currentQuestionsPage}
              setQuestionsPageSize={setQuestionsPageSize}
              maxQuestionsPageSize={maxQuestionsPageSize}
              setMaxQuestionsPageSize={setMaxQuestionsPageSize}
              fetchCourseQuestions={fetchCourseQuestions}
            />
            <br />
            {create ? (
              <div className="my-6 mb-4 w-full border border-gray-700 dark:border-dark-border dark:bg-dark-second bg-white py-4">
                <form onSubmit={(e) => onCreateQuestion(e)} className="grid grid-cols-12 ">
                  <h3 className="text-md col-span-2 ml-4 inline-flex font-bold leading-6 dark:text-dark-txt text-gray-900">
                    New question:{' '}
                  </h3>
                  <div className="relative col-span-10 w-full px-4">
                    <div>
                      <label className="block text-sm font-bold dark:text-dark-txt text-gray-900">
                        Title or summary
                      </label>
                      <div className="absolute right-0 mt-2.5 mr-6 dark:text-dark-txt-secondary text-gray-400">
                        {title.length} of 120
                      </div>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => {
                          onChange(e);
                        }}
                        required
                        name="title"
                        className="text-md duration block dark:ring-dark-border dark:border-dark-border w-full border focus:ring-none focus:outline-none border-dark py-2.5 pl-4 font-medium transition ease-in-out dark:bg-dark-second dark:text-dark-txt"
                        placeholder="Enter a title"
                      />
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-bold dark:text-dark-txt text-gray-900">
                        Details (optional)
                      </label>
                      <SimpleEditor
                        data={body}
                        setData={setBody}
                        maxLength={2400}
                        // placeholder="e.g. At 09:56, I don't understand this aprt, here is a screenshot and a code snippet."
                      />
                    </div>
                    <div className="float-right mt-4 flex space-x-2">
                      <button
                        type="button"
                        onClick={handleCreate}
                        className="inline-flex cursor-pointer items-center border border-transparent px-4 py-2 text-sm font-medium text-black dark:text-dark-txt hover:bg-gray-50 dark:hover:bg-dark-second"
                      >
                        Cancel
                      </button>
                      {loading ? (
                        <div className="inline-flex items-center border border-transparent bg-black px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-gray-900">
                          <CircleLoader
                            loading={loading}
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
                          Ask question
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            ) : (
              episodeUUID && (
                <button type="button" onClick={handleCreate} className="my-4 text-lg font-bold">
                  Ask a new question
                </button>
              )
            )}
          </>
        )}
      </ul>
    </div>
  );
}
