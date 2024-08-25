import React from 'react';
import { CircleLoader } from 'react-spinners';
import WatchListItem from './WatchListItem';

export default function WatchListSections({
  setEpisodeQuestions,
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
  details,
  id,
  setId,
  viewedEpisodes,
  fetchViewedEpisodes,
}) {
  return (
    <div>
      {sections ? (
        sections.map((section) => (
          <WatchListItem
            id={id}
            setId={setId}
            key={section.id}
            setSrc={setSrc}
            details={details}
            fetchQuestions={fetchQuestions}
            setEpisode={setEpisode}
            setEpisodeQuestions={setEpisodeQuestions}
            setTitle={setTitle}
            setContent={setContent}
            content={content}
            setResources={setResources}
            section={section}
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
            fetchViewedEpisodes={fetchViewedEpisodes}
          />
        ))
      ) : (
        <div className="grid w-full place-items-center ">
          <CircleLoader
            className="items-center justify-center text-center"
            loading
            size={15}
            color="#1c1d1f"
          />
        </div>
      )}
    </div>
  );
}
