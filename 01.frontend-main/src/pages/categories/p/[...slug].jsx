import Head from 'next/head';
import axios from 'axios';
import Layout from '@/hocs/Layout';
import PopularTabs from './components/PopularTabs';
import PopularTopics from './components/PopularTopics';
import PopularInstructors from './components/PopularInstructors';
import FeaturedProducts from '@/pages/components/products/list/FeaturedProducts';
import SearchProducts from './components/SearchProducts';

export default function Categories({
  slug,
  categories,
  instructors,
  mostViewedProducts,
  newestProducts,
  mostSoldProducts,
}) {
  const SeoList = {
    title: `Category - ${slug[0]} - Explore Premium Online Courses`,
    description:
      'Find and buy high-quality online courses at Boomslag, a cutting-edge marketplace where you can acquire knowledge through secure and seamless transactions using NFTs and ERC1155 tokens.',
    href: '/',
    url: 'https://boomslag.com',
    keywords:
      'online courses, online education, e-learning, nft courses marketplace, nft education, erc1155 tokens, blockchain education',
    robots: 'all',
    author: 'BoomSlag',
    publisher: 'BoomSlag',
    image:
      'https://bafybeiaor24mrcurzyzccxl7xw46zdqpor4sfuhddl6tzblujoiukchxnq.ipfs.w3s.link/teach.png',
    video: 'https://boomslagcourses.s3.us-east-2.amazonaws.com/Quack+Sound+Effect.mp4',

    twitterHandle: '@boomslag_',
  };

  const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

  const capitalizedSlug = capitalizeFirstLetter(slug[0]);

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
      <div className="p-8">
        <div className="my-6 mb-14">
          <h3 className="text-3xl font-bold leading-6 dark:text-dark-txt text-gray-900">
            {capitalizedSlug} Products
          </h3>
        </div>
        <div className="space-y-4">
          <PopularTabs
            productsBySold={mostSoldProducts}
            products={newestProducts}
            productsByViews={mostViewedProducts}
          />
          <FeaturedProducts data={newestProducts} />
          <PopularTopics categories={categories} />
          <PopularInstructors instructors={instructors} />
          <SearchProducts categories={categories} />
        </div>
      </div>
    </div>
  );
}

Categories.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export async function getServerSideProps(context) {
  const { slug } = context.query;

  // Check if username is defined
  if (!slug || slug.length === 0) {
    return {
      notFound: true,
    };
  }

  const categoriesRes = await axios.get(
    `${process.env.NEXT_PUBLIC_APP_PRODUCTS_URL}/api/category/popular/`,
  );

  const instructorsRes = await axios.get(
    `${process.env.NEXT_PUBLIC_APP_API_URL}/api/users/instructors/best_selling/`,
  );
  const mostViewedRes = await axios.get(
    `${
      process.env.NEXT_PUBLIC_APP_PRODUCTS_URL
    }/api/products/search/?p=${1}&page_size=${12}&max_page_size=${100}&filter=${'views'}&category=${slug}`,
  );
  const newestRes = await axios.get(
    `${
      process.env.NEXT_PUBLIC_APP_PRODUCTS_URL
    }/api/products/search/?p=${1}&page_size=${12}&max_page_size=${100}&category=${slug}`,
  );
  const mostSoldRes = await axios.get(
    `${
      process.env.NEXT_PUBLIC_APP_PRODUCTS_URL
    }/api/products/search/?p=${1}&page_size=${12}&max_page_size=${100}&filter=${'sold'}&category=${slug}`,
  );

  return {
    props: {
      slug: slug,
      categories: categoriesRes.data.results,
      instructors: instructorsRes.data.results,
      mostViewedProducts: mostViewedRes.data.results,
      newestProducts: newestRes.data.results,
      mostSoldProducts: mostSoldRes.data.results,
    },
  };
}
