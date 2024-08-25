import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getCoursesFromCart, getProductsFromCart } from '@/redux/actions/cart/cart';
import Link from 'next/link';
import { useRouter } from 'next/router';
import LogoImg from '@/components/LogoImg';

export default function DesktopNavbar() {
  const router = useRouter();

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const courseUUIDs = useMemo(() => {
    const uuids = [];
    cartItems.forEach((item) => {
      if (item.course) {
        uuids.push({
          course: item.course,
          coupon: item.coupon,
        });
      }
    });
    return uuids;
  }, [cartItems]);

  const productUUIDs = useMemo(() => {
    const uuids = [];
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
    return uuids;
  }, [cartItems]);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        dispatch(getProductsFromCart(productUUIDs)),
        dispatch(getCoursesFromCart(courseUUIDs)),
      ]);
    };
    fetchData();
  }, [dispatch, productUUIDs, courseUUIDs]);

  return (
    <header className="hidden dark:border-dark-second dark:bg-dark-main md:block md:static md:overflow-y-visible border-b-2 border-gray-900 max-w-full mx-auto py-3 px-4 sm:px-6 md:px-8">
      <div className="relative w-full flex justify-between md:gap-8">
        <div className="flex sm:absolute md:inset-y-0 md:left-0 md:static">
          <div className="flex items-center">
            <Link href="/">
              <LogoImg />
            </Link>
          </div>
        </div>
        <div className="min-w-0 flex-1 sm:px-8 md:px-0 flex items-center w-full py-3 md:mx-auto md:max-w-full lg:mx-0 lg:max-w-none">
          <div />
        </div>
        <div className="flex items-center justify-end space-x-4">
          <div className="hidden lg:inline-flex items-center text-sm dark:text-dark-txt text-gray-900 hover:text-iris-600">
            <button
              type="button"
              onClick={() => {
                router.back();
              }}
              className="font-bold dark:text-dark-accent dark:hover:text-dark-primary text-iris-500"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
