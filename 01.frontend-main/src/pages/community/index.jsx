import GetStarted from './components/GetStarted';
import Header from './components/Header';
import Head from 'next/head';
import Layout from '@/hocs/Layout';

const SeoList = {
  title: 'Community - Connect and Discuss the Future of NFTs',
  description:
    'Connect with other enthusiasts, creators, and sellers of NFTs. Share your thoughts, insights, and ideas on the future of digital ownership and the potential of ERC1155 technology.',
  href: '/',
  url: 'https://boomslag.com',
  keywords: 'nft community, boomslag community, boomslag, sell nfts',
  robots: 'all',
  author: 'BoomSlag',
  publisher: 'BoomSlag',
  image:
    'https://bafybeiaor24mrcurzyzccxl7xw46zdqpor4sfuhddl6tzblujoiukchxnq.ipfs.w3s.link/teach.png',
  twitterHandle: '@BoomSlag',
};

export default function Community() {
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
      <main className="dark:bg-dark-bg">
        <Header />
        <GetStarted />
      </main>
    </>
  );
}

Community.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
