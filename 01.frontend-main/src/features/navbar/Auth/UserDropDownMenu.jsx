import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import Tippy from '@tippyjs/react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { CheckBadgeIcon } from '@heroicons/react/20/solid';
import { setInboxCount, setInboxList } from '@/redux/actions/messages/messages';

export default function UserDropDownMenu({ logoutHandler }) {
  const myProfile = useSelector((state) => state.auth.profile);
  const myUser = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();
  // Friends inbox websocket
  // const [inboxes, setInboxes] = useState([]);
  const [start, setStart] = useState(0);
  // eslint-disable-next-line
  const [count, setCount] = useState(20);
  // eslint-disable-next-line
  const [error, setError] = useState(null);
  // eslint-disable-next-line
  const [connected, setConnected] = useState(false);
  // eslint-disable-next-line
  const [roomGroupName, setRoomGroupName] = useState(myUser && myUser.id);

  const userId = myUser && myUser.id;
  useEffect(() => {
    let client = null;
    if (userId !== null) {
      const handleOpen = () => {
        console.log('UserDropDown Inbox Websocket Connected');
        setConnected(true);
        client.send(
          JSON.stringify({
            type: 'get_inboxes',
            user_id: myUser && myUser.id,
          }),
        );
      };

      const handleMessage = (event) => {
        const message = JSON.parse(event.data);
        // console.log('Got this Message from Inbox Channels Consumer', message);
        switch (message.type) {
          case 'user_inboxes':
            dispatch(setInboxList(message.data));
            dispatch(setInboxCount(message.total_count));
            // setInboxes(message.data);
            break;
          case 'user_inboxes_from_view':
            dispatch(setInboxList(message.data.data));
            dispatch(setInboxCount(message.total_count));
            // setInboxes(message.data);
            break;
          default:
            console.log('Unhandled message type:', message.type);
        }
      };

      const handleError = (e) => {
        // console.error('WebSocket error:', e);
        setError(e);
        setConnected(false);
      };

      const connectWebSocket = () => {
        try {
          const protocol = process.env.NEXT_PUBLIC_APP_ENV === 'production' ? 'wss' : 'ws';
          const path = `${protocol}://${
            process.env.NEXT_PUBLIC_APP_CHAT_API_WS
          }/ws/inbox/${roomGroupName}/?token=${encodeURIComponent(userId)}`;
          client = new W3CWebSocket(path);
          client.onopen = handleOpen;
          client.onmessage = handleMessage;
          // client.onclose = handleClose;
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

      if (!client) {
        connectWebSocket();
      }

      return () => {
        disconnectWebSocket();
      };
    }
    // eslint-disable-next-line
  }, [roomGroupName]);

  // When user clicks "Load More" button, fetch next set of notifications
  // eslint-disable-next-line
  function loadMoreInboxes() {
    setStart(start + count); // increment start by count
    // Send message to server to fetch next set of notifications
    // eslint-disable-next-line
    socket.send(
      JSON.stringify({
        type: 'get_inboxes',
        user_id: myUser && myUser.id,
        start,
        count,
      }),
    );
  }

  return (
    <Tippy
      animation
      theme="custom"
      interactive
      placement="bottom"
      duration={[100, 75]}
      offset={[0, 15]}
      arrow={false}
      content={
        <div className="w-64 cursor-default rounded-lg dark:bg-dark-main bg-white shadow-lg">
          <Link
            href={`/@/${myUser && myUser.username}`}
            className="flex flex-wrap items-center justify-center  dark:hover:bg-dark-second hover:bg-gray-50 sm:flex-nowrap"
          >
            <div className="flex p-2 ">
              <div className="flex-shrink-0">
                {myProfile && myProfile.picture ? (
                  <Image
                    className="h-10 w-10 rounded-full"
                    src={myProfile.picture}
                    alt=""
                    width={50}
                    height={50}
                  />
                ) : (
                  <span className="inline-block h-8 w-8 overflow-hidden rounded-full bg-gray-100">
                    <svg
                      className="h-full w-full text-gray-300"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </span>
                )}
              </div>
              <div className="ml-4">
                <p className="text-lg font-medium leading-6 dark:text-dark-txt text-gray-900">
                  {myUser && myUser.username}
                  {myUser && myUser.verified && (
                    <span className="inline-flex">
                      <CheckBadgeIcon className="ml-1 h-4 w-4 text-iris-500" />
                    </span>
                  )}
                </p>
                <p className="text-sm text-gray-900 dark:text-dark-txt-secondary">
                  {myUser && myUser && myUser.email}
                </p>
              </div>
            </div>
          </Link>
          {/* Divider */}
          <div className="relative pb-2">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t dark:border-dark-second border-gray-300" />
            </div>
            <div className="relative flex justify-center" />
          </div>
          <ul className=" grid gap-3 p-3">
            <Link href="/library/courses">
              <li className="text-sm hover:text-iris-500 dark:hover:text-dark-accent dark:text-dark-txt-secondary">
                My Library
              </li>
            </Link>
            <Link href="/cart">
              <li className="text-sm hover:text-iris-500 dark:hover:text-dark-accent dark:text-dark-txt-secondary">
                My Cart
              </li>
            </Link>
            <Link href="/library/wishlist">
              <li className="text-sm hover:text-iris-500 dark:hover:text-dark-accent dark:text-dark-txt-secondary">
                Wishlist
              </li>
            </Link>
            <Link href="/library/orders">
              <li className="text-sm hover:text-iris-500 dark:hover:text-dark-accent dark:text-dark-txt-secondary">
                Orders
              </li>
            </Link>
            {myUser && myUser && myUser.role === 'seller' ? (
              <Link href="/sell/dashboard">
                <li className="text-sm hover:text-iris-500 dark:hover:text-dark-accent dark:text-dark-txt-secondary">
                  Seller Dashboard
                </li>
              </Link>
            ) : (
              <Link href="/teach">
                <li className="text-sm hover:text-iris-500 dark:hover:text-dark-accent dark:text-dark-txt-secondary">
                  Become Seller
                </li>
              </Link>
            )}
          </ul>
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t dark:border-dark-second border-gray-300" />
            </div>
            <div className="relative flex justify-center" />
          </div>
          <ul className=" grid gap-3 p-3">
            <Link href="/inbox">
              <li className="text-sm hover:text-iris-500 dark:hover:text-dark-accent dark:text-dark-txt-secondary">
                Messages
              </li>
            </Link>
          </ul>
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t dark:border-dark-second border-gray-300" />
            </div>
            <div className="relative flex justify-center" />
          </div>
          <ul className=" grid gap-3 p-3">
            <Link href="/wallet">
              <li className="text-sm hover:text-iris-500 dark:hover:text-dark-accent dark:text-dark-txt-secondary">
                Crypto Wallet
              </li>
            </Link>
          </ul>
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t dark:border-dark-second border-gray-300" />
            </div>
            <div className="relative flex justify-center" />
          </div>
          <ul className=" grid gap-3 p-3">
            <Link href={`/@/${myUser && myUser.username}`}>
              <li className="text-sm hover:text-iris-500 dark:hover:text-dark-accent dark:text-dark-txt-secondary">
                Public Profile
              </li>
            </Link>
            <Link href="/@/edit">
              <li className="text-sm hover:text-iris-500 dark:hover:text-dark-accent dark:text-dark-txt-secondary">
                Edit Profile
              </li>
            </Link>
          </ul>
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t dark:border-dark-second border-gray-300" />
            </div>
            <div className="relative flex justify-center" />
          </div>
          <ul className=" gap-3 p-3">
            <Link href="/help">
              <li className="text-sm hover:text-iris-500 dark:hover:text-dark-accent dark:text-dark-txt-secondary">
                Help
              </li>
            </Link>
            <button type="button" onClick={logoutHandler} className="pt-3">
              <li className="cursor-pointer text-sm w-full hover:text-iris-500 dark:hover:text-dark-accent dark:text-dark-txt-secondary">
                Log out
              </li>
            </button>
          </ul>
        </div>
      }
    >
      <Link href={`/@/${myUser && myUser && myUser.username}`}>
        {myProfile && myProfile.picture ? (
          <Image
            className="h-10 w-10 rounded-full"
            src={myProfile.picture}
            alt=""
            width={50}
            height={50}
          />
        ) : (
          <span className="inline-block h-8 w-8 overflow-hidden rounded-full bg-gray-100">
            <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </span>
        )}
      </Link>
    </Tippy>
  );
}
