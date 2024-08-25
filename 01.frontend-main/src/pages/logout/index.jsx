import React, { useEffect, useState } from 'react';
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import Layout from '@/hocs/Layout';
import Button from '@/components/Button';

const SeoList = {
  title: 'Boomslag - Come Back Soon!',
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

export default function Logout() {
  useEffect(() => {
    window.scrollTo(0, 0);
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* We've used 3xl here, but feel free to try other max-widths based on your needs */}
        <div className="mx-auto max-w-7xl">
          {/* Content goes here */}
          <div className="py-8">
            <div className="mb-4 rounded-md bg-moss-green-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="dark:text-dark h-5 w-5 mt-0.5" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <p className="dark:text-dark text-sm font-bold">
                    You’ve successfully logged out of Boomslag. Come back soon!
                  </p>
                </div>
              </div>
            </div>

            <main className="lg:relative">
              <div className="mx-auto w-full max-w-7xl pt-16 pb-20 text-center lg:text-left">
                <div className="px-6 sm:px-8 lg:w-1/2 xl:pr-16">
                  <h1 className="flex text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                    <span className="mr-2 inline-flex xl:inline dark:text-dark-txt">Boomslag</span>
                    <span className="inline-flex font-light dark:text-dark-accent text-iris-600 xl:inline">
                      business
                    </span>
                  </h1>
                  <p className="mx-auto mt-3 max-w-md text-lg text-gray-500 sm:text-xl md:mt-5 md:max-w-3xl">
                    Your company can give you access to our top 19,000+ business and tech courses.
                  </p>
                  <div className="mt-10 sm:flex sm:justify-center lg:justify-start">
                    <Link href="/business">
                      <Button className="px-10">Get Started</Button>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="relative h-64 w-full sm:h-72 md:h-96 lg:absolute lg:inset-y-0 lg:right-0 lg:h-full lg:w-1/2">
                <Image
                  className="absolute inset-0 h-full w-full object-cover"
                  src="/assets/img/logout/comeback2.png"
                  alt=""
                  width={512}
                  height={512}
                />
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

Logout.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
