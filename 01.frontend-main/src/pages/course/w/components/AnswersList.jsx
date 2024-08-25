import React from 'react';
import { CircleLoader } from 'react-spinners';
import StandardPagination from '@/components/pagination/StandardPagination';
import AnswerItem from '@/components/AnswerItem';

export default function AnswersList({
  answers,
  fetchAnswers,
  question,
  episode,
  count,
  setCount,
  pageSize,
  setPageSize,
  currentPage,
  setCurrentPage,
  maxPageSize,
  setMaxPageSize,
  filterBy,
  setFilterBy,
  orderBy,
  setOrderBy,
  searchTerm,
  setSearchTerm,
  loading,
  setLoading,
  authState,
}) {
  return (
    <div className="space-y-6 py-4">
      {!loading ? (
        answers &&
        answers.map((answer, index) => (
          <AnswerItem
            key={answer.id}
            authState={authState}
            answer={answer}
            index={index}
            fetchAnswers={fetchAnswers}
            count={count}
            loading={loading}
            setLoading={setLoading}
            question={question}
            episode={episode}
          />
        ))
      ) : (
        <div className="grid w-full place-items-center ">
          <CircleLoader
            className="items-center justify-center text-center"
            loading
            size={35}
            color="#1c1d1f"
          />
        </div>
      )}
      {answers && answers.length !== 0 && (
        <StandardPagination
          data={answers}
          count={count}
          pageSize={pageSize}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
}
