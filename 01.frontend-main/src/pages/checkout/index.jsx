import {
  ChevronUpIcon,
  GlobeAltIcon,
  GlobeAmericasIcon,
  HomeIcon,
  PhoneIcon,
} from '@heroicons/react/20/solid';
import Image from 'next/image';
import { useWindowSize } from 'react-use';
import { Disclosure, RadioGroup, Switch } from '@headlessui/react';
import Confetti from 'react-confetti';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import Head from 'next/head';
import cookie from 'cookie';
import jwtDecode from 'jwt-decode';
import Layout from '@/hocs/checkout';
import PolygonPayment from '@/api/PolygonPayment';
import PaymentMethod from './components/PaymentMethod';
import CourseCartItem from '@/features/navbar/Cart/CourseCartItem';
import CartItem from '@/features/navbar/Cart/CartItem';
import { ToastError } from '@/components/toast/ToastError';
import { ToastSuccess } from '@/components/ToastSuccess';
import { countries } from '@/helpers/fixedCountries';
import { getUserDelivery } from '@/redux/actions/auth/auth';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const SeoList = {
  title: 'Checkout - Boomslag NFT Marketplace',
  description:
    'Complete your purchase on Boomslag, the ultimate NFT marketplace for online courses, physical products, and more. Experience the future of e-commerce with the power of blockchain technology.',
  href: '/checkout',
  url: 'https://boomslag.com/checkout',
  keywords:
    'boomslag, nft marketplace, online courses, physical products, blockchain, e-commerce, checkout',
  robots: 'all',
  author: 'BoomSlag',
  publisher: 'BoomSlag',
  image:
    'https://bafybeiaor24mrcurzyzccxl7xw46zdqpor4sfuhddl6tzblujoiukchxnq.ipfs.w3s.link/teach.png',
  twitterHandle: '@boomslag_',
};

export default function Checkout() {
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  const dispatch = useDispatch();
  const router = useRouter();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    dispatch(getUserDelivery());
  }, [isAuthenticated]);

  const user = useSelector((state) => state.auth.user);
  const wallet = useSelector((state) => state.auth.wallet);
  const deliveryAddressRedux = useSelector((state) => state.auth.delivery_address);
  const cartItems = useSelector((state) => state.cart.items);
  const amountBeforeDiscounts = useSelector((state) => state.cart.amount);
  const totalAmount = useSelector((state) => state.cart.compare_amount);
  const finalPrice = useSelector((state) => state.cart.finalPrice);
  const totalAmountEth = useSelector((state) => state.cart.total_cost_ethereum);
  const maticCost = useSelector((state) => state.cart.maticCost);
  const taxEstimate = useSelector((state) => state.cart.tax_estimate);
  const shippingEstimate = useSelector((state) => state.cart.shipping_estimate);
  // const checkoutLoading = useSelector((state) => state.cart.checkout_loading);

  const courses = useSelector((state) => state.cart.courses);
  const products = useSelector((state) => state.cart.products);

  const ethBalance = useSelector((state) => state.auth.eth_balance);
  const maticBalance = useSelector((state) => state.auth.matic_balance);
  const ethereumWallet = useSelector((state) => state.auth.wallet);

  const [agreed, setAgreed] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState(0);
  useEffect(() => {
    if (
      deliveryAddressRedux &&
      deliveryAddressRedux.address &&
      deliveryAddressRedux.address.length !== 0
    ) {
      setDeliveryAddress(deliveryAddressRedux.address[0]);
    }
  }, []);
  const [newAddress, setNewAddress] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state_province_region: '',
    postal_zip_code: '',
    country_region: 'Peru',
    telephone_number: '',
    coupon_name: '',
    shipping_id: 0,
  });

  const {
    full_name,
    address_line_1,
    address_line_2,
    city,
    state_province_region,
    postal_zip_code,
    country_region,
    telephone_number,
    coupon_name,
    shipping_id,
  } = formData;
  const relevantFields = [
    full_name,
    address_line_1,
    address_line_2,
    city,
    state_province_region,
    postal_zip_code,
    telephone_number,
    coupon_name,
  ];

  const hasFormData = relevantFields.some((value) => value !== '');
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const [processing, setProcessing] = useState(false);
  const onSubmitCrypto = async () => {
    setProcessing(true);
    try {
      if (
        deliveryAddressRedux &&
        deliveryAddressRedux.address &&
        deliveryAddressRedux.address.length === 0
      ) {
        const res = await PolygonPayment(
          user.id,
          wallet.address,
          wallet.polygon_address,
          cartItems,
          formData,
          agreed,
        );

        setTimeout(() => {
          setProcessing(false);
        }, 3000);

        if (res.status === 200) {
          ToastSuccess('Payment Successful');
          setShowConfetti(true);
          setTimeout(() => {
            setShowConfetti((prev) => !prev);
          }, 10000);
          setTimeout(() => {
            router.push('/library/courses');
          }, 3000);
        }
      }

      if (
        deliveryAddressRedux &&
        deliveryAddressRedux.address &&
        deliveryAddressRedux.address.length !== 0
      ) {
        setProcessing(true);

        const res = await PolygonPayment(
          user.id,
          wallet.address,
          wallet.polygon_address,
          cartItems,
          hasFormData ? formData : deliveryAddress,
          agreed,
        );

        setTimeout(() => {
          setProcessing(false);
        }, 3000);

        if (res.status === 200) {
          ToastSuccess('Payment Successful');
          setShowConfetti(true);
          setTimeout(() => {
            setShowConfetti((prev) => !prev);
          }, 10000);
          setTimeout(() => {
            router.push('/library/courses');
          }, 3000);
        }
      }
    } catch (err) {
      setProcessing(false);
      if (err.response) {
        ToastError(err.response.data.error);
      } else {
        ToastError('An error occurred while processing your payment, try again :D');
      }
    }
  };

  const [ethPayment, setEthPayment] = useState(null);
  const [polygonPayment, setPolygonPayment] = useState(null);
  const [adaPayment, setAdaPayment] = useState(null);
  const [creditPayment, setCreditPayment] = useState(null);

  const handleEthPayment = () => {
    setCreditPayment(null);
    setEthPayment('ethereum');
    setAdaPayment(null);
  };

  const handleAdaPayment = () => {
    setCreditPayment(null);
    setEthPayment(null);
    setAdaPayment('cardano');
  };

  const [effectDropdownDelivery, setEffectDropdownDelivery] = useState(false);
  // eslint-disable-next-line
  const deliveryDisclosure = () => {
    return (
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button
              onMouseDown={() => {
                setEffectDropdownDelivery(true);
              }}
              onMouseUp={() => setEffectDropdownDelivery(false)}
              className={`${
                effectDropdownDelivery &&
                'duration-400 animate-click hover:translate-x-0.5  hover:translate-y-0.5 hover:shadow-neubrutalism-sm'
              }
                focus:ring-none 
                mt-2 
                flex
                w-full  justify-between border-2
                border-gray-900
                px-4
                dark:border-dark-border
                dark:text-dark-txt
                dark:bg-dark-second
                  py-4 text-left text-base font-bold text-gray-900 dark:shadow-none shadow-neubrutalism-sm transition duration-300 ease-in-out hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-gray-50 hover:text-iris-600  hover:shadow-neubrutalism-md focus:outline-none`}
            >
              <span className="font-bold">Delivery Information</span>
              <ChevronUpIcon
                className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-gray-500`}
              />
            </Disclosure.Button>

            <Disclosure.Panel className="rounded-b-lg   py-2.5 text-sm text-gray-500">
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <HomeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  name="full_name"
                  value={full_name}
                  onChange={(e) => onChange(e)}
                  type="text"
                  required
                  className="ring-none w-full border dark:border-dark-border border-gray-700 py-3 outline-none dark:bg-dark-bg dark:placeholder-dark-txt-secondary dark:text-dark-txt pl-10 focus:border-gray-500 focus:outline-transparent focus:ring-transparent"
                  placeholder="Full Name *"
                />
              </div>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <HomeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  name="address_line_1"
                  value={address_line_1}
                  onChange={(e) => onChange(e)}
                  type="text"
                  required
                  className="ring-none w-full border dark:border-dark-border border-gray-700 py-3 outline-none dark:bg-dark-bg dark:placeholder-dark-txt-secondary dark:text-dark-txt pl-10 focus:border-gray-500 focus:outline-transparent focus:ring-transparent"
                  placeholder="Address Line 1 *"
                />
              </div>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <HomeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  name="address_line_2"
                  value={address_line_2}
                  onChange={(e) => onChange(e)}
                  type="text"
                  required
                  className="ring-none w-full border dark:border-dark-border border-gray-700 py-3 outline-none dark:bg-dark-bg dark:placeholder-dark-txt-secondary dark:text-dark-txt pl-10 focus:border-gray-500 focus:outline-transparent focus:ring-transparent"
                  placeholder="Address Line 2"
                />
              </div>

              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <GlobeAltIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <div className=" sm:col-span-2">
                  <select
                    name="country_region"
                    value={country_region}
                    onChange={(e) => onChange(e)}
                    className="ring-none w-full border dark:border-dark-border border-gray-700 py-3 outline-none dark:bg-dark-bg dark:placeholder-dark-txt-secondary dark:text-dark-txt pl-10 focus:border-gray-500 focus:outline-transparent focus:ring-transparent"
                  >
                    {countries &&
                      countries !== null &&
                      countries !== undefined &&
                      countries.map((country) => (
                        <option key={country.name} value={country.name}>
                          {country.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <GlobeAmericasIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  name="city"
                  value={city}
                  onChange={(e) => onChange(e)}
                  type="text"
                  required
                  className="ring-none w-full border dark:border-dark-border border-gray-700 py-3 outline-none dark:bg-dark-bg dark:placeholder-dark-txt-secondary dark:text-dark-txt pl-10 focus:border-gray-500 focus:outline-transparent focus:ring-transparent"
                  placeholder="City"
                />
              </div>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <GlobeAmericasIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  name="state_province_region"
                  value={state_province_region}
                  onChange={(e) => onChange(e)}
                  type="text"
                  required
                  className="ring-none w-full border dark:border-dark-border border-gray-700 py-3 outline-none dark:bg-dark-bg dark:placeholder-dark-txt-secondary dark:text-dark-txt pl-10 focus:border-gray-500 focus:outline-transparent focus:ring-transparent"
                  placeholder="State / Provine / Region"
                />
              </div>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <GlobeAmericasIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  name="postal_zip_code"
                  value={postal_zip_code}
                  onChange={(e) => onChange(e)}
                  type="text"
                  required
                  className="ring-none w-full border dark:border-dark-border border-gray-700 py-3 outline-none dark:bg-dark-bg dark:placeholder-dark-txt-secondary dark:text-dark-txt pl-10 focus:border-gray-500 focus:outline-transparent focus:ring-transparent"
                  placeholder="Postal Code"
                />
              </div>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <PhoneIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  name="telephone_number"
                  value={telephone_number}
                  onChange={(e) => onChange(e)}
                  type="text"
                  required
                  className="ring-none w-full border dark:border-dark-border border-gray-700 py-3 outline-none dark:bg-dark-bg dark:placeholder-dark-txt-secondary dark:text-dark-txt pl-10 focus:border-gray-500 focus:outline-transparent focus:ring-transparent"
                  placeholder="Telephone"
                />
              </div>

              <div className="mt-4 flex items-center justify-center" />
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    );
  };

  return (
    <div className="dark:bg-dark-bg">
      <Head>
        <title>{SeoList.title}</title>
        <meta name="description" content={SeoList.description} />

        <meta name="keywords" content={SeoList.keywords} />
        <link rel="canonical" href={SeoList.href} />
        <meta name="robots" content={SeoList.robots} />
        <meta name="author" content={SeoList.author} />
        <meta name="publisher" content={SeoList.publisher} />

        {/* Social Media Tags */}
        <meta property="og:title" content={SeoList.title} />
        <meta property="og:description" content={SeoList.description} />
        <meta property="og:url" content={SeoList.url} />
        <meta property="og:image" content={SeoList.image} />
        <meta property="og:image:width" content="1370" />
        <meta property="og:image:height" content="849" />
        <meta property="og:image:alt" content="Boomslag Thumbnail Image" />
        <meta property="og:type" content="website" />

        <meta name="twitter:title" content={SeoList.title} />
        <meta name="twitter:description" content={SeoList.description} />
        <meta name="twitter:image" content={SeoList.image} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={SeoList.twitterHandle} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            className="absolute top-0 left-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            exit={{ opacity: 0 }}
          >
            {width && height && <Confetti width={width - 15} height={height} />}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="dark:bg-dark-bg">
        {/* {checkoutLoading === false ? (
        ) : (
          <LoadingPage />
        )} */}
        <div className="grid-cols-0 grid h-screen md:grid-cols-2">
          <div className="col-span-1 dark:bg-dark-bg bg-white">
            <div className=" mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {/* We've used 3xl here, but feel free to try other max-widths based on your needs */}
              <div className="mx-auto max-w-4xl ">
                <div className=" py-4 sm:flex ">
                  <div className="font-recife-bold text-2xl leading-6" />
                </div>

                <div className=" pt-6  sm:flex ">
                  <h3 className="font-recife-bold text-4xl leading-6 dark:text-dark-txt text-gray-900">
                    Checkout
                  </h3>
                </div>

                {cartItems && cartItems.some((u) => u.product) ? (
                  <div className="mb-3 flex-wrap items-center justify-between pt-14 pb-2 sm:flex sm:flex-nowrap">
                    <div className=" mt-2">
                      <h3 className="text-2xl font-black leading-6 dark:text-dark-txt text-gray-900">
                        Billing Address
                      </h3>
                    </div>
                    <div className=" flex-shrink-0">
                      {(newAddress || !deliveryAddress) && (
                        <div className="text-base dark:text-dark-txt-secondary text-gray-500">
                          <span className="text-md font-regular mr-2 dark:text-dark-txt-secondary">
                            Save for later
                          </span>
                          <Switch
                            checked={agreed}
                            onChange={setAgreed}
                            className={classNames(
                              agreed
                                ? 'bg-iris-600 dark:bg-dark-primary'
                                : 'bg-gray-200 dark:bg-dark-main',
                              'relative mr-2 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-none dark:text-dark-txt',
                            )}
                          >
                            <span
                              aria-hidden="true"
                              className={classNames(
                                agreed
                                  ? 'translate-x-5 dark:bg-dark-accent'
                                  : 'translate-x-0 dark:bg-dark-second',
                                'inline-block h-5 w-5 transform rounded-full  bg-white shadow ring-0 transition duration-200 ease-in-out',
                              )}
                            />
                          </Switch>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div />
                )}

                {cartItems && cartItems.some((u) => u.product) && (
                  <>
                    {deliveryAddressRedux && deliveryAddressRedux.address.length !== 0 ? (
                      <>
                        {!newAddress ? (
                          <button
                            type="button"
                            onClick={() => {
                              setNewAddress(true);
                            }}
                            className="mb-2 text-left text-sm font-semibold dark:text-dark-primary text-iris-600"
                          >
                            Add Address
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setNewAddress(false);
                            }}
                            className=" text-left text-sm font-semibold dark:text-dark-primary text-iris-600"
                          >
                            Choose Address
                          </button>
                        )}
                        {!newAddress ? (
                          <RadioGroup value={deliveryAddress} onChange={setDeliveryAddress}>
                            <RadioGroup.Label className="sr-only"> Address </RadioGroup.Label>
                            <div className="space-y-4">
                              {deliveryAddressRedux.address.map((address) => (
                                <RadioGroup.Option
                                  key={address.id}
                                  value={address}
                                  className={({ checked, active }) =>
                                    classNames(
                                      checked
                                        ? 'border-transparent bg-gray-200 dark:bg-dark-primary'
                                        : 'border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg',
                                      active
                                        ? 'border-gray-900 ring-2 ring-gray-900 dark:border-dark-second dark:ring-dark-primary'
                                        : '',
                                      'relative block cursor-pointer rounded-lg border px-6 py-4 shadow-sm focus:outline-none sm:flex sm:justify-between',
                                    )
                                  }
                                >
                                  {({ active, checked }) => (
                                    <>
                                      <span className="flex items-center">
                                        <span className="flex flex-col text-sm">
                                          <RadioGroup.Label
                                            as="span"
                                            className="font-medium dark:text-dark-txt text-gray-900"
                                          >
                                            {address.address_line_1}
                                          </RadioGroup.Label>
                                          <RadioGroup.Description
                                            as="span"
                                            className="text-gray-500 dark:text-dark-txt"
                                          >
                                            <span className="block sm:inline dark:text-dark-txt">
                                              {address.address_line_2}
                                            </span>{' '}
                                            <span
                                              className="hidden sm:mx-1 sm:inline dark:text-dark-txt"
                                              aria-hidden="true"
                                            >
                                              &middot;
                                            </span>{' '}
                                            <span className="block sm:inline dark:text-dark-txt">
                                              {address.postal_zip_code}
                                            </span>
                                          </RadioGroup.Description>
                                        </span>
                                      </span>
                                      <RadioGroup.Description
                                        as="span"
                                        className="mt-2 flex text-sm sm:mt-0 sm:ml-4 sm:flex-col sm:text-right"
                                      >
                                        <span className="font-medium dark:text-dark-txt text-gray-900">
                                          {address.country_region} &middot; {address.city}
                                        </span>
                                        <span className="ml-1 text-gray-500 sm:ml-0">
                                          {' '}
                                          {address.telephone_number}
                                        </span>
                                      </RadioGroup.Description>
                                      <span
                                        className={classNames(
                                          active ? 'border' : 'border-2',
                                          checked ? 'border-gray-900' : 'border-transparent',
                                          'pointer-events-none absolute -inset-px rounded-lg',
                                        )}
                                        aria-hidden="true"
                                      />
                                    </>
                                  )}
                                </RadioGroup.Option>
                              ))}
                            </div>
                          </RadioGroup>
                        ) : (
                          deliveryDisclosure()
                        )}
                      </>
                    ) : (
                      deliveryDisclosure()
                    )}
                    <div />
                  </>
                )}

                <div className=" pt-14 pb-6 sm:flex ">
                  <h3 className="text-2xl font-black leading-6 dark:text-dark-txt text-gray-900">
                    Payment Method
                  </h3>
                </div>
                <PaymentMethod
                  ethPayment={ethPayment}
                  setEthPayment={setEthPayment}
                  handleEthPayment={handleEthPayment}
                  adaPayment={adaPayment}
                  setAdaPayment={setAdaPayment}
                  handleAdaPayment={handleAdaPayment}
                  ethBalance={ethBalance}
                  maticBalance={maticBalance}
                  ethereumWallet={ethereumWallet}
                  totalAmountEth={totalAmountEth}
                  maticCost={maticCost}
                />

                <div className=" pt-14 pb-6 sm:flex ">
                  <h3 className="text-2xl font-black leading-6 dark:text-dark-txt text-gray-900">
                    Order
                  </h3>
                </div>
                <div className="">
                  {(courses && courses.length > 0) || (products && products.length > 0) ? (
                    <ul className="w-full">
                      {courses &&
                        courses.length > 0 &&
                        courses.map((course) => (
                          <CourseCartItem
                            key={course.course_id}
                            data={course}
                            cartItems={cartItems}
                          />
                        ))}
                      {products &&
                        products.length > 0 &&
                        products.map((product) => (
                          <CartItem key={product.product_id} data={product} cartItems={cartItems} />
                        ))}
                    </ul>
                  ) : (
                    <div className="my-4 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400 dark:text-dark-txt"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          vectorEffect="non-scaling-stroke"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                        />
                      </svg>
                      <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
                        No hay productos
                      </p>
                    </div>
                  )}
                </div>
                <br />
              </div>
            </div>
          </div>
          {/* Right Summary */}
          <div className="col-span-1 items-center justify-center dark:bg-dark-second bg-gray-100 text-center">
            <div className="sticky top-0 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {/* We've used 3xl here, but feel free to try other max-widths based on your needs */}
              <div className="mx-auto max-w-4xl ">
                <div className=" py-3 sm:flex ">
                  <div className="font-recife-bold text-2xl leading-6 " />
                </div>
                <div className=" py-6 sm:flex">
                  <h3 className="text-2xl font-black leading-6 dark:text-dark-txt text-gray-900">
                    Summary
                  </h3>
                </div>
                <section
                  aria-labelledby="summary-heading"
                  className="mt-16 rounded-lg  px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
                >
                  <p
                    id="summary-heading"
                    className="text-lg font-medium dark:text-dark-txt text-gray-900"
                  >
                    Order summary
                  </p>

                  <dl className="mt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <dt className="text-sm text-gray-600 dark:text-dark-txt">Total</dt>
                      <dd className="text-sm font-medium dark:text-dark-txt-secondary text-gray-900">
                        ${amountBeforeDiscounts}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-sm text-gray-600 dark:text-dark-txt">SubTotal</dt>
                      <dd className="text-sm font-medium dark:text-dark-txt-secondary text-gray-900">
                        ${totalAmount}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between dark:border-dark-border border-t border-gray-200 pt-4">
                      <dt className="flex items-center text-sm dark:text-dark-txt text-gray-600">
                        <span>Shipping estimate</span>
                      </dt>
                      <dd className="text-sm font-medium dark:text-dark-txt-secondary text-gray-900">
                        ${shippingEstimate}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between dark:border-dark-border border-t border-gray-200 pt-4">
                      <dt className="flex text-sm dark:text-dark-txt text-gray-600">
                        <span>Tax estimate</span>
                      </dt>
                      <dd className="text-sm font-medium dark:text-dark-txt-secondary text-gray-900">
                        ${taxEstimate}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between dark:border-dark-border border-t border-gray-200 pt-4">
                      <dt className="text-base font-medium dark:text-dark-txt text-gray-900">
                        Order total
                      </dt>
                      <dd className="text-base font-medium dark:text-dark-txt-secondary text-gray-900">
                        ${finalPrice}
                      </dd>
                    </div>
                    {/* <div className="flex items-center justify-between dark:border-dark-border border-t border-gray-200 pt-4">
                      <dt className="text-base font-medium text-gray-900" />
                      <dd className="text-base font-medium text-gray-900">ETH {totalAmountEth}</dd>
                    </div> */}
                    <div className="flex items-center justify-between dark:border-dark-border border-t border-gray-200 pt-4">
                      <dt className="" />
                      <dd className="text-base font-medium dark:text-dark-txt text-gray-900">
                        MATIC {maticCost}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-6">
                    <p className="font-regular mb-0.5 text-left text-xs dark:text-dark-txt-secondary text-gray-600">
                      By completing your purchase you agree to these{' '}
                      <Link className="font-medium dark:text-dark-accent text-iris-500" href="/">
                        Terms of Service
                      </Link>
                      .
                    </p>
                    {/* <button
                      type="button"
                      onClick={() => {
                        window.location.assign('/checkout');
                      }}
                      className="mt-4 w-full border-2 border-dark-bg bg-white p-4 text-base font-bold  text-dark shadow-neubrutalism-sm transition duration-300 ease-in-out hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow-neubrutalism-md"
                    >
                      Confirm Payment
                    </button> */}
                    <div className="py-1" />

                    {(ethPayment || creditPayment) === null ? (
                      <div className="text-md inline-flex w-full cursor-default items-center justify-center rounded dark:bg-dark-bg dark:text-dark-accent bg-gray-100 px-3 py-5 font-bold  leading-4 text-gray-700 transition  duration-300 ease-in-out hover:bg-gray-200 hover:text-gray-500">
                        Select Payment Method
                      </div>
                    ) : ethPayment ? (
                      maticBalance > maticCost + 0.05 ? (
                        <>
                          {cartItems && cartItems.some((u) => u.product) ? (
                            <>
                              {deliveryAddress !== 0 ? (
                                <>
                                  {processing ? (
                                    <>
                                      <div className="my-2 sm:flex">
                                        <div className="mb-4 flex-shrink-0 sm:mb-0 sm:mr-4">
                                          <Image
                                            width={256}
                                            height={256}
                                            alt=""
                                            src="/assets/img/gif/monkey-dance.gif"
                                            className="h-32 w-full border border-gray-300 bg-white object-cover text-gray-300 sm:w-32"
                                          />
                                        </div>
                                        <div>
                                          <h4 className="text-lg font-bold">
                                            Your transaction is being processed
                                          </h4>
                                          <p className="mt-1">
                                            Please wait while the ethereum blockchain processes your
                                            transaction
                                          </p>
                                        </div>
                                      </div>
                                      <div />
                                    </>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={onSubmitCrypto}
                                      className="dark:bg-dark-primary text-md inline-flex w-full items-center justify-center rounded bg-iris-500 px-3 py-5 font-bold  leading-4 text-white shadow-sm transition duration-300 ease-in-out hover:bg-iris-600 hover:text-iris-100 hover:shadow-button focus:outline-none focus:ring-2 focus:ring-iris-300 focus:ring-offset-2"
                                    >
                                      Confirm Transaction
                                    </button>
                                  )}
                                  <div />
                                </>
                              ) : formData.full_name !== '' &&
                                formData.address_line_1 !== '' &&
                                formData.country !== '' &&
                                formData.city !== '' &&
                                formData.state_province_region !== '' &&
                                formData.postal_zip_code !== '' &&
                                formData.telephone !== '' ? (
                                <>
                                  {processing ? (
                                    <>
                                      <div className="my-2 sm:flex">
                                        <div className="mb-4 flex-shrink-0 sm:mb-0 sm:mr-4">
                                          <Image
                                            width={256}
                                            height={256}
                                            alt=""
                                            src="/assets/img/gif/monkey-dance.gif"
                                            className="h-32 w-full border border-gray-300 bg-white object-cover text-gray-300 sm:w-32"
                                          />
                                        </div>
                                        <div>
                                          <h4 className="text-lg font-bold">
                                            Your transaction is being processed
                                          </h4>
                                          <p className="mt-1">
                                            Please wait while the ethereum blockchain processes your
                                            transaction
                                          </p>
                                        </div>
                                      </div>
                                      <div />
                                    </>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={onSubmitCrypto}
                                      className="dark:bg-dark-primary text-md inline-flex w-full items-center justify-center rounded bg-iris-500 px-3 py-5 font-bold  leading-4 text-white shadow-sm transition duration-300 ease-in-out hover:bg-iris-600 hover:text-iris-100 hover:shadow-button focus:outline-none focus:ring-2 focus:ring-iris-300 focus:ring-offset-2"
                                    >
                                      Confirm Transaction
                                    </button>
                                  )}
                                  <div />
                                </>
                              ) : (
                                <button
                                  type="button"
                                  className="text-md inline-flex w-full cursor-default items-center justify-center rounded bg-iris-200 px-3 py-5 font-bold  leading-4 text-iris-700 shadow-sm transition duration-300 ease-in-out"
                                >
                                  Select Delivery Address
                                </button>
                              )}
                              <div />
                            </>
                          ) : (
                            <div>
                              {processing ? (
                                <>
                                  <div className="my-2 sm:flex">
                                    <div className="mb-4 flex-shrink-0 sm:mb-0 sm:mr-4">
                                      <Image
                                        width={256}
                                        height={256}
                                        alt=""
                                        src="/assets/img/gif/monkey-dance.gif"
                                        className="h-32 w-full border border-gray-300 bg-white object-cover text-gray-300 sm:w-32"
                                      />
                                    </div>
                                    <div>
                                      <h4 className="text-lg font-bold">
                                        Your transaction is being processed
                                      </h4>
                                      <p className="mt-1">
                                        Please wait while the polygon network processes your
                                        transaction
                                      </p>
                                    </div>
                                  </div>
                                  <div />
                                </>
                              ) : (
                                <button
                                  type="button"
                                  onClick={onSubmitCrypto}
                                  className="dark:bg-dark-primary text-md inline-flex w-full items-center justify-center rounded bg-iris-500 px-3 py-5 font-bold  leading-4 text-white shadow-sm transition duration-300 ease-in-out hover:bg-iris-600 hover:text-iris-100 hover:shadow-button focus:outline-none focus:ring-2 focus:ring-iris-300 focus:ring-offset-2"
                                >
                                  Confirm Transaction
                                </button>
                              )}
                            </div>
                          )}
                          <div />
                        </>
                      ) : (
                        <div className="text-md inline-flex w-full cursor-default items-center justify-center rounded bg-iris-200 px-3 py-5 font-bold  leading-4 text-iris-700 shadow-sm transition duration-300 ease-in-out ">
                          Insufficient Funds
                        </div>
                      )
                    ) : (
                      <div className="text-md inline-flex w-full cursor-default items-center justify-center rounded bg-gray-100 px-3 py-5 font-bold  leading-4 text-gray-700 transition  duration-300 ease-in-out hover:bg-gray-200 hover:text-gray-500">
                        Select Payment Method
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Checkout.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export async function getServerSideProps(context) {
  const cookies = cookie.parse(context.req.headers.cookie || '');
  // Read the JWT token from the cookie
  const { access } = cookies;

  // Check if the user is authenticated
  let isAuthenticated = false;
  try {
    jwtDecode(access);
    isAuthenticated = true;
  } catch (err) {
    isAuthenticated = false;
  }

  // Redirect to '/' if the user is not authenticated
  if (!isAuthenticated) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  // If the user is authenticated, return an empty props object
  return {
    props: {},
  };
}
