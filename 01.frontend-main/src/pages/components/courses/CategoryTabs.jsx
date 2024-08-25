import React, { useCallback, useState } from 'react';
import { Tab } from '@headlessui/react';
import FetchSearchCourses from '@/api/courses/SearchCourses';
import CategoryCourses from './CategoryCourses';
import { useEffect } from 'react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function CategoryTabs({ categories }) {
  const [currentCategory, setCurrentCategory] = useState(categories && categories[0]);
  const [rating, setRating] = useState('');
  const [coursesLength, setCoursesLength] = useState(0);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [count, setCount] = useState([]);
  const [pageSize, setPageSize] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPageSize, setMaxPageSize] = useState(100);
  const [filterBy, setFilterBy] = useState('views');
  const [language, setLanguage] = useState('');
  const [duration, setDuration] = useState('');
  const [level, setLevel] = useState('');
  const [pricing, setPricing] = useState('');
  const [orderBy, setOrderBy] = useState('-published');
  const [selectedCourses, setSelectedCourses] = useState([]);

  const fetchCourses = useCallback(
    async (page, searchBy, category) => {
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
          category,
          level,
          pricing,
        );

        if (res.data) {
          setCount(res.data.count);
          setCourses(res.data.results);
          setCoursesLength(res.data.results.length);
          setSelectedCourses(res.data.results); // Add this line
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    },
    [pageSize, maxPageSize, filterBy, orderBy, rating, language, duration, level, pricing],
  );

  useEffect(() => {
    fetchCourses(currentPage, '', currentCategory);
  }, [fetchCourses]);

  return (
    <div className="relative mx-auto max-w-7xl  px-4 sm:px-6 lg:px-8 ">
      {/* Heading */}
      <div className=" ">
        <div className="-ml-4 -mt-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
          <div className="ml-4 ">
            <h3 className="font-recife-bold text-3xl tracking-tight text-gray-900 dark:text-dark-txt">
              A broad selection of courses
            </h3>
            <p className="font-gilroy-regular mb-4 text-lg text-gray-500">
              Choose from courses in Spanish and many other languages!
            </p>
          </div>
        </div>
      </div>
      <Tab.Group>
        <Tab.List className=" grid grid-cols-3 space-x-1 p-1 md:grid-cols-12">
          {categories &&
            categories.slice(0, 6).map((category) => (
              <Tab
                key={category.id}
                onClick={async () => {
                  setLoading(true);
                  setCurrentCategory(category);
                  fetchCourses(currentPage, '', category.slug);
                  setLoading(false);
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
                {category.name}
              </Tab>
            ))}
        </Tab.List>

        <Tab.Panels className="">
          {categories &&
            categories.map((category) => (
              <Tab.Panel key={category.id} className={classNames('rounded-xl  p-3', '')}>
                <CategoryCourses
                  category={category}
                  fetchCourses={fetchCourses}
                  currentPage={currentPage}
                  courses={courses}
                  loading={loading}
                  selectedCourses={selectedCourses}
                />
              </Tab.Panel>
            ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
