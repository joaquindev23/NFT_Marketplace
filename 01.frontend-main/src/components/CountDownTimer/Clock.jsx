import React, { useState, useEffect } from 'react';
import { getRemainingTimeUntilMsTimestamp } from './utils/CountDownTimerUtils';

export default function Clock({ time }) {
  const defaultRemainingTime = {
    seconds: '00',
    minutes: '00',
    hours: '00',
    days: '00',
  };

  const date = new Date(time).getTime();
  const [remainingTime, setRemainingTime] = useState(defaultRemainingTime);

  function updateRemainingTime(countdown) {
    setRemainingTime(getRemainingTimeUntilMsTimestamp(countdown));
  }

  useEffect(() => {
    const intervalId = setInterval(async () => {
      await updateRemainingTime(date);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [date]);

  return (
    <div>
      {/* Timer container */}
      <section className="w-full select-none">
        {/* Timer */}
        <section className="rounded-xl border border-gray-300 p-4">
          {/* Clock */}
          <div className="flex items-center justify-center gap-x-4 text-center">
            <section>
              <p className="font-regular text-4xl">{remainingTime.days}</p>
              <small className="text-base font-medium">Days</small>
            </section>
            <section>
              <p className="font-regular text-4xl">{remainingTime.hours}</p>
              <small className="text-base font-medium">Hours</small>
            </section>
            <section>
              <p className="font-regular text-4xl">{remainingTime.minutes}</p>
              <small className="text-base font-medium">Minutes</small>
            </section>
            <section>
              <p className="font-regular text-4xl">{remainingTime.seconds}</p>
              <small className="text-base font-medium">Seconds</small>
            </section>
          </div>
        </section>
      </section>
    </div>
  );
}
