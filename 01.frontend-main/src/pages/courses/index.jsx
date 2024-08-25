import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import Layout from '@/hocs/Layout';
import PopularTabs from '../categories/c/components/PopularTabs';
import FeaturedCourses from '../components/courses/list/FeaturedCourses';
import PopularTopics from '../categories/c/components/PopularTopics';
import PopularInstructors from '../categories/c/components/PopularInstructors';
import SearchCourses from '../categories/c/components/SearchCourses';
import FetchBestSellingInstructors from '@/api/courses/instructors/GetBestSelling';
import FetchPopularCourseCategories from '@/api/GetPopularCategories';
import FetchCourses from '@/api/courses/List';

const SeoList = {
  title: 'Boomslag Courses - Explore Premium Online Courses',
  description:
    'Find and buy high-quality online courses at Boomslag, a cutting-edge marketplace where you can acquire knowledge through secure and seamless transactions using NFTs and ERC1155 tokens.',
  href: '/',
  url: 'https://boomslag.com',
  keywords:
    'online courses, online education, e-learning, nft courses marketplace, nft education, erc1155 tokens, blockchain education',
  robots: 'all',
  author: 'Boomslag',
  publisher: 'Boomslag',
  image:
    'https://bafybeiaor24mrcurzyzccxl7xw46zdqpor4sfuhddl6tzblujoiukchxnq.ipfs.w3s.link/teach.png',
  video: 'https://boomslagcourses.s3.us-east-2.amazonaws.com/Quack+Sound+Effect.mp4',

  twitterHandle: '@boomslag_',
};

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState([]);
  const [pageSize, setPageSize] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPageSize, setMaxPageSize] = useState(100);
  const [filterBy, setFilterBy] = useState(null);
  const [filterByAuthor, setFilterByAuthor] = useState(null);
  const [searchBy, setSearchBy] = useState('');
  const [filterByCategory, setFilterByCategory] = useState(null);
  const [filterByBusinessActivity, setFilterByBusinessActivity] = useState(null);
  const [filterByType, setFilterByType] = useState(null);
  const [orderBy, setOrderBy] = useState('-published');

  const fetchCourses = useCallback(
    async (page, searchBy) => {
      setLoading(true);
      try {
        const res = await FetchCourses(
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
        if (res.data) {
          setCount(res.data.count);
          setCourses(res.data.results);
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
      filterByAuthor,
      filterByCategory,
      filterByBusinessActivity,
      filterByType,
    ],
  );

  useEffect(() => {
    fetchCourses(currentPage, '');
  }, [fetchCourses, currentPage]);

  // Fetch Categories
  const [categories, setCategories] = useState(null);
  const fetchPopularCategories = useCallback(async () => {
    const res = await FetchPopularCourseCategories();
    if (res.status === 200) {
      setCategories(res.data.results);
    }
  }, []);

  useEffect(() => {
    fetchPopularCategories();
  }, [fetchPopularCategories]);

  // Fetch Instructors
  const [instructors, setInstructors] = useState(null);
  const fetchPopularInstructors = useCallback(async () => {
    const res = await FetchBestSellingInstructors();
    if (res.status === 200) {
      setInstructors(res.data.results);
    }
  }, []);

  useEffect(() => {
    fetchPopularInstructors();
  }, [fetchPopularInstructors]);

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
      <div className="mx-auto max-w-7xl px-4 ">
        {/* We've used 3xl here, but feel free to try other max-widths based on your needs */}
        <div className="mx-auto max-w-7xl p-0 pt-12 md:p-12">
          <div className="space-y-12">
            <PopularTabs coursesBySold={courses} courses={courses} coursesByViews={courses} />
            <FeaturedCourses data={courses} />
            <PopularTopics categories={categories} />
            <PopularInstructors instructors={instructors} />
            <SearchCourses categories={categories} />
          </div>
        </div>
      </div>
    </div>
  );
}

Courses.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
