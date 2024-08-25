import Head from 'next/head';
import jwtDecode from 'jwt-decode';
import cookie from 'cookie';
import { Tab } from '@headlessui/react';
import React, { useEffect, useState, useRef } from 'react';

import { useSelector } from 'react-redux';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

import Layout from '@/hocs/Layout';
import Walletlayout from '../components/Layout';
import SendEthereum from './Components/SendEthereum';
import SendPolygon from '@/components/SendPolygon';

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
    'https://bafybeiaor24mrcurzyzccxl7xw46zdqpor4sfuhddl6tzblujoiukchxnq.ipfs.w3s.link/teach.png',
  video: 'https://boomslagcourses.s3.us-east-2.amazonaws.com/Quack+Sound+Effect.mp4',

  twitterHandle: '@boomslag_',
};

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Send() {
  const wallet = useSelector((state) => state.auth.wallet);
  const user = useSelector((state) => state.auth.user);

  const [txInfo, setTxInfo] = useState(null);

  const webSocketRef = useRef(null);
  const roomName = wallet && wallet.address;
  const [connected, setConnected] = useState(false);
  const [roomGroupName, setRoomGroupName] = useState(user && user.id);

  const userId = user && user.id;
  useEffect(() => {
    let client = null;
    if (userId) {
      const handleOpen = async () => {
        console.log('Connected to Send Tokens Websocket');
        setConnected(true);
      };

      const handleMessage = (event) => {
        const message = JSON.parse(event.data);
        // console.log('Got this message from Channels Chat Room', message);
        switch (message.type) {
          case 'send_message':
            // Update the state with the received transaction info
            setTxInfo(message.message);
            break;
          default:
            console.log('Unhandled message type:', message.type);
        }
      };

      const handleError = (e) => {
        console.error('WebSocket error:', e);
      };

      const handleClose = () => {
        console.log('WebSocket closed');
        setConnected(false);
      };
      const connectWebSocket = () => {
        try {
          const wsProtocol = process.env.NEXT_PUBLIC_APP_ENV === 'production' ? 'wss' : 'ws';
          const path = `${wsProtocol}://${
            process.env.NEXT_PUBLIC_APP_CRYPTO_API_WS
          }/ws/send_tokens/${roomName}/?token=${encodeURIComponent(userId)}`;
          client = new W3CWebSocket(path);
          client.onopen = handleOpen;
          client.onmessage = handleMessage;
          client.onerror = handleError;
          client.onclose = handleClose;
          webSocketRef.current = client;
        } catch (e) {
          handleError(e);
        }
      };

      const disconnectWebSocket = () => {
        if (client && client.readyState === WebSocket.OPEN) {
          client.close();
          setConnected(false);
        }
      };

      if (!client) {
        connectWebSocket();
      }

      return () => {
        disconnectWebSocket();
      };
    }
  }, [roomGroupName, userId, roomName, wallet]);

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
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl  p-1">
            <Tab
              className={({ selected }) =>
                classNames(
                  'w-full py-2.5 text-sm font-medium leading-5',
                  'focus:ring-none ring-white ring-opacity-60 ring-offset-2 ring-offset-gray-400 focus:outline-none',
                  selected
                    ? 'border border-gray-900 bg-white shadow-neubrutalism-sm dark:bg-dark-bg dark:border-dark-border dark:text-dark-txt'
                    : 'text-gray-500 hover:border hover:border-gray-900 hover:bg-gray-200 hover:text-gray-700 hover:shadow-neubrutalism-sm dark:text-dark-txt dark:hover:bg-dark-second dark:hover:border-dark-border dark:hover:text-dark-txt',
                )
              }
            >
              Ethereum Network
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  'w-full py-2.5 text-sm font-medium leading-5',
                  'focus:ring-none ring-white ring-opacity-60 ring-offset-2 ring-offset-gray-400 focus:outline-none',
                  selected
                    ? 'border border-gray-900 bg-white shadow-neubrutalism-sm dark:bg-dark-bg dark:border-dark-border dark:text-dark-txt'
                    : 'text-gray-500 hover:border hover:border-gray-900 hover:bg-gray-200 hover:text-gray-700 hover:shadow-neubrutalism-sm dark:text-dark-txt dark:hover:bg-dark-second dark:hover:border-dark-border dark:hover:text-dark-txt',
                )
              }
            >
              Polygon Network
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-2">
            <Tab.Panel className="p-4">
              <SendEthereum txInfo={txInfo} wallet={wallet} />
            </Tab.Panel>
            <Tab.Panel className="p-4">
              <SendPolygon txInfo={txInfo} wallet={wallet} />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </Walletlayout>
    </div>
  );
}

Send.getLayout = function getLayout(page) {
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
