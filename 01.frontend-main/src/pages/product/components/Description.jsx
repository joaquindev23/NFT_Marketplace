import React from 'react';
import parse from 'html-react-parser';
import {
  HomeIcon,
  ChevronRightIcon,
  CheckBadgeIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/solid';
import DOMPurify from 'isomorphic-dompurify';
import moment from 'moment';
import { useRouter } from 'next/router';
import Link from 'next/link';
import LoadingMoon from '@/components/loaders/LoadingMoon';

export default function Description({ product, author }) {
  const router = useRouter();
  const description = product && product.details.description;
  const sanitizedDescription = DOMPurify.sanitize(description);
  const parsedDescription = parse(sanitizedDescription);
  return (
    <div>
      {product && (
        <nav className="flex pb-2" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <div>
                <button
                  type="button"
                  onClick={() => {
                    router.push('/store');
                  }}
                  className="text-dark hover:text-gray-700 dark:text-dark-txt"
                >
                  <HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                  <span className="sr-only">Home</span>
                </button>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRightIcon
                  className="h-5 w-5 flex-shrink-0 text-dark dark:text-dark-txt"
                  aria-hidden="true"
                />
                <Link
                  href={`/category/${
                    product && product.details.category && product.details.category.slug
                  }`}
                  className="ml-4 text-sm font-bold text-dark hover:text-gray-700 dark:text-dark-txt"
                >
                  {product &&
                    product.details &&
                    product.details.category &&
                    product.details.category.name}
                </Link>
              </div>
            </li>
          </ol>
        </nav>
      )}

      {product && product.details && product.details.title ? (
        <h1 className="text-xl font-bold text-dark dark:text-white sm:text-2xl sm:tracking-tight lg:text-4xl">
          {product && product.details && product.details.title}
        </h1>
      ) : (
        <div className="max-w-8xl mx-auto mt-4 flex animate-pulse">
          <LoadingMoon />
        </div>
      )}

      <h2 className=" text-md font-regular py-3 text-gray-700 dark:text-dark-txt lg:text-lg">
        {parsedDescription}
      </h2>

      {/* Reviews */}
      <div className=" pb-2">
        {product ? (
          <div className="">
            {
              // eslint-disable-next-line
              product.best_seller ? (
                <span className="bg-green-100 text-green-800 inline-flex items-center justify-center px-3 py-0.5 text-sm font-semibold">
                  Best Seller
                </span>
              ) : (
                <div />
              )
            }
            <span className="mr-2 inline-flex">STARS HERE</span>
            <span className="text-yellow-500 font-regular text-xs md:text-xs">
              ({product.rating_no} ratings){' '}
              <span className="ml-2 text-xs font-medium text-gray-600">
                {product.purchases} Sold
              </span>
            </span>
          </div>
        ) : (
          <div />
        )}
      </div>

      {/* Author */}
      <div className="flex ">
        <div>
          <div className=" text-sm font-medium text-gray-700 dark:text-dark-txt">
            Created by:{' '}
            <span className="dark:text-dark-accent  text-iris-400 font-bold underline">
              <Link href={`/@/${author && author.username}`}>{author && author.username}</Link>
              {author && author.verified ? (
                <CheckBadgeIcon
                  className="dark:text-dark-accent  text-iris-400 ml-1 inline-flex h-4 w-4"
                  aria-hidden="true"
                />
              ) : (
                <div />
              )}
            </span>
          </div>

          <span className="mt-1 block" />

          <p className="mt-2 text-sm font-medium dark:text-dark-txt text-white ">
            Token ID:{' '}
            <span className="font-regular text-xs dark:text-dark-accent  text-iris-400">
              {product && product.details.token_id}
            </span>
          </p>
          <p className="mt-2 text-sm font-medium dark:text-dark-txt text-white ">
            NFT Address:{' '}
            <span className="font-regular text-xs dark:text-dark-accent  text-iris-400">
              <Link
                target="_blank"
                rel="noreferrer"
                href={`https://mumbai.polygonscan.com/address/${
                  product && product.details.nft_address
                }`}
              >
                {product && product.details.nft_address}
              </Link>
            </span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 mt-2">
        <div>
          <InformationCircleIcon className="mr-2 inline-flex h-5 w-5 text-gray-400 dark:text-dark-txt " />
          <span className="text-xs font-medium text-gray-400 dark:text-dark-txt sm:text-sm">
            <span>Updated </span>
            {moment(product && product.details.updated).format('MMMM / YYYY')}
          </span>
        </div>
        {/* <div><GlobeAltIcon className="h-5 w-5 dark:text-dark-txt text-gray-200 inline-flex mr-2"/>
                        <span className="dark:text-dark-txt sm:text-sm text-xs text-gray-200 font-regular">
                        {
                        details.language
                        }
                        </span>
                    </div> */}
      </div>
    </div>
  );
}
