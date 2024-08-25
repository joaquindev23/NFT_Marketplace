import Head from 'next/head';
import cookie from 'cookie';
import jwtDecode from 'jwt-decode';

import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import StartConversation from '@/api/chat/StartConversation';
import { resetComposeNewInbox, resetIsInVideoCall, resetVideoSrc } from '@/redux/actions/chat/chat';

import Layout from '@/hocs/Layout';
import InboxLayout from '@/hocs/InboxLayout';
import ChatInbox from './components/chat/ChatInbox';
import InboxesSec from './components/InboxesSec';

const SeoList = {
  title: 'Your Inbox - Buy and Sell NFTs on Our Revolutionary Platform',
  description:
    'Discover the ultimate NFT marketplace on Boomslag, where you can buy, sell, and trade your favorite digital assets. Our revolutionary platform combines the best of Opensea, Rarible, and SuperRare, using ERC1155 to provide a seamless and secure experience for buyers and sellers alike.',
  href: '/',
  url: 'https://boomslag.com',
  keywords: 'trade nfts, boomslag trade nft, boomslag marketplace',
  robots: 'all',
  author: 'BoomSlag',
  publisher: 'BoomSlag',
  image:
    'https://bafybeiaor24mrcurzyzccxl7xw46zdqpor4sfuhddl6tzblujoiukchxnq.ipfs.w3s.link/friends.png',
  twitterHandle: '@boomslag_',
};

export default function Inbox() {
  const profile = useSelector((state) => state.auth.profile);
  const user = useSelector((state) => state.auth.user);
  const friendList = useSelector((state) => state.friends.friends);
  const messagesState = useSelector((state) => state.messages);

  const instructorContacts = useSelector((state) => state.auth.instructorContacts.contacts);
  const sellerContacts = useSelector((state) => state.auth.sellerContacts.contacts);
  console.log('Instructor Contacts', instructorContacts);
  const compose = useSelector((state) => state.chat.compose_new_inbox);
  const select = useSelector((state) => state.chat.select);

  const dispatch = useDispatch();
  const [chat, setChat] = useState(null);

  const [inboxes, setInboxes] = useState([]);

  useEffect(() => {
    setInboxes(messagesState && messagesState.inboxes);
  }, [messagesState]);

  const handleStartConversation = async (friendId, friendUsername) => {
    try {
      const res = await StartConversation(user.username, friendId, friendUsername);
      if (res.status === 201) {
        setChat(res.data.results);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    // Any other code to run when the component mounts
    dispatch(resetVideoSrc());
    dispatch(resetIsInVideoCall());
    return () => {
      dispatch(resetIsInVideoCall());
      dispatch(resetVideoSrc());
    };
  }, []);

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
      <InboxLayout>
        {/* CHAT column */}
        <section
          aria-labelledby="primary-heading"
          className="flex h-full min-w-0 flex-1 flex-col overflow-y-auto bg-white lg:order-last"
        >
          {chat && <ChatInbox profile={profile} user={user} chat={chat} />}
        </section>

        {/* Secondary column (hidden on smaller screens) */}
        <aside className="hidden lg:order-first lg:block lg:flex-shrink-0">
          <div className="relative flex h-full w-96 flex-col overflow-y-auto border-r border-gray-200 bg-gray-100">
            {/* Your content */}
            {!compose ? (
              <InboxesSec chat={chat} setChat={setChat} user={user && user} inboxes={inboxes} />
            ) : (
              <>
                {/* Select From Friend or Instructor Who to COMPOSE to */}
                {select === 'friends' && (
                  <>
                    {/* Compose to FRIENDS list of Inboxes */}
                    <div className="flex flex-wrap items-center justify-between py-2 sm:flex-nowrap">
                      <div className="ml-4 mt-2">
                        <p className="text-lg font-semibold leading-6 text-gray-900">
                          Choose from friends
                        </p>
                      </div>
                    </div>
                    {/* Friends List here */}
                    <ul className="">
                      {friendList.map((friend) => (
                        <button
                          type="button"
                          key={friend.id}
                          onClick={() => {
                            handleStartConversation(friend.id, friend.username);
                            dispatch(resetComposeNewInbox());
                          }}
                          className="flex w-full cursor-pointer bg-gray-100 py-4 px-3 hover:bg-white"
                        >
                          <img className="h-10 w-10 rounded-full" src={friend.picture} alt="" />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{friend.username}</p>
                            {/* <p className="text-sm text-gray-500">Some description</p> */}
                          </div>
                        </button>
                      ))}
                    </ul>
                  </>
                )}

                {select === 'instructors' && (
                  <>
                    {/* Compose to FRIENDS list of Inboxes */}
                    <div className="flex flex-wrap items-center justify-between py-2 sm:flex-nowrap">
                      <div className="ml-4 mt-2">
                        <p className="text-lg font-semibold leading-6 text-gray-900">
                          Choose from instructors
                        </p>
                      </div>
                    </div>
                    {/* Friends List here */}
                    <ul className="">
                      {instructorContacts.map((contact) => (
                        <button
                          type="button"
                          key={contact.contact.id}
                          onClick={() => {
                            handleStartConversation(contact.contact.id, contact.contact.username);
                            dispatch(resetComposeNewInbox());
                          }}
                          className="flex cursor-pointer w-full bg-gray-100 py-4 px-3 hover:bg-white"
                        >
                          {/* <img className="h-10 w-10 rounded-full" src={person.image} alt="" /> */}
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              {contact.contact.username}
                            </p>
                            {/* <p className="text-sm text-gray-500">{inbox.room_name}</p> */}
                          </div>
                        </button>
                      ))}
                    </ul>
                  </>
                )}

                {select === 'sellers' && (
                  <>
                    {/* Compose to FRIENDS list of Inboxes */}
                    <div className="flex flex-wrap items-center justify-between py-2 sm:flex-nowrap">
                      <div className="ml-4 mt-2">
                        <p className="text-lg font-semibold leading-6 text-gray-900">
                          Choose from sellers
                        </p>
                      </div>
                    </div>
                    {/* Friends List here */}
                    <ul className="">
                      {sellerContacts.map((contact) => (
                        <button
                          type="button"
                          onClick={() => {
                            handleStartConversation(contact.contact.id, contact.contact.username);
                            dispatch(resetComposeNewInbox());
                          }}
                          key={contact.contact.id}
                          className="flex cursor-pointer w-full bg-gray-100 py-4 px-3 hover:bg-white"
                        >
                          {/* <img className="h-10 w-10 rounded-full" src={person.image} alt="" /> */}
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              {contact.contact.username}
                            </p>
                            {/* <p className="text-sm text-gray-500">{inbox.room_name}</p> */}
                          </div>
                        </button>
                      ))}
                    </ul>
                  </>
                )}
              </>
            )}
          </div>
        </aside>
      </InboxLayout>
    </div>
  );
}

Inbox.getLayout = function getLayout(page) {
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
