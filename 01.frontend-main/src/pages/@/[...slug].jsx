import Head from 'next/head';
import Layout from '@/hocs/Layout';
import { useRouter } from 'next/router';

import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import {
  UserCircleIcon,
  CheckBadgeIcon,
  PlusIcon,
  AcademicCapIcon,
  ChevronDownIcon,
} from '@heroicons/react/20/solid';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Menu, Tab, Transition } from '@headlessui/react';
import axios from 'axios';
import { ToastSuccess } from '@/components/ToastSuccess';
import AddFriend from '@/api/friends/AddFriend';
import CheckFriendRequest from '@/api/friends/CheckFriendRequest';
import CheckFriend from '@/api/friends/CheckFriend';
import CancelFriendRequest from '@/api/friends/CancelFriendRequest';
import RemoveFriend from '@/api/friends/RemoveFriend';
import FetchSearchCourses from '@/api/SearchCourses';
import LoadingMoon from '@/components/loaders/LoadingMoon';
import { useSelector } from 'react-redux';
import CourseCard from '../library/courses/components/CourseCard';
import ProductCard from '@/components/ProductCard';
import Image from 'next/image';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function SocialLink(props) {
  const { href, icon } = props;

  return (
    <div>
      {href && (
        <a target="_blank" referrerPolicy="no-referrer" href={href}>
          {icon}
        </a>
      )}
    </div>
  );
}

export default function Profile({ userProfile }) {
  const [user, setUser] = useState(userProfile);

  const SeoList = {
    title: 'Boomslag - User Profile | Manage Your NFTs and Account Details',
    description:
      'Access your Boomslag user profile to manage your NFTs, account details, and preferences on our innovative marketplace for buying and selling products using ERC1155 tokens.',
    href: '/user-profile',
    url: 'https://boomslag.com/user-profile',
    keywords: 'user profile, manage nfts, account details, boomslag, nft marketplace',
    robots: 'all',
    author: 'BoomSlag',
    publisher: 'BoomSlag',
    image:
      'https://bafybeiaor24mrcurzyzccxl7xw46zdqpor4sfuhddl6tzblujoiukchxnq.ipfs.w3s.link/friends.png',
    twitterHandle: '@BoomSlag',
  };

  const router = useRouter();

  const myUser = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [friendRequestSent, setFriendRequestSent] = useState(false);
  const [areFriends, setAreFriends] = useState(false);

  const [loading, setLoading] = useState(true);

  const social = [
    {
      name: 'URL',
      href: user && user.url,
      icon: (
        <i className="bx bx-globe text-2xl dark:text-dark-txt-secondary dark:hover:text-dark-accent text-gray-600 hover:text-gray-700" />
      ),
    },
    {
      name: 'YouTube',
      href: user && user.youtube,
      icon: (
        <i className="bx bxl-youtube hover:text-error text-2xl dark:text-dark-txt-secondary dark:hover:text-dark-accent text-gray-600" />
      ),
    },
    {
      name: 'Facebook',
      href: user && user.facebook,
      icon: (
        <i className="bx bxl-facebook text-2xl dark:text-dark-txt-secondary dark:hover:text-dark-accent text-gray-600 hover:text-blue-400" />
      ),
    },
    {
      name: 'Instagram',
      href: user && user.instagram,
      icon: (
        <i className="bx bxl-instagram text-2xl dark:text-dark-txt-secondary dark:hover:text-dark-accent text-gray-600 hover:text-blue-violet-200" />
      ),
    },
    {
      name: 'Twitter',
      href: user && user.twitter,
      icon: (
        <i className="bx bxl-twitter text-2xl dark:text-dark-txt-secondary dark:hover:text-dark-accent text-gray-600 hover:text-[#1DA1F2]" />
      ),
    },
    {
      name: 'GitHub',
      href: user && user.github,
      icon: (
        <i className="bx bxl-github text-2xl dark:text-dark-txt-secondary dark:hover:text-dark-accent text-gray-600 hover:text-gray-900" />
      ),
    },
  ];

  const handleAddFriend = useCallback(async () => {
    const res = await AddFriend(user.email);
    if (res.status === 200) {
      ToastSuccess(`Friend request sent to ${user.username}`);
      try {
        const resCheck = await CheckFriendRequest(user.email);
        if (resCheck.status === 200) {
          setFriendRequestSent(resCheck.data.request_sent);
        } else {
          // Handle non-200 response
        }
      } catch (error) {
        // Handle error
      }
    }
  }, [user]);

  const handleCancelFriendRequest = useCallback(async () => {
    const res = await CancelFriendRequest(user.email);
    if (res.status === 200) {
      ToastSuccess(`Request to be friends with ${user.username} canceled.`);
      if (user) {
        try {
          const resCheck = await CheckFriendRequest(user.email);

          if (resCheck.status === 200) {
            setFriendRequestSent(resCheck.data.request_sent);
          } else {
            // Handle non-200 response
          }
        } catch (error) {
          // Handle error
        }
      }
    }
  }, [user]);

  const handleRemoveFriend = useCallback(async () => {
    const res = await RemoveFriend(user.email);
    if (res.status === 200) {
      ToastSuccess(`Removed ${user.username} as friend.`);
      try {
        const resCheck = await CheckFriend(user.email);
        if (resCheck.status === 200) {
          setAreFriends(resCheck.data.results);
        } else {
          // Handle non-200 response
        }
      } catch (error) {
        // Handle error
      }
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const fetchAPI = async () => {
        try {
          const res = await CheckFriendRequest(user.email);
          if (res.status === 200) {
            setFriendRequestSent(res.data.request_sent);
          } else {
            // Handle non-200 response
          }
        } catch (error) {
          // Handle error
        }
      };
      fetchAPI();
      const checkFriends = async () => {
        try {
          const res = await CheckFriend(user.email);
          if (res.status === 200) {
            setAreFriends(res.data.results);
          } else {
            // Handle non-200 response
          }
        } catch (error) {
          // Handle error
        }
      };
      checkFriends();
    }
  }, [user, handleAddFriend, handleCancelFriendRequest]);

  const userId = myUser && myUser.id;
  const friendId = user && user.id;

  // Fetch User Courses
  const [courses, setCourses] = useState([]);

  const sellerUsername = user && user.id;
  const [rating, setRating] = useState('');
  const [coursesLength, setCoursesLength] = useState(0);
  const [count, setCount] = useState([]);
  const [pageSize, setPageSize] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPageSize, setMaxPageSize] = useState(100);
  const [filterBy, setFilterBy] = useState('views');
  const [language, setLanguage] = useState('');
  const [duration, setDuration] = useState('');
  const [author, setAuthor] = useState(sellerUsername);
  const [level, setLevel] = useState('');
  const [pricing, setPricing] = useState('');
  const [searchBy, setSearchBy] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [orderBy, setOrderBy] = useState('-published');

  const fetchCourses = useCallback(
    async (page, searchBy) => {
      if (!sellerUsername) return; // Add this line to prevent the API call if author is not set

      setLoading(true);
      try {
        const res = await FetchSearchCourses(
          page,
          pageSize,
          maxPageSize,
          filterBy,
          orderBy,
          searchBy,
          rating,
          language,
          duration,
          categoryId,
          level,
          pricing,
          sellerUsername,
        );

        if (res.data) {
          setCount(res.data.count);
          setCourses(res.data.results);
          setCoursesLength(res.data.results.length);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    },
    [
      pageSize,
      maxPageSize,
      filterBy,
      orderBy,
      rating,
      language,
      duration,
      categoryId,
      level,
      pricing,
      sellerUsername, // Make sure author is in the dependency array
    ],
  );

  const onSubmit = (e) => {
    e.preventDefault();
    fetchCourses(currentPage, searchBy);
  };

  useEffect(() => {
    fetchCourses(currentPage, '');
  }, [fetchCourses, currentPage, sellerUsername]);

  // Fetch Products
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  // eslint-disable-next-line
  const [connected, setConnected] = useState(false);
  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    let client = null;
    if (myUser && myUser.id) {
      const connectWebSocket = () => {
        try {
          const protocol = process.env.NEXT_PUBLIC_APP_ENV === 'production' ? 'wss' : 'ws';
          const path = `${protocol}://${
            process.env.NEXT_PUBLIC_APP_AUTH_API_WS
          }/ws/friends/?token=${encodeURIComponent(myUser && myUser.id)}`;

          client = new W3CWebSocket(path);
          client.onopen = handleOpen;
          client.onmessage = handleMessage;
          client.onclose = handleClose;
          client.onerror = handleError;
        } catch (e) {
          handleError(e);
        }
      };

      const handleError = (e) => {
        // console.error('WebSocket error:', e);
        setError(e);
        setConnected(false);
      };

      const handleOpen = () => {
        console.log('Connected to profile Frriends ws');
      };

      const handleMessage = (event) => {
        const message = JSON.parse(event.data);
        switch (message.type) {
          case 'check_friend':
            setAreFriends(message.data);
            break;
          default:
          // Handle other message types if needed
        }
      };

      const handleClose = () => {
        // Reconnect after a delay when the WebSocket is closed
        setTimeout(() => {
          connectWebSocket();
        }, 5000); // Reconnect after 5 seconds
      };

      const disconnectWebSocket = () => {
        if (client && client.readyState === WebSocket.OPEN) {
          client.close();
          // setConnected(false);
        }
      };

      if (!client) {
        connectWebSocket();
      }

      return () => {
        disconnectWebSocket();
      };
    }
  }, [user, myUser, isAuthenticated]);

  return (
    <div className="dark:bg-dark-bg">
      <Head>
        <title>{SeoList.title}</title>
        <meta name="description" content={SeoList.description} />

        <meta name="keywords" content={SeoList.keywords} />
        <link rel="canonical" href={SeoList.href} />
        <meta name="robots" content={SeoList.robots} />
        <meta name="author" content={SeoList.author} />
        <meta name="publisher" content={SeoList.publisher} />

        {/* Social Media Tags */}
        <meta property="og:title" content={SeoList.title} />
        <meta property="og:description" content={SeoList.description} />
        <meta property="og:url" content={SeoList.url} />
        <meta property="og:image" content={SeoList.image} />
        <meta property="og:image:width" content="1370" />
        <meta property="og:image:height" content="849" />
        <meta property="og:image:alt" content="Boomslag Thumbnail Image" />
        <meta property="og:type" content="website" />

        <meta name="twitter:title" content={SeoList.title} />
        <meta name="twitter:description" content={SeoList.description} />
        <meta name="twitter:image" content={SeoList.image} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={SeoList.twitterHandle} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <div className="">
          <Image
            width={512}
            height={512}
            className="h-32 w-full object-cover lg:h-48"
            src={user && user.banner}
            alt=""
          />
        </div>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-32">
          <div className="-mt-12 sm:-mt-12 sm:flex sm:items-end sm:space-x-5">
            <div className="flex">
              <Image
                width={512}
                height={512}
                className="h-24 w-24 rounded-full  sm:h-32 sm:w-32"
                src={user && user.picture}
                alt=""
              />
            </div>
            <div className="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
              <div className="mt-12 min-w-0 flex-1 sm:hidden md:block">
                <h1 className="truncate text-2xl flex font-bold text-gray-900 dark:text-dark-txt">
                  {user ? <div>{user && user.username}</div> : <div />}
                  {user && user.verified ? (
                    <CheckBadgeIcon
                      className="ml-1 mt-2 inline-flex h-5 w-auto text-purple-500"
                      aria-hidden="true"
                    />
                  ) : (
                    <div />
                  )}
                </h1>
                <p className="text-sm font-medium text-gray-500">
                  Account: {user && user.address && user.address.slice(0, 6)}...
                  {user && user.address && user.address.slice(-4)}
                  <CopyToClipboard text={user && user.address}>
                    <button
                      type="button"
                      onClick={() => {
                        ToastSuccess(`Copied Address: ${user.address}`);
                      }}
                      className="ml-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500 hover:text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                        />
                      </svg>
                    </button>
                  </CopyToClipboard>
                </p>
              </div>
              <div className="mt-8 flex space-x-6">
                {social.map((item) => (
                  <SocialLink key={item.name} name={item.name} href={item.href} icon={item.icon} />
                ))}
              </div>
              <div className="justify-stretch mt-0 flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4 md:mt-6">
                {/* Add Friend */}
                {user &&
                myUser &&
                myUser.username !== user.username &&
                !friendRequestSent &&
                !areFriends ? (
                  <button
                    type="button"
                    onClick={handleAddFriend}
                    className="inline-flex justify-center rounded-full border-2 border-dark px-4 py-2 text-sm font-medium text-dark shadow-neubrutalism-sm transition duration-300 ease-in-out hover:bg-gray-100"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 dark:text-dark-txt"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                      />
                    </svg>
                  </button>
                ) : user &&
                  myUser &&
                  myUser.username !== user.username &&
                  friendRequestSent &&
                  !areFriends ? (
                  // Friend Request Sent and Pending
                  <button
                    type="button"
                    onClick={handleCancelFriendRequest}
                    className="inline-flex justify-center rounded-full border-2 border-dark bg-blue-300 px-4 py-2 text-sm font-medium text-white shadow-neubrutalism-sm transition duration-300 ease-in-out hover:bg-blue-400"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 dark:text-dark-txt"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                      />
                    </svg>
                  </button>
                ) : (
                  user &&
                  myUser &&
                  myUser.username !== user.username &&
                  areFriends && (
                    // Users Are Friends, Show Dropdown with options
                    // <button
                    //   type="button"
                    //   // onClick={handleCancelFriendRequest}
                    //   className="inline-flex justify-center rounded-full border-2 border-white bg-blue-200 px-4 py-2 text-sm font-medium text-white shadow-neubrutalism-sm transition duration-300 ease-in-out hover:bg-blue-100"
                    // >
                    //   <svg
                    //     xmlns="http://www.w3.org/2000/svg"
                    //     className="h-5 w-5 dark:text-dark-txt"
                    //     fill="none"
                    //     viewBox="0 0 24 24"
                    //     stroke="currentColor"
                    //     strokeWidth="2"
                    //   >
                    //     <path
                    //       strokeLinecap="round"
                    //       strokeLinejoin="round"
                    //       d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    //     />
                    //   </svg>
                    // </button>
                    <Menu as="div" className="relative inline-block text-left">
                      <div>
                        <Menu.Button className="inline-flex justify-center rounded-full border-2 border-white bg-blue-200 px-4 py-2 text-sm font-medium text-white shadow-neubrutalism-sm transition duration-300 ease-in-out hover:bg-blue-100">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 dark:text-dark-txt"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                            />
                          </svg>
                        </Menu.Button>
                      </div>

                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <div className="">
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  type="button"
                                  onClick={handleRemoveFriend}
                                  className={classNames(
                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                    'block w-full px-4 py-3 text-left text-sm',
                                  )}
                                >
                                  Remove Friend
                                </button>
                              )}
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  )
                )}

                {/* MESSAGE */}
                {user && myUser && myUser.username !== user.username && areFriends && (
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-full border-2 border-dark px-4 py-2 text-sm font-medium text-dark shadow-neubrutalism-sm transition duration-300 ease-in-out hover:bg-gray-100"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 dark:text-dark-txt"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </button>
                )}

                {user && user.username === myUser?.username ? (
                  <div className="relative inline-block text-left">
                    <button
                      onClick={() => {
                        router.push('/@/edit/');
                      }}
                      type="button"
                      className="inline-flex w-full justify-center rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-400 shadow-md hover:text-gray-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-100 focus:ring-offset-2 dark:bg-dark-third dark:text-dark-txt dark:focus:ring-dark-third"
                    >
                      <UserCircleIcon className=" h-5 w-5 " aria-hidden="true" />
                    </button>
                  </div>
                ) : (
                  <div />
                )}
              </div>
            </div>
          </div>

          <p className="mt-4 text-sm font-medium text-gray-500">{user && user.profile_info}</p>

          <div className="grid grid-cols-12">
            <div className="col-span-12 ">
              <Tab.Group>
                <Tab.List className=" mt-8  grid space-x-1 space-y-1 rounded-xl p-1 sm:flex sm:space-x-2 sm:space-y-0">
                  <Tab
                    className={({ selected }) =>
                      classNames(
                        'col-span-1 w-full py-2.5 text-lg leading-5 md:col-span-2',
                        '',
                        selected
                          ? 'flex items-center justify-center space-x-2 border-b-4 border-gray-900 p-1 font-bold text-black focus:outline-none dark:text-dark-txt dark:border-dark-primary'
                          : 'flex items-center justify-center border-b-2 border-gray-50 p-1 font-semibold text-gray-600 hover:border-gray-200 dark:border-dark-third dark:text-dark-txt dark:hover:border-dark-border md:space-x-2',
                      )
                    }
                  >
                    Courses
                  </Tab>
                  <Tab
                    className={({ selected }) =>
                      classNames(
                        'col-span-1 w-full py-2.5 text-lg leading-5 md:col-span-2',
                        '',
                        selected
                          ? 'flex items-center justify-center space-x-2 border-b-4 border-gray-900 p-1 font-bold text-black focus:outline-none dark:text-dark-txt dark:border-dark-primary'
                          : 'flex items-center justify-center border-b-2 border-gray-50 p-1 font-semibold text-gray-600 hover:border-gray-200 dark:border-dark-third dark:text-dark-txt dark:hover:border-dark-border md:space-x-2',
                      )
                    }
                  >
                    Products
                  </Tab>
                  {/* <Tab
                  className={({ selected }) =>
                    classNames(
                      'col-span-1 w-full py-2.5 text-lg leading-5 md:col-span-2',
                      '',
                      selected
                        ? 'flex items-center justify-center space-x-2 border-b-4 border-gray-900 p-1 font-bold text-black focus:outline-none dark:text-dark-txt dark:border-dark-primary'
                        : 'flex items-center justify-center border-b-2 border-gray-50 p-1 font-semibold text-gray-600 hover:border-gray-200 dark:border-dark-third dark:text-dark-txt dark:hover:border-dark-border md:space-x-2',
                    )
                  }
                >
                  Music
                </Tab> */}
                  {/* <Tab
                  className={({ selected }) =>
                    classNames(
                      'col-span-1 w-full py-2.5 text-lg leading-5 md:col-span-2',
                      '',
                      selected
                        ? 'flex items-center justify-center space-x-2 border-b-4 border-gray-900 p-1 font-bold text-black focus:outline-none dark:text-dark-txt dark:border-dark-primary'
                        : 'flex items-center justify-center border-b-2 border-gray-50 p-1 font-semibold text-gray-600 hover:border-gray-200 dark:border-dark-third dark:text-dark-txt dark:hover:border-dark-border md:space-x-2',
                    )
                  }
                >
                  Games
                </Tab> */}
                </Tab.List>
                <Tab.Panels>
                  <Tab.Panel>
                    <div className="mt-6">
                      {loading ? (
                        <LoadingMoon color="#1c1d1f" size={25} />
                      ) : (
                        <div className="relative mt-8">
                          <div className="relative -mb-6 w-full overflow-x-auto pb-6">
                            <ul className="mx-4 sm:mx-6 lg:mx-0 flex flex-col sm:flex-row space-y-8 sm:space-y-0 sm:space-x-8">
                              {courses &&
                                courses.map((course) => (
                                  <CourseCard key={course.id} data={course} />
                                ))}
                            </ul>
                          </div>
                        </div>
                      )}
                      {courses && courses.length === 0 && (
                        <div className=" text-center">
                          <svg
                            className="mx-auto h-12 w-12 dark:text-dark-txt text-gray-400"
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
                              d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
                            />
                          </svg>
                          <h3 className="mt-2 text-sm font-medium dark:text-dark-txt-secondary text-gray-900">
                            User has no Courses
                          </h3>
                        </div>
                      )}
                    </div>
                  </Tab.Panel>
                  <Tab.Panel>
                    <div className="mt-6">
                      {loading ? (
                        <LoadingMoon color="#1c1d1f" size={25} />
                      ) : (
                        <>
                          {products &&
                            products.map((product) => (
                              <ProductCard key={product.id} data={product} />
                            ))}
                          <div />
                        </>
                      )}
                      {products && products.length === 0 && (
                        <div className=" text-center">
                          <svg
                            className="mx-auto h-12 w-12 dark:text-dark-txt text-gray-400"
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
                              d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                            />
                          </svg>
                          <h3 className="mt-2 text-sm font-medium dark:text-dark-txt-secondary text-gray-900">
                            User has no Products
                          </h3>
                        </div>
                      )}
                    </div>
                  </Tab.Panel>
                  {/* <Tab.Panel>Music</Tab.Panel> */}
                  {/* <Tab.Panel>Games</Tab.Panel> */}
                </Tab.Panels>
              </Tab.Group>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Profile.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export async function getServerSideProps(context) {
  const username = context.query.slug?.[0];

  // Check if username is defined
  if (!username) {
    return {
      notFound: true,
    };
  }

  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_APP_API_URL}/api/profiles/get/${username}`,
  );

  return {
    props: {
      userProfile: res.data.results,
    },
  };
}
