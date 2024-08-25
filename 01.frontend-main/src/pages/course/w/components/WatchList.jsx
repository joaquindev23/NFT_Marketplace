import React from 'react';
import { CircleLoader } from 'react-spinners';
import WatchListSections from './WatchListSections';

export default function WatchList({
  setEpisodeQuestions,
  episodeQuestions,
  sections,
  setSrc,
  setVideoHidden,
  videoHidden,
  content,
  setContent,
  setTitle,
  title,
  setEpisode,
  setResources,
  handleQuestionHidden,
  questionHidden,
  setQuestionHidden,
  handleResourceHidden,
  resourceHidden,
  setResourceHidden,
  fetchQuestions,
  loadingSections,
  handleToggle,
  details,
  id,
  setId,
  viewedEpisodes,
  fetchViewedEpisodes,
}) {
  return (
    <nav className="flex-1 pt-5">
      <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between p-4 sm:flex-nowrap">
        <div className="ml-4 mt-2">
          <p className="text-md font-bold leading-6 dark:text-dark-txt text-gray-900">
            Course content
          </p>
        </div>
        <button type="button" onClick={handleToggle} className="ml-4 mt-2 flex-shrink-0">
          <i className="bx bx-x text-2xl dark:text-dark-txt-secondary text-gray-900" />
        </button>
      </div>
      {!loadingSections ? (
        <WatchListSections
          id={id}
          setId={setId}
          setSrc={setSrc}
          fetchViewedEpisodes={fetchViewedEpisodes}
          details={details}
          fetchQuestions={fetchQuestions}
          sections={sections}
          setEpisode={setEpisode}
          setEpisodeQuestions={setEpisodeQuestions}
          episodeQuestions={episodeQuestions}
          setTitle={setTitle}
          setContent={setContent}
          content={content}
          setResources={setResources}
          handleQuestionHidden={handleQuestionHidden}
          questionHidden={questionHidden}
          setQuestionHidden={setQuestionHidden}
          videoHidden={videoHidden}
          setVideoHidden={setVideoHidden}
          title={title}
          handleResourceHidden={handleResourceHidden}
          resourceHidden={resourceHidden}
          setResourceHidden={setResourceHidden}
          viewedEpisodes={viewedEpisodes}
        />
      ) : (
        <div className="grid w-full place-items-center py-8">
          <CircleLoader
            className="items-center justify-center text-center"
            loading={loadingSections}
            size={35}
            color="#1c1d1f"
          />
        </div>
      )}
    </nav>
  );
}
