import { VideoCameraIcon } from '@heroicons/react/20/solid';
import React from 'react';
import { useDispatch } from 'react-redux';
import { setIsInVideoCall, setVideoSrc } from '@/redux/actions/chat/chat';

export default function JoinVideoCall({ onStartVideoCall }) {
  const dispatch = useDispatch();

  const handleStartCall = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        // Handle successful media device initialization
        console.log('Media devices initialized successfully');
        dispatch(setVideoSrc(stream));
        dispatch(setIsInVideoCall());
        onStartVideoCall();
      })
      .catch((error) => {
        // Handle media device initialization error
        console.error('Error initializing media devices', error);
      });
  };

  return (
    <div className="flex-items flex">
      <button
        type="button"
        className="relative -m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
        onClick={handleStartCall}
      >
        <span className="flex items-center justify-center">
          <span>
            <VideoCameraIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
            <span className="sr-only"> Add your mood </span>
          </span>
        </span>
      </button>
    </div>
  );
}
