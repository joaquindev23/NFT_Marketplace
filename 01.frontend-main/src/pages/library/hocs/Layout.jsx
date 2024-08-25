import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function LibraryLayout({ children, title }) {
  const router = useRouter();

  const tabs = [
    {
      name: 'Courses',
      href: '/library/courses',
      current: router.pathname === '/library/courses',
    },
    {
      name: 'Wishlist',
      href: '/library/wishlist',
      current: router.pathname === '/library/wishlist',
    },
    {
      name: 'Orders',
      href: '/library/orders',
      current: router.pathname === '/library/orders',
    },
  ];

  return (
    <div className="dark:bg-dark-bg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* We've used 3xl here, but feel free to try other max-widths based on your needs */}
        <div className="mx-auto max-w-5xl py-14">
          <div className="pb-5">
            <p className="text-2xl font-bold leading-6 text-gray-900 dark:text-dark-txt">
              {title} Library
            </p>
          </div>
          <div>
            <div className="block">
              <div className="border-b border-gray-200 dark:border-dark-border">
                <nav className="-mb-px lg:flex grid grid-cols-2" aria-label="Tabs">
                  {tabs.map((tab) => (
                    <Link
                      key={tab.name}
                      href={tab.href}
                      className={classNames(
                        tab.current
                          ? 'flex items-center justify-center space-x-2 border-b-4 border-gray-900 p-1 font-bold text-black focus:outline-none dark:text-dark-txt dark:border-dark-primary'
                          : 'flex items-center justify-center border-b-2 border-gray-50 p-1 font-semibold text-gray-600 hover:border-gray-200 dark:border-dark-third dark:text-dark-txt dark:hover:border-dark-border md:space-x-2',
                        'col-span-1 w-full py-2.5 text-lg leading-5 md:col-span-2',
                      )}
                      aria-current={tab.current ? 'page' : undefined}
                    >
                      {tab.name}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>
          <div className="p-12">{children}</div>
        </div>
      </div>
    </div>
  );
}
