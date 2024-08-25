import React, { Fragment, useState } from 'react';
import { ArrowUpCircleIcon, CheckIcon } from '@heroicons/react/24/outline';
import { MoonLoader } from 'react-spinners';
import {
  CheckCircleIcon,
  EllipsisVerticalIcon,
  FlagIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/solid';
import moment from 'moment';
import { Menu, Transition, Dialog } from '@headlessui/react';
import DOMPurify from 'dompurify';

import UpdateQuestionAnswer from '@/api/courses/questions/answers/Update';
import AcceptAnswer from '@/api/courses/questions/answers/AcceptAnswer';
import SimpleEditor from '@/components/SimpleEditor';
import DeleteAnswer from '@/api/courses/questions/answers/Delete';
import AddAnswerLike from '@/api/courses/questions/answers/AddLike';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function AnswerItem({
  answer,
  authState,
  fetchAnswers,
  count,
  loading,
  setLoading,
  question,
  episode,
}) {
  const [open, setOpen] = useState(false);

  const likeCount = answer && answer && answer.likes && answer && answer.likes.length;

  const [likes, setLikes] = useState(likeCount);
  const [like, setLike] = useState(
    answer && answer && answer.likes.some((u) => u.user === authState.user.id),
  );

  const [edit, setEdit] = useState(false);
  const [body, setBody] = useState('');

  const addLike = async () => {
    if (like) {
      setLike(false);
      await AddAnswerLike(answer && answer.id, 'remove');
      setLikes((previousState) => previousState - 1);
    } else {
      setLike(true);
      await AddAnswerLike(answer && answer.id, 'add');
      setLikes((previousState) => previousState + 1);
    }
  };

  const [acceptedAnswer, setAcceptedAnswer] = useState(answer && answer.is_accepted_answer);

  const acceptAnswer = async () => {
    await AcceptAnswer(answer && answer.id)
      .then((response) => {
        // Handle successful response
        setAcceptedAnswer(true);
      })
      .catch((error) => {
        // Handle error
      });

    // fetchQuestions(episode.episode_uuid)
  };

  const unacceptAnswer = async () => {
    // dispatch(unaccept_answer(answer&&answer.answer_uuid, question.question_uuid))
    // fetchQuestions(episode.episode_uuid)
    await AcceptAnswer(answer && answer.id)
      .then((response) => {
        // Handle successful response
        setAcceptedAnswer(false);
      })
      .catch((error) => {
        // Handle error
      });
  };

  const onEditAnswer = async (e) => {
    e.preventDefault();
    setLoading(true);
    await UpdateQuestionAnswer(answer && answer.id, body);
    await fetchAnswers(1, '');
    setLoading(false);
    setBody('');
  };

  const onDeleteAnswer = async (e) => {
    e.preventDefault();
    setLoading(true);
    await DeleteAnswer(answer && answer.id);
    await fetchAnswers(1, '');
    setLoading(false);
    setBody('');
  };

  return (
    <>
      <div className="flex ">
        <div className="mr-4  flex-shrink-0">
          <img
            className="inline-block h-14 w-14 rounded-full"
            src={answer && answer.user.picture}
            alt=""
          />
        </div>
        <div className="w-full">
          <div className="-ml-4 -mt-2  flex flex-wrap items-center justify-between sm:flex-nowrap">
            <div className="ml-4 mt-2 flex">
              <div className=" text-md font-bold  underline underline-offset-2">
                {answer && answer.user}
              </div>
              {acceptedAnswer ? (
                <span className="ml-2 inline-flex items-center rounded-full bg-forest-green-100 px-2.5 py-0.5 text-xs font-medium text-forest-green-800">
                  Correct answer
                </span>
              ) : (
                <div />
              )}
            </div>

            <div className="ml-4 mt-2 flex-shrink-0">
              <div className="flex">
                {answer && answer.user === authState.user.id ? (
                  <>
                    {!acceptedAnswer ? (
                      <CheckCircleIcon
                        onClick={acceptAnswer}
                        className="mr-2 h-6 w-6 cursor-pointer text-gray-400 hover:text-forest-green-300"
                      />
                    ) : (
                      <CheckCircleIcon
                        onClick={unacceptAnswer}
                        className="mr-2 h-6 w-6 cursor-pointer  text-forest-green-300"
                      />
                    )}
                    <div />
                  </>
                ) : (
                  <div />
                )}
                <div className="flex">
                  <div className="mr-1 inline-flex font-bold">{likes}</div>
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
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button className="">
                      <EllipsisVerticalIcon className="ml-2 h-6 w-6 cursor-pointer text-gray-600 hover:text-purple-700" />
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
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right dark:divide-dark-border dark:bg-dark-bg divide-y divide-gray-100 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        {answer && answer.user === authState.user.id && (
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
                                  Edit Answer
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
                                  Delete Answer
                                </button>
                              )}
                            </Menu.Item>
                          </>
                        )}
                        {answer && answer.user !== authState.user.id && (
                          <Menu.Item>
                            {({ active }) => (
                              <a
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
                              </a>
                            )}
                          </Menu.Item>
                        )}
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600">{moment(answer && answer.created_date).fromNow()}</p>
          <p
            className=" font-regular mt-1 text-sm"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(answer && answer.body) }}
          />
        </div>
      </div>

      {edit && (
        <div className="my-6 mb-4 w-full bg-white  pb-4">
          <form onSubmit={(e) => onEditAnswer(e)} className="grid  ">
            <div className="relative w-full px-4 ">
              <div className="mt-4">
                <label className="mb-1 block text-sm font-black text-gray-700">
                  Write your response
                </label>
                <SimpleEditor
                  data={body}
                  setData={setBody}
                  placeholder="e.g. At 09:56, I don't understand this aprt, here is a screenshot and a code snippet."
                />
              </div>
              <div className="float-right mt-4 flex space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setEdit(false);
                  }}
                  className="inline-flex cursor-pointer items-center border border-transparent px-4 py-2 text-sm font-medium text-black hover:bg-gray-50"
                >
                  Cancel
                </button>
                {loading ? (
                  <div className="inline-flex items-center border border-transparent bg-black px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-gray-900">
                    <MoonLoader
                      loading={loading}
                      className="inline-flex"
                      size={20}
                      color="#ffffff"
                    />
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="inline-flex items-center border border-transparent bg-black px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-gray-900"
                  >
                    Save answer
                  </button>
                )}
              </div>
            </div>
          </form>
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
                          Are you sure you wish to delete this answer?
                        </p>
                      </div>
                    </div>
                  </div>
                  <form onSubmit={onDeleteAnswer} className="mt-5 sm:mt-6">
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
    </>
  );
}
