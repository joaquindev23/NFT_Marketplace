import React from 'react';

export default function Details({ details }) {
  return (
    <>
      <div>
        <h3 className="text-lg font-semibold leading-6 text-gray-90 dark:text-dark-txt">
          Course Information
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-dark-txt-secondary">
          NFT Information.
        </p>
      </div>
      <div className="mt-5 border-t border-gray-200 dark:border-dark-border">
        <dl className="divide-y dark:divide-dark-border divide-gray-200">
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
            <dt className="text-sm font-medium text-gray-500 dark:text-dark-txt">Address</dt>
            <dd className="mt-1 flex text-sm dark:text-dark-txt-secondary text-gray-900 sm:col-span-2 sm:mt-0">
              <span className="flex-grow dark:text-dark-txt-secondary">
                {details && details.nft_address !== '0' && details.nft_address !== null
                  ? details.nft_address
                  : 'NFT Not Deployed Yet'}
              </span>
              <span className="ml-4 flex-shrink-0 ">
                {details && details.nft_address !== '0' && details.nft_address !== null && (
                  <a
                    href={`https://mumbai.polygonscan.com/address/${details.nft_address}`}
                    className="text-indigo-600 dark:text-dark-accent dark:hover:text-dark-primary hover:text-indigo-500 focus:ring-indigo-500 rounded-md  font-medium focus:outline-none focus:ring-2 focus:ring-offset-2"
                    target="_blank"
                    rel="noreferrer"
                  >
                    View on Polygonscan
                  </a>
                )}
              </span>
            </dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
            <dt className="text-sm font-medium text-gray-500 dark:text-dark-txt">Token ID</dt>
            <dd className="mt-1 flex text-sm dark:text-dark-txt-secondary text-gray-900 sm:col-span-2 sm:mt-0">
              <span className="flex-grow">{details && details.token_id}</span>
            </dd>
          </div>
        </dl>
      </div>
    </>
  );
}
