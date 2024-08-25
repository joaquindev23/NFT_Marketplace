import React from 'react';
import SimpleEditor from '@/components/SimpleEditor';

export default function WelcomeMessageSec({
  welcomeMessage,
  setWelcomeMessage,
  congratsMessage,
  setCongratsMessage,
}) {
  const welcomeCount = welcomeMessage && welcomeMessage.replace(/<[^>]+>/g, '').length;
  const congratsCount = congratsMessage && congratsMessage.replace(/<[^>]+>/g, '').length;
  return (
    <div>
      <div className="mt-8">
        <span className="mb-2 block text-md font-black dark:text-dark-txt text-gray-700">
          Thank You Message
        </span>
        <div className="relative mt-1 ">
          <div className="pointer-events-none  absolute bottom-0 right-0 flex items-center pr-3 pb-2">
            <span className="text-gray-500 sm:text-sm" id="price-currency">
              {welcomeCount || 0} of 1200
            </span>
          </div>
          <SimpleEditor
            data={welcomeMessage && welcomeMessage}
            setData={setWelcomeMessage}
            placeholder="Thank you for your purchase, we are sending it right now."
            maxLength={1200}
          />
        </div>
      </div>
      <div className="mt-8">
        <span className="mb-2 block text-md font-black dark:text-dark-txt text-gray-700">
          Product Delievered Message
        </span>
        <div className="relative mt-1 ">
          <div className="pointer-events-none  absolute bottom-0 right-0 flex items-center pr-3 pb-2">
            <span className="text-gray-500 sm:text-sm" id="price-currency">
              {congratsCount || 0} of 1200
            </span>
          </div>
          <SimpleEditor
            data={congratsMessage && congratsMessage}
            setData={setCongratsMessage}
            placeholder="Your order been dispatched and is on its way."
            maxLength={1200}
          />
        </div>
      </div>
    </div>
  );
}
