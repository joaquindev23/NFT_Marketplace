import React, { useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { MagnifyingGlassIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import { sidebarNavigation } from './sidebarNavigation';
import { resetComposeNewInbox, setComposeNewinbox, setInboxList } from '../redux/actions/chat/chat';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { loadUserContacts } from '@/redux/actions/auth/auth';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function InboxLayout({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const compose = useSelector((state) => state.chat.compose_new_inbox);
  const select = useSelector((state) => state.chat.select);

  const handleComposeInbox = () => {
    if (compose) {
      dispatch(resetComposeNewInbox());
      dispatch(setInboxList(''));
    } else {
      dispatch(setComposeNewinbox());
    }
  };

  const handleSelect = (option) => {
    // setSelected(option);
    dispatch(setInboxList(option));
  };

  // eslint-disable-next-line
  useEffect(() => {
    dispatch(loadUserContacts());
    dispatch(resetComposeNewInbox());
    dispatch(setInboxList(''));
    return () => {
      dispatch(setInboxList(''));
      dispatch(resetComposeNewInbox());
    };
  }, []);

  const handleSelectChange = (event) => {
    const selectedItemName = event.target.value;
    const selectedItem = sidebarNavigation.find((item) => item.name === selectedItemName);
    router.push(selectedItem.href);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Top nav */}
      <header className="relative flex h-16 flex-shrink-0 items-center bg-white">
        {/* Logo area */}
        <div className="absolute inset-y-0 left-0 md:static md:flex-shrink-0">
          <button
            type="button"
            onClick={handleComposeInbox}
            className={`
            ${compose ? 'bg-iris-300 focus:ring-iris-400' : 'bg-iris-500 focus:ring-iris-600'}
            flex h-16 w-16 items-center justify-center focus:outline-none focus:ring-2 focus:ring-inset  md:w-20`}
          >
            <PencilSquareIcon
              className={`${compose ? 'h-8 w-auto text-gray-50' : 'h-8 w-auto text-white'}  `}
              aria-hidden="true"
            />
          </button>
        </div>

        {/* Picker area */}
        <div className="mx-auto md:hidden">
          <div className="relative">
            <select
              id="inbox-select"
              className="rounded-md border-0 bg-none pl-3 pr-8 text-base font-medium text-gray-900 focus:ring-2 focus:ring-iris-600"
              defaultValue={sidebarNavigation.find((item) => item.current).name}
              onChange={handleSelectChange}
            >
              {sidebarNavigation.map((item) => (
                <option key={item.name}>{item.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Menu button area */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 sm:pr-6 md:hidden">
          {/* Mobile menu button */}
          {/* <button
                    type="button"
                    className="-mr-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-iris-600"
                    onClick={() => setMobileMenuOpen(true)}
                    >
                    <span className="sr-only">Open main menu</span>
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    </button> */}
        </div>

        {/* Desktop nav area */}
        <div className="hidden md:flex md:min-w-0 md:flex-1 md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            {/* <div className="relative max-w-2xl text-gray-400 focus-within:text-gray-500">
              <input
                id="desktop-search"
                type="search"
                placeholder="Search your inbox"
                className="block w-full border-transparent pl-12 focus:border-transparent focus:ring-0 sm:text-sm"
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-4">
                <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
              </div>
            </div> */}
          </div>

          <div className="ml-10 flex flex-shrink-0 items-center space-x-10 pr-4">
            <nav aria-label="Global" className="flex space-x-10">
              <button
                type="button"
                className={`text-sm font-medium ${
                  select === 'friends' ? 'text-iris-500' : 'text-gray-900 hover:text-iris-500'
                }`}
                onClick={() => {
                  handleSelect('friends');
                  dispatch(setComposeNewinbox());
                }}
              >
                Friends
              </button>
              <button
                type="button"
                className={`text-sm font-medium ${
                  select === 'instructors' ? 'text-iris-500' : 'text-gray-900 hover:text-iris-500'
                }`}
                onClick={() => {
                  handleSelect('instructors');
                  dispatch(setComposeNewinbox());
                }}
              >
                Instructors
              </button>
              <button
                type="button"
                className={`text-sm font-medium ${
                  select === 'sellers' ? 'text-iris-500' : 'text-gray-900 hover:text-iris-500'
                }`}
                onClick={() => {
                  handleSelect('sellers');
                  dispatch(setComposeNewinbox());
                }}
              >
                Sellers
              </button>
            </nav>
            <div className="flex items-center space-x-8" />
          </div>
        </div>
      </header>

      {/* Bottom section */}
      <div className="min-h-1 flex flex-1 overflow-hidden">
        {/* Narrow sidebar */}
        <nav
          aria-label="Sidebar"
          className="hidden md:block md:flex-shrink-0 md:overflow-y-auto md:bg-gray-900"
        >
          <div className="relative flex w-20 flex-col space-y-3 p-3">
            {sidebarNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={classNames(
                  item.current
                    ? 'bg-gray-200 bg-opacity-10 text-white'
                    : 'text-gray-400 hover:bg-gray-700 bg-opacity-10',
                  'inline-flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg',
                )}
              >
                <span className="sr-only">{item.name}</span>
                <item.icon className="h-6 w-6" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </nav>
        {/* Main area */}
        <main className="min-w-0 flex-1 border-t border-gray-200 lg:flex">{children}</main>
      </div>
    </div>
  );
}
