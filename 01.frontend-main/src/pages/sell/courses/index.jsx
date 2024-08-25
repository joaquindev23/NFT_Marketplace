import Head from 'next/head';
import Layout from '../components/Layout';
import { useState, Fragment, useEffect, useCallback } from 'react';
import { MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import { Menu, Transition } from '@headlessui/react';
import { useDispatch } from 'react-redux';

import CourseList from '../components/courses/CoursesList';
import ListSellerCourses from '@/api/manage/courses/List';
import { resetCreateVariables } from '@/redux/actions/courses/courses';
import { useRouter } from 'next/router';
import { CircleLoader } from 'react-spinners';
import Image from 'next/image';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const SeoList = {
  title: 'Seller Dashboard - Buy & Sell Products with NFTs on our Marketplace',
  description:
    'Discover a new way to buy and sell products using NFTs on Boomslag. Our revolutionary platform lets you purchase and sell physical and digital products securely and seamlessly using ERC1155 tokens.',
  href: '/',
  url: 'https://boomslag.com',
  keywords: 'buy and sell products, nft product marketplace, nft marketplace, sell nfts',
  robots: 'all',
  author: 'BoomSlag',
  publisher: 'BoomSlag',
  image:
    'https://bafybeiaor24mrcurzyzccxl7xw46zdqpor4sfuhddl6tzblujoiukchxnq.ipfs.w3s.link/friends.png',
  twitterHandle: '@BoomSlag',
};

export default function Courses() {
  const router = useRouter();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(resetCreateVariables());
    // eslint-disable-next-line
  }, []);

  const [loading, setLoading] = useState(true);

  const [count, setCount] = useState([]);
  const [pageSize, setPageSize] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPageSize, setMaxPageSize] = useState(100);
  const [courses, setCourses] = useState([]);
  const [filterBy, setFilterBy] = useState(null);
  const [filterByAuthor, setFilterByAuthor] = useState(null);
  const [searchBy, setSearchBy] = useState('');
  const [filterByCategory, setFilterByCategory] = useState(null);
  const [filterByBusinessActivity, setFilterByBusinessActivity] = useState(null);
  const [filterByType, setFilterByType] = useState(null);
  const [orderBy, setOrderBy] = useState('-date_created');

  const fetchCourses = useCallback(
    async (page, searchBy) => {
      setLoading(true);
      const res = await ListSellerCourses(
        page,
        pageSize,
        maxPageSize,
        filterBy,
        orderBy,
        filterByAuthor,
        filterByCategory,
        filterByBusinessActivity,
        filterByType,
        searchBy,
      );
      if (res && res.data) {
        setCount(res.data.count);
        setCourses(res.data.results);
      }
      setLoading(false);
    },
    [
      pageSize,
      maxPageSize,
      filterBy,
      orderBy,
      filterByAuthor,
      filterByCategory,
      filterByBusinessActivity,
      filterByType,
    ],
  );

  useEffect(() => {
    fetchCourses(currentPage, '');
  }, [fetchCourses, currentPage]);

  const onSubmit = async (e) => {
    e.preventDefault();
    fetchCourses(currentPage, searchBy);
  };

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
      <div className="px-8 pb-5 sm:flex sm:items-center sm:justify-between">
        <h3 className="font-bold text-xl leading-6 dark:text-dark-txt text-gray-900 md:text-4xl">
          Courses
        </h3>
      </div>

      <div className="px-8  pb-5 sm:flex sm:items-center sm:justify-between">
        <div className="mt-1 md:flex gap-4">
          <div className="w-full block">
            <form onSubmit={(e) => onSubmit(e)} className=" dark:border-dark-border  flex border">
              <div className=" flex flex-grow items-stretch ">
                <input
                  type="text"
                  value={searchBy}
                  onChange={(e) => {
                    setSearchBy(e.target.value);
                  }}
                  className="text-md duration block w-full border focus:ring-none focus:outline-none dark:border-dark-border border-dark py-2.5 pl-4 font-medium  transition ease-in-out dark:bg-dark-second dark:text-dark-txt"
                  placeholder="Search your courses"
                />
              </div>
              <button
                type="submit"
                className="relative -ml-px inline-flex items-center space-x-2 dark:border-dark-border border-l bg-black px-4 py-2 text-sm font-medium text-white"
              >
                <MagnifyingGlassIcon className="h-5 w-5 text-white" aria-hidden="true" />
              </button>
            </form>
          </div>

          <Menu as="div" className="relative z-20 inline-block text-left">
            <div>
              <Menu.Button className="inline-flex w-32 justify-center border dark:border-dark-border border-gray-700 dark:text-dark-txt dark:bg-dark-main bg-white px-4 py-2.5 text-sm font-black text-gray-700  hover:bg-gray-50">
                {orderBy === '-date_created' && 'Order by'}
                {orderBy === 'oldest' && 'Oldest'}
                {orderBy === 'az' && 'A - Z'}
                {orderBy === 'za' && 'Z - A'}
                {/* {orderBy === 'sold' && 'Most Sold'} */}
                <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
              </Menu.Button>
            </div>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-75"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute left-0 z-10 mt-2 w-56 origin-top-right dark:bg-dark-main bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        type="button"
                        onClick={async () => {
                          setOrderBy('-date_created');
                        }}
                        className={classNames(
                          active
                            ? 'bg-gray-100 dark:bg-dark-second text-gray-900 dark:text-dark-txt'
                            : 'text-gray-700 dark:text-dark-txt-secondary',
                          'block w-full cursor-pointer px-4 py-2 text-left text-sm ',
                        )}
                      >
                        Newest
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        type="button"
                        onClick={async () => {
                          setOrderBy('oldest');
                        }}
                        className={classNames(
                          active
                            ? 'bg-gray-100 dark:bg-dark-second text-gray-900 dark:text-dark-txt'
                            : 'dark:text-dark-txt-secondary text-gray-700',
                          'block w-full cursor-pointer px-4 py-2 text-left text-sm ',
                        )}
                      >
                        Oldest
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        type="button"
                        onClick={async () => {
                          setOrderBy('az');
                        }}
                        className={classNames(
                          active
                            ? 'bg-gray-100 dark:bg-dark-second text-gray-900 dark:text-dark-txt'
                            : 'text-gray-700 dark:text-dark-txt-secondary',
                          'block w-full cursor-pointer px-4 py-2 text-left text-sm ',
                        )}
                      >
                        A-Z
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        type="button"
                        onClick={async () => {
                          setOrderBy('za');
                        }}
                        className={classNames(
                          active
                            ? 'bg-gray-100 dark:bg-dark-second text-gray-900 dark:text-dark-txt'
                            : 'text-gray-700 dark:text-dark-txt-secondary',
                          'block w-full cursor-pointer px-4 py-2 text-left text-sm ',
                        )}
                      >
                        Z-A
                      </button>
                    )}
                  </Menu.Item>
                  {/* <Menu.Item>
                      {({ active }) => (
                        <button
                          type="button"
                          onClick={async () => {
                            setOrderBy('sold');
                          }}
                          className={classNames(
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'block w-full cursor-pointer px-4 py-2 text-left text-sm ',
                          )}
                        >
                          Most Sold
                        </button>
                      )}
                    </Menu.Item> */}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
          <Menu as="div" className="relative z-20 inline-block text-left">
            <div>
              <Menu.Button className="inline-flex dark:border-dark-border dark:text-dark-txt dark:bg-dark-main w-32 justify-center border border-gray-700 bg-white px-4 py-2.5 text-sm font-black text-gray-700  hover:bg-gray-50">
                Filter by
                <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
              </Menu.Button>
            </div>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-75"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute left-0 z-10 mt-2 w-56 origin-top-right dark:bg-dark-main bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        type="button"
                        onClick={async () => {
                          setFilterBy('published');
                        }}
                        className={classNames(
                          active
                            ? 'bg-gray-100 dark:bg-dark-second text-gray-900 dark:text-dark-txt'
                            : 'text-gray-700 dark:text-dark-txt-secondary',
                          'block w-full cursor-pointer px-4 py-2 text-left text-sm ',
                        )}
                      >
                        Published
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        type="button"
                        onClick={async () => {
                          setFilterBy('unpublished');
                        }}
                        className={classNames(
                          active
                            ? 'bg-gray-100 dark:bg-dark-second text-gray-900 dark:text-dark-txt'
                            : 'text-gray-700 dark:text-dark-txt-secondary',
                          'block w-full cursor-pointer px-4 py-2 text-left text-sm ',
                        )}
                      >
                        Unpublished
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
          <Menu as="div" className="relative z-20 inline-block text-left">
            <div>
              <Menu.Button className="inline-flex w-32 dark:text-dark-txt dark:bg-dark-main justify-center border border-gray-700 bg-white px-4 py-2.5 text-sm font-black text-gray-700  hover:bg-gray-50">
                Category
                <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
              </Menu.Button>
            </div>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-75"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute left-0 z-10 mt-2 w-56 origin-top-right dark:bg-dark-main bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        type="button"
                        // onClick={async () => {
                        //   setFilterByCategory('category.id')
                        // }}
                        className={classNames(
                          active
                            ? 'bg-gray-100 dark:bg-dark-second text-gray-900 dark:text-dark-txt'
                            : 'text-gray-700 dark:text-dark-txt-secondary',
                          'block w-full cursor-pointer px-4 py-2 text-left text-sm ',
                        )}
                      >
                        Category1
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>

        <div className="mt-3 sm:mt-0 sm:ml-4">
          <button
            type="button"
            onClick={() => {
              router.push('/sell/courses/create/1');
            }}
            className="text-md inline-flex items-center dark:hover:bg-dark-accent dark:bg-dark-primary bg-purple-600 px-4 py-3 font-bold text-white shadow-sm hover:bg-purple-700 "
          >
            New course
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid w-full place-items-center py-32">
          <CircleLoader
            className="hidden dark:flex items-center justify-center text-center"
            loading={loading}
            size={35}
            color="#fff"
          />
          <CircleLoader
            className="dark:hidden flex items-center justify-center text-center"
            loading={loading}
            size={35}
            color="#1c1d1f"
          />
        </div>
      ) : (
        <CourseList
          pageSize={pageSize}
          setPageSize={setPageSize}
          maxPageSize={maxPageSize}
          setMaxPageSize={setMaxPageSize}
          courses={courses}
          setCourses={setCourses}
          count={count}
          setCount={setCount}
          loading={loading}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}

      <div className="grid w-full place-items-center dark:text-dark-txt py-8">
        Based on your experience, we think these resources will be helpful.
      </div>

      <div className="mx-8 grid place-items-center ">
        <div className="my-1 p-2">
          <div className="">
            <div className="flex flex-col justify-center">
              <div className=" mx-auto flex w-72 max-w-xs flex-col space-y-3 rounded-xl border dark:border-dark-border border-gray-200  p-3 md:w-[760px] md:max-w-4xl md:flex-row md:space-x-5 md:space-y-0">
                <div className="grid w-full place-items-center  md:w-1/4">
                  <Image
                    src="/assets/img/logos/swirl.png"
                    width={300}
                    height={300}
                    alt="tailwind logo"
                    className="rounded-xl"
                  />
                </div>
                <div className="flex w-full flex-col space-y-2  p-3 md:w-2/3">
                  <h3 className="font-regular text-xl dark:text-dark-txt text-gray-800 md:text-3xl">
                    Engaging courses
                  </h3>
                  <p className="md:text-md text-base dark:text-dark-txt-secondary text-gray-700">
                    Whether you have been teaching for years or are teaching for the first time, you
                    can make an engaging course. We have compiled resources and best practices to
                    help you get to the next level, no matter where you are starting.
                  </p>

                  <p className="text-base font-bold dark:text-dark-accent text-purple-600 underline underline-offset-4">
                    Get started
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-8 grid md:grid-cols-2  ">
        <div className="my-1 p-2">
          <div className="">
            <div className="flex flex-col justify-center">
              <div className=" mx-auto flex w-72 max-w-xs flex-col space-y-3 rounded-xl dark:border-dark-border border border-gray-200  p-3 md:w-[760px] md:max-w-lg md:flex-row md:space-x-5 md:space-y-0">
                <div className="grid w-full place-items-center  md:w-1/4">
                  <Image
                    src="/assets/img/logos/star.png"
                    width={300}
                    height={300}
                    alt="tailwind logo"
                    className="rounded-xl"
                  />
                </div>
                <div className="flex w-full flex-col space-y-2  p-3 md:w-2/3">
                  <h3 className="font-regular text-xl dark:text-dark-txt text-gray-800 md:text-3xl">
                    Learn Video
                  </h3>
                  <p className="md:text-md text-base dark:text-dark-txt-secondary text-gray-700">
                    Quality video lectures can set your course apart. These resources teach the
                    basics.
                  </p>
                  <p className="text-base font-bold dark:text-dark-accent text-purple-600 underline underline-offset-4">
                    Get started
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="my-1 p-2">
          <div className="">
            <div className="flex flex-col justify-center">
              <div className=" mx-auto flex w-72 max-w-xs flex-col space-y-3 rounded-xl dark:border-dark-border border border-gray-200  p-3 md:w-[760px] md:max-w-lg md:flex-row md:space-x-5 md:space-y-0">
                <div className="grid w-full place-items-center  md:w-1/4">
                  <Image
                    src="/assets/img/logos/heart.png"
                    width={300}
                    height={300}
                    alt="tailwind logo"
                    className="rounded-xl"
                  />
                </div>
                <div className="flex w-full flex-col space-y-2 p-3 md:w-2/3">
                  <h3 className="font-regular text-xl dark:text-dark-txt text-gray-800 md:text-3xl">
                    Your Audience
                  </h3>
                  <p className="md:text-md text-base dark:text-dark-txt-secondary text-gray-700">
                    Set your course up for success by building your audience.
                  </p>

                  <p className="text-base font-bold dark:text-dark-accent text-purple-600 underline underline-offset-4">
                    Get started
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Courses.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
