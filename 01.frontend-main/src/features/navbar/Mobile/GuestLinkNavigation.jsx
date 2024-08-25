import {
  HomeIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  AcademicCapIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/router';

const secondaryNavigation = [
  { name: 'Community', href: '/community' },
  { name: 'Whitepaper', href: '/whitepaper' },
  { name: 'Careers', href: '/careers' },
  { name: 'Affiliates', href: '/affiliates' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function GuestLinkNavigation() {
  const router = useRouter();

  const navigation = [
    {
      name: 'Courses',
      href: '/courses',
      icon: AcademicCapIcon,
      current: router.pathname === '/courses',
    },
    {
      name: 'Products',
      href: '/products',
      icon: ShoppingCartIcon,
      current: router.pathname === '/products',
    },
    {
      name: 'Become Seller',
      href: '/sell',
      icon: UserPlusIcon,
      current: router.pathname === '/teach',
    },
    {
      name: 'Ecosystem',
      href: '/ecosystem',
      icon: HomeIcon,
      current: router.pathname === '/ecosystem',
    },
    {
      name: 'Marketplace',
      href: '/marketplace',
      icon: CurrencyDollarIcon,
      current: router.pathname === '/marketplace',
    },
  ];

  return (
    <nav aria-label="Sidebar">
      <div className="space-y-1">
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
