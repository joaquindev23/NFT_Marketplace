import { useCallback, useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '@/hocs/Layout';
import Header from './components/Header';
import Badges from './components/Badges';
import AffiliatesInfo from './components/AffiliatesInfo';
import Teach from './components/Teach';
import TeachCTA from './components/TeachCTA';
import FetchCourses from '@/api/courses/List';
import FetchPopularCourseCategories from '@/api/courses/GetPopularCategories';
import FetchProducts from '@/api/products/List';
import FetchProductPopularCourseCategories from '@/api/products/GetPopularCategories';
import PopularProductCategories from './components/products/PopularTopics';
import FeaturedCourses from './components/courses/list/FeaturedCourses';
import FeaturedProducts from './components/products/list/FeaturedProducts';
import PopularTopics from './categories/c/components/PopularTopics';

const SeoList = {
  title: 'Boomslag - The Ultimate NFT Marketplace for Courses & Products',
  description:
    'Explore a new world of possibilities with Boomslag, the innovative NFT marketplace that enables you to discover, purchase, and sell a variety of items, ranging from online courses to physical products and beyond, all using the cutting-edge ERC1155 technology.',
  href: '/',
  url: 'https://boomslag.com',
  keywords: 'nft marketplace, matic nfts, boomslag nfts, sell nfts online',
  robots: 'all',
  author: 'BoomSlag',
  publisher: 'BoomSlag',
  image:
    'https://bafybeiaor24mrcurzyzccxl7xw46zdqpor4sfuhddl6tzblujoiukchxnq.ipfs.w3s.link/teach.png',
  video: 'https://boomslagcourses.s3.us-east-2.amazonaws.com/Quack+Sound+Effect.mp4',

  twitterHandle: '@boomslag_',
};

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [products, setProducts] = useState([]);

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
  }, [fetchCourses]);

  const fetchProducts = useCallback(
    async (page, searchBy) => {
      setLoading(true);
      try {
        const res = await FetchProducts(
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
          setProducts(res.data.results);
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
    fetchProducts(currentPage, '');
  }, [fetchProducts, currentPage]);

  // Fetch Categories
  const [categories, setCategories] = useState(null);
  const fetchPopularCategories = useCallback(async () => {
    const res = await FetchPopularCourseCategories();
    if (res && res.status === 200) {
      setCategories(res.data.results);
    }
  }, []);

  useEffect(() => {
    fetchPopularCategories();
  }, [fetchPopularCategories]);
  // Fetch Product Categories
  const [productCategories, setProductCategories] = useState(null);
  const fetchProductCategories = useCallback(async () => {
    const res = await FetchProductPopularCourseCategories();
    if (res && res.status === 200) {
      setProductCategories(res.data.results);
    }
  }, []);

  useEffect(() => {
    fetchProductCategories();
  }, [fetchProductCategories]);

  return (
    <>
      <Head>
        <title>{SeoList.title}</title>
        <meta name="description" content={SeoList.description} />

        <meta name="keywords" content={SeoList.keywords} />
        <link rel="canonical" href={SeoList.href} />
        <meta name="robots" content={SeoList.robots} />
        <meta name="author" content={SeoList.author} />
        <meta name="publisher" content={SeoList.publisher} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        {/* Social Media Tags */}
        <meta property="og:title" content={SeoList.title} />
        <meta property="og:description" content={SeoList.description} />
        <meta property="og:url" content={SeoList.url} />
        <meta property="og:image" content={SeoList.image} />
        <meta property="og:image:width" content="1370" />
        <meta property="og:image:height" content="849" />
        <meta property="og:image:alt" content={SeoList.image} />
        <meta property="og:type" content="website" />

        <meta property="fb:app_id" content="555171873348164" />

        {/* Video meta tags */}
        <meta property="og:video" content={SeoList.video} />
        <meta property="og:video:url" content={SeoList.video} />
        <meta property="og:video:type" content="video/mp4" />
        <meta property="og:video:width" content="1280" />
        <meta property="og:video:height" content="720" />
        <meta property="og:video:secure_url" content={SeoList.video} />

        {/* Twitter meta Tags */}
        <meta name="twitter:title" content={SeoList.title} />
        <meta name="twitter:description" content={SeoList.description} />
        <meta name="twitter:image" content={SeoList.image} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={SeoList.twitterHandle} />
        <meta name="twitter:player:width" content="1280" />
        <meta name="twitter:player:height" content="720" />
        <meta name="twitter:player:stream" content={SeoList.video} />
      </Head>
      <main className="dark:bg-dark-main">
        <div className="text-gray-700 dark:text-dark-txt space-y-6">
          <Header />
          <Badges />
          {/* <CategoryTabs categories={categories} /> */}
          {/* <MostViewed courses={courses} /> */}
          <FeaturedCourses data={courses} />
          <FeaturedProducts data={products} />
          <div className="space-y-24">
            <PopularTopics categories={categories} />
            <PopularProductCategories categories={productCategories} />
          </div>
          <AffiliatesInfo />
          <Teach />
          <TeachCTA />
        </div>
      </main>
    </>
  );
}

Home.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
