import Head from 'next/head';
import Layout from '@/hocs/Layout';
import CoinMarketCap from './components/CoinMarketCap';
import CompanyStatement from './components/CompanyStatement';
import EmailNotifications from './components/EmailNotifications';
import Header from './components/Header';
import LatestNews from './components/LatestNews';
import Stats from './components/Stats';

const SeoList = {
  title: 'Investors - Boomslag NFT Marketplace',
  description:
    'Learn about investing in Boomslag, the ultimate NFT marketplace for online courses, physical products, and more. Discover how our revolutionary platform uses ERC1155 to provide a seamless and secure buying and selling experience and how you can be part of the growth of the next big thing in the blockchain space.',
  href: '/',
  url: 'https://boomslag.com',
  keywords: 'invest in pdm, praedium ico, boomslag praedium ico, boomslag investors',
  robots: 'all',
  author: 'BoomSlag',
  publisher: 'BoomSlag',
  image:
    'https://bafybeiaor24mrcurzyzccxl7xw46zdqpor4sfuhddl6tzblujoiukchxnq.ipfs.w3s.link/teach.png',
  twitterHandle: '@BoomSlag',
};

export default function Investors() {
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
      <Header />
      <CoinMarketCap />
      <CompanyStatement />
      <Stats />
      <LatestNews />
    </div>
  );
}

Investors.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
