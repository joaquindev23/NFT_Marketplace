import Head from 'next/head';
import React, { useState, Fragment, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import { Menu, Transition } from '@headlessui/react';
import LibraryLayout from '../hocs/Layout';

import Layout from '@/hocs/Layout';
import FetchOrders from '@/api/orders/List';
import OrdersList from './components/OrdersList';

const SeoList = {
  title: 'Orders - My Courses, Products, Wishlist & Orders | Boomslag NFT Marketplace',
  description:
    'Discover all your courses, products, wishlist and orders in one place on Boomslag, the ultimate NFT marketplace for online courses, physical products, and more. Explore our revolutionary platform that uses ERC1155 to provide a seamless and secure buying and selling experience.',
  href: '/',
  url: 'https://boomslag.com/library',
  keywords:
    'boomslag library, boomslag courses, boomslag products, boomslag wishlist, boomslag orders',
  robots: 'all',
  author: 'BoomSlag',
  publisher: 'BoomSlag',
  image:
    'https://bafybeiaor24mrcurzyzccxl7xw46zdqpor4sfuhddl6tzblujoiukchxnq.ipfs.w3s.link/teach.png',
  twitterHandle: '@BoomSlag',
};

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Orders() {
  const router = useRouter();
  useEffect(() => {
    window.scrollTo(0, 0);
    // eslint-disable-next-line
  }, [router.pathname]);

  const [loading, setLoading] = useState(true);

  const [count, setCount] = useState([]);
  const [orders, setOrders] = useState([]);
  const [pageSize, setPageSize] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPageSize, setMaxPageSize] = useState(100);
  const [filterBy, setFilterBy] = useState(null);
  const [searchBy, setSearchBy] = useState('');
  const [orderBy, setOrderBy] = useState('-date_issued');

  const fetchOrders = useCallback(
    async (page, searchBy) => {
      setLoading(true);
      const res = await FetchOrders(page, pageSize, maxPageSize, filterBy, orderBy, searchBy);
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
    <LibraryLayout title="Orders">
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
      <div className="flex ">
        <div className=" flex gap-x-4">
          {/* <div className="w-full ">
            <form
              onSubmit={(e) => onSubmit(e)}
              className="  dark:ring-dark-border dark:border-dark-border flex border"
            >
              <div className=" flex flex-grow items-stretch ">
                <input
                  type="text"
                  value={searchBy}
                  onChange={(e) => {
                    setSearchBy(e.target.value);
                  }}
                  className="text-md duration block dark:ring-dark-border dark:border-dark-border w-full border focus:ring-none focus:outline-none border-dark py-2.5 pl-4 font-medium transition ease-in-out dark:bg-dark-second dark:text-dark-txt"
                  placeholder="Search your orders"
                />
              </div>
              <button
                type="submit"
                className="relative -ml-px inline-flex items-center space-x-2 border-l dark:ring-dark-border dark:border-dark-border dark:bg-dark-bg bg-black px-4 py-2 text-sm font-medium text-white"
              >
                <MagnifyingGlassIcon className="h-5 w-5 text-white" aria-hidden="true" />
              </button>
            </form>
          </div> */}

          <Menu as="div" className="relative z-20 inline-block text-left">
            <div>
              <Menu.Button className="inline-flex w-32 justify-center border dark:border-dark-border border-gray-700 dark:text-dark-txt dark:bg-dark-main bg-white px-4 py-2.5 text-sm font-black text-gray-700  hover:bg-gray-50">
                {orderBy === '-date_issued' && 'Newest'}
                {orderBy === 'oldest' && 'Oldest'}
                {orderBy === 'max_amount' && '+ Price'}
                {orderBy === 'min_amount' && '- Price'}
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
                          setOrderBy('-date_issued');
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
                          setOrderBy('max_amount');
                        }}
                        className={classNames(
                          active
                            ? 'bg-gray-100 dark:bg-dark-second text-gray-900 dark:text-dark-txt'
                            : 'text-gray-700 dark:text-dark-txt-secondary',
                          'block w-full cursor-pointer px-4 py-2 text-left text-sm ',
                        )}
                      >
                        Highest Price
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        type="button"
                        onClick={async () => {
                          setOrderBy('min_amount');
                        }}
                        className={classNames(
                          active
                            ? 'bg-gray-100 dark:bg-dark-second text-gray-900 dark:text-dark-txt'
                            : 'text-gray-700 dark:text-dark-txt-secondary',
                          'block w-full cursor-pointer px-4 py-2 text-left text-sm ',
                        )}
                      >
                        Lowest Price
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
      </div>
      <OrdersList
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
    </LibraryLayout>
  );
}

Orders.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
