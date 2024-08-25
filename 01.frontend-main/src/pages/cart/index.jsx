import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Head from 'next/head';
import Link from 'next/link';

import CartItem from '@/features/navbar/Cart/CartItem';
import CourseCartItem from '@/features/navbar/Cart/CourseCartItem';

import Layout from '@/hocs/Layout';
import Button from '@/components/Button';

const SeoList = {
  title: 'Your Cart - Boomslag NFT Marketplace',
  description:
    'Find exciting career opportunities at Boomslag, the ultimate NFT marketplace for online courses, physical products, and more. We are looking for talented individuals to help us shape the future of e-commerce with the power of blockchain technology.',
  href: '/',
  url: 'https://boomslag.com',
  keywords: 'boomslag, boomslag affiliates, affiliate marketing NFT, nft affiliate marketing',
  robots: 'all',
  author: 'BoomSlag',
  publisher: 'BoomSlag',
  image:
    'https://bafybeiaor24mrcurzyzccxl7xw46zdqpor4sfuhddl6tzblujoiukchxnq.ipfs.w3s.link/teach.png',
  video: 'https://boomslagcourses.s3.us-east-2.amazonaws.com/Quack+Sound+Effect.mp4',

  twitterHandle: '@boomslag_',
};

export default function Cart() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const cartItems = useSelector((state) => state.cart.items);
  const finalPrice = useSelector((state) => state.cart.finalPrice);
  const courses = useSelector((state) => state.cart.courses);
  const products = useSelector((state) => state.cart.products);
  const amountBeforeDiscounts = useSelector((state) => state.cart.amount);
  const totalAmount = useSelector((state) => state.cart.compare_amount);
  // const totalAmountEth = useSelector((state) => state.cart.total_cost_ethereum);
  const maticCost = useSelector((state) => state.cart.maticCost);
  const taxEstimate = useSelector((state) => state.cart.tax_estimate);
  const shippingEstimate = useSelector((state) => state.cart.shipping_estimate);

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
      <div className=" mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:max-w-7xl lg:px-8">
        <p className=" text-3xl font-bold tracking-tight dark:text-dark-txt text-gray-900 sm:text-4xl">
          Shopping Cart
        </p>
        <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>

            <ul className="space-y-2   ">
              {courses &&
                courses.length > 0 &&
                courses.map((course) => (
                  <CourseCartItem key={course.course_slug} data={course} cartItems={cartItems} />
                ))}
              {products &&
                products.length > 0 &&
                products.map((product) => (
                  <CartItem key={product.product_slug} data={product} cartItems={cartItems} />
                ))}
            </ul>
          </section>

          {/* Order summary */}
          <section
            aria-labelledby="summary-heading"
            className="mt-16 rounded-lg px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
          >
            <p
              id="summary-heading"
              className="text-2xl font-medium dark:text-dark-txt text-gray-900"
            >
              Order summary
            </p>

            <dl className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm dark:text-dark-txt-secondary text-gray-600">Total</dt>
                <dd className="text-sm font-medium dark:text-dark-txt text-gray-900">
                  ${amountBeforeDiscounts}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm dark:text-dark-txt-secondary text-gray-600">SubTotal</dt>
                <dd className="text-sm font-medium dark:text-dark-txt text-gray-900">
                  ${totalAmount}
                </dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 dark:border-dark-border pt-4">
                <dt className="flex items-center text-sm dark:text-dark-txt-secondary text-gray-600">
                  <span>Shipping estimate</span>
                </dt>
                <dd className="text-sm font-medium dark:text-dark-txt text-gray-900">
                  ${shippingEstimate}
                </dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 dark:border-dark-border pt-4">
                <dt className="flex text-sm dark:text-dark-txt-secondary text-gray-600">
                  <span>Tax estimate</span>
                </dt>
                <dd className="text-sm font-medium dark:text-dark-txt text-gray-900">
                  ${taxEstimate}
                </dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 dark:border-dark-border pt-4">
                <dt className="text-base font-medium dark:text-dark-txt text-gray-900">
                  Order total
                </dt>
                <dd className="text-base font-medium dark:text-dark-txt text-gray-900">
                  ${finalPrice}
                </dd>
              </div>
              {/* <div className="flex items-center justify-between border-t border-gray-200 dark:border-dark-border pt-4">
                                <dt className="text-base font-medium text-gray-900" />
                                <dd className="text-base font-medium text-gray-900">
                                  ETH {totalAmountEth}
                                </dd>
                              </div> */}
              <div className="flex items-center justify-between border-t border-gray-200 dark:border-dark-border pt-4">
                <dt className="text-base font-medium dark:text-dark-txt text-gray-900" />
                <dd className="text-base font-medium dark:text-dark-txt text-gray-900">
                  MATIC {maticCost}
                </dd>
              </div>
            </dl>

            <div className="mt-4">
              {cartItems && cartItems.length > 0 ? (
                <Link href="/checkout">
                  <Button type="button">Checkout</Button>
                </Link>
              ) : (
                <Button disabled type="button">
                  Checkout
                </Button>
              )}
            </div>
          </section>
        </form>
      </div>
    </div>
  );
}

Cart.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
