import React from 'react';
import { UserPlusIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function FriendsLayout({ children }) {
  const router = useRouter();

  const navigation = [
    // {
    //   id: 2,
    //   name: 'Friend Suggestions',
    //   href: '/friends/suggestionns',
    //   icon: UserIcon,
    //   active: location.pathname === '/friends/suggestionns',
    // },
    {
      id: 1,
      name: 'All Friends',
      href: '/friends',
      icon: UserGroupIcon,
      active: router.pathname === '/friends',
    },
    {
      id: 2,
      name: 'Friend Requests',
      href: '/friends/requests',
      icon: UserPlusIcon,
      active: router.pathname === '/friends/requests',
    },
  ];
  return (
    <div>
      {/* 3 column wrapper */}
      <div className="mx-auto w-full max-w-7xl flex-grow lg:flex xl:px-8">
        {/* Left sidebar & main wrapper */}
        <div className="min-w-0 flex-1  xl:flex">
          <div className="border-b border-gray-200 xl:w-64 xl:flex-shrink-0 xl:border-b-0 xl:border-r xl:border-gray-200">
            <div className="h-full py-6 pl-4 pr-6 sm:pl-6 lg:pl-8 xl:pl-0">
              {/* Left column area */}
              <ul className="divide-y divide-gray-200 space-y-2">
                {navigation.map((item) => (
                  <Link key={item.id} href={item.href}>
                    <li
                      className={`${
                        item.active ? 'bg-gray-50' : 'hover:bg-gray-50'
                      } flex p-2 py-4 transition duration-200 ease-in-out `}
                    >
                      <item.icon className="h-10 w-10 rounded-full" />
                      <div className="ml-3">
                        <p className="mt-2 text-sm font-medium text-gray-900">{item.name}</p>
                        {/* <p className="text-sm text-gray-500">{item.email}</p> */}
                      </div>
                    </li>
                  </Link>
                ))}
              </ul>
            </div>
          </div>

          <div className=" lg:min-w-0 lg:flex-1">
            <div className="h-full py-6 px-4 sm:px-6 lg:px-8">{children}</div>
          </div>
        </div>
        {/* 
        <div className=" pr-4 sm:pr-6 lg:flex-shrink-0 lg:border-l lg:border-gray-200 lg:pr-8 xl:pr-0">
          <div className="h-full py-6 pl-6 lg:w-80"></div>
        </div> */}
      </div>
    </div>
  );
}
