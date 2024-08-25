import { ArrowLeftIcon } from '@heroicons/react/20/solid';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetIsInVideoCall, resetVideoSrc } from '@/redux/actions/chat/chat';

export default function EndVideoCall() {
  const dispatch = useDispatch();
  const videoSrc = useSelector((state) => state.chat.videoSrc);

  const handleEndCall = async () => {
    // get the video stream from the state

    // stop the tracks of the video stream
    if (videoSrc) {
      const tracks = videoSrc.getTracks();
      tracks.forEach((track) => {
        track.stop();
      });
    }

    // reset the video source in the state
    dispatch(resetVideoSrc());
    dispatch(resetIsInVideoCall());
  };

  useEffect(() => {
    return () => {
      dispatch(resetVideoSrc());
      dispatch(resetIsInVideoCall());
    };
  }, []);

  return (
    <div className="flex-items flex">
      <button
        type="button"
        className="relative -m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
        onClick={handleEndCall}
      >
        <span className="flex items-center justify-center">
          <span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500">
              <ArrowLeftIcon className="h-5 w-5 flex-shrink-0 text-white" aria-hidden="true" />
            </span>
            <span className="sr-only">End video call</span>
          </span>
        </span>
      </button>
    </div>
  );
}
