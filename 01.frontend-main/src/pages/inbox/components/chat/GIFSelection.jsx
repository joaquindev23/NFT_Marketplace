import { Menu, Popover, Transition } from '@headlessui/react';
import { ChevronDownIcon, GifIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import React, { Fragment, useState } from 'react';
import SearchGiphy from '@/api/chat/SearchGiphy';

export default function GIFSelection({ selectedGif, setSelectedGif, gifs, setGifs }) {
  const [offsetGIF, setOffsetGIF] = useState(0);
  const [GIFLimit, setGIFLimit] = useState(30);
  const [GIFRating, setGIFRating] = useState('r');
  const [GIFLanguage, setGIFLanguage] = useState('es');
  const [searchGIFQuery, setSearchGIFQuery] = useState('');

  const handleSearchGif = async (e) => {
    e.preventDefault();

    const res = await SearchGiphy(searchGIFQuery, GIFLimit, offsetGIF, GIFRating, GIFLanguage);
    setGifs(res.data.data);
    // console.log(res);
  };

  const handleGIFSelect = (gif) => {
    setSelectedGif({
      url: gif.images.downsized.url,
      title: gif.title,
      slug: gif.slug,
      embed_url: gif.embed_url,
      source: gif.source,
      rating: gif.rating,
    });
  };

  return (
    <div className="flex-items flex">
      {/* <button
                type="button"
                className="relative -m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
              >
                <span className="flex items-center justify-center">
                  <span>
                    <GifIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                    <span className="sr-only"> Add your mood </span>
                  </span>
                </span>
              </button> */}

      <Popover as="div" className="relative inline-block text-left">
        {({ open }) => (
          <>
            <div>
              <Popover.Button
                className={`
            ${open ? '' : 'text-opacity-90'}
            relative -m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500
          `}
              >
                <span className="flex items-center justify-center">
                  <span>
                    <GifIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                    <span className="sr-only"> Add your gif </span>
                  </span>
                </span>
              </Popover.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel
                className="
      absolute z-20 mt-2 w-screen max-w-xl origin-top-left transform rounded-lg border border-gray-200 bg-white shadow-lg ring-1 ring-black ring-opacity-5
    "
                style={{ top: '-19rem' }}
              >
                <div className="relative h-80 overflow-y-auto rounded-lg p-4">
                  <div className="fixed top-2 mt-1 flex gap-x-4">
                    <div className="w-full ">
                      <form onSubmit={handleSearchGif} className=" border-b-300  flex border">
                        <div className=" flex flex-grow items-stretch ">
                          <input
                            type="text"
                            value={searchGIFQuery}
                            onChange={(e) => {
                              setSearchGIFQuery(e.target.value);
                            }}
                            className="text-md block w-full border border-gray-700 outline-none ring ring-transparent focus:border-gray-700 focus:outline-transparent focus:ring-transparent"
                            placeholder="Search Giphy"
                          />
                        </div>
                        <button
                          type="submit"
                          className="relative -ml-px inline-flex items-center space-x-2 border-l bg-black px-4 py-2 text-sm font-medium text-white"
                        >
                          <MagnifyingGlassIcon className="h-5 w-5 text-white" aria-hidden="true" />
                        </button>
                      </form>
                    </div>
                    <Menu as="div" className="relative inline-block text-left">
                      <div>
                        <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 border border-gray-700 bg-white px-4 py-2.5 text-sm font-black text-gray-700  hover:bg-gray-50">
                          {GIFRating === 'r' && 'r'}
                          {GIFRating === 'g' && 'g'}
                          {GIFRating === 'pg' && 'pg'}
                          {GIFRating === 'pg-13' && 'pg-13'}
                          <ChevronDownIcon
                            className="-mr-1 h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </Menu.Button>
                      </div>

                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-28 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <div className="py-1">
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  type="button"
                                  onClick={async () => {
                                    setGIFRating('r');
                                  }}
                                  className={classNames(
                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                    'block w-full cursor-pointer px-4 py-2 text-left text-sm ',
                                  )}
                                >
                                  r
                                </button>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  type="button"
                                  onClick={async () => {
                                    setGIFRating('g');
                                  }}
                                  className={classNames(
                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                    'block w-full cursor-pointer px-4 py-2 text-left text-sm ',
                                  )}
                                >
                                  g
                                </button>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  type="button"
                                  onClick={async () => {
                                    setGIFRating('pg');
                                  }}
                                  className={classNames(
                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                    'block w-full cursor-pointer px-4 py-2 text-left text-sm ',
                                  )}
                                >
                                  pg
                                </button>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  type="button"
                                  onClick={async () => {
                                    setGIFRating('pg-13');
                                  }}
                                  className={classNames(
                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                    'block w-full cursor-pointer px-4 py-2 text-left text-sm ',
                                  )}
                                >
                                  pg-13
                                </button>
                              )}
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                    <Menu as="div" className="relative inline-block text-left">
                      <div>
                        <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 border border-gray-700 bg-white px-4 py-2.5 text-sm font-black text-gray-700  hover:bg-gray-50">
                          {GIFLanguage === 'en' && 'en'}
                          {GIFLanguage === 'es' && 'es'}
                          {GIFLanguage === 'pt' && 'pt'}
                          {GIFLanguage === 'it' && 'it'}
                          {GIFLanguage === 'fr' && 'fr'}
                          <ChevronDownIcon
                            className="-mr-1 h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </Menu.Button>
                      </div>

                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <div className="py-1">
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  type="button"
                                  onClick={async () => {
                                    setGIFLanguage('en');
                                  }}
                                  className={classNames(
                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                    'block w-full cursor-pointer px-4 py-2 text-left text-sm ',
                                  )}
                                >
                                  English
                                </button>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  type="button"
                                  onClick={async () => {
                                    setGIFLanguage('es');
                                  }}
                                  className={classNames(
                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                    'block w-full cursor-pointer px-4 py-2 text-left text-sm ',
                                  )}
                                >
                                  Español
                                </button>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  type="button"
                                  onClick={async () => {
                                    setGIFLanguage('fr');
                                  }}
                                  className={classNames(
                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                    'block w-full cursor-pointer px-4 py-2 text-left text-sm ',
                                  )}
                                >
                                  Francais
                                </button>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  type="button"
                                  onClick={async () => {
                                    setGIFLanguage('pt');
                                  }}
                                  className={classNames(
                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                    'block w-full cursor-pointer px-4 py-2 text-left text-sm ',
                                  )}
                                >
                                  Portuguese
                                </button>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  type="button"
                                  onClick={async () => {
                                    setGIFLanguage('it');
                                  }}
                                  className={classNames(
                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                    'block w-full cursor-pointer px-4 py-2 text-left text-sm ',
                                  )}
                                >
                                  Italiano
                                </button>
                              )}
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                  <div className="mt-12 grid auto-rows-max grid-cols-3 gap-4 overflow-y-auto p-4">
                    {gifs &&
                      gifs.map((gif) => (
                        <button onClick={() => handleGIFSelect(gif)} type="button">
                          <img
                            key={gif.id}
                            src={gif.images.downsized.url}
                            width={60}
                            height={60}
                            alt={gif.title}
                            className="h-32 w-full rounded-lg object-contain"
                          />
                        </button>
                      ))}
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
}
