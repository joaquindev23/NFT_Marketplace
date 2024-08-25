import Head from 'next/head';
import FriendsLayout from '@/hocs/FriendsLayout';
import FriendsSec from './components/FriendsSec';
import Layout from '@/hocs/Layout';
import { useSelector } from 'react-redux';

const SeoList = {
  title: 'Manage Friends - Boomslag',
  description:
    'Easily manage your friends and connections on Boomslag. Connect with other users in the NFT community.',
  href: '/friends',
  url: 'https://boomslag.com/friends',
  keywords: 'boomslag friends, nft friends, manage friends',
  robots: 'all',
  author: 'BoomSlag',
  publisher: 'BoomSlag',
  image:
    'https://bafybeiaor24mrcurzyzccxl7xw46zdqpor4sfuhddl6tzblujoiukchxnq.ipfs.w3s.link/friends.png',
  twitterHandle: '@BoomSlag',
};

export default function Friends() {
  const friendList = useSelector((state) => state.friends.friends);
  return (
    <FriendsLayout>
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
      <FriendsSec friendList={friendList} />
    </FriendsLayout>
  );
}

Friends.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
