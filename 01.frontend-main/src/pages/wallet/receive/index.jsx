import Head from 'next/head';
import jwtDecode from 'jwt-decode';
import cookie from 'cookie';
import Layout from '@/hocs/Layout';
import Walletlayout from '../components/Layout';
import CopyToClipboard from 'react-copy-to-clipboard';
import { ToastSuccess } from '@/components/ToastSuccess';
import { useSelector } from 'react-redux';

const SeoList = {
  title: 'Boomslag - Send ERC20 Tokens | Manage Your ERC20 Funds and Transactions',
  description:
    'Manage your ERC20 funds and transactions on the Boomslag Wallet page. Keep track of your balances, deposit and withdraw funds, and monitor your transaction history with ease.',
  href: '/wallet',
  url: 'https://boomslag.com/wallet',
  keywords: 'wallet, manage erc20 funds, transactions, boomslag, nft marketplace',
  robots: 'all',
  author: 'BoomSlag',
  publisher: 'BoomSlag',
  image:
    'https://bafybeiaor24mrcurzyzccxl7xw46zdqpor4sfuhddl6tzblujoiukchxnq.ipfs.w3s.link/friends.png',
  twitterHandle: '@BoomSlag',
};

export default function Receive() {
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
      <Walletlayout>
        <div className=" flex flex-wrap items-center justify-between sm:flex-nowrap">
          <div className="">
            <p className="text-xl font-bold leading-6 dark:text-dark-txt text-gray-900">
              Receive Tokens
            </p>
            <p className="text-md mt-2 dark:text-dark-txt-secondary text-gray-500">
              Your wallets support ERC20 Tokens, ERC721 NFTs and ERC1155 Assets. They are standard
              web3 wallets created in their respective network.
            </p>
          </div>
        </div>
        <div className="my-4 flex items-center">
          <span className="mr-2 text-lg font-bold dark:text-dark-txt text-gray-900">
            Ethereum Address:
          </span>
          <span className="text-md font-medium dark:text-dark-txt-secondary text-gray-500">
            {wallet && wallet.address}
          </span>
          <CopyToClipboard text={wallet && wallet.address}>
            <button
              type="button"
              onClick={() => {
                ToastSuccess(`Copied Address: ${wallet && wallet.address}`);
              }}
              className="ml-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 dark:text-dark-txt text-gray-500 hover:text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                />
              </svg>
            </button>
          </CopyToClipboard>
        </div>
        <div className="my-4 flex items-center">
          <span className="mr-2 text-lg font-bold dark:text-dark-txt text-gray-900">
            Polygon Address:
          </span>
          <span className="text-md font-medium dark:text-dark-txt-secondary text-gray-500">
            {wallet && wallet.polygon_address}
          </span>
          <CopyToClipboard text={wallet && wallet.polygon_address}>
            <button
              type="button"
              onClick={() => {
                ToastSuccess(`Copied Address: ${wallet && wallet.polygon_address}`);
              }}
              className="ml-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 dark:text-dark-txt text-gray-500 hover:text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                />
              </svg>
            </button>
          </CopyToClipboard>
        </div>
      </Walletlayout>
    </div>
  );
}

Receive.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export async function getServerSideProps(context) {
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

  // Redirect to '/' if the user is not authenticated
  if (!isAuthenticated) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  // If the user is authenticated, return an empty props object
  return {
    props: {},
  };
}
