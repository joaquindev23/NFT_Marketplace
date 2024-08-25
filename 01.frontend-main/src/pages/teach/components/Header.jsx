import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import LoadingMoon from '@/components/loaders/LoadingMoon';
import Button from '@/components/Button';
import { becomeSeller } from '@/redux/actions/teach/teach';

export default function Header({ isAuthenticated, myUser }) {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleBecomeInstructor = async () => {
    setLoading(true);
    dispatch(becomeSeller(myUser.id));
    setLoading(false);
  };

  return (
    <div className="relative isolate overflow-hidden bg-gradient-to-b from-white-900/10 dark:via-dark-main via-gray-800/20 dark:to-dark-second to-gray-700/5 pt-14">
      <div className="relative z-10">
        <div className="absolute top-0 left-1/2 right-0 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl lg:ml-24 xl:ml-48">
          <svg viewBox="0 0 801 1036" aria-hidden="true" className="w-[50.0625rem]">
            <path
              fill="url(#70656b7e-db44-4b9b-b7d2-1f06791bed52)"
              fillOpacity=".3"
              d="m282.279 843.371 32.285 192.609-313.61-25.32 281.325-167.289-58.145-346.888c94.5 92.652 277.002 213.246 251.009-45.597C442.651 127.331 248.072 10.369 449.268.891c160.956-7.583 301.235 116.434 351.256 179.39L507.001 307.557l270.983 241.04-495.705 294.774Z"
            />
            <defs>
              <linearGradient
                id="70656b7e-db44-4b9b-b7d2-1f06791bed52"
                x1="508.179"
                x2="-28.677"
                y1="-116.221"
                y2="1091.63"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#00c6ff" />
                <stop offset="0.5" stopColor="#0072ff" />
                <stop offset="1" stopColor="#7a2aff" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      <div
        className="absolute inset-y-0 right-1/2 -z-10 -mr-96 w-[200%] origin-top-right skew-x-[-40deg]  shadow-xl dark:shadow-dark-second shadow-iris-600/10 ring-1 dark:ring-dark-second ring-iris-50 sm:-mr-80 lg:-mr-96"
        aria-hidden="true"
      />
      <div className="mx-auto max-w-7xl py-16 px-6 lg:px-8 z-20">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:grid lg:max-w-none lg:grid-cols-2 lg:gap-x-16 lg:gap-y-6 xl:grid-cols-1 xl:grid-rows-1 xl:gap-x-8">
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight dark:text-dark-txt text-gray-900 sm:text-6xl lg:col-span-2 xl:col-auto">
            Ahoy, me hearties!
          </h1>
          <div className="mt-6 max-w-xl lg:mt-0 xl:col-end-1 xl:row-start-1">
            <p className="text-lg leading-8 text-gray-600 dark:text-dark-txt-secondary">
              Welcome aboard, sailor! I be the Captain, and I invite ye to join our crew of skilled
              privateers in the quest for knowledge across the Seven Seas.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              {isAuthenticated ? (
                <div className="">
                  {myUser && myUser.become_seller && loading === false ? (
                    <Button>Access Requested</Button>
                  ) : (
                    <div>
                      {loading ? (
                        <Button>
                          <LoadingMoon size={20} />
                        </Button>
                      ) : (
                        <Button
                          onClick={() => {
                            handleBecomeInstructor();
                          }}
                        >
                          Become Merchant
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <Link className="" href="/auth/login">
                  <Button>Get Started</Button>
                </Link>
              )}
            </div>
          </div>
          <Image
            width={256}
            height={256}
            src="/assets/img/placeholder/teacher.png"
            alt=""
            className=" aspect-[5/5] w-full max-w-lg rounded-2xl object-cover  lg:max-w-none xl:row-span-2 xl:row-end-2 "
          />
        </div>
      </div>
    </div>
  );
}
