import Layout from '@/hocs/Layout';
import Head from 'next/head';
import BecomeAffiliate from './components/BecomeAffiliate';
import Features1 from './components/Features1';
import Header from './components/Header';
import RankingSystem from './components/RankingSystem';

const SeoList = {
  title: 'Affiliates Program - Join the Boomslag NFT Marketplace',
  description:
    'Join the Boomslag Affiliates Program and earn rewards for promoting the ultimate NFT marketplace for online courses, physical products, and more. Discover how our revolutionary platform uses ERC1155 to provide a seamless and secure buying and selling experience.',
  href: '/',
  url: 'https://boomslag.com',
  keywords: 'boomslag, boomslag affilaites, affiliate marketing NFT, nft affiliate marketing',
  robots: 'all',
  author: 'BoomSlag',
  publisher: 'BoomSlag',
  image:
    'https://bafybeiaor24mrcurzyzccxl7xw46zdqpor4sfuhddl6tzblujoiukchxnq.ipfs.w3s.link/teach.png',
  twitterHandle: '@BoomSlag',
};

export default function Affiliates() {
  return (
    <div>
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
      <Features1 />
      <RankingSystem />
      <BecomeAffiliate />
    </div>
  );
}

Affiliates.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
