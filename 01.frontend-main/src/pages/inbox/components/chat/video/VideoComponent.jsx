import React, { useEffect, useRef } from 'react';

export default function VideoComponent({ myVideoSrc }) {
  const localVideoRef = useRef(null);

  useEffect(() => {
    if (localVideoRef.current && myVideoSrc) {
      localVideoRef.current.srcObject = myVideoSrc;
    }
  }, [myVideoSrc]);

  return (
    <div className="flex h-full items-center justify-center">
      <video
        className="h-full max-h-80 w-auto object-cover"
        autoPlay
        muted
        playsInline
        ref={localVideoRef}
      />
    </div>
  );
}
