import Link from 'next/link';
import {
  DocumentIcon,
  ChevronRightIcon,
  AcademicCapIcon,
  EllipsisHorizontalIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

export default function GetStarted() {
  return (
    <div className="relative -mt-12 mx-auto max-w-7xl pb-32 px-4 sm:px-6 lg:px-8 ">
      {/* Heading */}

      <div className=" flex">
        <ul className="grid w-full grid-cols-2 gap-2">
          <Link
            href={`/whitepaper`}
            type="button"
            className="text-sm focus:ring-iris-500 mx-0.5 my-0.5 inline-flex items-center rounded-xl justify-between border bg-white dark:border-dark-border dark:bg-dark-bg px-6 py-5 font-bold text-gray-900 dark:text-dark-txt shadow-sm hover:bg-gray-50 dark:hover:bg-dark-second focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 ease-in-out w-full"
          >
            <DocumentIcon className="h-8 w-auto" />
            Explore the Whitepaper
            <ChevronRightIcon className="h-5 w-5" />
          </Link>
          <Link
            href={`/teach`}
            type="button"
            className="text-sm focus:ring-iris-500 mx-0.5 my-0.5 inline-flex items-center rounded-xl justify-between border bg-white dark:border-dark-border dark:bg-dark-bg px-6 py-5 font-bold text-gray-900 dark:text-dark-txt shadow-sm hover:bg-gray-50 dark:hover:bg-dark-second focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 ease-in-out w-full"
          >
            <AcademicCapIcon className="h-8 w-auto" />
            Get Started with Boomslag
            <ChevronRightIcon className="h-5 w-5" />
          </Link>
          {/* <Link
            href={`/teach`}
            type="button"
            className="text-sm focus:ring-iris-500 mx-0.5 my-0.5 inline-flex items-center rounded-xl justify-between border border-gray-300 bg-white px-6 py-5 font-bold text-gray-900 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 ease-in-out w-full"
          >
            <UsersIcon className="h-8 w-auto" />
            Visit the Forums
            <ChevronRightIcon className="h-5 w-5" />
          </Link> */}
          <Link
            href={`/press`}
            type="button"
            className="text-sm focus:ring-iris-500 mx-0.5 my-0.5 inline-flex items-center rounded-xl justify-between border bg-white dark:border-dark-border dark:bg-dark-bg px-6 py-5 font-bold text-gray-900 dark:text-dark-txt shadow-sm hover:bg-gray-50 dark:hover:bg-dark-second focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 ease-in-out w-full"
          >
            <EllipsisHorizontalIcon className="h-8 w-auto" />
            Resources
            <ChevronRightIcon className="h-5 w-5" />
          </Link>
        </ul>
      </div>
    </div>
  );
}
