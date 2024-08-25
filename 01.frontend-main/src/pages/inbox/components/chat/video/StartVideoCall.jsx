import { VideoCameraIcon } from '@heroicons/react/20/solid';
import React from 'react';
import { useDispatch } from 'react-redux';
import { setIsInVideoCall, setVideoSrc } from '@/redux/actions/chat/chat';

export default function StartVideoCall({
  onStartVideoCall,
  user,
  stream,
  peerConnections,
  websocketVideoClientRef,
  createPeerConnection,
}) {
  const dispatch = useDispatch();

  const handleStartCall = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(async (stream) => {
        // Handle successful media device initialization
        console.log('Media devices initialized successfully');
        dispatch(setVideoSrc(stream));
        dispatch(setIsInVideoCall());
        onStartVideoCall();

        // Create a new RTCPeerConnection instance for the current user
        const peerConnection = createPeerConnection(user.id);
        peerConnections.current[user.id] = peerConnection;

        // Add local stream tracks to the peer connection
        stream.getTracks().forEach((track) => {
          peerConnections.current[user.id].addTrack(track, stream);
        });

        // Create an offer and set it as the local description
        const offer = await peerConnections.current[user.id].createOffer();
        await peerConnections.current[user.id].setLocalDescription(
          new RTCSessionDescription(offer),
        );

        // Function to send the offer to the other user
        const sendOffer = () => {
          websocketVideoClientRef.current.send(
            JSON.stringify({
              type: 'offer',
              offer: offer,
              from_user_id: user.id,
            }),
          );
        };

        // Check the WebSocket connection state
        if (websocketVideoClientRef.current.readyState === WebSocket.OPEN) {
          sendOffer();
        } else {
          // Add an event listener to wait for the WebSocket to open
          websocketVideoClientRef.current.addEventListener('open', () => {
            sendOffer();
          });
        }
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
          {stream && stream.length === 0 ? (
            <span>
              <VideoCameraIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              <span className="sr-only"> Add your mood </span>
            </span>
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-200">
              <VideoCameraIcon className="h-4 w-4 flex-shrink-0 text-white" aria-hidden="true" />
            </span>
          )}
        </span>
      </button>
    </div>
  );
}
