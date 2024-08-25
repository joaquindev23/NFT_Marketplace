import Head from 'next/head';
import jwtDecode from 'jwt-decode';
import cookie from 'cookie';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ListTokens from '@/api/tokens/List';
import { getTokens, listTokens } from '@/redux/actions/crypto/crypto';
import Layout from '@/hocs/Layout';
import PolygonNetwork from './components/PolygonNetwork';
import EthereumNetwork from './components/EthereumNetwork';
import Heading from './components/Heading';
import Walletlayout from './components/Layout';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';

const SeoList = {
  title: 'Boomslag - Wallet | Manage Your ERC20 Funds and Transactions',
  description:
    'Manage your ERC20 funds and transactions on the Boomslag Wallet page. Keep track of your balances, deposit and withdraw funds, and monitor your transaction history with ease.',
  href: '/wallet',
  url: 'https://boomslag.com/wallet',
  keywords: 'wallet, manage erc20 funds, transactions, boomslag, nft marketplace',
  robots: 'all',
  author: 'BoomSlag',
  publisher: 'BoomSlag',
  image:
    'https://bafybeiaor24mrcurzyzccxl7xw46zdqpor4sfuhddl6tzblujoiukchxnq.ipfs.w3s.link/teach.png',
  video: 'https://boomslagcourses.s3.us-east-2.amazonaws.com/Quack+Sound+Effect.mp4',

  twitterHandle: '@boomslag_',
};

export default function Wallet() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const [searchBy, setSearchBy] = useState('');

  // eslint-disable-next-line
  const [pageSize, setPageSize] = useState(6);
  // eslint-disable-next-line
  const [currentPage, setCurrentPage] = useState(1);
  // eslint-disable-next-line
  const [maxPageSize, setMaxPageSize] = useState(100);
  // eslint-disable-next-line
  const [name, setName] = useState(null);
  // eslint-disable-next-line
  const [symbol, setSymbol] = useState(null);
  // eslint-disable-next-line
  const [address, setAddress] = useState(null);
  // eslint-disable-next-line
  const [decimals, setDecimals] = useState(null);

  const tokens = useSelector((state) => state.crypto.tokens);
  const count = useSelector((state) => state.crypto.count);
  const wallet = useSelector((state) => state.auth.wallet);

  const fetchTokens = useCallback(
    async (page, searchBy) => {
      setLoading(true);
      if (wallet && wallet.address && wallet.address !== undefined) {
        dispatch(
          listTokens(
            page,
            pageSize,
            maxPageSize,
            searchBy,
            name,
            symbol,
            address,
            decimals,
            wallet.address,
          ),
        );
      }

      setLoading(false);
    },
    [pageSize, maxPageSize, name, symbol, address, decimals, wallet, dispatch],
  );

  useEffect(() => {
    fetchTokens(currentPage, '');
  }, [fetchTokens, currentPage]);

  const onSubmit = async (e) => {
    e.preventDefault();
    fetchTokens(currentPage, searchBy);
  };

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
        <Heading fetchTokens={fetchTokens} currentPage={currentPage} />
        <div className="mt-6 space-y-2">
          <div className=" flex gap-x-4">
            <div className="w-full ">
              <form onSubmit={(e) => onSubmit(e)} className=" dark:border-dark-border flex border">
                <div className=" flex flex-grow items-stretch ">
                  <input
                    type="text"
                    value={searchBy}
                    onChange={(e) => {
                      setSearchBy(e.target.value);
                    }}
                    className="relative w-full focus:outline-none focus:ring-none dark:text-dark-txt-secondary dark:placeholder-dark-txt-secondary -ml-px inline-flex items-center space-x-2 border-l dark:border-dark-border dark:ring-dark-border  dark:bg-dark-bg  px-4 py-2 text-sm font-medium text-white"
                    placeholder="Search your tokens"
                  />
                </div>
                <button
                  type="submit"
                  className="relative -ml-px inline-flex items-center space-x-2 border-l dark:border-dark-border bg-black px-4 py-2 text-sm font-medium text-white"
                >
                  <MagnifyingGlassIcon className="h-5 w-5 text-white" aria-hidden="true" />
                </button>
              </form>
            </div>
          </div>
          <EthereumNetwork
            fetchTokens={fetchTokens}
            loading={loading}
            count={count}
            pageSize={pageSize}
          />
          <PolygonNetwork
            fetchTokens={fetchTokens}
            loading={loading}
            count={count}
            pageSize={pageSize}
          />
        </div>
      </Walletlayout>
    </div>
  );
}

Wallet.getLayout = function getLayout(page) {
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
    props: { access: access },
  };
}
