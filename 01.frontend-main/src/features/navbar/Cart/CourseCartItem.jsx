import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  getItems,
  removeCartItem,
  removeCartItemAnonymous,
  removeCartItemAuthenticated,
} from '@/redux/actions/cart/cart';
import LoadingMoon from '@/components/loaders/LoadingMoon';

export default function CourseCartItem({ data }) {
  const [loading, setLoading] = useState(false);
  const [hover, setHover] = useState(false);
  const heartIcon = useRef(null);
  const handleMouseTrashEnter = () => {
    heartIcon.current.classList.remove('bx-trash');
    heartIcon.current.classList.add('bxs-trash');
  };

  const handleMouseTrashLeave = () => {
    heartIcon.current.classList.remove('bxs-trash');
    heartIcon.current.classList.add('bx-trash');
  };

  const handleMouseEnter = () => {
    setHover(true);
  };
  const handleMouseLeave = () => {
    setHover(false);
  };

  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  async function handleRemoveCartItem() {
    setLoading(true);
    if (isAuthenticated) {
      dispatch(removeCartItemAuthenticated(data.course_id, 'Course'));
    } else {
      dispatch(removeCartItemAnonymous(data.course_id, 'Course'));
    }
    // await dispatch(getCartTotal(cartItems));
    setLoading(false);
  }

  const coursePrice =
    data && data.course_compare_price && data.course_discount
      ? data.course_compare_price
      : data.course_price;

  function calculateDiscountPercentage(originalPrice, discountedPrice) {
    if (originalPrice === 0) return 0;
    return parseInt(((originalPrice - discountedPrice) / originalPrice) * 100, 10);
  }

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="flex w-full flex-col justify-center dark:bg-dark-second  bg-white"
    >
      <div className="relative mx-auto flex h-full w-full max-w-xs flex-col border-t-2 border-l-2 border-r-2 dark:border-b-2 dark:border-dark-border border-dark-bg dark:shadow-none shadow-neubrutalism-md transition duration-300  ease-in-out hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neubrutalism-xl md:max-w-full md:flex-row ">
        <Link href={`/courses/${data.course_id}`} className=" flex-shrink-0 sm:mb-0 sm:mr-4">
          <Image src={data.course_image} alt="" className="h-20 w-auto" width={256} height={256} />
        </Link>
        <div className="relative flex w-full flex-col space-y-2 p-2">
          <div className="item-center flex justify-between">
            <Link
              href={`/courses/${data.course_id}`}
              className={`text-left text-md font-bold ${
                hover ? 'text-iris-500 dark:text-dark-primary' : 'dark:text-dark-txt text-gray-800'
              }`}
            >
              {data.course_title}
            </Link>
            <div className="flex items-center">
              <button
                type="button"
                onClick={async () => {
                  handleRemoveCartItem();
                  // close_cart()
                }}
                className="ml-4 flex-shrink-0 "
              >
                {loading ? (
                  <LoadingMoon className="inline-flex" size={20} color="#1e1f48" />
                ) : (
                  <div
                    ref={heartIcon}
                    onMouseEnter={handleMouseTrashEnter}
                    onMouseLeave={handleMouseTrashLeave}
                    className="bx bx-trash inline-flex cursor-pointer text-xl text-pink-500"
                  />
                )}
              </button>
            </div>
          </div>
          <div className="flex">
            {data.coupon && (
              <span className="mr-2 inline-flex items-center rounded-full bg-almond-100 px-2.5 py-0.5 text-xs font-medium text-almond-800">
                {data.coupon.name}
              </span>
            )}
            {data.course_discount && (
              <div className="mx-2 flex-shrink-0">
                {data.course_discount ? (
                  <p className="inline-flex items-center rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-800">
                    {calculateDiscountPercentage(data.course_price, data.course_compare_price)}% Off
                  </p>
                ) : (
                  <div />
                )}
              </div>
            )}
          </div>
          <div className="item-center flex justify-between">
            <p className=" text-md select-none dark:text-dark-txt-secondary text-gray-600">
              {data.course_short_description.length > 46
                ? data.course_short_description.slice(0, 60)
                : data.course_short_description}
            </p>
            <div className="flex items-center">
              {data.coupon ? (
                <>
                  <p className="text-md select-none font-bold dark:text-dark-txt-secondary text-gray-800">
                    $
                    {data.coupon.fixed_price_coupon
                      ? (coursePrice - data.coupon.fixed_price_coupon.discount_price).toFixed(2)
                      : (
                          coursePrice *
                          (1 - data.coupon.percentage_coupon.discount_percentage / 100)
                        ).toFixed(2)}
                  </p>
                  <div />
                </>
              ) : (
                <p className="text-md select-none font-bold dark:text-dark-txt-secondary text-gray-800">
                  ${coursePrice}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
