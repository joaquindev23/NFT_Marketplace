import React from 'react';
import { Popover } from '@headlessui/react';
import { BellIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/router';
import LogoImg from '@/components/LogoImg';

const navigation = [
  { name: 'Dashboard', href: '#', current: true },
  { name: 'Calendar', href: '#', current: false },
  { name: 'Teams', href: '#', current: false },
  { name: 'Directory', href: '#', current: false },
];
const userNavigation = [
  { name: 'Your Profile', href: '#' },
  { name: 'Settings', href: '#' },
  { name: 'Sign out', href: '#' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar({ title, myUser }) {
  const router = useRouter();

  return (
    <>
      {/* When the mobile menu is open, add `overflow-hidden` to the `body` element to prevent double scrollbars */}
      <Popover
        as="header"
        className={({ open }) =>
          classNames(
            open ? 'static inset-0  overflow-y-auto' : '',
            ' z-30 w-full bg-white  shadow-lg dark:bg-dark-main dark:shadow-none lg:static lg:overflow-y-visible',
          )
        }
      >
        <>
          <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
            <div className="relative flex justify-between lg:gap-8 xl:grid xl:grid-cols-12">
              <div className="flex md:absolute  md:inset-y-0 md:left-0 lg:static xl:col-span-3">
                <button
                  onClick={() => {
                    router.push('/sell/products');
                  }}
                  type="button"
                  className="flex flex-shrink-0 items-center dark:border-dark-border border-r border-gray-300 pr-8"
                >
                  {/* Dark Image */}

                  <LogoImg />
                </button>
                <p className="ml-8 dark:text-dark-txt grid content-center items-center text-center text-lg">
                  {title}
                </p>
              </div>

              <div className="min-w-0 flex-1 md:px-8 lg:px-0 xl:col-span-5">
                <div className="flex items-center px-6 py-9 md:mx-auto md:max-w-3xl lg:mx-0 lg:max-w-none xl:px-0">
                  <div className="w-full" />
                </div>
              </div>

              <div className="flex lg:items-center lg:justify-end xl:col-span-4">
                <button
                  type="button"
                  onClick={() => {
                    router.push('/sell/products');
                  }}
                  className="text-md ml-6 inline-flex items-center px-4 py-2 font-bold dark:text-dark-accent text-iris-500"
                >
                  Exit
                </button>
              </div>
            </div>
          </div>

          <Popover.Panel as="nav" className="lg:hidden" aria-label="Global">
            <div className="mx-auto max-w-3xl space-y-1 px-2 pt-2 pb-3 sm:px-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  aria-current={item.current ? 'page' : undefined}
                  className={classNames(
                    item.current ? 'bg-gray-100 text-gray-900' : 'hover:bg-gray-50',
                    'block rounded-md py-2 px-3 text-base font-medium',
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-4 pb-3">
              <div className="mx-auto flex max-w-3xl items-center px-4 sm:px-6">
                <div className="flex-shrink-0">
                  <img className="h-10 w-10 rounded-full" src={myUser && myUser.imageUrl} alt="" />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{myUser && myUser.name}</div>
                  <div className="text-sm font-medium text-gray-500">{myUser && myUser.email}</div>
                </div>
                <button
                  type="button"
                  className="focus:ring-indigo-500 ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mx-auto mt-3 max-w-3xl space-y-1 px-2 sm:px-4">
                {userNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block rounded-md py-2 px-3 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </Popover.Panel>
        </>
      </Popover>
    </>
  );
}
