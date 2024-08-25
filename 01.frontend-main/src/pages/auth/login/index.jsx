import React, { useEffect, useState } from 'react';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import CircleLoader from 'react-spinners/CircleLoader';
import { useSelector, useDispatch } from 'react-redux';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { login, resetRegisterSuccess } from '@/redux/actions/auth/auth';
import Layout from '@/hocs/Layout';

const SeoList = {
  title: 'Boomslag - Login to Your Account',
  description:
    'Log in to access your Web3 wallet and all your tokens and NFTs on Boomslag, the premier NFT marketplace for buying and selling digital assets.',
  href: '/',
  url: 'https://boomslag.com',
  keywords: 'NFT marketplace, Matic NFTs, Boomslag NFTs, sell NFTs online',
  robots: 'all',
  author: 'BoomSlag',
  publisher: 'BoomSlag',
  image:
    'https://bafybeiaor24mrcurzyzccxl7xw46zdqpor4sfuhddl6tzblujoiukchxnq.ipfs.w3s.link/teach.png',
  twitterHandle: '@BoomSlag',
};

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    if (showPassword) {
      setShowPassword(false);
    } else {
      setShowPassword(true);
    }
  };

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const loading = useSelector((state) => state.auth.loading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetRegisterSuccess());
  }, [dispatch]);

  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();

    if (dispatch && dispatch !== null && dispatch !== undefined) {
      dispatch(login(email, password));
    }
  };

  function redirectToHome() {
    if (typeof window !== 'undefined' && isAuthenticated) {
      router.push('/');
    }
  }

  if (typeof window !== 'undefined' && isAuthenticated) redirectToHome();

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

      <div className=" dark:bg-dark-bg">
        <div className="sm:mx-auto sm:w-full sm:max-w-md ">
          <p className="mb-6 pt-8 text-center text-lg font-bold tracking-tight text-gray-900 dark:text-dark-txt">
            Login to your account
          </p>
          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-300 dark:border-dark-second" />
            </div>
            <div className="relative flex justify-center" />
          </div>
        </div>

        <div className=" sm:mx-auto sm:w-full sm:max-w-md">
          <div className=" py-8 px-4 sm:px-10">
            <form onSubmit={onSubmit} className="space-y-3">
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => onChange(e)}
                  required
                  className="text-md duration block w-full border focus:ring-none focus:outline-none border-dark py-3 pl-10 font-medium shadow-neubrutalism-xs transition ease-in-out dark:bg-dark-second dark:text-dark-txt"
                  placeholder="email@example.com"
                />
              </div>

              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={password}
                  onChange={(e) => onChange(e)}
                  required
                  className="text-md duration block w-full border focus:ring-none focus:outline-none border-dark py-3 pl-10 font-medium shadow-neubrutalism-xs transition ease-in-out dark:bg-dark-second dark:text-dark-txt"
                  placeholder="Password"
                />
              </div>

              <div className="mt-2 flex">
                <input
                  className="form-checkbox h-4 w-4  text-black transition duration-150 ease-in-out"
                  type="checkbox"
                  id="show-password"
                  onChange={toggleShowPassword}
                />
                <label
                  className="ml-2 flex text-sm leading-5 text-gray-900 focus-within:text-blue-800"
                  htmlFor="show-password"
                >
                  {showPassword ? (
                    <span className="inline-flex text-gray-900 dark:text-dark-txt">
                      Hide password
                    </span>
                  ) : (
                    <span className="inline-flex text-gray-900 dark:text-dark-txt">
                      Show password
                    </span>
                  )}
                </label>
              </div>

              <div>
                {loading ? (
                  <button
                    type="button"
                    className="text-md focus:ring-none inline-flex 
w-full
        items-center
        justify-center 
        border
        border-dark-bg 
        bg-white dark:bg-dark-primary rounded-2xl dark:text-dark-txt
        px-4 
        py-3 
        text-sm 
        font-bold
        text-dark
              shadow-neubrutalism-sm transition
duration-300
                    ease-in-out  hover:-translate-x-0.5  hover:-translate-y-0.5  hover:bg-gray-50 hover:shadow-neubrutalism-md "
                  >
                    <CircleLoader loading={loading} size={25} color="#1c1d1f" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="
                    text-md focus:ring-none inline-flex 
                    w-full
                    items-center
                    justify-center 
                    border
                    border-dark-bg 
                    bg-white dark:bg-dark-primary rounded-2xl dark:text-dark-txt
                    px-4 
                    py-3 
                    text-sm 
                    font-bold
                    text-dark
                    shadow-neubrutalism-sm transition
                    duration-300
                    ease-in-out  hover:-translate-x-0.5  hover:-translate-y-0.5  hover:bg-gray-50 hover:shadow-neubrutalism-md  "
                  >
                    Login
                  </button>
                )}
              </div>
              <div className="flex items-center justify-center">
                <div className="text-sm">
                  <span className="text-md font-medium text-gray-900 dark:text-dark-txt">or </span>
                  <Link
                    href="/auth/forgot_password"
                    className="text-lg font-medium text-blue-500 dark:text-dark-accent hover:text-blue-600"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-sm">
                  <span className="text-md font-base text-gray-900 dark:text-dark-txt">
                    Don&apos;t have an account?{' '}
                  </span>
                  <Link
                    href="/auth/signup"
                    className="nderline text-lg font-medium text-blue-500 dark:text-dark-accent hover:text-blue-600"
                  >
                    Register
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

Login.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
