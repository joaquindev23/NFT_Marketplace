import Link from 'next/link';
import moment from 'moment';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { ArrowUpCircleIcon } from '@heroicons/react/24/outline';
import {
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  EllipsisVerticalIcon,
  FlagIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/solid';
import { CircleLoader } from 'react-spinners';
import DOMPurify from 'dompurify';
import { Dialog, Menu, Transition } from '@headlessui/react';

import FetchQuestionAnswers from '@/api/courses/questions/answers/ListQuestionAnswers';
import SimpleEditor from '@/components/SimpleEditor';
import AnswersSec from './AnswersSec';
import CreateQuestionAnswer from '@/api/courses/questions/answers/Create';
import DeleteQuestion from '@/api/courses/questions/Delete';
import UpdateQuestion from '@/api/courses/questions/Update';
import AddQuestionLike from '@/api/courses/questions/AddLike';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function QuestionListItem({
  question,
  episode,
  setSrc,
  setVideoHidden,
  setContent,
  setTitle,
  setEpisode,
  setResources,
  setQuestionHidden,
  setResourceHidden,
  fetchEpisodeQuestions,
  authState,
  currentQuestionsPage,
  fetchCourseQuestions,
}) {
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
  });
  const { title } = formData;
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClick = () => {
    window.scrollTo(0, 0);
    setVideoHidden(false);
    setQuestionHidden(true);
    setResourceHidden(true);

    if (setSrc) {
      setSrc(episode.file);
    }
    if (setContent) {
      setContent(episode.content);
    }
    if (setTitle) {
      setTitle(episode.title);
    }
    if (setResources) {
      setResources(episode.resources);
    }
    // if (setEpisodeQuestions) {
    // fetchEpisodeQuestions(episode.episode_uuid);
    // }
    if (setEpisode) {
      setEpisode(episode);
    }
  };

  const questionId = question && question && question.id;
  // Create and Fetch Answer
  const [loadingAnswers, setLoadingAnswers] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [count, setCount] = useState([]);
  const [pageSize, setPageSize] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPageSize, setMaxPageSize] = useState(100);
  const [filterBy, setFilterBy] = useState(null);
  const [orderBy, setOrderBy] = useState('-created_date');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAnswers = useCallback(
    async (page, search) => {
      // setLoadingQuestions(true);
      setLoadingAnswers(true);
      try {
        const res = await FetchQuestionAnswers(
          questionId,
          page,
          pageSize,
          maxPageSize,
          orderBy,
          filterBy,
          search,
        );
        if (res.data) {
          setCount(res.data.count);
          setAnswers(res.data.results);
        }
      } catch (err) {
        // eslint-disable-next-line
        // console.log(err);
      } finally {
        // setLoadingQuestions(false);
        setLoadingAnswers(false);
      }
    },
    [questionId, pageSize, maxPageSize, orderBy, filterBy],
  );

  useEffect(() => {
    fetchAnswers(currentPage, searchTerm);
    // eslint-disable-next-line
  }, [fetchAnswers, currentPage]);

  const [viewAnswers, setViewAnswers] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleViewAnswers = async () => {
    if (viewAnswers) {
      setViewAnswers(false);
    } else {
      setViewAnswers(true);
      /// fetch question answers
      await fetchAnswers(currentPage, searchTerm);
    }
  };

  const likeCount = question && question && question.likes && question && question.likes.length;

  const [likes, setLikes] = useState(likeCount);

  const [like, setLike] = useState(
    question && question && question.likes.some((u) => u.user === authState.user.id),
  );

  const addLike = async () => {
    if (like) {
      setLike(false);
      await AddQuestionLike(question && question.id, 'remove');
      setLikes((previousState) => previousState - 1);
    } else {
      setLike(true);
      await AddQuestionLike(question && question.id, 'add');
      setLikes((previousState) => previousState + 1);
    }
  };

  const questionView = () => (
    <div className="block dark:hover:bg-dark-main hover:bg-gray-50">
      <div className="flex items-center px-4 py-4 sm:px-6">
        <div className="flex min-w-0 flex-1 items-center">
          <div className="flex-shrink-0">
            <img className="h-12 w-12 rounded-full" src="" alt="" />
          </div>
          <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
            <div>
              <div className=" truncate text-sm font-medium">{question && question.user}</div>
              <p className="mt-2 flex items-center space-x-1 text-gray-500">
                <button
                  type="button"
                  onClick={handleClick}
                  className="cursor-pointer truncate text-xs dark:text-dark-accent text-purple-700 underline underline-offset-4 hover:text-purple-600"
                >
                  Lecture {question && question.episode.episode_number}
                </button>

                <span className="truncate text-xs">&middot;</span>
                <span className="truncate text-xs dark:text-dark-txt-secondary">
                  {moment(question && question.created_date)
                    .startOf('minute')
                    .fromNow()}
                </span>
              </p>
            </div>
            <div className="hidden md:block">
              <div>
                <p className=" text-sm font-bold dark:text-dark-txt text-gray-900">
                  <button type="button" className="cursor-pointer" onClick={handleViewAnswers}>
                    {question && question.title}
                  </button>
                </p>
                {question && question.correct_answer ? (
                  <p className="mt-2 flex items-center text-sm dark:text-dark-txt text-gray-500">
                    <CheckCircleIcon
                      className="text-green-400 mr-1.5 h-5 w-5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span className="truncate ">Answered</span>
                  </p>
                ) : (
                  <div />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-rows-2 space-y-1">
          <div className="flex">
            <span className="mr-2 text-lg font-bold dark:text-dark-txt-secondary">{likes}</span>
            <ArrowUpCircleIcon
              onClick={addLike}
              className={`${
                like
                  ? 'text-purple-700 dark:text-dark-primary dark:hover:text-dark-txt hover:text-gray-600'
                  : 'text-gray-600 dark:text-dark-txt dark:hover:text-dark-primary hover:text-purple-700'
              }
                    h-6 w-6   cursor-pointer`}
            />
          </div>
          <div className="flex">
            <span className="mr-2 text-lg font-bold dark:text-dark-txt">
              {question && question.get_answers_count}
            </span>
            <ChatBubbleLeftRightIcon
              onClick={handleViewAnswers}
              className="mt-0.5 h-6 w-6 cursor-pointer text-gray-500"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const [body, setBody] = useState('');

  const [addAnswer, setAddAnswer] = useState(false);
  const handleAddAnswer = () => {
    if (addAnswer) {
      setAddAnswer(false);
      setLoading(false);
    } else {
      setAddAnswer(true);
    }
  };

  const onCreateAnswer = async (e) => {
    e.preventDefault();
    setLoading(true);
    await CreateQuestionAnswer(question && question.id, body);
    await fetchAnswers(currentPage, searchTerm);
    setLoading(false);
    handleAddAnswer();
    setBody('');
  };

  const onEditQuestion = async (e) => {
    e.preventDefault();
    setLoading(true);
    await UpdateQuestion(question && question.id, title, body);
    if (episode.id) {
      await fetchEpisodeQuestions(currentQuestionsPage, '');
    } else {
      await fetchCourseQuestions(currentQuestionsPage, '');
    }

    setLoading(false);
    setEdit(false);
    setBody('');
    setFormData({ title: '' });
  };

  const onDeleteQuestion = async (e) => {
    e.preventDefault();
    setLoading(true);
    await DeleteQuestion(question && question.id);
    if (episode.id) {
      await fetchEpisodeQuestions(currentQuestionsPage, '');
    } else {
      await fetchCourseQuestions(currentQuestionsPage, '');
    }
    setLoading(false);
    setBody('');
  };

  return (
    <li>
      {!viewAnswers ? (
        questionView()
      ) : (
        <div className="grid space-y-4 border dark:border-dark-second border-gray-700 pb-2">
          <button
            type="button"
            onClick={handleViewAnswers}
            className="border-b border-gray-900 p-2 px-4 font-bold dark:text-dark-txt dark:hover:bg-dark-third text-gray-900 hover:bg-gray-50"
          >
            Return to question
          </button>

          {edit && (
            <div className="my-6 mb-4 w-full border dark:border-dark-second border-gray-700 dark:bg-dark-second bg-white py-4">
              <form onSubmit={(e) => onEditQuestion(e)} className="grid grid-cols-12 ">
                <h3 className="text-md col-span-2 ml-4 inline-flex font-bold leading-6 dark:text-dark-txt text-gray-900">
                  Edit question:{' '}
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
                    <SimpleEditor data={body} setData={setBody} maxLength={2400} />
                  </div>
                  <div className="float-right mt-4 flex space-x-2">
                    <button
                      type="button"
                      onClick={() => setEdit(false)}
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
                        Save question
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          )}

          <div className="block">
            <div className="flex items-center px-4 sm:px-6">
              <div className="flex min-w-0 flex-1 items-center">
                <div className="flex-shrink-0">
                  <img className="h-12 w-12 rounded-full" src="" alt="" />
                </div>
                <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                  <div>
                    <div className=" truncate text-sm font-medium">{question && question.user}</div>
                    <p className="mt-2 flex items-center space-x-1 text-gray-500">
                      <span
                        onClick={handleClick}
                        className="cursor-pointer truncate text-xs dark:text-dark-accent text-purple-700 underline underline-offset-4 hover:text-purple-600"
                      >
                        Lecture {question && question.episode.episode_number}
                      </span>

                      <span className="truncate text-xs">&middot;</span>
                      <span className="truncate text-xs dark:text-dark-txt">
                        {moment(question && question.created_date)
                          .startOf('minute')
                          .fromNow()}
                      </span>
                    </p>
                  </div>
                  <div className="hidden md:block">
                    <div>
                      <p className="text-sm font-bold dark:text-dark-txt text-gray-900">
                        {question && question.title}
                      </p>
                      {question && question.correct_answer ? (
                        <p className="mt-2 flex items-center text-sm text-gray-500">
                          <CheckCircleIcon
                            className="text-green-400 mr-1.5 h-5 w-5 flex-shrink-0"
                            aria-hidden="true"
                          />
                          <span className="truncate">Answered</span>
                        </p>
                      ) : (
                        <div />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-rows-2 space-y-1">
                <div className="flex">
                  <span className="mr-2 text-lg font-bold">{likes}</span>
                  <ArrowUpCircleIcon
                    onClick={addLike}
                    className={`${
                      like
                        ? 'text-purple-700 dark:text-dark-primary hover:dark:text-dark-txt-secondary hover:text-gray-600'
                        : 'text-gray-600 dark:text-dark-txt-secondary hover:dark:text-dark-primary hover:text-purple-700'
                    }
                            h-6 w-6   cursor-pointer`}
                  />
                  <Menu as="div" className="relative inline-block text-left">
                    <div>
                      <Menu.Button className="">
                        <EllipsisVerticalIcon className="ml-2 h-6 w-6 cursor-pointer dark:text-dark-txt text-gray-600 hover:text-purple-700" />
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
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y dark:bg-dark-bg dark:divide-dark-border divide-gray-100 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                          {question && question.user === authState.user.id && (
                            <>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEdit(true);
                                    }}
                                    className={classNames(
                                      active
                                        ? 'bg-gray-100 dark:bg-dark-main text-gray-900 dark:text-dark-txt'
                                        : 'dark:text-dark-txt-secondary text-gray-700',
                                      'group flex w-full items-center px-4 py-2 text-sm',
                                    )}
                                  >
                                    <PencilIcon
                                      className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                      aria-hidden="true"
                                    />
                                    Edit Question
                                  </button>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setOpen(true);
                                    }}
                                    className={classNames(
                                      active
                                        ? 'bg-gray-100 dark:bg-dark-main text-gray-900 dark:text-dark-txt'
                                        : 'dark:text-dark-txt-secondary text-gray-700',
                                      'group flex w-full items-center px-4 py-2 text-sm',
                                    )}
                                  >
                                    <TrashIcon
                                      className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                      aria-hidden="true"
                                    />
                                    Delete Question
                                  </button>
                                )}
                              </Menu.Item>
                            </>
                          )}
                          {question && question.user !== authState.user.id && (
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  href="/"
                                  className={classNames(
                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                    'group flex items-center px-4 py-2 text-sm',
                                  )}
                                >
                                  <FlagIcon
                                    className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                    aria-hidden="true"
                                  />
                                  Report abuse
                                </Link>
                              )}
                            </Menu.Item>
                          )}
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
                <div className="flex">
                  <span className="mr-2 text-lg font-bold">
                    {question && question.get_answers_count}
                  </span>
                  <ChatBubbleLeftRightIcon
                    onClick={handleViewAnswers}
                    className="mt-0.5 h-6 w-6 cursor-pointer dark:text-dark-txt-secondary text-gray-500"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
            <p
              className="mt-2 space-y-1 px-4 text-sm dark:text-dark-txt-secondary text-gray-700"
              dangerouslySetInnerHTML={{
                __html:
                  DOMPurify.sanitize(question && question.body.length) > 97
                    ? DOMPurify.sanitize(question && question.body.slice(0, 96))
                    : question && DOMPurify.sanitize(question && question.body),
              }}
            />
          </div>

          {question && question.correct_answer ? (
            <div className="px-4">
              <label className="mb-1 block text-sm font-black dark:text-dark-txt text-gray-700">
                Correct answer
              </label>
              <div className="flex ">
                <div className="mr-4  flex-shrink-0">
                  {/* <img
                    className="inline-block h-14 w-14 rounded-full"
                    src={question && question.correct_answer.user.picture}
                    alt=""
                  /> */}
                </div>
                <div className="w-full">
                  <div className="-ml-4 -mt-2  flex flex-wrap items-center justify-between sm:flex-nowrap">
                    <div className="ml-4 mt-2 ">
                      <div className=" text-md font-bold text-purple-700 underline underline-offset-2">
                        {question && question.correct_answer.user}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-dark-txt-secondary">
                    {moment(question && question.correct_answer.created_date).fromNow()}
                  </p>
                  <p
                    className=" font-regular mt-1 dark:text-dark-txt-secondary text-sm"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(question && question.correct_answer.body),
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div />
          )}

          <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between px-4 sm:flex-nowrap">
            <div className="ml-4 mt-2">
              <h3 className="text-md font-bold leading-6 dark:text-dark-txt text-gray-900">
                {question && question.get_answers_count} Replies
              </h3>
            </div>
            <button
              type="button"
              onClick={handleAddAnswer}
              className="ml-4 mt-2 flex-shrink-0 font-bold"
            >
              Reply
            </button>
          </div>
          {addAnswer ? (
            <div className="my-6 mb-4 w-full bg-white dark:bg-dark-second pb-4">
              <form onSubmit={(e) => onCreateAnswer(e)} className="grid  ">
                <div className="relative w-full px-4 ">
                  <div className="mt-4">
                    <label className="mb-1 block text-sm font-black dark:text-dark-txt text-gray-700">
                      Write your response
                    </label>
                    <SimpleEditor data={body} setData={setBody} />
                  </div>
                  <div className="float-right mt-4 flex space-x-2">
                    <div
                      onClick={handleAddAnswer}
                      className="inline-flex cursor-pointer items-center border border-transparent px-4 py-2 text-sm font-medium text-black dark:text-dark-txt hover:bg-gray-50 dark:hover:bg-dark-second"
                    >
                      Cancel
                    </div>
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
                        Add an answer
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          ) : (
            <div />
          )}
          <AnswersSec
            answers={answers}
            authState={authState}
            fetchAnswers={fetchAnswers}
            question={question}
            loading={loadingAnswers}
            setLoading={setLoadingAnswers}
            episode={episode}
            count={count}
            setCount={setCount}
            pageSize={pageSize}
            setPageSize={setPageSize}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            maxPageSize={maxPageSize}
            setMaxPageSize={setMaxPageSize}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            orderBy={orderBy}
            setOrderBy={setOrderBy}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>
      )}

      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
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
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                  <div>
                    <div className="mt-3 text-center sm:mt-5">
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you wish to delete this question?
                        </p>
                      </div>
                    </div>
                  </div>
                  <form onSubmit={onDeleteQuestion} className="mt-5 sm:mt-6">
                    <button
                      type="submit"
                      className="inline-flex w-full justify-center rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dark"
                      onClick={() => setOpen(false)}
                    >
                      Confirm
                    </button>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </li>
  );
}
