import Head from 'next/head';

import Layout from '@/hocs/Layout';

import { Fragment, useCallback, useEffect, useState } from 'react';
import { Dialog, Disclosure, Menu, Tab, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import {
  ChevronDownIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  MinusIcon,
  PlusIcon,
  Squares2X2Icon,
} from '@heroicons/react/20/solid';
import LoadingMoon from '@/components/loaders/LoadingMoon';
import { AnimatePresence, motion } from 'framer-motion';
import FetchSearchCourses from '@/api/courses/SearchCourses';
import RatingsFilter from '../categories/c/components/RatingsFilter';
import VideoDurationFilter from '../categories/c/components/VideoDurationFilter';
import LanguageFilter from '../categories/c/components/LanguageFilter';
import LevelFilter from '../categories/c/components/LevelFilter';
import PriceFilter from '../categories/c/components/PriceFilter';
import axios from 'axios';
import CategoriesFilter from '../categories/c/components/CategoriesFilter';
import CourseCardHorizontal from '@/components/CourseCardHorizontal';
import FetchSearchProducts from '@/api/products/SearchProducts';
import ProductCard from '../../components/ProductCard';
import ProductCardHorizontal from '@/components/ProductCardHorizontal';

const sortOptions = [
  { name: 'Most Sold', filterBy: 'sold', order: 'desc' },
  { name: 'Most Viewed', filterBy: 'views', order: 'desc' },
  { name: 'Newest', filterBy: 'date_created', order: 'desc' },
  { name: 'Price: Low to High', filterBy: 'price', order: 'desc' },
  { name: 'Price: High to Low', filterBy: 'price', order: 'asc' },
];
const subCategories = [
  { name: 'Totes', href: '#' },
  { name: 'Backpacks', href: '#' },
  { name: 'Travel Bags', href: '#' },
  { name: 'Hip Bags', href: '#' },
  { name: 'Laptop Sleeves', href: '#' },
];
const filters = [
  {
    id: 'color',
    name: 'Color',
    options: [
      { value: 'white', label: 'White', checked: false },
      { value: 'beige', label: 'Beige', checked: false },
      { value: 'blue', label: 'Blue', checked: true },
      { value: 'brown', label: 'Brown', checked: false },
      { value: 'green', label: 'Green', checked: false },
      { value: 'purple', label: 'Purple', checked: false },
    ],
  },
  {
    id: 'category',
    name: 'Category',
    options: [
      { value: 'new-arrivals', label: 'New Arrivals', checked: false },
      { value: 'sale', label: 'Sale', checked: false },
      { value: 'travel', label: 'Travel', checked: true },
      { value: 'organization', label: 'Organization', checked: false },
      { value: 'accessories', label: 'Accessories', checked: false },
    ],
  },
  {
    id: 'size',
    name: 'Size',
    options: [
      { value: '2l', label: '2L', checked: false },
      { value: '6l', label: '6L', checked: false },
      { value: '12l', label: '12L', checked: false },
      { value: '18l', label: '18L', checked: false },
      { value: '20l', label: '20L', checked: false },
      { value: '40l', label: '40L', checked: true },
    ],
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const SeoList = {
  title: 'Search - Buy & Sell Products with NFTs on our Marketplace',
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

export default function Search({ term, courseCategories, productCategories }) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [viewCourses, setViewCourses] = useState(true);
  const [viewProducts, setViewProducts] = useState(false);

  const [showFilter, setShowFilter] = useState(true);
  const [loading, setLoading] = useState(false);
  const [coursesLength, setCoursesLength] = useState(0);

  const [productsLength, setProductsLength] = useState(0);

  const [products, setProducts] = useState([]);

  const [courses, setCourses] = useState([]);
  // eslint-disable-next-line
  const [count, setCount] = useState([]);
  // eslint-disable-next-line
  const [pageSize, setPageSize] = useState(12);
  // eslint-disable-next-line
  const [currentPage, setCurrentPage] = useState(1);
  // eslint-disable-next-line
  const [maxPageSize, setMaxPageSize] = useState(100);
  const [filterBy, setFilterBy] = useState('views');
  const [language, setLanguage] = useState('');
  const [duration, setDuration] = useState('');
  const [level, setLevel] = useState('');
  const [pricing, setPricing] = useState('');
  const [searchBy, setSearchBy] = useState(term[0]);
  const [categoryId, setCategoryId] = useState('');
  const [rating, setRating] = useState('');

  const [orderBy, setOrderBy] = useState('-published');
  const [orderByProduct, setOrderByProduct] = useState('-date_created');

  useEffect(() => {
    setSearchBy(term[0]);
  }, [term]);

  const fetchCourses = useCallback(
    // eslint-disable-next-line
    async (page, searchBy) => {
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
    ],
  );

  useEffect(() => {
    if (term[0]) {
      fetchCourses(currentPage, searchBy);
    }
  }, [fetchCourses, currentPage, term]);

  const fetchProducts = useCallback(
    // eslint-disable-next-line
    async (page, searchBy) => {
      setLoading(true);
      try {
        const res = await FetchSearchProducts(
          page,
          pageSize,
          maxPageSize,
          filterBy,
          orderByProduct,
          searchBy,
          rating,
          categoryId,
          pricing,
        );

        if (res && res.data) {
          setCount(res.data.count);
          setProducts(res.data.results);
          setProductsLength(res.data.results.length);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    },
    [pageSize, maxPageSize, filterBy, orderByProduct, rating, categoryId, pricing],
  );

  const onSubmit = (e) => {
    e.preventDefault();
    fetchProducts(currentPage, searchBy);
  };

  useEffect(() => {
    if (term[0]) {
      fetchProducts(currentPage, searchBy);
    }
  }, [fetchProducts, currentPage, searchBy]);

  const handleFilterHide = () => {
    if (showFilter) {
      setShowFilter(false);
    } else {
      setShowFilter(true);
    }
  };
  const handleMobileFilterHide = () => {
    if (mobileFiltersOpen) {
      setMobileFiltersOpen(false);
    } else {
      setMobileFiltersOpen(true);
    }
  };

  const filterAnimation = {
    initial: { x: '-100%', opacity: 1 },
    animate: { x: 0, opacity: 1, scale: 1 },
    exit: { x: '-100%', opacity: 1 },
    transition: { duration: 0.3, ease: 'easeOut' },
  };

  const filterArea = () => (
    <>
      {/* <ul className="space-y-4 border-b dark:border-dark-border border-gray-200 pb-6 text-sm font-medium text-gray-900">
        Filter here
      </ul> */}
      <RatingsFilter setRating={setRating} />
      <VideoDurationFilter setDuration={setDuration} />
      <LanguageFilter setLanguage={setLanguage} />
      <CategoriesFilter categories={courseCategories} setCategoryId={setCategoryId} />
      <LevelFilter setLevel={setLevel} />
      <PriceFilter setPricing={setPricing} />
    </>
  );
  const productsFilterArea = () => (
    <>
      {/* <ul className="space-y-4 border-b dark:border-dark-border border-gray-200 pb-6 text-sm font-medium text-gray-900">
        Filter here
      </ul> */}
      <RatingsFilter setRating={setRating} />
      <CategoriesFilter categories={productCategories} setCategoryId={setCategoryId} />
    </>
  );

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

      <div className="px-8">
        {/* Mobile filter dialog */}
        <Transition.Root show={mobileFiltersOpen} as={Fragment}>
          <Dialog as="div" className="relative z-40 lg:hidden" onClose={setMobileFiltersOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto dark:bg-dark-bg bg-white py-4 pb-12 shadow-xl">
                  <div className="flex items-center justify-between px-4">
                    <h2 className="text-lg font-medium dark:text-dark-txt text-gray-900">
                      Filters
                    </h2>
                    <button
                      type="button"
                      className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md dark:text-dark-txt p-2 text-gray-400"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="p-4">{filterArea()}</div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        <main className="mx-auto max-w-7xl ">
          <div className="flex items-baseline justify-between pt-12 pb-2">
            <header>
              <p className="text-3xl font-bold leading-6 dark:text-dark-txt text-gray-900">
                You searched for: {term[0]}
              </p>
            </header>
          </div>

          <section aria-labelledby="products-heading" className=" pb-24">
            <div className="flex items-baseline justify-between py-6">
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    handleFilterHide();
                    handleMobileFilterHide();
                  }}
                  className="flex border dark:border-dark-border dark:bg-dark-second dark:hover:bg-dark-main dark:text-dark-txt border-gray-700 px-4 py-4 text-center hover:bg-gray-50"
                >
                  <i className="bx bx-filter text-3xl" />
                  <span className="mt-1 items-center justify-center font-bold">Filter</span>
                </button>
                <Menu as="div" className="relative inline-block text-left">
                  <Menu.Button className=" w-full  border border-gray-700 bg-white px-4 dark:bg-dark-second dark:hover:bg-dark-main dark:text-dark-txt-secondary py-2 text-sm font-medium dark:border-dark-border text-gray-700 shadow-sm hover:bg-gray-50 ">
                    <span className="flex cursor-pointer text-xs font-bold dark:text-dark-txt text-gray-700">
                      Sort by
                    </span>
                    <div className="flex w-full">
                      <span className="text-lg">
                        {
                          filterBy === 'sold'
                            ? 'Most Sold'
                            : filterBy === 'views'
                            ? 'Most Viewed'
                            : // : filterBy === 'rating'
                            // ? 'Highest Rated'
                            filterBy === 'date_created'
                            ? 'Newest'
                            : filterBy === 'price' && orderBy === 'asc'
                            ? 'Price: Low to High'
                            : filterBy === 'price' && orderBy === 'desc' && 'Price: High to Low'
                          // : filterBy === 'language'
                          // && `Language: ${language}`
                          // : filterBy === 'duration'
                          // ? `Duration: ${duration} Hours`
                          // : filterBy === 'level'
                          // ? `Level: ${level}`
                          // : filterBy === 'pricing' && `Pricing: ${pricing}`
                        }
                      </span>
                      <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                    </div>
                  </Menu.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute left-0 z-10 mt-2 w-40 origin-top-right dark:bg-dark-second bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        {sortOptions.map((option) => (
                          <Menu.Item key={option.name}>
                            {({ active }) => (
                              <button
                                type="button"
                                onClick={() => {
                                  setFilterBy(option.filterBy);
                                  setOrderBy(option.order);
                                  setOrderByProduct(option.order);
                                }}
                                className={classNames(
                                  active ? 'bg-gray-100 dark:bg-dark-third' : '',
                                  'text-left block cursor-pointer px-4 py-2 text-sm font-medium dark:text-dark-txt text-gray-900 w-full',
                                )}
                              >
                                {option.name}
                              </button>
                            )}
                          </Menu.Item>
                        ))}
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>

              <div className="text-md hidden items-center font-bold text-gray-500 md:flex">
                {loading ? (
                  <LoadingMoon size={20} color="#1c1d1f" />
                ) : (
                  <>{coursesLength + productsLength} Results</>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              {/* Filters */}
              <AnimatePresence>
                {showFilter ? (
                  <motion.div key="filters" {...filterAnimation} className="hidden lg:block">
                    <div className="grid grid-cols-12">
                      <div className="col-span-12 ">
                        <Tab.Group>
                          <Tab.List className="  grid space-x-1 space-y-1 rounded-xl p-1 sm:flex sm:space-x-2 sm:space-y-0">
                            <Tab
                              onClick={() => {
                                setViewCourses(true);
                                setViewProducts(false);
                              }}
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
                              onClick={() => {
                                setViewCourses(false);
                                setViewProducts(true);
                              }}
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
                          </Tab.List>
                          <Tab.Panels>
                            <Tab.Panel>{filterArea()}</Tab.Panel>
                            <Tab.Panel>{productsFilterArea()}</Tab.Panel>
                            {/* <Tab.Panel>Music</Tab.Panel> */}
                            {/* <Tab.Panel>Games</Tab.Panel> */}
                          </Tab.Panels>
                        </Tab.Group>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div />
                )}
              </AnimatePresence>

              {/* Product grid */}

              <div
                id="product-grid"
                className={`${showFilter ? 'lg:col-span-3' : 'lg:col-span-4'}`}
              >
                {/* Replace with your content */}
                <div className="w-full ">
                  {/* Product grid */}
                  <ul className="space-y-2">
                    {courses &&
                      viewCourses &&
                      courses.map((course) => (
                        <li key={course.id}>
                          <CourseCardHorizontal data={course} />
                        </li>
                      ))}
                    {products &&
                      viewProducts &&
                      products.map((product) => (
                        <li key={product.id}>
                          <ProductCardHorizontal data={product} />
                        </li>
                      ))}
                  </ul>
                </div>
                {/* /End replace */}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

Search.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export async function getServerSideProps(context) {
  const { term } = context.query;

  const categoriesRes = await axios.get(
    `${process.env.NEXT_PUBLIC_APP_COURSES_URL}/api/category/popular/`,
  );

  const categoriesProductsRes = await axios.get(
    `${process.env.NEXT_PUBLIC_APP_PRODUCTS_URL}/api/category/popular/`,
  );

  return {
    props: {
      term: term,
      courseCategories: categoriesRes.data.results,
      productCategories: categoriesProductsRes.data.results,
    },
  };
}
