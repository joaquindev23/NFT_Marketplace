import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Link from 'next/link';
import { WalletIcon } from '@heroicons/react/24/outline';

import DarkModeButton from '@/components/DarkModeButton.jsx';
import GlobeButton from '@/components/GlobeButton';
import {
  loadEthereumBalance,
  loadMaticPolygonBalance,
  loadPraediumBalance,
  loadUriBalance,
  logout,
} from '@/redux/actions/auth/auth';
import { ToastSuccess } from '@/components/ToastSuccess';
import AnimatedTippy from '@/components/tooltip';
import CartComponent from '../Cart/CartComponent';
import UserDropDownMenu from './UserDropDownMenu';
import MenuDropdown from './MenuDropdown';
import Notifications from './Notifications';
import { useEffect } from 'react';

export default function AuthLinks() {
  const dispatch = useDispatch();
  const router = useRouter();

  const wallet = useSelector((state) => state.auth.wallet);
  const myUser = useSelector((state) => state.auth.user);
  const myProfile = useSelector((state) => state.auth.profile);

  const userLoading = useSelector((state) => state.auth.user_loading);
  const ethereumBalance = useSelector((state) => state.auth.eth_balance);
  const galrBalance = useSelector((state) => state.auth.galr_balance);
  const pdmBalance = useSelector((state) => state.auth.pdm_balance);
  const maticBalance = useSelector((state) => state.auth.matic_balance);

  const logoutHandler = () => {
    if (dispatch && dispatch !== null && dispatch !== undefined) {
      dispatch(logout());
      router.push('/logout');
    }
  };

  const tokens = [
    {
      name: 'Ethereum',
      symbol: 'ETH',
      balance: ethereumBalance,
      network: 'Ethereum',
    },
    {
      name: 'Matic',
      symbol: 'MATIC',
      balance: maticBalance,
      network: 'Polygon',
    },
    {
      name: 'Uridium',
      symbol: 'URI',
      balance: galrBalance,
      network: 'Polygon',
    },
    {
      name: 'Praedium',
      symbol: 'PDM',
      balance: pdmBalance,
      network: 'Polygon',
    },
  ];

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  useEffect(() => {
    if (isAuthenticated && wallet && wallet.address) {
      dispatch(loadEthereumBalance(wallet.address));
      dispatch(loadMaticPolygonBalance(wallet.polygon_address));
      dispatch(loadPraediumBalance(wallet.polygon_address));
      dispatch(loadUriBalance(wallet.polygon_address));
    }
  }, []);

  return (
    <ul className="ml-1 flex space-x-4">
      <MenuDropdown />
      <AnimatedTippy
        offsetY={15}
        content={
          <div className="w-full  p-4 leading-6">
            <div className="mb-2 flex items-center">
              <span className="mr-2 text-lg font-bold dark:text-dark-txt text-gray-900">
                Ethereum Address:
              </span>
              <span className="text-md font-medium text-gray-500 dark:text-dark-txt-secondary">
                {wallet && wallet.address}
              </span>
              <CopyToClipboard text={wallet && wallet.address}>
                <button
                  type="button"
                  onClick={() => {
                    ToastSuccess(`Copied Address: ${wallet && wallet.address}`);
                  }}
                  className="ml-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500 hover:text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                    />
                  </svg>
                </button>
              </CopyToClipboard>
            </div>
            <div className="mb-4 flex items-center">
              <span className="mr-2 text-lg font-bold dark:text-dark-txt text-gray-900">
                Polygon Address:
              </span>
              <span className="text-md font-medium dark:text-dark-txt-secondary text-gray-500">
                {wallet && wallet.polygon_address}
              </span>
              <CopyToClipboard text={wallet && wallet.polygon_address}>
                <button
                  type="button"
                  onClick={() => {
                    ToastSuccess(`Copied Address: ${wallet && wallet.polygon_address}`);
                  }}
                  className="ml-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500 hover:text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                    />
                  </svg>
                </button>
              </CopyToClipboard>
            </div>

            <table className="min-w-full divide-y dark:divide-dark-border divide-gray-200">
              <thead className="bg-gray-50 dark:bg-dark-second">
                <tr>
                  <th
                    scope="col"
                    className="dark:text-dark-txt text-md px-6 py-3 text-left font-medium uppercase tracking-wider text-dark-gray"
                  >
                    Token
                  </th>
                  <th
                    scope="col"
                    className="dark:text-dark-txt text-md px-6 py-3 text-left font-medium uppercase tracking-wider text-dark-gray"
                  >
                    Balance
                  </th>
                  <th
                    scope="col"
                    className="dark:text-dark-txt text-md px-6 py-3 text-left font-medium uppercase tracking-wider text-dark-gray"
                  >
                    Network
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">View</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-dark-border dark:bg-dark-third divide-gray-200 bg-white">
                {tokens.map((token) => (
                  <tr key={token.symbol}>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        <div className="">
                          <div className="text-md font-medium dark:text-dark-txt-secondary text-dark-gray">
                            {token.name} ({token.symbol})
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        <div className="">
                          <div className="text-md font-medium dark:text-dark-txt-secondary text-dark-gray">
                            {token.balance && token.balance.toLocaleString('en-US')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        <div className="">
                          <div className="text-md font-medium text-dark-gray dark:text-dark-txt-secondary">
                            {token.network}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm dark:text-dark-txt-secondary text-gray-500">
                      <Link href="/wallet" className="dark:text-dark-accent text-iris-600">
                        View Wallet
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
      >
        <li className="relative ml-1">
          <Link
            href="/wallet"
            className=" ring-none mt-2 items-center justify-center border-none  transition duration-300 ease-in-out hover:text-iris-400 dark:text-dark-txt-secondary dark:hover:text-dark-primary md:inline-flex"
          >
            <WalletIcon className="h-6 w-6" aria-hidden="true" />
          </Link>
        </li>
      </AnimatedTippy>
      <CartComponent />
      <Notifications />
      <li className="overflow:hidden relative inline-flex">
        {userLoading ? (
          <span className="inline-block h-8 w-8 overflow-hidden rounded-full bg-gray-100">
            <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </span>
        ) : (
          <UserDropDownMenu
            myUser={myUser && myUser}
            myProfile={myProfile && myProfile}
            logoutHandler={logoutHandler}
          />
        )}
      </li>
      <DarkModeButton />
    </ul>
  );
}
