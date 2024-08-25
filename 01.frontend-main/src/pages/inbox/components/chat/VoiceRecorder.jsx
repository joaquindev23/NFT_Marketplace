import { MicrophoneIcon } from '@heroicons/react/20/solid';
import React, { useEffect, useState } from 'react';

export default function VoiceRecorder({ audioURL, setAudioURL }) {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  useEffect(() => {
    const handleDataAvailable = (event) => {
      const blob = new Blob([event.data], { type: 'audio/mp3' });
      const url = URL.createObjectURL(blob);
      setAudioURL(url);
    };

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);
        recorder.addEventListener('dataavailable', handleDataAvailable);
      })
      .catch((err) => {
        console.log('Error getting user media', err);
      });
  }, []);

  const startRecording = () => {
    setRecording(true);
    mediaRecorder.start();
  };

  const stopRecording = () => {
    setRecording(false);
    mediaRecorder.stop();
  };

  return (
    <div>
      <div className="flex-items flex">
        {recording === false ? (
          <button
            type="button"
            onClick={startRecording}
            className="relative -m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
          >
            <span className="flex items-center justify-center">
              <span>
                <MicrophoneIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                <span className="sr-only"> Add voice note </span>
              </span>
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={stopRecording}
            className="relative -m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
          >
            <span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500">
                <MicrophoneIcon className="h-5 w-5 flex-shrink-0 text-white" aria-hidden="true" />
              </span>

              {/* <button type='button' onClick={startRecording} disabled={recording}>Start recording</button>
                    <button type='button' onClick={stopRecording} disabled={!recording}>Stop recording</button> */}
              <span className="sr-only">Add voice note</span>
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
