import Image from 'next/image';
import React, { useState } from 'react';
import { RadioGroup } from '@headlessui/react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { ToastSuccess } from '@/components/ToastSuccess';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function PaymentMethod({
  ethPayment,
  setEthPayment,
  handleEthPayment,
  maticBalance,
  ethereumWallet,
  maticCost,
}) {
  const [effectETH, setEffectETH] = useState(false);
  return (
    <>
      {/* Ethereum Payment */}
      <RadioGroup
        onClick={() => {
          handleEthPayment();
        }}
        value={ethPayment}
        onChange={setEthPayment}
      >
        <RadioGroup.Label className="sr-only"> Server size </RadioGroup.Label>
        <div className="space-y-4">
          <RadioGroup.Option
            value="ethereum"
            onMouseDown={() => {
              setEffectETH(true);
            }}
            onMouseUp={() => setEffectETH(false)}
            className={({ checked, active }) =>
              classNames(
                checked ? 'border-transparent' : ' dark:border-dark-border border-gray-900',
                active ? 'border-gray-900 dark:border-dark-border  ring-gray-900' : '',
                effectETH
                  ? 'duration-400 animate-click hover:translate-x-0.5  hover:translate-y-0.5 hover:shadow-neubrutalism-sm'
                  : '',
                'relative mb-1.5 block cursor-pointer  border-2 dark:bg-dark-second bg-white px-6 py-4 dark:shadow-none shadow-neubrutalism-sm transition duration-300 ease-in-out hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neubrutalism-md focus:outline-none sm:flex sm:justify-between',
              )
            }
          >
            {({ active, checked }) => (
              <>
                <span className="flex items-center">
                  <span className="flex flex-col text-sm">
                    <RadioGroup.Label
                      as="span"
                      className="text-base font-bold dark:text-dark-txt text-gray-900"
                    >
                      Polygon
                    </RadioGroup.Label>
                    <RadioGroup.Description as="span" className="text-gray-500">
                      <span className="block sm:inline" />
                    </RadioGroup.Description>
                  </span>
                </span>
                <RadioGroup.Description
                  as="span"
                  className="mt-2 flex text-sm sm:mt-0 sm:ml-4 sm:flex-col sm:text-right"
                >
                  <Image
                    width={40}
                    height={40}
                    className="h-5 w-5"
                    src="/assets/img/polygon.png"
                    alt=""
                  />
                  <span className="ml-1 sm:ml-0" />
                </RadioGroup.Description>
                <span
                  className={classNames(
                    active ? 'border ' : 'border-2',
                    checked ? 'border-gray-900 dark:border-dark-border' : 'border-transparent',
                    'pointer-events-none absolute -inset-px dark:text-dark-txt',
                  )}
                  aria-hidden="true"
                />
              </>
            )}
          </RadioGroup.Option>
        </div>
      </RadioGroup>
      {ethPayment !== null ? (
        <div className="my-4   ">
          <div className="  px-4  sm:px-6">
            <div className=" flex flex-wrap items-center justify-between sm:flex-nowrap">
              <div className=" ">
                <p className="mt-1 text-lg font-bold leading-6 dark:text-dark-txt text-gray-600">
                  Transaction Information
                </p>
              </div>
              <div className="ml-4 mt-2 flex-shrink-0">
                <span className="font-regular mr-2 inline-flex text-sm dark:text-dark-txt-secondary text-gray-500">
                  {maticBalance > maticCost + 0.05 ? 'Sufficient funds' : 'Insufficient funds'}
                </span>
                {maticBalance > maticCost + 0.05 ? (
                  <CheckCircleIcon className="relative inline-flex h-5 w-5 text-forest-green-300" />
                ) : (
                  <XCircleIcon className="relative inline-flex h-5 w-5 text-rose-500" />
                )}
              </div>
            </div>
          </div>

          {/* Your wallet info */}
          <div className=" px-4  sm:px-6">
            <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
              <div className="ml-4 mt-2">
                <p className="font-regular text-base leading-6 dark:text-dark-txt text-gray-900">
                  Your Wallet
                </p>
              </div>
              <div className="ml-4 mt-2 flex-shrink-0">
                <CopyToClipboard text={ethereumWallet && ethereumWallet.polygon_address}>
                  <button
                    type="button"
                    onClick={() => {
                      ToastSuccess('Copiado');
                    }}
                    className="relative inline-flex w-full cursor-pointer items-center py-2 text-sm font-medium dark:text-dark-txt-secondary text-gray-600"
                  >
                    {ethereumWallet && ethereumWallet.polygon_address}
                  </button>
                </CopyToClipboard>
              </div>
            </div>
          </div>
          <div className=" px-4  sm:px-6">
            <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
              <div className="ml-4 mt-2">
                <p className="font-regular text-base leading-6 dark:text-dark-txt text-gray-900">
                  Available MATIC
                </p>
              </div>
              <div className="ml-4 mt-2 flex-shrink-0">
                <div className="relative inline-flex cursor-pointer items-center dark:text-dark-txt-secondary py-2 text-sm font-medium text-gray-600">
                  {maticBalance}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div />
      )}
    </>
  );
}
