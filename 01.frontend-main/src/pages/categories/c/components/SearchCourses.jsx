import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { Dialog, Menu, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import LoadingMoon from '@/components/loaders/LoadingMoon';
import RatingsFilter from './RatingsFilter';
import VideoDurationFilter from './VideoDurationFilter';
import LanguageFilter from './LanguageFilter';
import CategoriesFilter from './CategoriesFilter';
import LevelFilter from './LevelFilter';
import PriceFilter from './PriceFilter';
import FetchSearchCourses from '@/api/courses/SearchCourses';
import CourseCardHorizontal from '@/components/CourseCardHorizontal';

const sortOptions = [
  { name: 'Most Sold', filterBy: 'sold', order: 'desc' },
  { name: 'Most Viewed', filterBy: 'views', order: 'desc' },
  { name: 'Newest', filterBy: 'date_created', order: 'desc' },
  { name: 'Price: Low to High', filterBy: 'price', order: 'desc' },
  { name: 'Price: High to Low', filterBy: 'price', order: 'asc' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function SearchCourses({ categories }) {
  const [rating, setRating] = useState('');
  const [coursesLength, setCoursesLength] = useState(0);

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
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
  const [searchBy, setSearchBy] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [orderBy, setOrderBy] = useState('-published');

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

  const onSubmit = (e) => {
    e.preventDefault();
    fetchCourses(currentPage, searchBy);
  };

  useEffect(() => {
    fetchCourses(currentPage, '');
  }, [fetchCourses, currentPage]);

  // Filters

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [showFilter, setShowFilter] = useState(true);

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
      <ul className="space-y-4 border-b dark:border-dark-border border-gray-200 pb-6 text-sm font-medium text-gray-900">
        <form
          onSubmit={(e) => onSubmit(e)}
          className="border-b-300 flex dark:border-dark-border w-full border"
        >
          <div className=" flex flex-grow items-stretch ">
            <input
              type="text"
              value={searchBy}
              onChange={(e) => {
                setSearchBy(e.target.value);
              }}
              className="text-md duration block dark:ring-dark-border dark:border-dark-border w-full border focus:ring-none focus:outline-none border-dark py-2.5 pl-4 font-medium transition ease-in-out dark:bg-dark-second dark:text-dark-txt"
              placeholder="Search all courses"
            />
          </div>
          <button
            type="submit"
            className="relative -ml-px inline-flex border  items-center space-x-2 border-l dark:ring-dark-border dark:border-dark-border dark:bg-dark-bg bg-black px-4 py-2 text-sm font-medium text-white"
          >
            <MagnifyingGlassIcon className="h-5 w-5 text-white" aria-hidden="true" />
          </button>
        </form>
      </ul>
      <RatingsFilter setRating={setRating} />
      <VideoDurationFilter setDuration={setDuration} />
      <LanguageFilter setLanguage={setLanguage} />
      <CategoriesFilter categories={categories} setCategoryId={setCategoryId} />
      <LevelFilter setLevel={setLevel} />
      <PriceFilter setPricing={setPricing} />
    </>
  );

  return (
    <div className="">
      <div>
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
              <p className="text-2xl font-bold leading-6 dark:text-dark-txt text-gray-900">
                Search all courses
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
                {loading ? <LoadingMoon size={20} color="#1c1d1f" /> : <>{coursesLength} Results</>}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              {/* Filters */}
              <AnimatePresence>
                {showFilter ? (
                  <motion.div key="filters" {...filterAnimation} className="hidden lg:block">
                    {filterArea()}
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
                  <ul>
                    {courses &&
                      courses.map((course) => (
                        <li key={course.id}>
                          <CourseCardHorizontal data={course} />
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
