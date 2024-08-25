import { ToastSuccess } from '@/components/ToastSuccess';
import AnimatedTippy from '@/components/tooltip';
import { Dialog, Transition } from '@headlessui/react';

import Footer from '@/features/footer';
import {
  Bars3BottomLeftIcon,
  BellIcon,
  CalendarIcon,
  ChartBarIcon,
  FolderIcon,
  HomeIcon,
  InboxIcon,
  UsersIcon,
  XMarkIcon,
  WalletIcon,
  QuestionMarkCircleIcon,
  WrenchIcon,
  ChatBubbleLeftIcon,
  AcademicCapIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState, Fragment } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useSelector } from 'react-redux';

import Sidebar from '@/features/sidebar';
import DarkModeButton from '@/components/DarkModeButton.jsx';
import UserDropDownMenu from '@/features/navbar/Auth/UserDropDownMenu';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const router = useRouter();
  const wallet = useSelector((state) => state.auth.wallet);
  const myUser = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const myProfile = useSelector((state) => state.auth.profile);
  const userLoading = useSelector((state) => state.auth.user_loading);
  const ethereumBalance = useSelector((state) => state.auth.eth_balance);
  const galrBalance = useSelector((state) => state.auth.galr_balance);
  const pdmBalance = useSelector((state) => state.auth.pdm_balance);
  const maticBalance = useSelector((state) => state.auth.matic_balance);

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

  const navigation = [
    { name: 'Courses', href: '/sell/courses', icon: AcademicCapIcon, current: true },
    { name: 'Products', href: '/sell/products', icon: ShoppingCartIcon, current: false },
    {
      name: 'Communication',
      href: '/sell/communication',
      icon: ChatBubbleLeftIcon,
      current: false,
    },
    {
      name: 'Performance',
      href: '/sell/performance',
      icon: ChartBarIcon,
      current: false,
    },
    { name: 'Tools', href: '/sell/tools', icon: WrenchIcon, current: false },
    { name: 'Help', href: '/sell/help', icon: QuestionMarkCircleIcon, current: false },
  ];

  return (
    <>
      {/* Sidebar Mobile */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 md:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 z-50 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative z-50 flex w-full max-w-xs flex-1 flex-col bg-dark-main pt-5 pb-4">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex flex-shrink-0 items-center px-4">
                  <img
                    className="h-8 w-auto"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                    alt="Your Company"
                  />
                </div>
                <div className="mt-5 h-0 flex-1 overflow-y-auto">
                  <nav className="space-y-1 px-2">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'group flex items-center rounded-md px-2 py-2 text-base font-medium',
                        )}
                      >
                        <item.icon
                          className={classNames(
                            item.current
                              ? 'text-gray-300'
                              : 'text-gray-400 group-hover:text-gray-300',
                            'mr-4 h-6 w-6 flex-shrink-0',
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </a>
                    ))}
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
            <div className="w-14 flex-shrink-0" aria-hidden="true">
              {/* Dummy element to force sidebar to shrink to fit close icon */}
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      {/* Static sidebar for desktop */}
      <Sidebar />
      <div className="flex flex-col md:pl-20 dark:bg-dark-bg">
        {/* // sticky top-0 */}
        <div className=" z-0 flex h-16 flex-shrink-0">
          <button
            type="button"
            className="focus:ring-indigo-500 dark:border-dark-border border-r border-gray-200 px-4 dark:text-dark-txt text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3BottomLeftIcon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex flex-1 justify-between px-4">
            <div className="flex flex-1" />
            <ul className="flex space-x-6">
              <Link
                href="/"
                className="mt-3 md:mt-5 hover:text-iris-500 dark:hover:text-dark-accent dark:text-dark-txt "
              >
                Return to Customer
              </Link>
              {/* <AnimatedTippy
                offsetY={0}
                content={
                  <div className="w-full z-50 dark:bg-dark-main bg-white rounded-lg p-4 leading-6">
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
                <li className="relative">
                  <button
                    type="button"
                    className=" ring-none mt-5 items-center justify-center border-none  transition duration-300 ease-in-out hover:text-iris-400 dark:text-dark-txt-secondary dark:hover:text-dark-primary md:inline-flex"
                  >
                    <Link href="/wallet">
                      <WalletIcon className="h-6 w-6" aria-hidden="true" />
                    </Link>
                  </button>
                </li>
              </AnimatedTippy> */}

              {/* <li className="overflow:hidden relative inline-flex">
                {userLoading ? (
                  <span className="inline-block h-8 w-8 overflow-hidden rounded-full bg-gray-100">
                    <svg
                      className="h-full w-full text-gray-300"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </span>
                ) : (
                  <div className="mt-4">
                    <UserDropDownMenu myProfile={myProfile} myUser={myUser} />
                  </div>
                )}
              </li> */}
              <div className="mt-2">
                <DarkModeButton />
              </div>
            </ul>
          </div>
        </div>
        <main className="flex-1">
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
              {/* Replace with your content */}
              <div className="py-4">{children}</div>
              {/* /End replace */}
            </div>
          </div>
        </main>
      </div>
      <div className="md:pl-16">
        <Footer />
      </div>
    </>
  );
}
