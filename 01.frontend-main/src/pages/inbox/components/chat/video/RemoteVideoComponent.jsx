import React, { useEffect, useRef } from 'react';

export default function RemoteVideoComponent({ userId, stream }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  console.log(`Rendering remote video for user ${userId} with stream:`, stream);

  return (
    <div className="remote-video-container h-full w-full">
      <video className="h-full max-h-80 w-auto object-cover" autoPlay playsInline ref={videoRef} />
    </div>
  );
}
