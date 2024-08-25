import React, { Fragment, useState, useEffect } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { Menu, Popover, Transition } from '@headlessui/react';
import { setNotifications } from '@/redux/actions/notifications/notifications';
import MarkNotificationAsSeen from '@/api/NotificationSeen';
import Tippy from '@tippyjs/react';

export default function Notifications() {
  // const reduxNotifications = useSelector((state) => state.notifications.notifications);
  const [notifications, setNotificationsList] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);

  const handleRemoveNotification = (notification) => {
    setNotificationsList((prevNotifications) => {
      return prevNotifications.filter(
        (prevNotification) => prevNotification.id !== notification.id,
      );
    });
  };

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const userId = user && user.id;
  const [start, setStart] = useState(0);
  const [count, setCount] = useState(20);

  useEffect(() => {
    let client = null;
    if (userId !== null) {
      const connectWebSocket = () => {
        const protocol = process.env.NEXT_PUBLIC_APP_ENV === 'production' ? 'wss' : 'ws';
        const path = `${protocol}://${
          process.env.NEXT_PUBLIC_APP_NOTIFICATIONS_WS_URL
        }/ws/notification/?token=${encodeURIComponent(userId)}`;
        client = new W3CWebSocket(path);
        client.onopen = handleOpen;
        client.onmessage = handleMessage;
      };

      const handleOpen = () => {
        console.log('Notification WebSocket Connected');
        // Get notifications for current user
        client.send(
          JSON.stringify({
            type: 'get_notifications',
            user_id: user && user.id,
            start,
            count,
          }),
        );
      };

      const handleMessage = (event) => {
        const message = JSON.parse(event.data);
        // console.log('Got this message from websocket: ', message);
        switch (message.type) {
          case 'notifications':
            // Update notifications state
            setNotificationCount(message.total_count);
            dispatch(setNotifications(message.data));
            setNotificationsList(message.data);
            break;
          case 'new_notification':
            setNotificationCount(message.total_count);
            setNotificationsList((prev) => {
              return [...prev, message.data];
            });
            break;
          default:
          // console.log('Unhandled message type:', message.type);
        }
      };

      const disconnectWebSocket = () => {
        if (client && client.readyState === client.OPEN) {
          client.close();
        }
      };

      if (user && user.id) {
        connectWebSocket();
      }

      return () => {
        disconnectWebSocket();
      };
    }
  }, [user]);

  // When user clicks "Load More" button, fetch next set of notifications
  function loadMoreNotifications() {
    setStart(start + count); // increment start by count
    // Send message to server to fetch next set of notifications
    socket.send(
      JSON.stringify({
        type: 'get_notifications',
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
      offset={[10, 15]}
      arrow={false}
      content={
        <div className="w-80 h-80 overflow-y-auto cursor-default rounded-lg dark:bg-dark-main bg-white shadow-lg">
          <div className="relative grid gap-8 dark:bg-dark-main bg-white p-7">
            <div className=" border-b  border-gray-200 bg-white dark:border-dark-third dark:bg-dark-main ">
              <div className="-ml-4 -mt-4 flex flex-wrap items-center justify-between md:flex-nowrap">
                <div className="ml-4 ">
                  <p className="text-lg font-bold leading-6 text-dark-gray dark:text-dark-txt">
                    Notifications
                  </p>
                </div>
                <div className="ml-4  flex-shrink-0" />
              </div>
            </div>
            {notifications &&
              notifications.map((item) => (
                <button
                  type="button"
                  onClick={async () => {
                    await MarkNotificationAsSeen(item.id);
                    handleRemoveNotification(item);
                    if (item.notification_type === '4') {
                      if (item.course) {
                        window.location.href = `/courses/${item.course}`;
                      }
                      if (item.product) {
                        window.location.href = `/products/${item.product}`;
                      }
                    }
                    if (item.notification_type === '3') {
                      window.location.href = item.url;
                    }
                  }}
                  key={item.id}
                  className="focus-visible:ring-orange-500 -m-3 flex items-center rounded-lg p-2 text-left transition duration-150 ease-in-out dark:bg-dark-bg  hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-opacity-50"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center text-white sm:h-12 sm:w-12">
                    <i className={`${item.icon} text-xl dark:text-dark-txt text-gray-500`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">
                      {item.notification_type === 4 &&
                        `Congratulations! ${item.course ? 'Course' : 'Product'} sold`}
                    </p>
                    <p className="text-sm dark:text-dark-txt-secondary text-gray-500">
                      {item.text_preview}
                    </p>
                  </div>
                </button>
              ))}
          </div>
          {notifications && notifications.length === count && (
            <div className="bg-gray-50 p-4">
              <a
                href="##"
                className="focus-visible:ring-orange-500 flow-root rounded-md px-2 py-2 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-opacity-50"
              >
                <span className="flex items-center">
                  <span className="text-sm font-medium text-gray-900">Documentation</span>
                </span>
                <span className="block text-sm text-gray-500">
                  Start integrating products and tools
                </span>
              </a>
            </div>
          )}
        </div>
      }
    >
      <button
        type="button"
        className="ring-none relative items-center justify-center rounded-full border-none text-dark-gray hover:text-iris-400 dark:text-dark-txt-secondary  dark:hover:text-dark-primary md:inline-flex "
      >
        <BellIcon
          className=" h-6 w-6 
transition duration-300 ease-in-out  "
          aria-hidden="true"
        />
        {notifications && notifications.length > 0 && (
          <span className="absolute top-0 ml-4 rounded-full bg-iris-600 px-2 text-center text-xs font-semibold text-white md:ml-4">
            {notificationCount}
          </span>
        )}
      </button>
    </Tippy>
  );
}
