import { Fragment, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CircleLoader } from 'react-spinners/CircleLoader';
import { Listbox, Transition, Tab } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import Web3 from 'web3';
import GetContractABI from '@/api/tokens/GetContractABI';
import SendTokens from '@/api/tokens/SendTokens';
import { ToastError } from '@/components/ToastError';
import LoadingMoon from '@/components/loaders/LoadingMoon';
import Button from '@/components/Button';
import { resetSendTokens, sendTokens } from '@/redux/actions/crypto/crypto';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function SendEthereum({ wallet, txInfo }) {
  const web3 = new Web3(process.env.NEXT_PUBLIC_APP_RPC_ETH_PROVIDER);

  const [gasPrice, setGasPrice] = useState(0);
  const [gasLimit, setGasLimit] = useState(21000);

  const tokens = useSelector((state) => state.crypto.tokens);
  const sending = useSelector((state) => state.crypto.sending_tokens);
  const [ethTokens, setEthTokens] = useState([]);

  const [selected, setSelected] = useState(null); // Set it to null initially

  useEffect(() => {
    const ethTokensRes = tokens.filter((token) => token.network === 'Ethereum');
    setEthTokens(ethTokensRes);
    setSelected(ethTokensRes[0]); // Set the selected state here
  }, [tokens]);

  const totalGasFeeWei = gasPrice * gasLimit;
  const totalGasFeeEther = web3.utils.fromWei(totalGasFeeWei.toString(), 'ether');
  const estimatedGasFeeEther = totalGasFeeEther;
  const estimatedGasFeeEtherFast = totalGasFeeEther * 1.75;
  const estimatedGasFeeEtherFastest = totalGasFeeEther * 2.5;

  const [amount, setAmount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [txHash, setTxHash] = useState('');
  // const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    toAccount: '',
  });

  const [avgWait, setAvgWait] = useState(null);
  const [fastWait, setFastWait] = useState(null);
  const [fastestWait, setFastestWait] = useState(null);

  // Fetch the average block time on component mount
  useEffect(() => {
    const fetchBlockTime = async () => {
      try {
        const response = await fetch('https://ethgasstation.info/json/ethgasAPI.json');
        const data = await response.json();
        setAvgWait(data.avgWait);
        setFastWait(data.fastWait);
        setFastestWait(data.fastestWait);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBlockTime();
  }, []);
  // Calculate the estimated transaction time based on the block time and gas limit
  const estimatedTime = avgWait * 60;
  const estimatedTimeFast = fastWait * 60;
  const estimatedTimeFastest = fastestWait * 60;

  const [balance, setBalance] = useState('');
  const [contractABI, setContractABI] = useState('');

  useEffect(() => {
    const fetchApi = async () => {
      if (selected && selected.address.length === 42 && selected.symbol !== 'ETH') {
        try {
          const res = await GetContractABI(selected.address);
          console.log('Response:', res.data.result);

          if (res.data.result === 'Contract source code not verified') {
            console.warn('Contract ABI not available: Contract source code not verified');
            setBalance('');
            setContractABI('');
          } else {
            const abi = JSON.parse(res.data.result);
            setContractABI(abi);
          }
        } catch (err) {
          console.error(err);
          setBalance('');
          setContractABI('');
        }
      } else {
        setBalance('');
        setContractABI('');
      }
    };
    if (selected) {
      fetchApi();
    }
  }, [selected]);

  useEffect(() => {
    const fetchData = async () => {
      if (selected && selected.symbol === 'ETH') {
        console.log('Fetch ETH Balance');
        setBalance(await web3.eth.getBalance(wallet.address));
        setGasLimit(21000);
      } else if (contractABI !== '') {
        const contract = new web3.eth.Contract(contractABI, selected.address);
        setBalance(await contract.methods.balanceOf(wallet.address).call());
        if (toAccount !== '' && amount !== '' && amount > 0) {
          const data = contract.methods.transfer(toAccount, amount).encodeABI();
          const limit = await web3.eth.estimateGas({
            from: wallet.address,
            to: toAccount,
            data: data,
          });
          setGasLimit(limit);
          console.log('Gas Limit: ', gasLimit);
        }
      }
    };
    fetchData();

    const getGasPrice = async () => {
      const res = await web3.eth.getGasPrice();
      setGasPrice(res);
    };
    getGasPrice();
    // eslint-disable-next-line
  }, [contractABI, selected, wallet, toAccount, amount]);

  const handleMaxClick = () => {
    setAmount(web3.utils.fromWei(balance.toString(), 'ether'));
  };

  const [ethBalance, setEthBalance] = useState(0);
  const [sendDisabled, setSendDisabled] = useState(true);

  const walletAddress = wallet && wallet.address;

  useEffect(() => {
    const fetchEthBalance = async () => {
      if (walletAddress) {
        try {
          const res = await web3.eth.getBalance(wallet.address);
          setEthBalance(res);
        } catch (error) {
          console.error('Error fetching ETH balance:', error);
        }
      }
    };
    fetchEthBalance();
  }, [walletAddress]);

  useEffect(() => {
    const estimatedGasFeeWei = gasPrice * gasLimit;
    const estimatedTotalCost =
      Number(amount) + Number(web3.utils.fromWei(estimatedGasFeeWei.toString(), 'ether'));

    setSendDisabled(ethBalance < estimatedTotalCost);

    // eslint-disable-next-line
  }, [ethBalance, gasPrice, gasLimit, amount]);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(resetSendTokens());
  }, []);
  const [speed, setSpeed] = useState('average');
  const onSend = async () => {
    if (toAccount !== '' && amount !== '' && amount > 0 && balance > 0 && ethBalance > 0) {
      dispatch(sendTokens(wallet.address, toAccount, amount, selected, speed, gasLimit));
    } else {
      let errorMessage = 'Please enter the following: ';
      if (toAccount === '') {
        errorMessage += 'to account, ';
      }
      if (amount === '') {
        errorMessage += 'amount, ';
      }
      if (amount <= 0) {
        errorMessage += 'a valid amount, ';
      }
      if (balance <= 0) {
        errorMessage += `enough ${selected.symbol} balance, `;
      }
      if (ethBalance <= 0) {
        errorMessage += 'enough ETH balance to cover gas fees, ';
      }
      ToastError(`${errorMessage.slice(0, -2)}.`);
    }
  };

  return (
    <div>
      <div className=" flex flex-wrap items-center justify-between sm:flex-nowrap">
        <div className="">
          <p className="text-xl font-bold leading-6 dark:text-dark-txt text-gray-900">
            Ethereum Network
          </p>
          <p className="text-md mt-2 dark:text-dark-txt-secondary text-gray-500">
            Send ERC20 tokens to any ERC20 compatible wallet.
          </p>
        </div>
      </div>

      <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4  sm:border-gray-200 sm:pt-5">
        <span className="block text-sm font-semibold text-gray-700 dark:text-dark-txt sm:mt-px sm:pt-2">
          Send to ERC20 Address
        </span>
        <div className="mt-1 sm:col-span-2 sm:mt-0">
          <div className="flex max-w-lg rounded-xl shadow-sm">
            <input
              type="text"
              name="toAccount"
              placeholder="0x0000000000000000000000000000000000000"
              value={toAccount}
              onChange={(e) => setToAccount(e.target.value)}
              className="text-md duration block w-full border focus:ring-none focus:outline-none border-dark py-3 pl-4 font-medium  dark:placeholder-dark-txt-secondary shadow-neubrutalism-xs transition ease-in-out dark:bg-dark-second dark:text-dark-txt"
            />
          </div>
        </div>
      </div>
      <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4  sm:border-gray-200 sm:pt-5">
        <span className="block text-sm font-semibold text-gray-700 dark:text-dark-txt sm:mt-px sm:pt-2">
          Select Token
        </span>
        <div className="mt-1 sm:col-span-2 sm:mt-0">
          <div className="flex max-w-lg rounded-xl shadow-sm">
            <div className="w-full">
              <Listbox value={selected && selected} onChange={setSelected}>
                <div className="relative mt-1">
                  <Listbox.Button className="focus-visible:border-indigo-500 focus-visible:ring-offset-orange-300 sm:text-md relative w-full cursor-default border border-gray-900 dark:bg-dark-bg dark:shadow-none dark:border-dark-border bg-white py-3 pl-3 pr-10 text-left shadow-neubrutalism-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2">
                    <span className="block truncate">
                      {selected && selected.name} ({selected && selected.symbol})
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="text-md duration absolute mt-1 block max-h-60 w-full overflow-auto border dark:border-dark-border bg-white py-3 text-base font-medium shadow-neubrutalism-sm ring-1 ring-black ring-opacity-5 transition ease-in-out placeholder:text-gray-300  focus:outline-none focus:ring-gray-900 dark:bg-dark-bg dark:text-dark-txt sm:text-sm">
                      {ethTokens.map((token) => (
                        <Listbox.Option
                          key={token.address}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active
                                ? 'bg-amber-100 text-amber-900'
                                : 'text-gray-900 dark:text-dark-txt'
                            }`
                          }
                          value={token}
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? 'font-bold' : 'font-normal'
                                }`}
                              >
                                {token.name} ({token.symbol})
                              </span>
                              {selected ? (
                                <span className="text-amber-600 absolute inset-y-0 left-0 flex items-center pl-3">
                                  <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>
          </div>
        </div>
      </div>
      <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4  sm:border-gray-200 sm:pt-5">
        <span className="block text-sm font-semibold text-gray-700 dark:text-dark-txt sm:mt-px sm:pt-2">
          Balance: {web3.utils.fromWei(balance.toString(), 'ether')}
        </span>
        <div className="mt-1 sm:col-span-2 sm:mt-0">
          <div className="flex max-w-lg">
            <input
              type="number"
              name="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.1"
              className="text-md duration block w-full border focus:ring-none focus:outline-none border-dark py-3 pl-4 font-medium  dark:placeholder-dark-txt-secondary shadow-neubrutalism-xs transition ease-in-out dark:bg-dark-second dark:text-dark-txt"
              min={0} // Set the minimum value to 0
            />
            <button
              type="button"
              onClick={handleMaxClick}
              className="text-md ml-2 inline-flex w-20
                      items-center
                      justify-center
                      border 
                      border-dark-bg 
                      bg-white 
                      dark:shadow-none
                      dark:border-dark-border
                      px-4 
                      py-3 
                      font-bold 
                      shadow-neubrutalism-md 
                      transition 
                      duration-300
                      ease-in-out
                      hover:-translate-x-0.5  hover:-translate-y-0.5 hover:bg-gray-50 hover:text-iris-600  
                      hover:shadow-neubrutalism-lg
                     dark:bg-dark-second dark:text-dark-txt dark:hover:text-white"
            >
              Max
            </button>
          </div>
        </div>
      </div>
      <div className="mt-4 rounded-lg border dark:border-dark-second border-gray-500 px-4 py-3 text-right dark:bg-dark-bg sm:px-6">
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl  p-1">
            <Tab
              onClick={() => {
                setSpeed('average');
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
              Average
            </Tab>
            <Tab
              onClick={() => {
                setSpeed('fast');
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
              Fast
            </Tab>
            <Tab
              onClick={() => {
                setSpeed('fastest');
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
              Fastest
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-2">
            <Tab.Panel className={classNames('rounded-xl  p-3', '')}>
              <div>
                <div className=" text-left font-bold">
                  Gas: <span className="text-gray-500">(estimated)</span>
                  <span className="font-regular text-sm"> {estimatedGasFeeEther}</span>
                </div>
                <div className=" text-left font-bold">
                  ETH Balance:
                  <span className="font-regular text-sm">
                    {' '}
                    {web3.utils.fromWei(ethBalance.toString(), 'ether')}
                  </span>
                </div>
                <div className="pb-2 text-left text-forest-green-300">
                  Likely in {estimatedTime} seconds
                </div>
              </div>
            </Tab.Panel>
            <Tab.Panel className={classNames('rounded-xl  p-3', '')}>
              <div>
                <div className=" text-left font-bold">
                  Gas: <span className="text-gray-500">(estimated)</span>
                  <span className="font-regular text-sm"> {estimatedGasFeeEtherFast}</span>
                </div>
                <div className=" text-left font-bold">
                  ETH Balance:
                  <span className="font-regular text-sm">
                    {' '}
                    {web3.utils.fromWei(ethBalance.toString(), 'ether')}
                  </span>
                </div>
                <div className="pb-2 text-left text-forest-green-300">
                  Likely in {estimatedTimeFast} seconds
                </div>
              </div>
            </Tab.Panel>
            <Tab.Panel className={classNames('rounded-xl  p-3', '')}>
              <div>
                <div className=" text-left font-bold">
                  Gas: <span className="text-gray-500">(estimated)</span>
                  <span className="font-regular text-sm"> {estimatedGasFeeEtherFastest}</span>
                </div>
                <div className=" text-left font-bold">
                  ETH Balance:
                  <span className="font-regular text-sm">
                    {' '}
                    {web3.utils.fromWei(ethBalance.toString(), 'ether')}
                  </span>
                </div>
                <div className="pb-2 text-left text-forest-green-300">
                  Likely in {estimatedTimeFastest} seconds
                </div>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>

        {txInfo && txInfo.tx_hash ? (
          <div className="  py-5  ">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              Transaction Hash
            </h3>
            <a
              href={`https://etherscan.io/tx/${txInfo && txInfo.tx_hash}`}
              target="_blank"
              rel="noreferrer"
              className="mt-1 text-xs text-purple-500"
            >
              {txInfo && txInfo.tx_hash}
            </a>
          </div>
        ) : (
          <div />
        )}
        {sending ? (
          <Button>
            <LoadingMoon size={25} color="#1c1d1f" />
          </Button>
        ) : (
          <>
            {loading ? (
              <Button>
                <CircleLoader loading={loading} className="inline-flex" size={20} color="#ffffff" />
              </Button>
            ) : (
              <Button
                onClick={() => {
                  onSend();
                }}
                disabled={!sendDisabled && (amount === '' || toAccount === '')}
              >
                Send
              </Button>
            )}
            <div />
          </>
        )}
      </div>
    </div>
  );
}
