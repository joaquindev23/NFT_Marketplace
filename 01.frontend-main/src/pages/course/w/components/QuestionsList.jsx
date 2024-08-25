import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { CircleLoader } from 'react-spinners';
import StandardPagination from '@/components/pagination/StandardPagination';
import QuestionListItem from './QuestionListItem';

export default function QuestionsList({
  questions,
  questionsCount,
  questionsPageSize,
  setCurrentQuestionsPage,
  currentQuestionsPage,
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
  fetchCourseQuestions,
}) {
  return (
    <div>
      {questions ? (
        <div className="space-y-2">
          {questions.length !== 0 ? (
            questions.map((question) => (
              <QuestionListItem
                key={question.id}
                authState={authState}
                question={question}
                episode={episode}
                fetchEpisodeQuestions={fetchEpisodeQuestions}
                setSrc={setSrc}
                setVideoHidden={setVideoHidden}
                setContent={setContent}
                setTitle={setTitle}
                setEpisode={setEpisode}
                setResources={setResources}
                setQuestionHidden={setQuestionHidden}
                setResourceHidden={setResourceHidden}
                currentQuestionsPage={currentQuestionsPage}
                fetchCourseQuestions={fetchCourseQuestions}
              />
            ))
          ) : (
            <div className="text-center">
              <QuestionMarkCircleIcon className="mx-auto h-12 w-12" />
              <h3 className="mt-2 text-sm font-medium dark:text-dark-txt text-gray-900">
                No Questions
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-dark-txt-secondary">
                Get started by asking a question.
              </p>
            </div>
          )}
          {questions && questions.length !== 0 && (
            <StandardPagination
              data={questions}
              count={questionsCount}
              pageSize={questionsPageSize}
              currentPage={currentQuestionsPage}
              setCurrentPage={setCurrentQuestionsPage}
            />
          )}
        </div>
      ) : (
        <div className="grid w-full place-items-center py-8">
          <CircleLoader
            className="items-center justify-center text-center"
            loading={questions}
            size={35}
            color="#1c1d1f"
          />
        </div>
      )}
    </div>
  );
}
