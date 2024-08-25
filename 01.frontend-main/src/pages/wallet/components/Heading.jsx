import React, { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition, Tab } from '@headlessui/react';
import CircleLoader from 'react-spinners/CircleLoader';
import { EnvelopeIcon, QrCodeIcon } from '@heroicons/react/20/solid';
import Web3 from 'web3';
import GetContractABI from '@/api/tokens/GetContractABI';
import AddTokenToList from '@/api/tokens/AddTokenToList';
import GetContractABIPolygon from '@/api/tokens/GetContractABIPolygon';
import Button from '@/components/Button';
import { useSelector } from 'react-redux';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const web3 = new Web3(process.env.NEXT_PUBLIC_APP_RPC_ETH_PROVIDER);
const polygonWeb3 = new Web3(process.env.NEXT_PUBLIC_APP_RPC_POLYGON_PROVIDER);

export default function Heading({ fetchTokens, currentPage }) {
  const [open, setOpen] = useState(false);
  const [network, setNetwork] = useState('Ethereum');
  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState('');
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [decimals, setDecimals] = useState('');
  const [contractABI, setContractABI] = useState('');

  const wallet = useSelector((state) => state.auth.wallet);

  useEffect(() => {
    const fetchApi = async () => {
      if (address.length === 42) {
        try {
          if (network === 'Ethereum') {
            const res = await GetContractABI(address);
            const abi = JSON.parse(res.data.result);
            setContractABI(abi);
          }
          if (network === 'Polygon') {
            const res = await GetContractABIPolygon(address);
            const abi = JSON.parse(res.data.result);
            setContractABI(abi);
          }
        } catch (err) {
          console.error(err);
          setName('');
          setSymbol('');
          setDecimals('');
          setContractABI('');
        }
      } else {
        setName('');
        setSymbol('');
        setDecimals('');
        setContractABI('');
      }
    };
    fetchApi();
  }, [address, network]);

  useEffect(() => {
    const fetchData = async () => {
      if (contractABI !== '') {
        if (network === 'Ethereum') {
          const contract = new web3.eth.Contract(contractABI, address);
          setName(await contract.methods.name().call());
          setSymbol(await contract.methods.symbol().call());
          setDecimals(await contract.methods.decimals().call());
        }
        if (network === 'Polygon') {
          const contract = new polygonWeb3.eth.Contract(contractABI, address);
          setName(await contract.methods.name().call());
          setSymbol(await contract.methods.symbol().call());
          setDecimals(await contract.methods.decimals().call());
        }
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, [contractABI]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await AddTokenToList(address, name, symbol, decimals, network, wallet.address);
    fetchTokens(currentPage, '');
    setLoading(false);
    setOpen(false);
    setAddress('');
    setName('');
    setSymbol('');
    setDecimals('');
  };

  return (
    <div className="">
      <div className="-ml-4 -mt-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
        <div className="ml-4 mt-4">
          <p className="text-xl font-bold leading-6 dark:text-dark-txt text-gray-900">
            Your ERC20 Token List
          </p>
          <p className="text-md mt-2 text-gray-500 dark:text-dark-txt-secondary">
            A list of your tokens, you may add more tokens to keep track of and interact with.
          </p>
        </div>
        <div className="ml-4 mt-4 flex-shrink-0">
          <button
            type="button"
            onClick={() => {
              setOpen(true);
            }}
            className="relative inline-flex items-center dark:bg-dark-primary dark:hover:bg-dark-accent border border-transparent bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-dark focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Add Token to List +
          </button>
        </div>
      </div>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden dark:bg-dark-bg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title
                        as="div"
                        className="text-lg font-medium leading-6 dark:text-dark-txt text-gray-900"
                      >
                        Add ERC20 Token
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm dark:text-dark-txt-secondary text-gray-500">
                          Fill the form and add your token to the list to keep track and use within
                          boomslag.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Tab.Group>
                    <Tab.List className="flex space-x-1 rounded-xl  p-1">
                      <Tab
                        onClick={() => {
                          setNetwork('Ethereum');
                        }}
                        className={({ selected }) =>
                          classNames(
                            'w-full py-2.5 text-sm font-medium leading-5',
                            'focus:ring-none ring-white ring-opacity-60 ring-offset-2 ring-offset-gray-400 focus:outline-none',
                            selected
                              ? 'border border-gray-900 bg-white shadow-neubrutalism-sm dark:bg-dark-bg dark:border-dark-border dark:text-dark-txt'
                              : 'text-gray-500 hover:border hover:border-gray-900 hover:bg-gray-200 hover:text-gray-700 hover:shadow-neubrutalism-sm dark:text-dark-txt dark:hover:bg-dark-second dark:hover:border-dark-border dark:hover:text-dark-txt',
                          )
                        }
                      >
                        Ethereum Network
                      </Tab>
                      <Tab
                        onClick={() => {
                          setNetwork('Polygon');
                        }}
                        className={({ selected }) =>
                          classNames(
                            'w-full py-2.5 text-sm font-medium leading-5',
                            'focus:ring-none ring-white ring-opacity-60 ring-offset-2 ring-offset-gray-400 focus:outline-none',
                            selected
                              ? 'border border-gray-900 bg-white shadow-neubrutalism-sm dark:bg-dark-bg dark:border-dark-border dark:text-dark-txt'
                              : 'text-gray-500 hover:border hover:border-gray-900 hover:bg-gray-200 hover:text-gray-700 hover:shadow-neubrutalism-sm dark:text-dark-txt dark:hover:bg-dark-second dark:hover:border-dark-border dark:hover:text-dark-txt',
                          )
                        }
                      >
                        Polygon Network
                      </Tab>
                    </Tab.List>
                    <Tab.Panels className="mt-2">
                      <Tab.Panel className={classNames('rounded-xl  p-3', '')}>
                        <form onSubmit={onSubmit} className="space-y-3">
                          <div className="relative mt-1 rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <QrCodeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </div>
                            <input
                              type="text"
                              placeholder="Address"
                              value={address}
                              name="address"
                              onChange={(e) => setAddress(e.target.value)}
                              required
                              className="text-md duration block w-full  py-3 pl-10 font-medium shadow-neubrutalism-sm transition ease-in-out focus:border-gray-900 focus:ring-gray-900 dark:bg-dark-second dark:text-dark-txt"
                            />
                          </div>
                          <div className="relative mt-1 rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </div>
                            <input
                              type="text"
                              placeholder="Name"
                              value={name}
                              name="name"
                              required
                              onChange={(e) => setName(e.target.value)}
                              className="text-md duration block w-full  py-3 pl-10 font-medium shadow-neubrutalism-sm transition ease-in-out focus:border-gray-900 focus:ring-gray-900 dark:bg-dark-second dark:text-dark-txt"
                            />
                          </div>
                          <div className="relative mt-1 rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </div>
                            <input
                              type="text"
                              placeholder="Symbol"
                              value={symbol}
                              name="symbol"
                              required
                              onChange={(e) => setSymbol(e.target.value)}
                              className="text-md duration block w-full  py-3 pl-10 font-medium shadow-neubrutalism-sm transition ease-in-out focus:border-gray-900 focus:ring-gray-900 dark:bg-dark-second dark:text-dark-txt"
                            />
                          </div>
                          <div className="relative mt-1 rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </div>
                            <input
                              type="number"
                              placeholder="Decimals"
                              name="decimals"
                              value={decimals}
                              required
                              onChange={(e) => setDecimals(e.target.value)}
                              className="text-md duration block w-full  py-3 pl-10 font-medium shadow-neubrutalism-sm transition ease-in-out focus:border-gray-900 focus:ring-gray-900 dark:bg-dark-second dark:text-dark-txt"
                            />
                          </div>

                          <div>
                            {loading ? (
                              <Button>
                                <CircleLoader loading={loading} size={25} color="#1c1d1f" />
                              </Button>
                            ) : (
                              <Button type="submit">Add Token</Button>
                            )}
                          </div>
                        </form>
                      </Tab.Panel>
                      <Tab.Panel className={classNames('rounded-xl  p-3', '')}>
                        <form onSubmit={onSubmit} className="space-y-3">
                          <div className="relative mt-1 rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <QrCodeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </div>
                            <input
                              type="text"
                              placeholder="Address"
                              value={address}
                              name="address"
                              onChange={(e) => setAddress(e.target.value)}
                              required
                              className="text-md duration block w-full  py-3 pl-10 font-medium shadow-neubrutalism-sm transition ease-in-out focus:border-gray-900 focus:ring-gray-900 dark:bg-dark-second dark:text-dark-txt"
                            />
                          </div>
                          <div className="relative mt-1 rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </div>
                            <input
                              type="text"
                              placeholder="Name"
                              value={name}
                              name="name"
                              required
                              onChange={(e) => setName(e.target.value)}
                              className="text-md duration block w-full  py-3 pl-10 font-medium shadow-neubrutalism-sm transition ease-in-out focus:border-gray-900 focus:ring-gray-900 dark:bg-dark-second dark:text-dark-txt"
                            />
                          </div>
                          <div className="relative mt-1 rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </div>
                            <input
                              type="text"
                              placeholder="Symbol"
                              value={symbol}
                              name="symbol"
                              required
                              onChange={(e) => setSymbol(e.target.value)}
                              className="text-md duration block w-full  py-3 pl-10 font-medium shadow-neubrutalism-sm transition ease-in-out focus:border-gray-900 focus:ring-gray-900 dark:bg-dark-second dark:text-dark-txt"
                            />
                          </div>
                          <div className="relative mt-1 rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </div>
                            <input
                              type="number"
                              placeholder="Decimals"
                              name="decimals"
                              value={decimals}
                              required
                              onChange={(e) => setDecimals(e.target.value)}
                              className="text-md duration block w-full  py-3 pl-10 font-medium shadow-neubrutalism-sm transition ease-in-out focus:border-gray-900 focus:ring-gray-900 dark:bg-dark-second dark:text-dark-txt"
                            />
                          </div>

                          <div>
                            {loading ? (
                              <Button>
                                <CircleLoader loading={loading} size={25} color="#1c1d1f" />
                              </Button>
                            ) : (
                              <Button type="submit">Add Token</Button>
                            )}
                          </div>
                        </form>
                      </Tab.Panel>
                    </Tab.Panels>
                  </Tab.Group>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
