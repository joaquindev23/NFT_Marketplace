import { useRouter } from 'next/router';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import useWindowSize from 'react-use/lib/useWindowSize';
import Confetti from 'react-confetti';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import { CircleLoader } from 'react-spinners/CircleLoader';
import Web3 from 'web3';
import Sidebar from '../../components/sidebar';
import { resetCourseNFT } from '@/redux/actions/courses/courses';
import GetDeployNFTPrice from '@/api/courses/GetDeployNFTPrice';
import DeployNFT from '@/api/tokens/DeployNFT';
import { ToastSuccess } from '@/components/ToastSuccess';
import { ToastError } from '@/components/ToastError';
import {
  getProduct,
  updateProductKeywords,
  updateProductSlug,
  updateProductStatus,
  updateProductStock,
} from '@/redux/actions/products/products';
import EditNFTAddress from '@/api/manage/products/EditNFTAddress';

export default function ManageProductLayout({
  children,
  myUser,
  isAuthenticated,
  title,
  product,
  productUUID,
}) {
  const router = useRouter();

  const web3 = new Web3(process.env.NEXT_PUBLIC_APP_RPC_POLYGON_PROVIDER);
  const [openTx, setOpenTx] = useState(false);
  const [deploying, setDeploying] = useState(false);

  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [canPublish, setCanPublish] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const txHash = useSelector((state) => state.courses.txHash);
  const details = product && product.details;

  const [deploymentCost, setDeploymentCost] = useState(0);
  const [maticBalance, setMaticBalance] = useState(0);

  const wallet = useSelector((state) => state.auth.wallet);
  const userPolygonAddress = wallet && wallet.polygon_address;
  const userAddress = wallet && wallet.address;

  const dispatch = useDispatch();

  const productWeights = product && product.weights;
  // Function to calculate the total stock based on the product weights
  const calculateTotalStock = (weights) => {
    return weights.reduce((total, weight) => total + weight.stock, 0);
  };

  const getInitialStock = () => {
    if (productWeights && productWeights.length > 0) {
      return calculateTotalStock(productWeights);
    }
    return 0;
  };

  useEffect(() => {
    if (userPolygonAddress) {
      web3.eth.getBalance(userPolygonAddress, (err, balance) => {
        if (err) {
          // eslint-disable-next-line
          console.error(err);
        } else {
          setMaticBalance(web3.utils.fromWei(balance, 'ether'));
        }
      });
    }
  }, [userPolygonAddress]);

  useEffect(() => {
    if (details) {
      if (
        details.target_audience_bool &&
        details.features_bool &&
        details.supply_chain_bool &&
        details.delivery_bool &&
        details.warehousing_bool &&
        details.value_proposition_bool &&
        details.marketing_strategy_bool &&
        details.product_details_bool &&
        details.accessibility_bool &&
        details.documentation_bool &&
        details.landing_page_bool &&
        details.pricing_bool &&
        details.promotions_bool &&
        details.shipping_bool &&
        details.messages_bool
      ) {
        setCanPublish(true);
      } else {
        setCanPublish(false);
      }
    }
  }, [details]);

  const [formData, setFormData] = useState({
    keywords: '',
    slug: '',
    stock: getInitialStock(),
  });

  const productsKeywords = details && details.keywords;
  const productSlug = details && details.slug;
  const [canDeploy, setCanDeploy] = useState(false);

  useEffect(() => {
    if (productsKeywords && maticBalance > deploymentCost) {
      setCanDeploy(true);
    }
  }, [productsKeywords, productSlug, details, maticBalance, deploymentCost]);

  const { keywords, slug, stock } = formData;

  function onChange(e) {
    const { value, name } = e.target;
    let formattedValue;

    if (name === 'slug') {
      formattedValue = value.toLowerCase().replace(/[^a-zA-Z0-9-\s]/g, '');
      formattedValue = formattedValue.replace(/[\s]/g, '-');
    } else if (name === 'keywords') {
      formattedValue = value.toLowerCase().replace(/[^a-zA-Z0-9-\s]/g, '');
    } else if (name === 'stock') {
      formattedValue = value;

      if (formattedValue === '') {
        formattedValue = '0'; // Set value to '0' (string) if the input is empty
      } else {
        let numValue = parseInt(formattedValue);
        formattedValue = numValue.toString(); // Convert the value back to a string, removing any leading zeros
        if (numValue >= 999999999) {
          formattedValue = '999999999';
        }
      }
    }

    setFormData({ ...formData, [name]: formattedValue });
  }

  async function handleSaveChanges() {
    setLoading(true);

    // Only update the slug if it has changed and is not empty
    if (slug !== (details && details.slug) && slug !== '') {
      dispatch(updateProductSlug(productUUID[0], formData.slug));
    }

    // Only update the keywords if they have changed and are not empty
    if (keywords !== (details && details.keywords) && keywords !== '') {
      dispatch(updateProductKeywords(productUUID[0], formData.keywords));
    }

    // Only update the stock if it has changed
    if (Number(stock) !== Number(details.quantity)) {
      dispatch(updateProductStock(productUUID[0], formData.stock));
    }

    setLoading(false);
    // history.push(`/sell/courses/manage/settings/${productUUID}`);
  }

  const publishProductButton = () => (
    <button
      onClick={async () => {
        if ((details && details.nft_address === '0') || details.nft_address === null) {
          setOpen(!open);
          if (userAddress && userPolygonAddress) {
            try {
              const res = await GetDeployNFTPrice(userAddress, userPolygonAddress);
              setDeploymentCost(res.data.results);
            } catch (e) {
              if (e) {
                const res = await GetDeployNFTPrice(userAddress, userPolygonAddress);
                setDeploymentCost(res.data.results);
              } else {
                // handle other error types
              }
            }
          }
        } else {
          await dispatch(updateProductStatus(productUUID[0], true));
          // await dispatch(getProduct(productUUID[0]));
        }
      }}
      type="button"
      disabled={!canPublish}
      className={`${
        canPublish
          ? 'dark:bg-dark-primary bg-iris-500 hover:bg-iris-600 focus:ring-iris-600'
          : 'bg-iris-200 dark:bg-dark-accent'
      } inline-flex w-full items-center justify-center rounded-md border border-transparent  px-6 py-3 text-center text-base font-medium text-white  focus:outline-none focus:ring-2  focus:ring-offset-2 `}
    >
      {details && details.status === 'published' ? 'Draft ' : 'Publish '}
      Product
    </button>
  );

  const publishSlugButton = () => (
    <div className="mt-5 sm:mt-6">
      {loading ? (
        <div className="inline-flex items-center border border-transparent bg-black dark:bg-dark-bg px-4 py-2 text-sm font-bold text-white dark:text-dark-txt shadow-sm hover:bg-gray-900 dark:hover:bg-dark-second">
          <CircleLoader loading={loading} className="inline-flex" size={20} color="#ffffff" />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            handleSaveChanges();
          }}
          disabled={!keywords && !slug && !stock}
          className="inline-flex items-center border border-transparent bg-black dark:bg-dark-bg px-4 py-2 text-sm font-bold text-white dark:text-dark-txt shadow-sm hover:bg-gray-900 dark:hover:bg-dark-second"
        >
          Save Changes
        </button>
      )}
    </div>
  );

  const [deployedContractAddress, setDeployedContractAddress] = useState('');
  const [deployedGasFee, setDeployedGasFee] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const [newPercent, setNewPercent] = useState(0);
  const [newPolygonAddress, setNewPolygonAddress] = useState('');

  const [teamMembers, setTeamMembers] = useState([
    {
      polygonAddress: userPolygonAddress,
      percent: 100,
    },
  ]);

  const [step1, setStep1] = useState(false);
  const [step2, setStep2] = useState(false);
  const [step3, setStep3] = useState(false);

  const onCreateNFT = async (e) => {
    e.preventDefault(e);
    setDeploying(true);

    setOpen(false);
    setOpenTx(true);
    try {
      // Set price variable based on the product weights
      const price =
        product && product.weights && product.weights.length > 0
          ? product.weights[0].price
          : details && details.price;

      // Call DeployNFT with the appropriate price
      const res = await DeployNFT(
        productUUID,
        price,
        details && details.token_id,
        stock,
        teamMembers,
        'products',
        userAddress,
        userPolygonAddress,
      );
      if (res.status === 200) {
        ToastSuccess('NFT Deployed');
        setDeployedContractAddress(res.data.results.contractAddress);
        setDeployedGasFee(res.data.results.gasUsed);
        setTransactionHash(res.data.results.transactionHash);
        await EditNFTAddress(productUUID[0], res.data.results.contractAddress);
        await dispatch(updateProductStatus(productUUID[0], true));
        dispatch(getProduct(productUUID[0]));

        setShowConfetti(true);
        setTimeout(() => {
          setShowConfetti((prev) => !prev);
        }, 10000);

        setDeploying(false);
        setStep3(false);
        setStep2(false);
        setStep1(false);
      }
    } catch (err) {
      ToastError(`Error: ${err.response ? err.response.statusText : err.message}`);
      setDeploying(false);
      setOpenTx(false);
      setDeployedContractAddress('');
      setDeployedGasFee('');
      setTransactionHash('');
      setStep3(false);
      setStep2(false);
      setStep1(false);
    }
  };

  const onAddTeamMember = (e) => {
    e.preventDefault();

    // Check if the new polygon address already exists in the teamMembers list
    const isDuplicate = teamMembers.some(
      (member) => member.polygonAddress.toLowerCase() === newPolygonAddress.toLowerCase(),
    );

    if (isDuplicate) {
      alert('This Polygon address already exists in the list. Please use a different address.');
      return;
    }

    const newMember = {
      polygonAddress: newPolygonAddress,
      percent: parseInt(newPercent),
    };

    const updatedMembers = [...teamMembers, newMember];

    const remainingPercent = 100 - newMember.percent;
    const totalExistingPercent = teamMembers.reduce((sum, member) => sum + member.percent, 0);
    const totalPercentageToDeduct = newMember.percent;

    const redistributedMembers = updatedMembers.map((member, index) => {
      if (index === teamMembers.length) {
        return newMember;
      } else {
        const originalPercent = member.percent;
        const deduction = (originalPercent / totalExistingPercent) * totalPercentageToDeduct;
        member.percent = originalPercent - deduction;
      }
      return member;
    });

    setTeamMembers(redistributedMembers);
    setNewPolygonAddress('');
    setNewPercent(0);
  };

  const onRemoveTeamMember = (indexToRemove) => {
    const memberToRemove = teamMembers[indexToRemove];
    const remainingMembers = teamMembers.filter((_, index) => index !== indexToRemove);

    const totalRemainingPercent = remainingMembers.reduce((sum, member) => sum + member.percent, 0);
    const totalPercentageToAdd = memberToRemove.percent;

    const redistributedMembers = remainingMembers.map((member) => {
      const originalPercent = member.percent;
      const addition = (originalPercent / totalRemainingPercent) * totalPercentageToAdd;
      member.percent = originalPercent + addition;
      return member;
    });

    setTeamMembers(redistributedMembers);
  };

  // WEBSOCKET
  const webSocketRef = useRef(null);
  const roomName = details && details.token_id;
  const [connected, setConnected] = useState(false);
  const handleOpen = async () => {
    console.log('Connected to Deploy NFT Websocket');
    setConnected(true);
  };
  const handleMessage = (event) => {
    const message = JSON.parse(event.data);
    // console.log('Got this message from Channels Chat Room', message);
    switch (message.type) {
      case 'send_message':
        // Update the state with the received transaction info
        console.log('Got this Message from Channels: ', message);
        setStep1(message.message.step1);
        setStep2(message.message.step2);
        setStep3(message.message.step3);
        // setTxInfo(message.message);
        break;
      default:
        console.log('Unhandled message type:', message.type);
    }
  };
  const handleError = (e) => {
    // console.error('WebSocket error:', e);
  };

  useEffect(() => {
    let client = null;
    if (!(details && details.token_id)) {
      return;
    }

    const connectWebSocket = () => {
      if (connected) {
        console.log('WebSocket already connected');
        return;
      }

      try {
        const wsProtocol = process.env.NEXT_PUBLIC_APP_ENV === 'production' ? 'wss' : 'ws';
        const path = `${wsProtocol}://${process.env.NEXT_PUBLIC_APP_CRYPTO_API_WS}/ws/deploy_nft/${roomName}/`;
        client = new W3CWebSocket(path);
        client.onopen = handleOpen;
        client.onmessage = handleMessage;
        client.onerror = handleError;
        client.onclose = handleClose;
        webSocketRef.current = client;
      } catch (e) {
        handleError(e);
      }
    };

    const handleClose = () => {
      console.log('WebSocket closed');
      setConnected(false);
      // Reconnect after a delay
      reconnectWebSocket();
    };

    const reconnectWebSocket = () => {
      setTimeout(() => {
        if (!connected) {
          console.log('Reconnecting WebSocket...');
          connectWebSocket();
        }
      }, 5000); // Reconnect delay (in milliseconds)
    };

    const disconnectWebSocket = () => {
      if (client && client.readyState === WebSocket.OPEN) {
        client.close();
        setConnected(false);
      }
    };
    return () => {
      disconnectWebSocket();
    };
  }, [roomName]);

  if (!isAuthenticated && myUser && myUser.role !== 'seller' && myUser.id !== product.details.id) {
    router.push('/sell');
  }

  return (
    <>
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            className="absolute top-0 left-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            exit={{ opacity: 0 }}
          >
            <Confetti width={width} height={height} />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="dark:bg-dark-bg">
        {/* <SidebarMobile sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> */}
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog as="div" className="relative z-40 lg:hidden" onClose={setSidebarOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col dark:bg-dark-bg bg-white">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                      <button
                        type="button"
                        className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="h-0 flex-1 overflow-y-auto">
                    <nav className=" space-y-1 ">
                      <Sidebar product={product} productUUID={productUUID} />
                    </nav>
                  </div>
                  {details && details.status === 'published' ? (
                    <div />
                  ) : (
                    <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
                      {publishProductButton()}
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
              <div className="w-14 flex-shrink-0">
                {/* Force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Sidebar Mobile */}

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex min-h-0 flex-1 flex-col border-r dark:border-dark-border border-gray-200 dark:bg-dark-bg bg-white">
            <div className="flex flex-1 flex-col overflow-y-auto ">
              <nav className=" flex-1 space-y-1 dark:bg-dark-bg bg-white ">
                <Sidebar product={product} productUUID={productUUID} />
              </nav>
            </div>

            {details && details.status === 'published' ? (
              <div />
            ) : (
              <div className="flex flex-shrink-0 border-t dark:border-dark-border border-gray-200 p-4">
                {publishProductButton()}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col lg:pl-72">
          <div className="sticky top-0 z-0 dark:bg-dark-bg bg-white pl-1 pt-1 sm:pl-3 sm:pt-3 lg:hidden">
            <button
              type="button"
              className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md dark:text-dark-txt-secondary text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-iris-500"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <main className="flex-1">
            <div className="py-8">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="py-4 shadow-button ">
                  {/* Replace with your content */}

                  <div className="border-b dark:border-dark-second border-gray-300 pb-5">
                    <h1 className="p-4 px-8 text-2xl font-bold leading-6 dark:text-dark-txt text-gray-900 md:text-2xl">
                      {title}
                    </h1>
                  </div>

                  <div className="px-8 pt-10">{children}</div>

                  {/* /End replace */}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setOpen}>
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
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg dark:bg-dark-bg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div>
                    <div>
                      {/* INPUTS */}
                      <div className="mt-3 text-center sm:mt-5">
                        <Dialog.Title
                          as="div"
                          className="text-lg font-medium leading-6 dark:text-dark-txt text-gray-900"
                        >
                          Slug and keywords
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500 dark:text-dark-txt-secondary">
                            <span className="font-bold dark:text-dark-txt">
                              You may only choose this once so pick carefully
                            </span>
                            , keywords and slug help your course get found on the internet easier.
                            Make it something related to your course topic.
                          </p>
                        </div>
                        <div className="flex">
                          <div className="mb-2 w-full">
                            <div className="relative col-span-12 mt-1 rounded-md shadow-sm">
                              <span className="mb-2 block text-left text-sm font-black dark:text-dark-txt text-gray-700">
                                Slug
                              </span>
                              <input
                                type="text"
                                name="slug"
                                maxLength={60}
                                placeholder="python-web-development"
                                value={slug || (details && details.slug) || ''}
                                onChange={(e) => {
                                  onChange(e);
                                }}
                                className="ring-none w-full border dark:border-dark-border border-gray-700 py-3 outline-none dark:bg-dark-second pl-2.5 focus:border-gray-500 focus:outline-transparent focus:ring-transparent"
                                aria-describedby="price-currency"
                              />
                              <div className="pointer-events-none absolute inset-y-0 right-0 top-8 flex items-center pr-3">
                                <span className="text-gray-500 sm:text-sm" id="price-currency">
                                  {(details && details.slug !== slug
                                    ? details.slug?.length
                                    : slug?.length) || 0}{' '}
                                  of 60
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex">
                          <div className="mb-2 w-full">
                            <div className="relative col-span-12 mt-1 rounded-md shadow-sm">
                              <span className="mb-2 block text-left text-sm font-black dark:text-dark-txt text-gray-700">
                                Keywords
                              </span>
                              <input
                                type="text"
                                name="keywords"
                                maxLength={120}
                                placeholder="python, web development"
                                value={keywords || (details && details.keywords) || ''}
                                onChange={(e) => {
                                  onChange(e);
                                }}
                                className="ring-none w-full border dark:border-dark-border border-gray-700 py-3 outline-none dark:bg-dark-second pl-2.5 focus:border-gray-500 focus:outline-transparent focus:ring-transparent"
                                aria-describedby="price-currency"
                              />
                              <div className="pointer-events-none absolute inset-y-0 right-0 top-8 flex items-center pr-3">
                                <span className="text-gray-500 sm:text-sm" id="price-currency">
                                  {(details && details.keywords !== keywords
                                    ? details.keywords?.length
                                    : keywords?.length) || 0}{' '}
                                  of 120
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex">
                          <div className="mb-2 w-full">
                            <div className="relative col-span-12 mt-1 rounded-md shadow-sm">
                              <span className="mb-2 block text-left text-sm font-black dark:text-dark-txt text-gray-700">
                                Stock (0 = Unlimited stock)
                              </span>
                              {product && product.weights && product.weights.length > 0 ? (
                                <div className="ring-none text-left w-full border dark:border-dark-border border-gray-700 py-3 outline-none dark:bg-dark-second pl-2.5 focus:border-gray-500 focus:outline-transparent focus:ring-transparent">
                                  {getInitialStock()}
                                </div>
                              ) : (
                                <>
                                  <input
                                    type="number"
                                    name="stock"
                                    min={1}
                                    step={1}
                                    max={999999999}
                                    placeholder="1000"
                                    value={stock || (details && details.quantity)}
                                    onChange={(e) => {
                                      onChange(e);
                                    }}
                                    className="ring-none w-full border dark:border-dark-border border-gray-700 py-3 outline-none dark:bg-dark-second pl-2.5 focus:border-gray-500 focus:outline-transparent focus:ring-transparent"
                                    aria-describedby="price-currency"
                                  />
                                  <div className="pointer-events-none absolute inset-y-0 right-0 top-8 flex items-center pr-3">
                                    <span className="text-gray-500 sm:text-sm" id="price-currency">
                                      {stock} of 999,999,999
                                    </span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      {/* Set Sellers */}
                      <div className="mx-auto max-w-lg">
                        <div>
                          <div className="text-center">
                            <p className="mt-2 text-base font-semibold leading-6 dark:text-dark-txt text-gray-900">
                              Add team members
                            </p>
                            <p className="mt-1 text-sm text-gray-500 dark:text-dark-txt-secondary">
                              Add team members whom you want to share the profits with.
                            </p>
                          </div>
                          <form onSubmit={onAddTeamMember} className="mt-4 flex">
                            <div className="grid grid-cols-12 gap-x-1">
                              <input
                                type="text"
                                name="newPolygonAddress"
                                value={newPolygonAddress}
                                onChange={(e) => setNewPolygonAddress(e.target.value)}
                                required
                                className="dark:bg-dark-bg dark:text-dark-txt dark:placeholder-dark-txt-secondary dark:focus:ring-dark-primary dark:focus:border-dark-primary dark:border-dark-border dark:ring-dark-border col-span-10 pl-2.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-iris-600 sm:text-sm sm:leading-6"
                                placeholder="Team Member Polygon Address"
                              />
                              <input
                                type="number"
                                name="newPercent"
                                value={newPercent}
                                min={1}
                                max={99}
                                onChange={(e) => setNewPercent(e.target.value)}
                                required
                                className="dark:bg-dark-bg dark:text-dark-txt dark:placeholder-dark-txt-secondary dark:focus:ring-dark-primary dark:focus:border-dark-primary dark:border-dark-border dark:ring-dark-border col-span-2 block w-full rounded-md border-0 text-center py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-iris-600 sm:text-sm sm:leading-6"
                                placeholder="%"
                              />
                            </div>
                            <button
                              type="submit"
                              className="dark:bg-dark-primary dark:hover:bg-dark-accent dark:focus-visible:outline-iris-600 ml-4 flex-shrink-0 rounded-md bg-iris-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-iris-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                            >
                              Add Member
                            </button>
                          </form>
                        </div>
                        <div className="mt-4">
                          <span className="text-sm font-medium text-gray-500 dark:text-dark-txt">
                            Team members
                          </span>
                          <ul className="my-4 divide-y divide-gray-200 border-t border-b dark:border-dark-border dark:divide-dark-border border-gray-200">
                            {teamMembers.map((member, index) => (
                              <li
                                key={member.polygonAddress}
                                className="flex items-center justify-between space-x-3 py-4"
                              >
                                <div className="flex min-w-0 flex-1 items-center space-x-3">
                                  <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-gray-900 dark:text-dark-txt">
                                      {member.polygonAddress}
                                    </p>
                                    <p className="truncate text-sm font-medium text-gray-500 dark:text-dark-txt-secondary">
                                      {member.percent} %
                                    </p>
                                  </div>
                                </div>
                                <div className="flex-shrink-0">
                                  {member.polygonAddress !== userPolygonAddress && (
                                    <button
                                      type="button"
                                      onClick={() => onRemoveTeamMember(index)}
                                      className="inline-flex items-center gap-x-1.5 text-sm font-semibold leading-6 text-gray-900"
                                    >
                                      {/* <PlusIcon className="h-5 w-5 text-gray-400" aria-hidden="true" /> */}
                                      Remove
                                    </button>
                                  )}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="flex text-sm font-bold">
                      Cost:{' '}
                      <span className="font-regular ml-1 text-gray-700 dark:text-dark-txt">
                        {' '}
                        {deploymentCost} MATIC
                      </span>
                    </div>
                    <div className="flex text-sm font-bold">
                      Balance:{' '}
                      <span className="font-regular ml-1 text-gray-700 dark:text-dark-txt">
                        {' '}
                        {maticBalance} MATIC
                      </span>
                    </div>
                    <div className="flex text-sm font-bold">
                      Deployer:{' '}
                      <CopyToClipboard text={userPolygonAddress}>
                        <span className="font-regular ml-1 cursor-pointer text-gray-700 dark:text-dark-txt dark:hover:text-dark-accent hover:text-gray-600 focus:text-gray-800">
                          {' '}
                          {userPolygonAddress}
                        </span>
                      </CopyToClipboard>
                    </div>

                    <div className="space-x-2">
                      <form onSubmit={onCreateNFT} className="float-right mt-6 ml-1">
                        <button
                          type="submit"
                          disabled={!canDeploy}
                          className={`inline-flex items-center border border-transparent bg-black dark:bg-dark-bg px-4 py-2 text-sm font-bold text-white dark:text-dark-txt shadow-sm hover:bg-gray-900 dark:hover:bg-dark-second ${
                            canDeploy ? '' : 'cursor-not-allowed bg-gray-300 dark:bg-dark-third'
                          }`}
                        >
                          Deploy NFT
                        </button>
                      </form>
                      <div className="float-right">{publishSlugButton()}</div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      <Transition.Root show={openTx} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => {
            if (!deploying) {
              setOpenTx(false);
              dispatch(resetCourseNFT());
            }
          }}
        >
          <div className="fixed inset-0" />

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-lg">
                    {deploying ? (
                      <div className="flex h-full flex-col overflow-y-scroll dark:bg-dark-second bg-white py-6 shadow-xl">
                        <div className="px-4 sm:px-6">
                          <div className="my-2 sm:flex">
                            <div className="mb-4 flex-shrink-0 sm:mb-0 sm:mr-4">
                              <img
                                alt=""
                                src="/assets/img/gif/monkey-dance.gif"
                                className="h-32 w-full border dark:border-dark-border border-gray-300 bg-white object-cover text-gray-300 sm:w-32"
                              />
                            </div>
                            <div>
                              <p className="text-lg font-bold">
                                {deployedContractAddress ? 'NFT Deployed' : 'Deploying NFT...'}
                              </p>
                              <ul className="mt-2 mb-4 list-inside list-disc ">
                                <li
                                  className={
                                    step1
                                      ? 'font-bold text-gray-700 dark:text-dark-txt'
                                      : 'dark:text-dark-txt-secondary text-gray-500'
                                  }
                                >
                                  Deploying
                                  {step1 && (
                                    <div className="my-4 ml-2 inline-flex items-center justify-center space-x-1">
                                      <div className="h-1 w-1 animate-bounce rounded-full bg-gray-500 dark:text-dark-txt-secondary" />
                                      <div className="h-1 w-1 animate-bounce rounded-full bg-gray-500 dark:text-dark-txt-secondary" />
                                      <div className="h-1 w-1 animate-bounce rounded-full bg-gray-500 dark:text-dark-txt-secondary" />
                                    </div>
                                  )}
                                </li>
                                <li
                                  className={
                                    step2
                                      ? 'font-bold text-gray-700 dark:text-dark-txt'
                                      : 'text-gray-500 dark:text-dark-txt-secondary'
                                  }
                                >
                                  Verifying
                                  {step2 && (
                                    <div className="my-4 ml-2 inline-flex items-center justify-center space-x-1">
                                      <div className="h-1 w-1 animate-bounce rounded-full bg-gray-500 dark:text-dark-txt-secondary" />
                                      <div className="h-1 w-1 animate-bounce rounded-full bg-gray-500 dark:text-dark-txt-secondary" />
                                      <div className="h-1 w-1 animate-bounce rounded-full bg-gray-500 dark:text-dark-txt-secondary" />
                                    </div>
                                  )}
                                </li>
                                <li
                                  className={
                                    step3
                                      ? 'font-bold text-gray-700 dark:text-dark-txt'
                                      : 'text-gray-500 dark:text-dark-txt-secondary'
                                  }
                                >
                                  Get ready to start selling!
                                  {step3 && (
                                    <div className="my-4 ml-2 inline-flex items-center justify-center space-x-1">
                                      <div className="h-1 w-1 animate-bounce rounded-full bg-gray-500 dark:text-dark-txt-secondary" />
                                      <div className="h-1 w-1 animate-bounce rounded-full bg-gray-500 dark:text-dark-txt-secondary" />
                                      <div className="h-1 w-1 animate-bounce rounded-full bg-gray-500 dark:text-dark-txt-secondary" />
                                    </div>
                                  )}
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500 dark:text-dark-txt">
                              Salary Expectation
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 dark:text-dark-txt-secondary">
                              $120,000 (feature coming soon)
                            </dd>
                            <dt className="text-sm font-medium text-gray-500 dark:text-dark-txt">
                              Potential Users
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 dark:text-dark-txt-secondary">
                              69,420
                            </dd>
                            <dt className="text-sm font-medium text-gray-500 dark:text-dark-txt">
                              User Interest
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 dark:text-dark-txt-secondary">
                              69 %
                            </dd>
                            <dt className="text-sm font-medium text-gray-500 dark:text-dark-txt">
                              Competition
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 dark:text-dark-txt-secondary">
                              100 similar courses
                            </dd>
                            <dt className="text-sm font-medium text-gray-500 dark:text-dark-txt">
                              Engagement
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 dark:text-dark-txt-secondary">
                              97 %
                            </dd>
                            <dt className="text-sm font-medium text-gray-500 dark:text-dark-txt">
                              Traffic
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 dark:text-dark-txt-secondary">
                              247,804
                            </dd>
                            <dt className="text-sm font-medium text-gray-500 dark:text-dark-txt">
                              Market Trends
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 dark:text-dark-txt-secondary">
                              Artificial Intelligence
                            </dd>
                          </div>
                          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 dark:text-dark-txt">
                            <dt className="text-sm font-medium text-gray-500">
                              Prediction metrics
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 dark:text-dark-txt-secondary">
                              Based on the data we've gathered from previous sales of courses
                              similar to yours, we can provide a prediction of how much your course
                              could potentially earn.
                            </dd>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex h-full flex-col overflow-y-scroll dark:bg-dark-second bg-white py-6 shadow-xl">
                        <div className="px-4 sm:px-6">
                          <div className="flex items-start justify-between">
                            <p className="text-xl font-bold leading-6 text-gray-900 dark:text-dark-txt">
                              Transaction Information
                            </p>
                            <div className="ml-3 flex h-7 items-center">
                              <button
                                type="button"
                                className="rounded-md  text-gray-400 dark:text-dark-txt-secondary hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-iris-500 focus:ring-offset-2"
                                onClick={() => {
                                  if (!deploying) {
                                    setOpenTx(false);
                                  }
                                }}
                              >
                                <span className="sr-only">Close panel</span>
                                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="relative mt-6 flex-1 px-4 sm:px-6">
                          <div className="mt-5 border-t dark:border-dark-border border-gray-200">
                            <dl className="sm:divide-y dark:divide-dark-border sm:divide-gray-200">
                              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500 dark:text-dark-txt">
                                  NFT Address:
                                </dt>
                                <dd className="mt-1 text-xs dark:text-dark-txt-secondary text-gray-900 hover:text-iris-500 sm:col-span-2 sm:mt-0">
                                  <a
                                    target="_blank"
                                    rel="noreferrer"
                                    href={`https://mumbai.polygonscan.com/address/${deployedContractAddress}`}
                                  >
                                    {deployedContractAddress}
                                  </a>
                                </dd>
                              </div>
                              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500 dark:text-dark-txt">
                                  Deployment Cost
                                </dt>
                                <dd className="mt-1 text-xs text-gray-900 sm:col-span-2 sm:mt-0 dark:text-dark-txt-secondary">
                                  {deployedGasFee}
                                </dd>
                              </div>
                              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 dark:text-dark-txt">
                                <dt className="text-sm font-medium text-gray-500 dark:text-dark-txt">
                                  Transaction Hash
                                </dt>
                                <dd className="mt-1 text-xs dark:text-dark-txt-secondary text-gray-900 hover:text-iris-500 sm:col-span-2 sm:mt-0 truncate">
                                  {transactionHash !== '' && (
                                    <a
                                      target="_blank"
                                      rel="noreferrer"
                                      href={`https://mumbai.polygonscan.com/tx/${transactionHash}`}
                                    >
                                      {`${transactionHash.slice(0, 21)}...${transactionHash.slice(
                                        -21,
                                      )}`}
                                    </a>
                                  )}
                                </dd>
                              </div>
                            </dl>
                          </div>
                        </div>
                      </div>
                    )}
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
