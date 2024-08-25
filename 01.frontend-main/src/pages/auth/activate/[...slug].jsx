import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/router';
import CircleLoader from 'react-spinners/CircleLoader';
import Head from 'next/head';
import Layout from '@/hocs/Layout';
import { activate, resetRegisterSuccess } from '../../../redux/actions/auth/auth';

const faqs = [
  {
    question: 'Your Ethereum Wallet',
    answer:
      'With boomslag you get an integrated ERC20 Ethereum wallet, this allows for you to interact with any token compliant with this standard within our available blockchains.',
  },
  {
    question: 'How we handle transactions',
    answer:
      'Everything is handled through our backend server, providing the safest possible communication between the app and the blockchain.',
  },
  {
    question: 'What services are offered',
    answer:
      'This is a social ecommerce experience that allows for sellers and buyers to interact with their products. We have different blockchain services like staking and crowdfunding. We allow for the mix of physical products and crowdfunding project to be created aroung them. All this and much more',
  },
  {
    question: 'Sending and reciving ETH or other currencies',
    answer:
      'Your wallet has the capabilities to send ethereum and receive it. For other currencies, you can recive them as long as they comply with the ERC 20 token standard and it is available within the same blockchain. To interact with it we might have to add the cryptocurrency to our system.',
  },
  {
    question: 'Can i have my currency listed in boomslag',
    answer:
      'Contact support and we will have a meeting to see the possibilities of adding your project.',
  },
  // More questions...
];
const faqsSellers = [
  {
    question: 'Sellers and Buyers',
    answer:
      'Buy and sell Online courses with the complete college experience, sell physical products, video games, music.',
  },
  {
    question: 'Subscriptions',
    answer:
      'Creators can make subscriptions and attach them to their available products, susbcribers may access this content on a monthly basis.',
  },
  // More questions...
];

const SeoList = {
  title: 'Boomslag - Activate Account',
  description:
    'Explore a new world of possibilities with Boomslag, the innovative NFT marketplace that enables you to discover, purchase, and sell a variety of items, ranging from online courses to physical products and beyond, all using the cutting-edge ERC1155 technology.',
  href: '/',
  url: 'https://boomslag.com',
  keywords: 'nft marketplace, matic nfts, boomslag nfts, sell nfts online',
  robots: 'all',
  author: 'BoomSlag',
  publisher: 'BoomSlag',
  image:
    'https://bafybeiaor24mrcurzyzccxl7xw46zdqpor4sfuhddl6tzblujoiukchxnq.ipfs.w3s.link/teach.png',
  twitterHandle: '@BoomSlag',
};

export default function Activation() {
  const dispatch = useDispatch();

  const router = useRouter();
  const filterData = router.query.slug;

  const [effectRegister, setEffectRegister] = useState(false);
  const [activated, setActivated] = useState(false);
  const loading = useSelector((state) => state.auth.loading);

  useEffect(() => {
    dispatch(resetRegisterSuccess());
  }, [dispatch]);

  const activateAccount = () => {
    const uid = filterData[0];
    const token = filterData[1];

    dispatch(activate(uid, token));
    setActivated(true);

    // toast.success("Activation successful, you may now login and start learning.")
  };

  if (activated && !loading) router.push('/auth/login');

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
      <div className="mx-auto  px-4 dark:bg-dark-bg sm:px-6 lg:px-8">
        {/* We've used 3xl here, but feel free to try other max-widths based on your needs */}
        <div className="mx-auto ">
          {/* Content goes here */}

          <div className="  px-4 py-8 sm:px-6">
            <div className="-ml-4 -mt-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
              <div className="ml-4 mt-4">
                <h3 className="font-recife-bold text-3xl leading-6 text-gray-900 dark:text-dark-txt">
                  Welcome to Boomslag
                </h3>
                <p className="font-regular mt-2 max-w-4xl text-lg text-gray-900 dark:text-dark-txt-secondary">
                  Before you get started please follow this guide.
                </p>
              </div>
              <div className="ml-4 mt-4 flex-shrink-0">
                {loading ? (
                  <div className="text-md relative inline-flex items-center border border-transparent bg-palm-leaf-500 px-4 py-2 font-bold text-white shadow-sm hover:bg-palm-leaf-600 focus:outline-none focus:ring-2 focus:ring-palm-leaf-400 focus:ring-offset-2">
                    <CircleLoader loading={loading} size={25} color="#ffffff" />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={activateAccount}
                    onMouseDown={() => {
                      setEffectRegister(true);
                    }}
                    onMouseUp={() => setEffectRegister(false)}
                    className={`${
                      effectRegister &&
                      'duration-400 animate-click hover:translate-x-0.5  hover:translate-y-0.5 hover:shadow-neubrutalism-sm'
                    }
                    text-md 
                    relative
                    inline-flex
                    w-full 
                    items-center
                   justify-center 
                    border 
                    border-dark-bg border-transparent
                    bg-palm-leaf-500  px-4  py-2  text-sm
                    font-bold
                    text-white shadow-neubrutalism-md   transition duration-300 ease-in-out hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-palm-leaf-600  hover:shadow-neubrutalism-lg focus:outline-none focus:ring-2 focus:ring-palm-leaf-400 focus:ring-offset-2`}
                  >
                    Activate account
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="">
            <div className="mx-auto max-w-7xl py-16 px-4 sm:px-6 lg:py-10 lg:px-8">
              <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                <div>
                  <h2 className="text-3xl font-black tracking-tight text-gray-900 dark:text-dark-txt">
                    Your ERC20 Wallet
                  </h2>
                  <p className="font-regular mt-4 text-lg text-gray-900 dark:text-dark-txt-secondary">
                    Want to know more about how this wallet works? Read our
                    <Link
                      href="/blog"
                      className="text-indigo-600 mx-2 hover:text-indigo-500 font-medium"
                    >
                      blog post
                    </Link>
                    about how we handle ERC20 transactions.
                  </p>
                </div>
                <div className="mt-12 lg:col-span-2 lg:mt-0">
                  <dl className="space-y-12">
                    {faqs.map((faq) => (
                      <div key={faq.question}>
                        <dt className="text-lg font-bold leading-6 text-gray-900 dark:text-dark-txt">
                          {faq.question}
                        </dt>
                        <dd className="text-md font-regular mt-2 text-gray-900 dark:text-dark-txt-secondary">
                          {faq.answer}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="">
            <div className="mx-auto max-w-7xl py-16 px-4 sm:px-6 lg:py-10 lg:px-8">
              <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                <div>
                  <h2 className="text-xl font-black tracking-tight text-gray-900 dark:text-dark-txt md:text-4xl">
                    Marketplace
                  </h2>
                  <p className="font-regular mt-4 text-lg text-gray-900 dark:text-dark-txt">
                    Want to know more about how to make money with boomslag? Read our
                    <Link
                      href="/"
                      className="text-indigo-600 ml-2 hover:text-indigo-500 font-medium"
                    >
                      blog post
                    </Link>
                    .
                  </p>
                </div>
                <div className="mt-12 lg:col-span-2 lg:mt-0">
                  <dl className="space-y-12">
                    {faqsSellers.map((faq) => (
                      <div key={faq.question}>
                        <dt className="text-lg font-bold leading-6 text-gray-900 dark:text-dark-txt">
                          {faq.question}
                        </dt>
                        <dd className="text-md font-regular mt-2 text-gray-900 dark:text-dark-txt">
                          {faq.answer}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

Activation.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
