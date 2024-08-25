import { CheckBadgeIcon } from '@heroicons/react/20/solid';
import {
  HomeIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  AcademicCapIcon,
  HeartIcon,
  ListBulletIcon,
  RectangleGroupIcon,
  ChatBubbleLeftIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function AuthLinkNavigation({ myProfile, myUser }) {
  const router = useRouter();

  const secondaryNavigation = [
    {
      name: 'Ecosystem',
      href: '/ecosystem',
      icon: HomeIcon,
      current: router.pathname === '/ecosystem',
    },
    {
      name: 'Trade',
      href: '/marketplace',
      icon: CurrencyDollarIcon,
      current: router.pathname === '/marketplace',
    },
    {
      name: 'Products',
      href: '/products',
      icon: ShoppingCartIcon,
      current: router.pathname === '/products',
    },
    {
      name: 'Courses',
      href: '/courses',
      icon: AcademicCapIcon,
      current: router.pathname === '/courses',
    },
  ];

  const navigation = [
    {
      name: 'My Library',
      href: '/library/courses',
      icon: ListBulletIcon,
      current: router.pathname === '/library/courses',
    },
    {
      name: 'My Wishlist',
      href: '/library/wishlist',
      icon: HeartIcon,
      current: router.pathname === '/marketplace',
    },
    {
      name: 'Seller Dashboard',
      href: '/sell/dashboard',
      icon: RectangleGroupIcon,
      current: router.pathname === '/sell/dashboard',
    },
    {
      name: 'Messages',
      href: '/messages',
      icon: ChatBubbleLeftIcon,
      current: router.pathname === '/messages',
    },
    {
      name: 'Purchase History',
      href: '/library/orders',
      icon: ShoppingCartIcon,
      current: router.pathname === '/teach',
    },
  ];

  return (
    <nav aria-label="Sidebar">
      <div className="space-y-1">
        <Link
          href={`/@${myUser && myUser.username}`}
          className="flex flex-wrap p-2 bg-white dark:bg-dark-main dark:hover:bg-dark-second hover:bg-gray-50 sm:flex-nowrap rounded-lg transition duration-200 ease-in-out"
        >
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <Image
                className="h-10 w-10 rounded-full"
                src={myProfile && myProfile.picture}
                alt=""
                width={50}
                height={50}
              />
            </div>
            <div>
              <p className="text-lg font-medium leading-6 dark:text-dark-txt text-gray-900">
                {myUser && myUser.username}
                {myUser && myUser.verified && (
                  <span className="inline-flex">
                    <CheckBadgeIcon className="ml-1 h-4 w-4 text-iris-500" />
                  </span>
                )}
              </p>
              <p className="text-sm text-gray-900 dark:text-dark-txt-secondary">
                {myUser && myUser && myUser.email}
              </p>
            </div>
          </div>
        </Link>
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={classNames(
              item.current
                ? 'bg-gray-100 text-gray-900 dark:bg-dark-second dark:text-dark-txt'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-dark-txt dark:hover:bg-dark-third dark:hover:text-dark-accent',
              'group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 ease-in-out',
            )}
            aria-current={item.current ? 'page' : undefined}
          >
            <item.icon
              className={classNames(
                item.current
                  ? 'text-gray-500 dark:text-dark-accent'
                  : 'text-gray-400 group-hover:text-gray-500 dark:text-dark-txt-secondary dark:group-hover:text-dark-accent',
                '-ml-1 mr-3 h-6 w-6 flex-shrink-0',
              )}
              aria-hidden="true"
            />
            <span className="truncate">{item.name}</span>
          </Link>
        ))}
      </div>
      <div className="mt-8">
        <h3
          className="px-3 text-sm font-medium dark:text-dark-txt text-gray-500"
          id="projects-headline"
        >
          Boomslag Ecosystem
        </h3>
        <div className="mt-1 space-y-1" aria-labelledby="projects-headline">
          {secondaryNavigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={classNames(
                'group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 ease-in-out',
                'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-dark-txt-secondary dark:hover:bg-dark-third dark:hover:text-dark-accent',
              )}
            >
              <span className="truncate">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
