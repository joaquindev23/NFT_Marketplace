import React from 'react';
import AnswersList from './AnswersList';

export default function AnswersSec({
  answers,
  authState,
  fetchAnswers,
  question,
  loading,
  setLoading,
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
}) {
  return (
    <div className="px-4">
      <AnswersList
        answers={answers && answers}
        authState={authState && authState}
        fetchAnswers={fetchAnswers && fetchAnswers}
        question={question && question}
        loading={loading && loading}
        setLoading={setLoading && setLoading}
        episode={episode && episode}
        count={count && count}
        setCount={setCount && setCount}
        pageSize={pageSize && pageSize}
        setPageSize={setPageSize && setPageSize}
        currentPage={currentPage && currentPage}
        setCurrentPage={setCurrentPage && setCurrentPage}
        maxPageSize={maxPageSize && maxPageSize}
        setMaxPageSize={setMaxPageSize && setMaxPageSize}
        filterBy={filterBy && filterBy}
        setFilterBy={setFilterBy && setFilterBy}
        orderBy={orderBy && orderBy}
        setOrderBy={setOrderBy && setOrderBy}
        searchTerm={searchTerm && searchTerm}
        setSearchTerm={setSearchTerm && setSearchTerm}
      />
    </div>
  );
}
