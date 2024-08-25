import Head from 'next/head';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CircleLoader } from 'react-spinners';
import { useRouter } from 'next/router';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

import Layout from '../../components/Layout';
import ListSellerProducts from '@/api/manage/products/List';
import { resetCreateVariables } from '@/redux/actions/courses/courses';
import ProductsList from '../components/ProductsList';
import Link from 'next/link';
import FetchOrderItems from '@/api/orders/ListOrderItems';
import LoadingBar from '@/components/loaders/LoadingBar';
import OrderItemList from './components/OrderItemsList';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const SeoList = {
  title: 'Orders Dashboard - Buy & Sell Products with NFTs on our Marketplace',
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

export default function Orders() {
  const router = useRouter();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(resetCreateVariables());
    // eslint-disable-next-line
  }, []);

  const [loading, setLoading] = useState(true);

  const [count, setCount] = useState([]);
  const [orders, setOrders] = useState([]);
  const [pageSize, setPageSize] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPageSize, setMaxPageSize] = useState(100);
  const [products, setProducts] = useState([]);
  const [filterBy, setFilterBy] = useState(null);
  const [searchBy, setSearchBy] = useState('');
  const [orderBy, setOrderBy] = useState('-date_added');

  const fetchOrders = useCallback(
    async (page, searchBy) => {
      setLoading(true);
      const res = await FetchOrderItems(page, pageSize, maxPageSize, filterBy, orderBy, searchBy);
      if (res && res.data) {
        setCount(res.data.count);
        setOrders(res.data.results);
      }
      setLoading(false);
    },
    [pageSize, maxPageSize, filterBy, orderBy],
  );

  useEffect(() => {
    fetchOrders(currentPage, '');
  }, [fetchOrders, currentPage]);

  const onSubmit = async (e) => {
    e.preventDefault();
    fetchOrders(currentPage, searchBy);
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
        <h3 className="font-recife-bold text-xl leading-6 dark:text-dark-txt text-gray-900 md:text-4xl">
          Orders
        </h3>
      </div>

      <div className="px-8  pb-5 sm:flex sm:items-center sm:justify-between">
        <div className="mt-1 flex gap-x-4">
          <div className="w-full ">
            <form
              onSubmit={(e) => onSubmit(e)}
              className=" border-b-300 dark:border-dark-border flex border"
            >
              <div className=" flex flex-grow items-stretch ">
                <input
                  type="text"
                  value={searchBy}
                  onChange={(e) => {
                    setSearchBy(e.target.value);
                  }}
                  className="text-md duration block w-full border focus:ring-none focus:outline-none dark:border-dark-border border-dark py-2.5 pl-4 font-medium  transition ease-in-out dark:bg-dark-second dark:text-dark-txt"
                  placeholder="Search your orders"
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
                {orderBy === '-date_added' && 'Newest'}
                {orderBy === 'oldest' && 'Oldest'}
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
                          setOrderBy('-date_added');
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
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
          <Menu as="div" className="relative z-20 inline-block text-left">
            <div>
              <Menu.Button className="inline-flex dark:border-dark-border dark:text-dark-txt dark:bg-dark-main w-32 justify-center border border-gray-700 bg-white px-4 py-2.5 text-sm font-black text-gray-700  hover:bg-gray-50">
                Filter By
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
                          setFilterBy('not_processed');
                        }}
                        className={classNames(
                          active
                            ? 'bg-gray-100 dark:bg-dark-second text-gray-900 dark:text-dark-txt'
                            : 'text-gray-700 dark:text-dark-txt-secondary',
                          'block w-full cursor-pointer px-4 py-2 text-left text-sm ',
                        )}
                      >
                        Not Processed
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        type="button"
                        onClick={async () => {
                          setFilterBy('processing');
                        }}
                        className={classNames(
                          active
                            ? 'bg-gray-100 dark:bg-dark-second text-gray-900 dark:text-dark-txt'
                            : 'text-gray-700 dark:text-dark-txt-secondary',
                          'block w-full cursor-pointer px-4 py-2 text-left text-sm ',
                        )}
                      >
                        Processing
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        type="button"
                        onClick={async () => {
                          setFilterBy('shipping');
                        }}
                        className={classNames(
                          active
                            ? 'bg-gray-100 dark:bg-dark-second text-gray-900 dark:text-dark-txt'
                            : 'text-gray-700 dark:text-dark-txt-secondary',
                          'block w-full cursor-pointer px-4 py-2 text-left text-sm ',
                        )}
                      >
                        Shipping
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        type="button"
                        onClick={async () => {
                          setFilterBy('delivered');
                        }}
                        className={classNames(
                          active
                            ? 'bg-gray-100 dark:bg-dark-second text-gray-900 dark:text-dark-txt'
                            : 'text-gray-700 dark:text-dark-txt-secondary',
                          'block w-full cursor-pointer px-4 py-2 text-left text-sm ',
                        )}
                      >
                        Delivered
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        type="button"
                        onClick={async () => {
                          setFilterBy('cancelled');
                        }}
                        className={classNames(
                          active
                            ? 'bg-gray-100 dark:bg-dark-second text-gray-900 dark:text-dark-txt'
                            : 'text-gray-700 dark:text-dark-txt-secondary',
                          'block w-full cursor-pointer px-4 py-2 text-left text-sm ',
                        )}
                      >
                        Cancelled
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>

        {/* <div className="mt-3 sm:mt-0 sm:ml-4"></div> */}
      </div>

      {loading ? (
        <div className="grid w-full place-items-center py-8">
          {/* <CircleLoader
            className="hidden dark:flex items-center justify-center text-center"
            loading={loading}
            size={35}
            color="#fff"
          /> */}
          <CircleLoader
            className="dark:hidden flex items-center justify-center text-center"
            loading={loading}
            size={35}
            color="#1c1d1f"
          />
        </div>
      ) : (
        <OrderItemList
          pageSize={pageSize}
          setPageSize={setPageSize}
          maxPageSize={maxPageSize}
          setMaxPageSize={setMaxPageSize}
          orders={orders}
          setOrders={setOrders}
          count={count}
          setCount={setCount}
          loading={loading}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}

      <div className="grid w-full place-items-center py-8">
        Based on your experience, we think these resources will be helpful.
      </div>
      <div className="mx-8 grid place-items-center ">
        <div className="my-1 p-2">
          <div className="">
            <div className="flex flex-col justify-center">
              <div className=" mx-auto flex w-72 max-w-xs flex-col space-y-3 rounded-xl border dark:border-dark-border border-gray-200  p-3 md:w-[760px] md:max-w-4xl md:flex-row md:space-x-5 md:space-y-0">
                <div className="grid w-full place-items-center  md:w-1/4">
                  <img
                    src="/assets/img/logos/swirl.png"
                    width="300"
                    height="300"
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
                  <img
                    src="/assets/img/logos/star.png"
                    width="300"
                    height="300"
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
                  <img
                    src="/assets/img/logos/heart.png"
                    width="300"
                    height="300"
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

Orders.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
