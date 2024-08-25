import LoadingBar from '@/components/loaders/LoadingBar';
import Head from 'next/head';
import { useSelector } from 'react-redux';
import Layout from '../components/Layout';

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

export default function SellerDashboard() {
  const wallet = useSelector((state) => state.auth.wallet);

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
      <dl className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="px-4 py-5 bg-white dark:bg-dark-third dark:text-dark-txt shadow-neubrutalism-md border-2 border-gray-900 rounded-lg overflow-hidden sm:p-6">
          <dt className="text-sm font-medium text-gray-500 tr dark:text-dark-txt truncate">
            Earnings
          </dt>
          <dd className="mt-1 text-xl font-semibold text-gray-900 dark:text-dark-txt">
            MATIC{' '}
            {wallet && wallet.total_earnings && wallet.total_earnings === 0 ? (
              <>0</>
            ) : (
              <>{wallet && wallet.total_earnings}</>
            )}
          </dd>
        </div>
        <div className="px-4 py-5 bg-white dark:bg-dark-third dark:text-dark-txt shadow-neubrutalism-md border-2 border-gray-900 rounded-lg overflow-hidden sm:p-6">
          <dt className="text-sm font-medium text-gray-500 tr dark:text-dark-txt truncate">
            Course Sales
          </dt>
          <dd className="mt-1 text-xl font-semibold text-gray-900 dark:text-dark-txt">
            {wallet && wallet.course_sales == 0 ? (
              <>0</>
            ) : wallet && wallet.course_sales ? (
              <>{Math.round(wallet.course_sales)}</>
            ) : (
              <LoadingBar />
            )}
          </dd>
        </div>
        <div className="px-4 py-5 bg-white dark:bg-dark-third dark:text-dark-txt shadow-neubrutalism-md border-2 border-gray-900 rounded-lg overflow-hidden sm:p-6">
          <dt className="text-sm font-medium text-gray-500 tr dark:text-dark-txt truncate">
            Product Sales
          </dt>
          <dd className="mt-1 text-xl font-semibold text-gray-900 dark:text-dark-txt">
            {wallet && wallet.product_sales == 0 ? (
              <>0</>
            ) : wallet && wallet.product_sales ? (
              <>{Math.round(wallet.product_sales)}</>
            ) : (
              <LoadingBar />
            )}
          </dd>
        </div>
      </dl>
    </div>
  );
}

SellerDashboard.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
