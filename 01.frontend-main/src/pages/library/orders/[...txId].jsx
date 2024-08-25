import Head from 'next/head';
import axios from 'axios';
import cookie from 'cookie';
import Layout from '@/hocs/Layout';
import jwtDecode from 'jwt-decode';
import OrderContentSec from './components/OrderContentSec';

const SeoList = {
  title: 'Your Order - Boomslag NFT Marketplace',
  description:
    'Access the Boomslag press kit for information about the company, the team, our mission, and our revolutionary NFT marketplace platform. Download our logos, brand guidelines, and other assets for use in articles, features, and other media.',
  href: '/',
  url: 'https://boomslag.com',
  keywords: 'boomslag press kit',
  robots: 'all',
  author: 'BoomSlag',
  publisher: 'BoomSlag',
  image:
    'https://bafybeiaor24mrcurzyzccxl7xw46zdqpor4sfuhddl6tzblujoiukchxnq.ipfs.w3s.link/teach.png',
  twitterHandle: '@BoomSlag',
};

export default function OrderDetails({ txId, order, orderItems }) {
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
      <div className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          {/* We've used 3xl here, but feel free to try other max-widths based on your needs */}
          <div className="mx-auto max-w-4xl">
            <div className="">
              <h2 className="sr-only">Products purchased</h2>
              <OrderContentSec order={order} orderItems={orderItems} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

OrderDetails.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
export async function getServerSideProps(context) {
  const { txId } = context.query;

  const cookies = cookie.parse(context.req.headers.cookie || '');
  // Read the JWT token from the cookie
  const { access } = cookies;

  // Check if the user is authenticated
  let isAuthenticated = false;
  try {
    jwtDecode(access);
    isAuthenticated = true;
  } catch (err) {
    isAuthenticated = false;
  }

  // Check if username is defined
  if (!txId || txId.length === 0 || !isAuthenticated) {
    return {
      redirect: {
        destination: isAuthenticated ? '/library/orders' : '/',
        permanent: false,
      },
    };
  }

  try {
    const orderRes = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_ORDERS_URL}/api/orders/get/${txId}/`,
      { headers: { Authorization: `JWT ${access}` } },
    );

    return {
      props: {
        txId: txId,
        order: orderRes.data.results.order,
        orderItems: orderRes.data.results.order_items,
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: '/library/orders',
        permanent: false,
      },
    };
  }
}
