import PlusIcon from '@heroicons/react/20/solid/PlusIcon';
import React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetComposeNewInbox, setComposeNewinbox } from '@/redux/actions/chat/chat';
import InboxesList from './InboxesList';

export default function InboxesSec({ inboxes, user, setChat, chat }) {
  const dispatch = useDispatch();

  const compose = useSelector((state) => state.chat.compose_new_inbox);

  const handleComposeInbox = () => {
    if (compose) {
      dispatch(resetComposeNewInbox());
    } else {
      dispatch(setComposeNewinbox());
    }
  };

  return (
    <div>
      {/* Active Inboxes */}
      <div className="flex flex-wrap items-center justify-between py-2 sm:flex-nowrap">
        <div className="ml-4 mt-2">
          <p className="text-lg font-semibold leading-6 text-gray-900">Inboxes</p>
        </div>
      </div>
      {inboxes && inboxes.length > 0 ? (
        <InboxesList chat={chat} inboxes={inboxes} user={user} setChat={setChat} />
      ) : (
        <>
          {/* No messages empty */}
          <div>
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  vectorEffect="non-scaling-stroke"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No Messages</h3>
              <p className="mt-1 text-sm text-gray-500">Compose a new message to see it here.</p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleComposeInbox}
                  className="inline-flex items-center rounded-md bg-iris-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-iris-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iris-600"
                >
                  <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                  Compose new
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
