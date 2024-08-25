import { StarIcon } from '@heroicons/react/20/solid';
import React, { useState } from 'react';
import Link from 'next/link';
import UpdateProductClicks from '@/api/products/UpdateClicks';
import Image from 'next/image';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function ProductCardHorizontal({ data }) {
  let {
    id,
    slug,
    images,
    title,
    category,
    rating,
    rating_no,
    short_description,
    discount,
    price,
    compare_price,
    shipping,
    best_seller,
  } = data && data;

  const [hover, setHover] = useState(false);

  const handleMouseEnter = () => {
    setHover(true);
  };
  const handleMouseLeave = () => {
    setHover(false);
  };

  const handleUpdateClicks = () => {
    UpdateProductClicks(data && data.id);
  };

  const current = new Date();
  const deliveryDays = new Date(current.setDate(current.getDate() + Number(shipping[0].time)));

  if (data && data.weights && data.weights.length > 0) {
    price = data.weights[0].price;
  }

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="m-4 flex flex-col justify-center w-full"
    >
      <div className="relative mx-auto flex h-full w-full flex-col border-t-2 border-l-2 border-r-2 dark:border-b-2 dark:border-dark-border border-dark-bg dark:shadow-none shadow-neubrutalism-md transition duration-300  ease-in-out hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neubrutalism-xl md:max-w-full md:flex-row ">
        <Link
          // onClick={() => {
          //   handleUpdateClicks();
          // }}
          href={`/product/${slug}`}
          className="relative grid w-full place-items-center  md:w-5/12"
        >
          <Image
            width={256}
            height={256}
            src={images[0].file}
            alt={title}
            className="h-full object-cover"
          />

          <div
            id={`img-shadow${id}`}
            className="bg-gray-350 absolute inset-0 mix-blend-multiply"
            aria-hidden="true"
          />
        </Link>

        <div className="relative flex w-full flex-col space-y-2 p-4">
          <div className="item-center flex justify-between">
            <Link
              // onClick={() => {
              //   handleUpdateClicks();
              // }}
              href={`/product/${slug}`}
              className={`text-lg font-bold  ${
                hover ? 'text-iris-500 dark:text-dark-primary' : 'dark:text-dark-txt text-gray-800'
              }`}
            >
              {title}
            </Link>

            <div className="flex items-center">
              {discount ? (
                <p className=" text-gray-800 dark:text-dark-txt">
                  {' '}
                  <strong>${price}</strong> / <span className="line-through">{compare_price}</span>
                  <span className="font-base"> + ${shipping[0].price} Shipping</span>
                </p>
              ) : (
                <p className=" text-gray-800 dark:text-dark-txt">
                  <strong>
                    ${price}
                    <span className="font-base"> + ${shipping[0].price} Shipping</span>
                  </strong>
                </p>
              )}
            </div>
          </div>
          <div className="item-center flex justify-between">
            <p className=" text-md select-none dark:text-dark-txt-secondary text-gray-600">
              {data && data.short_description && data.short_description.length > 46
                ? data.short_description.slice(0, 60)
                : data.short_description}
            </p>

            <div className="flex items-center">
              <div className="ml-4 mt-2 flex-shrink-0">
                {discount && (
                  <p className="inline-flex items-center rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-800">
                    {parseInt(((compare_price - price) / compare_price) * 100, 10)}% Off
                  </p>
                )}
              </div>
              {/* <div className="ml-4  flex-shrink-0">
                <div className="flex gap-x-2">
                  {best_seller ? (
                    <div className="inline-flex rounded-full bg-almond-200 px-3 py-1 text-xs font-medium text-almond-800  ">
                      Bestseller
                    </div>
                  ) : (
                    <div />
                  )}
                </div>
              </div> */}
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between sm:flex-nowrap">
            <div className="">
              <p className="text-xs dark:text-dark-txt-secondary text-gray-500">
                {data && data.author.username}
              </p>
            </div>
            <div className="ml-4 flex-shrink-0">
              <div className="flex gap-x-2" />
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between sm:flex-nowrap">
            <div className="">
              <h3 className="flex space-x-2">
                <span className="text-md inline-flex font-semibold text-almond-600">{rating}</span>
                <div className="ml-1 flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={classNames(
                        data.rating > rating ? 'text-almond-400' : 'text-gray-200',
                        'h-5 w-5 flex-shrink-0',
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <span className="inline-flex text-xs dark:text-dark-txt-secondary text-gray-400">
                  ({rating_no})
                </span>
              </h3>
            </div>
            <div className="ml-4  flex-shrink-0">
              <div className="flex gap-x-2" />
            </div>
          </div>
          <div className="absolute bottom-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
            <p className="inline-flex text-xs dark:text-dark-txt-secondary text-gray-500">
              {category.name}
            </p>
            <div className="ml-4  flex-shrink-0">
              <div className="flex gap-x-2" />
            </div>
          </div>
          <div className="absolute bottom-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
            {best_seller && (
              <span className="relative inline-flex items-center bg-[#eceb98] px-2.5 py-0.5 text-xs font-bold text-[#314d22]">
                Bestseller
              </span>
            )}
            <div className="ml-4  flex-shrink-0">
              <div className="flex gap-x-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
