import React from 'react';
import Link from 'next/link';
import StandardPagination from '@/components/pagination/StandardPagination';

export default function TokenListSec({
  tokens,
  tokenBalances,
  count,
  pageSize,
  currentPage,
  setCurrentPage,
}) {
  return (
    <div className="px-6 lg:px-8">
      <div className="mt-8 flow-root">
        <div className="-my-2 -mx-6 overflow-x-auto lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y dark:divide-dark-second divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-6 pr-3 text-left text-sm font-semibold dark:text-dark-txt text-gray-900 sm:pl-0"
                  >
                    Symbol
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 px-3 text-left text-sm font-semibold dark:text-dark-txt text-gray-900"
                  >
                    Address
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 px-3 text-left text-sm font-semibold dark:text-dark-txt text-gray-900"
                  >
                    Balance
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 px-3 text-left text-sm font-semibold dark:text-dark-txt text-gray-900"
                  >
                    Trade
                  </th>
                  {/* <th scope="col" className="relative py-3.5 pl-3 pr-6 sm:pr-0">
                    <span className="sr-only">Send</span>
                  </th> */}
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-dark-border divide-gray-200">
                {tokens &&
                  tokens.map((token) => (
                    <tr key={token.address}>
                      <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium dark:text-dark-txt-secondary text-gray-900 sm:pl-0">
                        {token.symbol}
                      </td>
                      <td className="whitespace-nowrap py-4 px-3 text-sm dark:text-dark-txt-secondary text-gray-500">
                        {token.address}
                      </td>
                      <td className="whitespace-nowrap py-4 px-3 text-sm dark:text-dark-txt-secondary text-gray-500">
                        {tokenBalances.find((tb) => tb[token.symbol])?.balance || 'N/A'}
                      </td>
                      <td className="whitespace-nowrap py-4 px-3 text-sm dark:text-dark-txt-secondary text-gray-500">
                        <Link
                          href="/send"
                          className="text-indigo-600 dark:text-dark-accent dark:hover:text-dark-primary hover:text-indigo-900"
                        >
                          Trade
                        </Link>
                      </td>
                      {/* <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium sm:pr-0">
                      <a href="/" className="text-indigo-600 hover:text-indigo-900">
                        Edit<span className="sr-only">, test</span>
                      </a>
                    </td> */}
                    </tr>
                  ))}
              </tbody>
            </table>
            <StandardPagination
              data={tokens && tokens}
              count={count}
              pageSize={pageSize}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
