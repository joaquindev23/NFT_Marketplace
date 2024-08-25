import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { Squares2X2Icon } from '@heroicons/react/24/outline';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { setFriendRequestsList, setFriendsList } from '@/redux/actions/friends/friends';
import AnimatedTippy from '@/components/tooltip';

export default function MenuDropdown() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [friendRequests, setFriendRequests] = useState([]);
  const [requestCount, setFriendRequestsCount] = useState(0);
  const [start, setStart] = useState(0);
  const [count, setCount] = useState(20);

  // eslint-disable-next-line
  const [error, setError] = useState(null);
  // eslint-disable-next-line
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let client = null;
    if (user && user.id) {
      const handleOpen = () => {
        console.log('Friends Websocket Connected to Django Channels');
        client.send(
          JSON.stringify({
            type: 'get_friendslist',
            user_id: user && user.id,
            start,
            count,
          }),
        );
        client.send(
          JSON.stringify({
            type: 'get_friend_requests',
            user_id: user && user.id,
            start,
            count,
          }),
        );
      };

      const handleMessage = (event) => {
        const message = JSON.parse(event.data);
        // console.log('Got this from websocket:', message);
        switch (message.type) {
          case 'friends_list':
            // Update inboxes state
            dispatch(setFriendsList(message.data));
            break;
          case 'friend_requests':
            // Update inboxes state
            // console.log('FRIEND REQUESTS:', message.data);
            setFriendRequestsCount(message.total_count);
            dispatch(setFriendRequestsList(message.data));
            setFriendRequests(message.data);
            // setFriendRequests(message.data);
            break;
          case 'new_friend_request':
            // console.log('New Friend Request: ', message.data);
            setFriendRequestsCount(message.total_count);
            const updatedFriendRequests = [...friendRequests, message.data];
            setFriendRequests(updatedFriendRequests);
            dispatch(setFriendRequestsList(updatedFriendRequests));
            break;
          default:
          // console.log('Unhandled message type:', message.type);
        }
      };

      const handleError = (e) => {
        // console.error('WebSocket error:', e);
        setError(e);
        setConnected(false);
      };

      const handleClose = () => {
        setConnected(false);
        setTimeout(connectWebSocket, 5000); // Attempt to reconnect every 5 seconds
      };

      const connectWebSocket = () => {
        try {
          const protocol = process.env.NEXT_PUBLIC_APP_ENV === 'production' ? 'wss' : 'ws';
          const path = `${protocol}://${
            process.env.NEXT_PUBLIC_APP_AUTH_API_WS
          }/ws/friends/?token=${encodeURIComponent(user && user.id)}`;
          client = new W3CWebSocket(path);
          client.onopen = handleOpen;
          client.onmessage = handleMessage;
          client.onclose = handleClose;
          client.onerror = handleError;
        } catch (e) {
          handleError(e);
        }
      };

      const disconnectWebSocket = () => {
        if (client && client.readyState === WebSocket.OPEN) {
          client.close();
          setConnected(false);
        }
      };

      if (!client && user) {
        connectWebSocket();
      }

      return () => {
        disconnectWebSocket();
      };
    }
  }, [user]);

  return (
    <AnimatedTippy
      offsetY={20}
      content={
        <div className="w-96  cursor-default ">
          <div className="-mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
            <div className="-mb-4 p-4">
              <p className="text-xl font-extrabold leading-6 dark:text-dark-txt text-gray-900">
                Menu
              </p>
            </div>
            <div className="mx-4 mt-4 flex-shrink-0">
              <button
                type="button"
                className="relative inline-flex items-center rounded-md bg-dark px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-gray-900"
              >
                Create
              </button>
            </div>
          </div>
          <div className=" p-4">
            <div className="overflow-y-auto dark:text-dark-txt">
              Social
              <ul className="divide-y divide-gray-200 space-y-2">
                <li className="mt-2">
                  <Link href="/friends">
                    <div className="flex items-center space-x-4 rounded-lg p-2 transition duration-200 ease-in-out dark:hover:bg-dark-second hover:bg-[#f7f8fa]">
                      <div className="flex-shrink-0">
                        <i className="bx bx-group text-2xl text-iris-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium dark:text-dark-txt text-gray-900">
                          Friends
                        </p>
                        <p className="text-sm text-gray-500 dark:text-dark-txt-secondarys">
                          Search friends and requests
                        </p>
                      </div>
                      <div>
                        {requestCount > 0 && (
                          <div className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                            {requestCount}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      }
    >
      <button
        type="button"
        className="ring-none relative items-center justify-center rounded-full border-none text-dark-gray hover:text-iris-400 dark:text-dark-txt-secondary  dark:hover:text-dark-primary md:inline-flex "
      >
        <Squares2X2Icon
          className=" h-6 w-6 
transition duration-300 ease-in-out  "
          aria-hidden="true"
        />
        {requestCount > 0 && (
          <span className="absolute top-0 ml-4 rounded-full bg-iris-600 px-2 text-center text-xs font-semibold text-white md:ml-4">
            {requestCount}
          </span>
        )}
      </button>
    </AnimatedTippy>
    //     <Tippy
    //       animation
    //       theme="custom"
    //       interactive
    //       placement="bottom"
    //       duration={[100, 75]}
    //       offset={[0, 10]}
    //       arrow={false}
    //       content={
    //         <div className="w-96 cursor-default rounded-lg bg-[#f7f8fa] shadow-lg">
    //           <div className="-mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
    //             <div className="-mb-4 p-4">
    //               <p className="text-xl font-extrabold leading-6 text-gray-900">Menu</p>
    //             </div>
    //             <div className="mx-4 mt-4 flex-shrink-0">
    //               <button
    //                 type="button"
    //                 className="relative inline-flex items-center rounded-md bg-dark px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-gray-900"
    //               >
    //                 Create
    //               </button>
    //             </div>
    //           </div>
    //           <div className=" p-4">
    //             <div className="overflow-y-auto rounded-lg bg-white shadow">
    //               <div className="p-4">
    //                 Social
    //                 <ul className="divide-y divide-gray-200">
    //                   <li>
    //                     <a href="/friends">
    //                       <div className="flex items-center space-x-4 rounded-lg p-2 transition duration-200 ease-in-out hover:bg-[#f7f8fa]">
    //                         <div className="flex-shrink-0">
    //                           <i className="bx bx-group text-2xl text-iris-400" />
    //                         </div>
    //                         <div className="min-w-0 flex-1">
    //                           <p className="text-sm font-medium text-gray-900">Friends</p>
    //                           <p className="text-sm text-gray-500">Search friends and requests</p>
    //                         </div>
    //                         <div>
    //                           {requestCount > 0 && (
    //                             <div className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
    //                               {requestCount}
    //                             </div>
    //                           )}
    //                         </div>
    //                       </div>
    //                     </a>
    //                   </li>
    //                 </ul>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       }
    //     >
    //       <button
    //         type="button"
    //         onClick={() => {
    //           setOpen(true);
    //         }}
    //         className="ring-none relative items-center justify-center rounded-full border-none text-dark-gray dark:text-dark-txt hover:dark:bg-dark-third dark:hover:text-iris-600 md:inline-flex "
    //       >
    //         <Squares2X2Icon
    //           className=" h-6 w-6 text-gray-400
    // transition duration-300 ease-in-out hover:text-iris-400"
    //           aria-hidden="true"
    //         />
    //         {requestCount > 0 && (
    //           <span className="absolute top-0 ml-4 rounded-full bg-iris-600 px-2 text-center text-xs font-semibold text-white md:ml-4">
    //             {requestCount}
    //           </span>
    //         )}
    //       </button>
    //     </Tippy>
  );
}
