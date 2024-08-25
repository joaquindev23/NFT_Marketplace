import React, { useCallback, useEffect, useRef, useState } from 'react';
import { IoSearch } from 'react-icons/io5';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { useClickOutside } from 'react-click-outside-hook';
import MoonLoader from 'react-spinners/MoonLoader';
import DOMPurify from 'dompurify';

import {
  SearchInput,
  SearchIcon,
  containerVariants,
  containerTransition,
  CloseIcon,
  SearchKeyIcon,
  LoadingWrapper,
  WarningMessage,
} from './Elements';
import { useDebounce } from '../../../hooks/debounceHook';
import FetchSearchCourses from '@/api/SearchCourses';
import FetchSearchProducts from '@/api/products/SearchProducts';

export default function NavSearchbar() {
  const [data, setData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [noData, setNoData] = useState(false);

  // Fetch Courses Logic Here
  // eslint-disable-next-line
  const [rating, setRating] = useState('');
  // eslint-disable-next-line
  const [coursesLength, setCoursesLength] = useState(0);
  const [courses, setCourses] = useState([]);
  // eslint-disable-next-line
  const [products, setProducts] = useState([]);
  const [productsLength, setProductsLength] = useState(0);
  const [loading, setLoading] = useState(true);
  const [productsCount, setProductsCount] = useState(0);
  // eslint-disable-next-line
  const [count, setCount] = useState([]);
  // eslint-disable-next-line
  const [pageSize, setPageSize] = useState(12);
  // eslint-disable-next-line
  const [currentPage, setCurrentPage] = useState(1);
  // eslint-disable-next-line
  const [maxPageSize, setMaxPageSize] = useState(100);
  // eslint-disable-next-line
  const [filterBy, setFilterBy] = useState('views');
  // eslint-disable-next-line
  const [language, setLanguage] = useState('');
  // eslint-disable-next-line
  const [duration, setDuration] = useState('');
  // eslint-disable-next-line
  const [level, setLevel] = useState('');
  // eslint-disable-next-line
  const [pricing, setPricing] = useState('');
  // eslint-disable-next-line
  const [searchQuery, setSearchQuery] = useState('');
  // eslint-disable-next-line
  const [categoryId, setCategoryId] = useState('');
  // eslint-disable-next-line
  const [orderBy, setOrderBy] = useState('-published');

  const fetchCourses = useCallback(
    // eslint-disable-next-line
    async (page, searchQuery) => {
      setLoading(true);
      try {
        const res = await FetchSearchCourses(
          page,
          pageSize,
          maxPageSize,
          filterBy,
          orderBy,
          searchQuery,
          rating,
          language,
          duration,
          categoryId,
          level,
          pricing,
        );

        if (res.status === 200) {
          if (res.data && res.data.results.length === 0) setNoData(true);

          setData(res.data);
        }

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

  const [orderByProducts, setOrderByProducts] = useState('-date_created');
  const fetchProducts = useCallback(
    // eslint-disable-next-line
    async (page, searchQuery) => {
      setLoading(true);
      try {
        const res = await FetchSearchProducts(
          page,
          pageSize,
          maxPageSize,
          filterBy,
          orderByProducts,
          searchQuery,
          rating,
          categoryId,
          pricing,
        );

        if (res.status === 200) {
          if (res.data && res.data.results.length === 0) setNoData(true);

          setProductData(res.data);
        }

        if (res.data) {
          setProductsCount(res.data.count);
          setProducts(res.data.results);
          setProductsLength(res.data.results.length);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    },
    [pageSize, maxPageSize, filterBy, orderByProducts, rating, categoryId, pricing],
  );

  const router = useRouter();

  const [isExpanded, setExpanded] = useState(false);
  const [parentRef, isClickedOutside] = useClickOutside();
  const inputRef = useRef(null);

  const isEmpty = !data || data.length === 0;

  const changeHandler = (e) => {
    e.preventDefault();
    const inputText = e.target.value.trim();
    if (inputText === '') {
      setNoData(false);
      setExpanded(false); // Collapse the dropdown if the input is empty
    } else {
      setExpanded(true); // Expand the dropdown if there's text in the input
    }

    setSearchQuery(e.target.value);
  };

  const expandContainer = () => {
    setExpanded(true);
    // eslint-disable-next-line
    inputFocus();
  };

  const collapseContainer = () => {
    setExpanded(false);
    setSearchQuery('');
    setLoading(false);
    setNoData(false); // This will reset the "Nothing to see here!" message
    // eslint-disable-next-line
    inputUnFocus();
    setData([]);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  useEffect(() => {
    if (isClickedOutside) {
      collapseContainer();
    }
  }, [isClickedOutside]);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        collapseContainer();
      }
    };

    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const inputFocus = () => {
    inputRef.current.focus();
  };
  const keydownHandler = (e) => {
    if (e.key === '/' && e.ctrlKey) {
      e.preventDefault(); // Add this line
      inputFocus();
      expandContainer();
    }
  };

  const inputUnFocus = () => {
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', keydownHandler);

    return () => {
      document.removeEventListener('keydown', keydownHandler);
    };
  }, []);

  // useEffect(() => {
  //   if (inputRef.current.blur()) {
  //     collapseContainer();
  //   }
  // }, []);

  const [focused, setFocused] = useState(false);

  const searchData = async () => {
    if (!searchQuery || searchQuery.trim() === '') {
      setNoData(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    setNoData(false);

    await fetchCourses(currentPage, searchQuery);
    await fetchProducts(currentPage, searchQuery);

    setLoading(false);
    setNoData(data.length === 0);
  };

  useDebounce(searchQuery, 500, searchData);

  const onSubmitSearch = (e) => {
    e.preventDefault();
    collapseContainer();
    router.push(`/search/${searchQuery}`);
  };
  return (
    <div ref={parentRef} className="relative w-full">
      <motion.div
        className="w-full h-12 bg-white rounded-full border border-gray-400 dark:bg-dark-bg dark:bg-opacity-50 dark:border-dark-second"
        animate={isExpanded ? 'expanded' : 'collapsed'}
        variants={containerVariants}
        transition={containerTransition}
      >
        <div className="w-full flex pt-3 px-4 min-h-12">
          <form className="flex w-full" onSubmit={(e) => onSubmitSearch(e)}>
            <span className="text-gray-400 pt-0.5 text-lg align-middle">
              <IoSearch />
            </span>
            <input
              placeholder="Search for anything"
              ref={inputRef}
              value={searchQuery}
              onChange={changeHandler}
              className={`w-full h-full outline-none border-none pl-2 dark:text-dark-txt text-gray-400 text-sm font-light rounded-md bg-transparent focus:placeholder-opacity-0 transition-all duration-200 ${
                focused ? 'placeholder-opacity-0' : ''
              }`}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
          </form>
          <AnimatePresence>
            {isExpanded ? (
              <CloseIcon
                zIndex={1}
                key="close-icon"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  type="button"
                  onClick={() => {
                    inputUnFocus();
                    collapseContainer();
                  }}
                  className="absolute inset-y-0 right-0 mr-3 flex py-2 pr-1.5"
                >
                  <kbd className="inline-flex items-center rounded-lg border dark:border-dark-third dark:text-dark-txt border-gray-400 px-3.5 pb-1 font-sans text-sm font-medium text-dark-gray shadow-inner">
                    Esc
                  </kbd>
                </button>
              </CloseIcon>
            ) : (
              <SearchKeyIcon
                zIndex={1}
                key="search-icon"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  type="button"
                  onClick={() => {
                    inputFocus();
                    expandContainer();
                  }}
                  className="absolute inset-y-0 right-0 mr-3 flex py-2 pr-1.5"
                >
                  <kbd className="inline-flex items-center rounded-lg border dark:border-dark-third dark:text-dark-txt border-gray-400 px-2 pb-1 font-sans text-sm font-medium text-dark-gray shadow-inner hover:bg-opacity-90">
                    ⌘ + /
                  </kbd>
                </button>
              </SearchKeyIcon>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {isExpanded && (
        <AnimatePresence>
          <motion.div
            className="absolute z-20 w-full border dark:border-dark-border border-gray-200 rounded-2xl p-4 bg-white dark:bg-dark-bg shadow-navbar"
            key="content-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {loading && (
              <LoadingWrapper>
                <MoonLoader loading color="#000" size={20} />
              </LoadingWrapper>
            )}
            {!loading && isEmpty && !noData && (
              <LoadingWrapper>
                <WarningMessage>Start typing to Search</WarningMessage>
              </LoadingWrapper>
            )}
            {!loading && noData && (
              <LoadingWrapper>
                <WarningMessage>Nothing to see here!</WarningMessage>
              </LoadingWrapper>
            )}
            {!loading && !isEmpty && (
              <div>
                {data.results.length > 0 &&
                  data.results.map((course) => (
                    <Link
                      key={course.id}
                      href={`/course/${course.slug}`}
                      onClick={() => {
                        collapseContainer();
                      }}
                      className="flex p-2 dark:hover:bg-dark-main rounded-xl hover:bg-gray-50"
                    >
                      <div className="mr-4 flex-shrink-0 self-center">
                        <Image
                          className="inline-block h-12 w-auto object-cover"
                          src={course && course.thumbnail}
                          alt="thumbnail"
                          width={512}
                          height={512}
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold">{course.title}</h4>
                        <p className="text-xs">
                          <span className="font-bold text-gray-600">Course</span>{' '}
                          <span
                            className="ml-1 text-gray-400"
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(course.short_description),
                            }}
                          />
                        </p>
                      </div>
                    </Link>
                  ))}
                {productData.results.length > 0 &&
                  productData.results.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.slug}`}
                      onClick={() => {
                        collapseContainer();
                      }}
                      className="flex p-2 dark:hover:bg-dark-main rounded-xl hover:bg-gray-50"
                    >
                      <div className="mr-4 flex-shrink-0 self-center">
                        <Image
                          className="inline-block h-8 w-auto rounded-md"
                          src={product.images[0].file}
                          alt="thumbnail"
                          width={50}
                          height={50}
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold">{product.title}</h4>
                        <p className="text-xs">
                          <span className="font-bold text-gray-600">Product</span>{' '}
                          <span
                            className="ml-1 text-gray-400"
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(product.short_description),
                            }}
                          />
                        </p>
                      </div>
                    </Link>
                  ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
