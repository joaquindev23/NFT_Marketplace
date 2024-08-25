import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { LockClosedIcon } from '@heroicons/react/20/solid';
import CircleLoader from 'react-spinners/CircleLoader';
import { useSelector, useDispatch } from 'react-redux';
import Head from 'next/head';
import Layout from '@/hocs/Layout';
import { resetPasswordConfirm } from '../../../redux/actions/auth/auth';
import Button from '@/components/Button';

const SeoList = {
  title: 'Boomslag - Change Password',
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

export default function ForgotPasswordConfirm() {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    if (showPassword) {
      setShowPassword(false);
    } else {
      setShowPassword(true);
    }
  };

  const router = useRouter();
  const filterData = router.query.slug;
  const uid = filterData && filterData[0];
  const token = filterData && filterData[1];

  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);

  const [formData, setFormData] = useState({
    new_password: '',
    re_new_password: '',
  });

  const { newPassword, reNewPassword } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();

    if (dispatch && dispatch !== null && dispatch !== undefined) {
      dispatch(resetPasswordConfirm(uid, token, newPassword, reNewPassword));
      router.push('/auth/login');
    }
  };

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
      <div className="dark:bg-dark-bg">
        <div className="sm:mx-auto sm:w-full sm:max-w-md ">
          <p className="mb-6 pt-8 text-center text-lg font-bold tracking-tight text-gray-900 dark:text-dark-txt">
            Change your password
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
                  <LockClosedIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => onChange(e)}
                  required
                  className="text-md duration block w-full border focus:ring-none focus:outline-none border-dark py-3 pl-10 font-medium shadow-neubrutalism-xs transition ease-in-out dark:bg-dark-second dark:text-dark-txt"
                  placeholder="New Password"
                />
              </div>

              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="reNewPassword"
                  value={reNewPassword}
                  onChange={(e) => onChange(e)}
                  required
                  className="text-md duration block w-full border focus:ring-none focus:outline-none border-dark py-3 pl-10 font-medium shadow-neubrutalism-xs transition ease-in-out dark:bg-dark-second dark:text-dark-txt"
                  placeholder="Repeat New Password"
                />
              </div>
              <div className="mt-2 flex">
                <input
                  className="form-checkbox h-4 w-4 text-black transition duration-150 ease-in-out"
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
                  <Button type="button">
                    <CircleLoader loading={loading} size={25} color="#1c1d1f" />
                  </Button>
                ) : (
                  <Button type="submit">Change Password</Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

ForgotPasswordConfirm.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
