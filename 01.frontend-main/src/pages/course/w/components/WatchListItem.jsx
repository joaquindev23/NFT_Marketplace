import React, { useState } from 'react';
import WatchListContentItem from './WatchListContentItem';

export default function WatchListItem({
  section,
  setSrc,
  setContent,
  setResources,
  setTitle,
  setEpisodeQuestions,
  setEpisode,
  setQuestionHidden,
  videoHidden,
  setVideoHidden,
  title,
  fetchQuestions,
  setResourceHidden,
  details,
  id,
  setId,
  viewedEpisodes,
  fetchViewedEpisodes,
}) {
  const [hidden, setHidden] = useState(true);

  const handleHidden = () => {
    setHidden(!hidden);
  };

  return (
    <div className="">
      <div
        onClick={handleHidden}
        className="-ml-4 flex cursor-pointer flex-wrap items-center justify-between dark:hover:bg-dark-third dark:bg-dark-bg bg-gray-50 p-3 sm:flex-nowrap"
      >
        <div className="ml-4 ">
          <p className="text-sm font-extrabold leading-6 dark:text-dark-txt text-gray-900">
            Section {section && section.number}: {section && section.title}
          </p>
          <p className="mt-1 text-xs dark:text-dark-txt-secondary text-gray-500">
            0/{section && section.episodes.length} | {section && section.total_duration}
          </p>
        </div>
        <div className="ml-4  flex-shrink-0">
          {hidden ? (
            <i className="bx bx-chevron-up text-2xl dark:text-dark-txt-secondary text-gray-900" />
          ) : (
            <i className="bx bx-chevron-down text-2xl dark:text-dark-txt-secondary text-gray-900" />
          )}
        </div>
      </div>
      <div className={hidden ? ' hidden' : '  '}>
        {section ? (
          section &&
          section.episodes.map((data) => (
            <WatchListContentItem
              id={id}
              fetchViewedEpisodes={fetchViewedEpisodes}
              setId={setId}
              key={data.id} // use the `id` property as the key
              details={details}
              fetchQuestions={fetchQuestions}
              section={section}
              setSrc={setSrc !== null && setSrc !== undefined && setSrc}
              setContent={setContent !== null && setContent !== undefined && setContent}
              setResources={setResources !== null && setResources !== undefined && setResources}
              setTitle={setTitle !== null && setTitle !== undefined && setTitle}
              setEpisodeQuestions={
                setEpisodeQuestions !== null &&
                setEpisodeQuestions !== undefined &&
                setEpisodeQuestions
              }
              setEpisode={setEpisode !== null && setEpisode !== undefined && setEpisode}
              data={data}
              title={title}
              videoHidden={videoHidden}
              setVideoHidden={setVideoHidden}
              setQuestionHidden={setQuestionHidden}
              setResourceHidden={setResourceHidden}
              viewedEpisodes={viewedEpisodes}
            />
          ))
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
