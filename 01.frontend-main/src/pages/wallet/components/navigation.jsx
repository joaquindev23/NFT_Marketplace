import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

export const navigationItems = [
  {
    id: 0,
    name: 'Tokens',
    href: '/wallet',
    icon: 'bx bx-coin',
  },
  {
    id: 1,
    name: 'Send',
    href: '/wallet/send',
    icon: 'bx bx-right-top-arrow-circle',
  },
  {
    id: 2,
    name: 'Receive',
    href: '/wallet/receive',
    icon: 'bx bx-left-top-arrow-circle',
  },
];

export default function Navigation() {
  const router = useRouter();
  return (
    <div>
      <ul className="mt-3 ml-3 hidden space-y-2 p-2 md:block">
        {navigationItems.map((item) => (
          <li key={item.id}>
            <Link href={item.href}>
              <button
                type="button"
                className={`
                ${
                  router.pathname === item.href
                    ? 'border-gray-900 bg-gray-50 dark:bg-dark-second dark:text-dark-primary dark:border-dark-second text-iris-500'
                    : ''
                }
                flex w-full items-center justify-between rounded-md border px-4 py-2 text-left hover:border-gray-900 dark:border-dark-second dark:hover:bg-dark-second dark:hover:text-dark-accent hover:bg-gray-100 hover:text-iris-500`}
              >
                <div className="flex items-center ">
                  <i className={`${item.icon} text-xl text-gray-500`} />
                  <span className="ml-2">{item.name}</span>
                </div>
              </button>
            </Link>
          </li>
        ))}
      </ul>
      <select
        name="location"
        className="focus:border-indigo-500 focus:ring-indigo-500 mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:outline-none sm:text-sm md:hidden"
        defaultValue="Canada"
        onChange={(e) => {
          const selectedNavItem = navigationItems.find((item) => item.name === e.target.value);
          router.push(selectedNavItem.href);
        }}
      >
        {navigationItems.map((item) => (
          <option key={item.id}>{item.name}</option>
        ))}
      </select>
    </div>
  );
}
