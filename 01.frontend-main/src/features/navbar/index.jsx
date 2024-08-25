import { XMarkIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DesktopNavbar from './Desktop';
import MobileNavbar from './Mobile';
import { getCoursesFromCart, getProductsFromCart } from '@/redux/actions/cart/cart';

export default function Navbar() {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  const courseUUIDs = useMemo(() => {
    const uuids = [];
    if (Array.isArray(cartItems)) {
      cartItems.forEach((item) => {
        if (item.course) {
          uuids.push({
            course: item.course,
            coupon: item.coupon,
          });
        }
      });
    }
    return uuids;
  }, [cartItems]);

  const productUUIDs = useMemo(() => {
    const uuids = [];
    if (Array.isArray(cartItems)) {
      cartItems.forEach((item) => {
        if (item.product) {
          uuids.push({
            product: item.product,
            count: item.count,
            color: item.color,
            size: item.size,
            material: item.material,
            shipping: item.shipping,
            weight: item.weight,
            coupon: item.coupon,
          });
        }
      });
    }
    return uuids;
  }, [cartItems]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchPromises = [];

      // if (productUUIDs.length > 0)
      fetchPromises.push(dispatch(getProductsFromCart(productUUIDs)));

      // if (courseUUIDs.length > 0)
      fetchPromises.push(dispatch(getCoursesFromCart(courseUUIDs)));

      await Promise.all(fetchPromises);
    };

    fetchData();
  }, [dispatch, productUUIDs, courseUUIDs]);

  return (
    <header className="bg-white shadow-navbar border-b w-full z-30 lg:overflow-y-visible dark:border-dark-second dark:bg-dark-main">
      <div className="relative isolate flex items-center gap-x-6 overflow-hidden bg-gray-50 py-2.5 px-6 sm:px-3.5 sm:before:flex-1">
        <svg
          viewBox="0 0 577 310"
          aria-hidden="true"
          className="absolute top-1/2 left-[max(-7rem,calc(50%-52rem))] -z-10 w-[36.0625rem] -translate-y-1/2 transform-gpu blur-2xl"
        >
          <path
            id="558b8b01-4d09-4091-8be3-c5da192b7892"
            fill="url(#4b688345-001e-47fa-aa7a-d561812ecf15)"
            fillOpacity=".3"
            d="m142.787 168.697-75.331 62.132L.016 88.702l142.771 79.995 135.671-111.9c-16.495 64.083-23.088 173.257 82.496 97.291C492.935 59.13 494.936-54.366 549.339 30.385c43.523 67.8 24.892 159.548 10.136 196.946l-128.493-95.28-36.628 177.599-251.567-140.953Z"
          />
          <defs>
            <linearGradient
              id="4b688345-001e-47fa-aa7a-d561812ecf15"
              x1="614.778"
              x2="-42.453"
              y1="26.617"
              y2="96.115"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#00c6ff" />
              <stop offset="0.5" stopColor="#0072ff" />
              <stop offset="1" stopColor="#7a2aff" />
            </linearGradient>
          </defs>
        </svg>
        <svg
          viewBox="0 0 577 310"
          aria-hidden="true"
          className="absolute top-1/2 left-[max(45rem,calc(50%+8rem))] -z-10 w-[36.0625rem] -translate-y-1/2 transform-gpu blur-2xl"
        >
          <use href="#558b8b01-4d09-4091-8be3-c5da192b7892" />
        </svg>
        <p className="text-sm leading-6 text-gray-900">
          <span className="font-bold">Praedium ICO</span> is on April 20 – 27 in Polygon Network.{' '}
          <Link href="/" className="whitespace-nowrap font-semibold">
            Get your PDM Tokens&nbsp;<span aria-hidden="true">&rarr;</span>
          </Link>
        </p>
        <div className="flex flex-1 justify-end">
          <button type="button" className="-m-3 p-3 focus-visible:outline-offset-[-4px]">
            <span className="sr-only">Dismiss</span>
            <XMarkIcon className="h-5 w-5 text-gray-900" aria-hidden="true" />
          </button>
        </div>
      </div>
      <DesktopNavbar />
      <MobileNavbar />
    </header>
  );
}
