import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Popover } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';

import Navbar from '../components/Navbar';
import { setProductStep2 } from '@/redux/actions/create/create';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function CreateProduct2() {
  const dispatch = useDispatch();

  const router = useRouter();

  const myUser = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const title = useSelector((state) => state.create.product_title);
  const type = useSelector((state) => state.create.product_type);

  const [content, setContent] = useState(title || '');

  // useEffect(() => {
  //   if (!isAuthenticated || (!type && myUser && myUser.role !== 'seller')) {
  //     router.push('/');
  //   }
  // }, [dispatch]);

  return (
    <div className="dark:bg-dark-main">
      <Navbar myUser={myUser} title="Step 2 of 4" />
      <div className="overflow-hidden  bg-gray-200">
        <div className="h-1 dark:bg-dark-primary bg-purple-800" style={{ width: '50%' }} />
      </div>

      <div className="grid w-full place-items-center py-14">
        <h2 className="font-recife-bold mx-12 text-2xl dark:text-dark-txt md:mx-0 md:text-4xl">
          What shall be the name of this product, young Skywalker?
        </h2>
        <p className="font-regular mx-12 mt-4 text-sm md:mx-0 md:text-lg dark:text-dark-txt-secondary">
          The choice is yours, for the power of the dark side is subtle and can be used to shape the
          future in any way you desire.
        </p>
        <div className="relative mt-12">
          <div className="absolute right-0 mt-4 mr-4 dark:text-dark-txt-secondary text-gray-600">
            {content.length === '0' ? '0' : content.length} of 60
          </div>
          <input
            type="text"
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              dispatch(setProductStep2(e.target.value));
            }}
            placeholder="e.g. E-Cigarrete, Clothing, Whatever you have in hand!"
            className="w-96 py-4  pl-4 dark:bg-dark-bg dark:border-dark-border dark:placeholder-dark-txt-secondary focus:ring-none focus:outline-none md:w-[750px]"
          />
        </div>
      </div>

      <Popover
        as="footer"
        className={({ open }) =>
          classNames(
            open ? 'fixed inset-0 overflow-y-auto' : '',
            ' fixed inset-x-0 bottom-0 z-30 w-full dark:border-dark-border border bg-white  py-4 shadow-2xl dark:bg-dark-main dark:shadow-none lg:overflow-y-visible',
          )
        }
      >
        <div className="px-8 sm:flex sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => {
              router.back();
            }}
            className="text-lg font-medium leading-6 dark:text-dark-txt text-gray-900"
          >
            Previous
          </button>
          <div className="mt-3 sm:mt-0 sm:ml-4">
            {title && title.length <= 60 ? (
              <button
                type="button"
                onClick={() => {
                  router.push('/sell/products/create/3');
                }}
                className={classNames(
                  'text-md inline-flex items-center px-4 py-3 font-black',
                  'border border-transparent',
                  'bg-dark text-white hover:bg-gray-700',
                  'dark:bg-dark-primary dark:hover:bg-dark-accent',
                )}
              >
                Continue
              </button>
            ) : (
              <div className="text-md inline-flex select-none items-center border border-transparent bg-gray-300 px-4 py-3 font-black text-white dark:bg-dark-third dark:text-dark-txt">
                Continue
              </div>
            )}
          </div>
        </div>
      </Popover>
    </div>
  );
}
