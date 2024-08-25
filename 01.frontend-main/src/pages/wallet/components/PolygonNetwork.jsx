import React, { useEffect, useState } from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { useSelector } from 'react-redux';
import retry from 'async-retry';
import ListPolygonTokenBalances from '@/api/tokens/ListPolygonBalances';

import TokenListSec from './TokenListSec';
import FullWidthMoonLoader from '@/components/loaders/FullWidthMoonLoader';

export default function PolygonNetwork({ loading, fetchTokens, count, pageSize }) {
  //   const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [polygonTokenBalances, setPolygonTokenBalances] = useState([]);

  const [searchBy, setSearchBy] = useState('');

  const tokens = useSelector((state) => state.crypto.tokens);
  const wallet = useSelector((state) => state.auth.wallet);

  const [polygonTokens, setPolygonTokens] = useState([]);

  // This effect will only run once when the component mounts, as there are no dependencies.
  useEffect(() => {
    if (tokens !== undefined) {
      const polygonTokensRes = tokens.filter((token) => token.network === 'Polygon');
      setPolygonTokens(polygonTokensRes);
    }
  }, [tokens]);

  // This effect will run only when polygonTokens changes.
  useEffect(() => {
    async function fetchBalances() {
      if (polygonTokens.length > 0) {
        try {
          const polygonBalances = await retry(
            async () => {
              const response = await ListPolygonTokenBalances(
                polygonTokens,
                wallet && wallet.polygon_address,
              );
              if (response.status >= 400) throw new Error(response.statusText);
              return response;
            },
            {
              retries: 3, // The maximum number of retries
              minTimeout: 1000, // The minimum delay between retries (in milliseconds)
              factor: 2, // The factor to use for exponential backoff
            },
          );
          setPolygonTokenBalances(polygonBalances.data.results);
        } catch (error) {
          console.error('Failed to fetch polygon token balances:', error);
        }
      }
    }

    fetchBalances();
  }, [polygonTokens]);

  const onSubmit = async (e) => {
    e.preventDefault();
    fetchTokens(currentPage, searchBy);
  };

  return (
    <div>
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex w-full justify-between rounded-lg border dark:border-dark-second border-gray-400 px-4 py-4 text-left text-sm font-medium text-purple-900 transition duration-300 ease-in-out hover:border-gray-900 dark:hover:bg-dark-third hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
              <span className="text-lg font-medium dark:text-dark-txt">Polygon Network</span>
              <ChevronUpIcon
                className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-dark`}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="px-4 pb-2 text-sm text-gray-500">
              <div className="">
                {loading ? (
                  <FullWidthMoonLoader />
                ) : (
                  <TokenListSec
                    tokens={polygonTokens}
                    tokenBalances={polygonTokenBalances}
                    count={count}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                  />
                )}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
}
