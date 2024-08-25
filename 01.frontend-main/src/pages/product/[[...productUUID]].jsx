import { Dialog, RadioGroup, Tab, Transition } from '@headlessui/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Web3 from 'web3';
import axios from 'axios';
import Head from 'next/head';
import cookie from 'cookie';
import parse from 'html-react-parser';
import { useDispatch, useSelector } from 'react-redux';
import { Fragment, useCallback, useEffect, useState } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import {
  BookOpenIcon,
  CheckBadgeIcon,
  HeartIcon,
  IdentificationIcon,
  LockClosedIcon,
  PlayIcon,
  ReceiptRefundIcon,
  StarIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid';

import {
  FacebookShareButton,
  FacebookIcon,
  WhatsappShareButton,
  WhatsappIcon,
  TwitterShareButton,
  TwitterIcon,
  EmailShareButton,
  EmailIcon,
  LinkedinShareButton,
  LinkedinIcon,
  TelegramShareButton,
  TelegramIcon,
  RedditShareButton,
  RedditIcon,
} from 'react-share';

import CopyToClipboard from 'react-copy-to-clipboard';
import Layout from '@/hocs/Layout';
import UpdateProductViews from '@/api/products/UpdateViews';
import { checkCoupon, removeCoupon } from '@/redux/actions/coupons/coupons';
import UpdateAnalytics from '@/api/products/UpdateAnalytics';
import { addItem, addItemAnonymous, addItemAuthenticated } from '@/redux/actions/cart/cart';
import { ToastSuccess } from '@/components/ToastSuccess';
import Description from './components/Description';
import Clock from '@/components/CountDownTimer/Clock';
import LoadingMoon from '@/components/loaders/LoadingMoon';
import CustomVideo from '@/components/CustomVideo';
import Button from '@/components/Button';
import InstructorDetails from '../course/components/InstructorDetails';
import Reviews from './components/Reviews';
import VerifyTokenOwnership from '@/api/tokens/VerifyTicketOwnership';
import GetNFTStock from '@/api/tokens/GetNFTStock';
import VerifyAffiliate from '@/api/tokens/VerifyAffiliate';
import BecomeAffiliate from '@/api/tokens/BecomeAffiliate';
import Image from 'next/image';
import { MoonLoader } from 'react-spinners';
import GetContractABIPolygon from '@/api/tokens/GetContractABIPolygon';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Product({
  product,
  author,
  authorProfile,
  productUUID,
  referrer,
  initialIsAffiliate,
  initialOwnsTicket,
}) {
  const web3 = new Web3(process.env.NEXT_PUBLIC_APP_RPC_POLYGON_PROVIDER);

  const SeoList = {
    title: product.details.title
      ? `${product.details.title} - ${product.details.short_description}`
      : 'Boomslag - Physical Products Marketplace',
    description:
      product.description ||
      'Discover and learn from the best online products in various categories on Boomslag - the ultimate NFT marketplace for products and products. Buy and sell using ERC1155 tokens to ensure seamless and secure transactions.',
    href: product.details.slug ? `/products/${product.details.slug}` : '/',
    url: product.details.slug
      ? `https://boomslag.com/products/${product.details.slug}`
      : 'https://boomslag.com',
    keywords: product.details.keywords
      ? `${product.details.keywords}, online products, blockchain products, boomslag products, nft online products`
      : 'online products, blockchain products, boomslag products, nft online products',
    robots: 'all',
    author: author.username || 'BoomSlag',
    publisher: 'BoomSlag',
    image:
      product.images && product.images.length > 0
        ? product.images[0].file
        : 'https://bafybeiaor24mrcurzyzccxl7xw46zdqpor4sfuhddl6tzblujoiukchxnq.ipfs.w3s.link/teach.png',
    twitterHandle: '@BoomSlag',
  };

  const dispatch = useDispatch();
  const router = useRouter();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);

  const wallet = useSelector((state) => state.auth.wallet);
  const polygonAddress = wallet && wallet.polygon_address;

  const coupon = useSelector((state) => state.coupons.coupon);
  const cartItems = useSelector((state) => state.cart.items);
  const couponType = useSelector((state) => state.coupons.type);
  const couponDiscount = useSelector((state) => state.coupons.discount);

  const [openShare, setOpenShare] = useState(false);
  const [open, setOpen] = useState(false);
  const [openTrade, setOpenTrade] = useState(false);
  const [openJoinAffiliate, setOpenJoinAffiliate] = useState(false);
  const [effectClick, setEffectClick] = useState(false);
  const [effectCart, setEffectCart] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDescription, setShowDescription] = useState(false);

  const [quantity, setQuantity] = useState(1);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [selectedShipping, setSelectedShipping] = useState(null);
  useEffect(() => {
    if (product.shipping[0]) {
      setSelectedShipping(product.shipping[0]);
    }
  }, [product]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState(product.weights[0] || null);
  const [selectedSize, setSelectedSize] = useState(null);
  const details = product && product.details;

  // useEffect(() => {
  //   if (product) {
  //     UpdateProductViews(product.details.id);
  //   }
  // }, [productUUID, product]);

  useEffect(() => {
    dispatch(removeCoupon());
  }, [dispatch]);

  const shareUrl = `${process.env.NEXT_PUBLIC_APP_PUBLIC_URL}product/${product.details.slug}`;
  const shareUrlAffiliate = `${process.env.NEXT_PUBLIC_APP_PUBLIC_URL}/product/${product.details.slug}?referrer=${polygonAddress}`;

  // useEffect(() => {
  //   const startTime = new Date();
  //   const startTimeInSeconds = startTime.getSeconds();

  //   return () => {
  //     const endTime = new Date();
  //     const endTimeInSeconds = endTime.getSeconds();
  //     const duration = endTimeInSeconds - startTimeInSeconds;
  //     UpdateAnalytics(product.details.id, duration);
  //   };
  //   // eslint-disable-next-line
  // }, []);

  function scrollFunction() {
    if (document.getElementById('navbar')) {
      if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
        document.getElementById('navbar').classList.remove('hidden');
      } else {
        document.getElementById('navbar').classList.add('hidden');
      }
    }

    if (document.getElementById('navbar')) {
      if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
        document.getElementById('navbar').style.top = '0';
      } else {
        document.getElementById('navbar').style.top = '-100px';
      }
    }

    if (document.getElementById('above-fold-video')) {
      if (document.body.scrollTop > 560 || document.documentElement.scrollTop > 560) {
        document.getElementById('above-fold-video').classList.add('hidden');
      } else {
        document.getElementById('above-fold-video').classList.remove('hidden');
      }
    }

    if (document.getElementById('below-fold-video')) {
      if (
        document.body.scrollTop > 560 ||
        (document.documentElement.scrollTop > 560 && document.body.clientWidth > 1239)
      ) {
        document.getElementById('below-fold-video').classList.remove('hidden');
      } else {
        document.getElementById('below-fold-video').classList.add('hidden');
      }
    }
  }

  useEffect(() => {
    window.onscroll = function () {
      scrollFunction();
    };
  }, []);

  const productExistsInCart =
    cartItems && cartItems.some((u) => u.product && u.product.includes(product.details.id));

  async function handleAddToCart() {
    if (productExistsInCart) {
      router.push('/cart');
    }

    if (isAuthenticated) {
      if (coupon) {
        if (selectedShipping !== null) {
          dispatch(
            addItemAuthenticated(
              product.details.id,
              'Product',
              coupon,
              selectedShipping,
              quantity,
              selectedSize,
              selectedColor,
              selectedWeight,
              selectedMaterial,
              referrer,
            ),
          );
        }
      } else if (selectedShipping !== null) {
        dispatch(
          addItemAuthenticated(
            product.details.id,
            'Product',
            null,
            selectedShipping,
            quantity,
            selectedSize,
            selectedColor,
            selectedWeight,
            selectedMaterial,
            referrer,
          ),
        );
      } else {
        ToastSuccess('Select Shipping Option');
      }
    }

    if (!isAuthenticated) {
      if (coupon) {
        if (selectedShipping !== null) {
          dispatch(
            addItemAnonymous(
              product.details.id,
              'Product',
              coupon,
              selectedShipping,
              quantity,
              selectedSize,
              selectedColor,
              selectedWeight,
              selectedMaterial,
              referrer,
            ),
          );
        }
      } else if (selectedShipping !== null) {
        dispatch(
          addItemAnonymous(
            product.details.id,
            'Product',
            null,
            selectedShipping,
            quantity,
            selectedSize,
            selectedColor,
            selectedWeight,
            selectedMaterial,
            referrer,
          ),
        );
      } else {
        ToastSuccess('Select Shipping Option');
      }
    }
  }

  function applyCoupon(e) {
    e.preventDefault();
    dispatch(checkCoupon(selectedCoupon, productUUID[0], 'products'));
  }

  const topBar = () => {
    return (
      <div
        id="navbar"
        className="fixed top-0 z-40 hidden w-full dark:bg-dark-main bg-dark-gray py-1.5"
      >
        <div>
          <div className="py-3 ml-0 lg:ml-12">
            <div className="ml-5 text-lg font-bold leading-6 text-white">
              {product && product.details.title}
              <div className="float-right flex lg:hidden">
                {/* Price */}
                <div className="flex px-4 text-dark">
                  <div className="mr-4 flex-shrink-0 self-end">
                    {coupon && couponType && couponDiscount ? (
                      couponType === 'fixed' ? (
                        <p className="inline-flex text-xl font-bold dark:text-dark-txt">
                          $ {(parseFloat(productPrice) - couponDiscount).toFixed(2)}
                        </p>
                      ) : (
                        couponType === 'percentage' && (
                          <p className="inline-flex text-xl font-bold dark:text-dark-txt">
                            $ {(parseFloat(productPrice) * (1 - couponDiscount / 100)).toFixed(2)}
                          </p>
                        )
                      )
                    ) : (
                      <p className="inline-flex text-xl font-bold dark:text-dark-txt">
                        $ {parseFloat(productPrice).toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {
              // eslint-disable-next-line
              product && product.details.best_seller ? (
                <span className="mr-2 ml-4 inline-flex items-center rounded-full bg-almond-100 px-2.5 py-0.5 text-xs font-bold text-almond-800">
                  Best seller
                </span>
              ) : (
                <div />
              )
            }
            <span className={`${details && details.best_seller ? '' : 'ml-4'} mr-2 inline-flex`}>
              {[0, 1, 2, 3, 4].map((rating) => (
                <StarIcon
                  key={rating}
                  className={classNames(
                    details.rating > rating ? 'text-almond-600' : 'text-gray-200',
                    'h-5 w-5 flex-shrink-0',
                  )}
                  aria-hidden="true"
                />
              ))}
            </span>
            <span className="text-sm text-purple-300">
              ({details && details.rating_no} ratings)
            </span>
            <span className="font-medium text-white ml-2 text-sm">{details.sold} Sold</span>
          </div>
        </div>
      </div>
    );
  };

  const baseProductPrice =
    details && details.compare_price && product.discount ? details.compare_price : details.price;
  const productPrice = baseProductPrice ? parseFloat(baseProductPrice) : 0;
  const initialWeightPrice = selectedWeight ? parseFloat(selectedWeight.price) : 0;
  const displayPrice = (productPrice + initialWeightPrice).toFixed(2);

  const addToCartForm = () => {
    return (
      <div className="w-full transition">
        <div className="  px-4 py-2">
          <div className=" pb-5">
            <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
              <div className="ml-4 mt-2">
                <h3 className="text-base font-semibold leading-6 dark:text-dark-txt text-gray-900">
                  {details && details.title}
                </h3>
              </div>
              <div className="ml-4 mt-2 flex-shrink-0">
                <p className="text-sm text-almond-600">
                  <span className="mr-2 inline-flex">
                    {[0, 1, 2, 3, 4].map((rate) => (
                      <StarIcon
                        key={rate}
                        className={classNames(
                          details.rating > rate ? 'text-yellow-400' : 'text-gray-300',
                          'h-5 w-5 flex-shrink-0',
                        )}
                        aria-hidden="true"
                      />
                    ))}
                  </span>
                  <span className="inline-flex text-xs text-gray-400 dark:text-dark-txt-secondary">
                    ({details.rating_no}) ratings
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
            <div className="ml-4 mt-4">
              <div className="flex">
                <div className="mr-4 flex-shrink-0">
                  <Image
                    className="inline-block h-8 w-8 rounded-full"
                    src={authorProfile && authorProfile.picture}
                    alt=""
                    width={50}
                    height={50}
                  />
                </div>
                <div>
                  <p className="font-medium dark:text-dark-txt-accent text-iris-500  text-sm">
                    <Link href={`/@/${encodeURIComponent(author && author.username)}`}>
                      {author && author.username}
                    </Link>
                    {user && user.verified && (
                      <CheckBadgeIcon
                        className="ml-1 inline-flex h-5 w-auto text-purple-500"
                        aria-hidden="true"
                      />
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="-ml-4 mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
            <div className="ml-4 w-full ">
              {!loading && details && details.discount && (
                <Clock time={details && details.discount_until} />
              )}
            </div>
          </div>

          <div className="-ml-4 mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
            <div className="ml-4 ">
              {loading ? (
                <LoadingMoon size={20} color="#1e1f48" />
              ) : (
                <div className="flex">
                  <p className=" text-gray-800 dark:text-dark-txt">
                    <strong>
                      ${displayPrice}
                      <span className="font-base">
                        {' '}
                        + ${selectedShipping && selectedShipping.price} Shipping
                      </span>
                    </strong>
                  </p>

                  <div className="ml-2 flex-shrink-0">
                    {coupon ? (
                      <p className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-bold text-almond-800">
                        {coupon.name}
                      </p>
                    ) : (
                      <div />
                    )}
                  </div>
                  <div className="ml-2 flex-shrink-0">
                    {product.discount ? (
                      <p className="inline-flex items-center rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-800">
                        {parseInt(
                          ((details.compare_price - displayPrice) / details.compare_price) * 100,
                          10,
                        )}
                        % Off
                      </p>
                    ) : (
                      <div />
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className=" flex-shrink-0">
              {/* Stock Count */}
              <div className="inline-flex">
                <div className="flex items-center justify-between">
                  <p className="font-regular mr-2 text-sm text-gray-900 dark:text-dark-txt">
                    Stock left
                  </p>
                </div>
                <div className="block  grid-cols-3 gap-3 text-lg font-bold sm:grid-cols-6">
                  {stock !== false ? (
                    stock === -1 ? (
                      <i className="bx bx-infinite text-xl" />
                    ) : (
                      <>
                        {stock && stock >= 10 ? (
                          <div className="text-green-500">{stock && stock}</div>
                        ) : (
                          <div className="text-red-500">{stock && stock}</div>
                        )}
                      </>
                    )
                  ) : (
                    <>
                      <MoonLoader loading size={15} className="mr-1" color="#1c1d1f" />
                      <span>Loading</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
            <div className="ml-4 mt-4">
              <div className="flex">
                <div className="mr-4 flex-shrink-0">
                  <div className="flex">
                    {/* <div className="mr-4 font-bold flex-shrink-0 dark:text-dark-txt">Qty</div> */}
                    <div>
                      <span className="isolate inline-flex rounded-md shadow-sm">
                        <button
                          type="button"
                          onClick={() => {
                            if (quantity > 1) {
                              setQuantity(quantity - 1);
                            }
                          }}
                          disabled={quantity === 1}
                          className="focus:border-indigo-500 dark:focus:border-dark-primary dark:focus:ring-dark-primary focus:ring-indigo-500 relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 dark:border-dark-border dark:text-dark-txt dark:bg-dark-bg dark:hover:bg-dark-second"
                        >
                          <i className="bx bxs-left-arrow text-gray-700 dark:text-dark-txt" />
                        </button>
                        <div
                          type="button"
                          className="relative -ml-px inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 dark:border-dark-border dark:text-dark-txt dark:bg-dark-bg"
                        >
                          {quantity}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (quantity < (stock && stock)) {
                              setQuantity(quantity + 1);
                            }
                          }}
                          className="focus:border-indigo-500 dark:focus:border-dark-primary dark:focus:ring-dark-primary focus:ring-indigo-500 relative -ml-px inline-flex items-center rounded-r-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 dark:border-dark-border dark:text-dark-txt dark:bg-dark-bg dark:hover:bg-dark-second"
                        >
                          <i className="bx bxs-right-arrow text-gray-700 dark:text-dark-txt" />
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="ml-4 mt-4 flex-shrink-0">
              <div className="flex">
                <div className="mr-2 flex-shrink-0 dark:text-dark-txt">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <span className="isolate inline-flex dark:text-dark-txt">
                    {details && details.views} <span className="ml-1 font-bold"> views</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4">
          <Tab.Group>
            <Tab.List className=" grid  space-x-1 space-y-1 p-1 sm:flex sm:space-y-0  ">
              <Tab
                className={({ selected }) =>
                  classNames(
                    'col-span-1 w-full py-2.5 text-md leading-5 md:col-span-2',
                    '',
                    selected
                      ? 'flex items-center justify-center space-x-2 border-b-4 border-gray-900 p-1 font-medium text-black focus:outline-none dark:text-dark-txt dark:border-dark-primary'
                      : 'flex items-center justify-center border-b-2 border-gray-50 p-1 font-base text-gray-600 hover:border-gray-200 dark:border-dark-third dark:text-dark-txt dark:hover:border-dark-border md:space-x-2',
                  )
                }
              >
                Shipping
              </Tab>
              {product && product.colors.length > 0 && (
                <Tab
                  className={({ selected }) =>
                    classNames(
                      'col-span-1 w-full py-2.5 text-md leading-5 md:col-span-2',
                      '',
                      selected
                        ? 'flex items-center justify-center space-x-2 border-b-4 border-gray-900 p-1 font-medium text-black focus:outline-none dark:text-dark-txt dark:border-dark-primary'
                        : 'flex items-center justify-center border-b-2 border-gray-50 p-1 font-base text-gray-600 hover:border-gray-200 dark:border-dark-third dark:text-dark-txt dark:hover:border-dark-border md:space-x-2',
                    )
                  }
                >
                  Color
                </Tab>
              )}
              {product && product.sizes.length > 0 && (
                <Tab
                  className={({ selected }) =>
                    classNames(
                      'col-span-1 w-full py-2.5 text-md leading-5 md:col-span-2',
                      '',
                      selected
                        ? 'flex items-center justify-center space-x-2 border-b-4 border-gray-900 p-1 font-medium text-black focus:outline-none dark:text-dark-txt dark:border-dark-primary'
                        : 'flex items-center justify-center border-b-2 border-gray-50 p-1 font-base text-gray-600 hover:border-gray-200 dark:border-dark-third dark:text-dark-txt dark:hover:border-dark-border md:space-x-2',
                    )
                  }
                >
                  Size
                </Tab>
              )}
              {product && product.materials.length > 0 && (
                <Tab
                  className={({ selected }) =>
                    classNames(
                      'col-span-1 w-full py-2.5 text-md leading-5 md:col-span-2',
                      '',
                      selected
                        ? 'flex items-center justify-center space-x-2 border-b-4 border-gray-900 p-1 font-medium text-black focus:outline-none dark:text-dark-txt dark:border-dark-primary'
                        : 'flex items-center justify-center border-b-2 border-gray-50 p-1 font-base text-gray-600 hover:border-gray-200 dark:border-dark-third dark:text-dark-txt dark:hover:border-dark-border md:space-x-2',
                    )
                  }
                >
                  Material
                </Tab>
              )}
              {product && product.weights.length > 0 && (
                <Tab
                  className={({ selected }) =>
                    classNames(
                      'col-span-1 w-full py-2.5 text-md leading-5 md:col-span-2',
                      '',
                      selected
                        ? 'flex items-center justify-center space-x-2 border-b-4 border-gray-900 p-1 font-medium text-black focus:outline-none dark:text-dark-txt dark:border-dark-primary'
                        : 'flex items-center justify-center border-b-2 border-gray-50 p-1 font-base text-gray-600 hover:border-gray-200 dark:border-dark-third dark:text-dark-txt dark:hover:border-dark-border md:space-x-2',
                    )
                  }
                >
                  Weight
                </Tab>
              )}
            </Tab.List>
            <Tab.Panels>
              {/* Shipping */}
              <Tab.Panel>
                <div className="items-center justify-center space-x-2 py-4 text-center">
                  <RadioGroup value={selectedShipping} onChange={setSelectedShipping}>
                    <RadioGroup.Label className="sr-only">Pricing plans</RadioGroup.Label>
                    <div className="relative space-y-1 ">
                      {product &&
                        product.shipping.map((item, planIdx) => (
                          <RadioGroup.Option
                            key={item.id}
                            value={item}
                            required
                            className={({ checked }) =>
                              classNames(
                                planIdx === 0 ? '' : '',
                                planIdx === item.length - 1 ? '' : '',
                                checked
                                  ? 'z-10 border-purple-200 dark:bg-dark-accent dark:border-dark-primary  bg-purple-50'
                                  : 'border-gray-200 dark:border-dark-second dark:bg-dark-second',
                                'relative flex flex-col py-2 px-4 sm:flex-row sm:items-center sm:justify-between sm:space-x-4 cursor-pointer border focus:outline-none md:grid md:grid-cols-3 md:pl-4 md:pr-6 rounded-md',
                              )
                            }
                          >
                            {({ active, checked }) => (
                              <>
                                <span className="flex items-center text-sm">
                                  <RadioGroup.Label
                                    as="span"
                                    className={classNames(
                                      checked
                                        ? 'text-purple-900 dark:text-white'
                                        : 'text-gray-900 dark:text-dark-txt',
                                      'ml-3 font-medium',
                                    )}
                                  >
                                    {item.title}
                                  </RadioGroup.Label>
                                </span>
                                <RadioGroup.Description
                                  as="span"
                                  className="mt-1 sm:mt-0 text-sm md:ml-0 md:pl-0 md:text-center"
                                >
                                  <span
                                    className={classNames(
                                      checked
                                        ? 'text-purple-900 dark:text-white'
                                        : 'text-gray-900 dark:text-dark-txt',
                                      'font-medium',
                                    )}
                                  >
                                    ${item.price}
                                  </span>
                                </RadioGroup.Description>
                                <RadioGroup.Description
                                  as="span"
                                  className={classNames(
                                    checked
                                      ? 'text-purple-700 dark:text-white'
                                      : 'text-gray-500 dark:text-dark-txt',
                                    'ml-6 pl-1 text-sm md:ml-0 md:pl-0 md:text-right',
                                  )}
                                >
                                  Days: {item.time}
                                </RadioGroup.Description>
                              </>
                            )}
                          </RadioGroup.Option>
                        ))}
                    </div>
                  </RadioGroup>
                </div>
              </Tab.Panel>
              {/* Color Select */}
              {product && product.colors.length > 0 && (
                <Tab.Panel>
                  {product && product.colors.length !== 0 ? (
                    <RadioGroup value={selectedColor} onChange={setSelectedColor} className="p-4">
                      <div className="flex items-center space-x-3">
                        {product.colors.map((color) => (
                          <RadioGroup.Option
                            key={color.id}
                            value={color.id}
                            className={({ active, checked }) =>
                              classNames(
                                color.selectedColor,
                                active && checked ? 'ring ring-offset-1' : '',
                                !active && checked ? 'ring-2' : '',
                                'relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none',
                              )
                            }
                          >
                            <span
                              aria-hidden="true"
                              className={classNames(
                                'h-8 w-8 rounded-full border border-black border-opacity-10',
                              )}
                              style={{ backgroundColor: color.hex }}
                            />
                          </RadioGroup.Option>
                        ))}
                      </div>
                    </RadioGroup>
                  ) : (
                    <div />
                  )}
                </Tab.Panel>
              )}
              {/* Size */}
              {product && product.sizes.length > 0 && (
                <Tab.Panel>
                  {/* Size picker */}
                  <RadioGroup value={selectedSize} onChange={setSelectedSize} className="py-4">
                    <RadioGroup.Label className="sr-only"> Privacy setting </RadioGroup.Label>
                    <div className="-space-y-px rounded-md bg-white dark:bg-dark-main ">
                      {product &&
                        product.sizes.map((size, settingIdx) => (
                          <RadioGroup.Option
                            key={size.id}
                            value={size.id}
                            disabled={!size.inStock}
                            className={({ checked }) =>
                              classNames(
                                settingIdx === 0 ? 'rounded-tl-md rounded-tr-md' : '',
                                settingIdx === size.length - 1 ? 'rounded-bl-md rounded-br-md' : '',
                                checked
                                  ? 'border-purple-200 bg-purple-50'
                                  : 'border-gray-200 dark:border-dark-third',
                                'relative flex cursor-pointer border p-4 focus:outline-none',
                              )
                            }
                          >
                            {({ active, checked }) => (
                              <>
                                <span
                                  className={classNames(
                                    checked
                                      ? 'border-transparent bg-purple-600'
                                      : 'border-gray-300 bg-white ',
                                    active ? 'ring-2 ring-purple-500 ring-offset-2' : '',
                                    'mt-0.5 flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded-full border',
                                  )}
                                  aria-hidden="true"
                                >
                                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                </span>
                                <span className="ml-3 flex flex-col">
                                  <RadioGroup.Label
                                    as="span"
                                    className={classNames(
                                      checked
                                        ? 'text-purple-900'
                                        : 'text-gray-900 dark:text-dark-txt',
                                      'block text-sm font-medium',
                                    )}
                                  >
                                    {size.title}
                                  </RadioGroup.Label>
                                  {/* <RadioGroup.Description
                                        as="span"
                                        className={classNames(checked ? 'text-purple-700' : 'text-gray-500', 'block text-sm')}
                                    >
                                        {setting.description}
                                    </RadioGroup.Description> */}
                                </span>
                              </>
                            )}
                          </RadioGroup.Option>
                        ))}
                    </div>
                  </RadioGroup>
                </Tab.Panel>
              )}
              {/* Material */}
              {product && product.materials.length > 0 && (
                <Tab.Panel>
                  <div className="items-center justify-center space-x-2 py-4 text-center">
                    <RadioGroup value={selectedMaterial} onChange={setSelectedMaterial}>
                      <RadioGroup.Label className="sr-only"> Pricing plans </RadioGroup.Label>
                      <div className="relative -space-y-px rounded-md bg-white dark:bg-dark-main">
                        {product &&
                          product.materials.map((item, planIdx) => (
                            <RadioGroup.Option
                              key={item.id}
                              value={item.id}
                              required
                              className={({ checked }) =>
                                classNames(
                                  planIdx === 0 ? 'rounded-tl-md rounded-tr-md' : '',
                                  planIdx === item.length - 1 ? 'rounded-bl-md rounded-br-md' : '',
                                  checked
                                    ? 'z-10 border-purple-200 bg-purple-50'
                                    : 'border-gray-200 dark:border-dark-third',
                                  'relative flex cursor-pointer flex-col border p-4 focus:outline-none md:grid md:grid-cols-3 md:pl-4 md:pr-6',
                                )
                              }
                            >
                              {({ active, checked }) => (
                                <>
                                  <span className="flex items-center text-sm">
                                    <span
                                      className={classNames(
                                        checked
                                          ? 'border-transparent bg-purple-600'
                                          : 'border-gray-300 bg-white',
                                        active ? 'ring-2 ring-purple-500 ring-offset-2' : '',
                                        'flex h-4 w-4 items-center justify-center rounded-full border',
                                      )}
                                      aria-hidden="true"
                                    >
                                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                    </span>
                                    <RadioGroup.Label
                                      as="span"
                                      className={classNames(
                                        checked
                                          ? 'text-purple-900'
                                          : 'text-gray-900 dark:text-dark-txt',
                                        'ml-3 font-medium',
                                      )}
                                    >
                                      {item.title}
                                    </RadioGroup.Label>
                                  </span>
                                  <RadioGroup.Description
                                    as="span"
                                    className="ml-6 pl-1 text-sm md:ml-0 md:pl-0 md:text-center"
                                  >
                                    <span
                                      className={classNames(
                                        checked
                                          ? 'text-purple-900'
                                          : 'text-gray-900 dark:text-dark-txt',
                                        'font-medium',
                                      )}
                                    >
                                      ${item.price}
                                    </span>
                                  </RadioGroup.Description>
                                  <RadioGroup.Description
                                    as="span"
                                    className={classNames(
                                      checked ? 'text-purple-700' : 'text-gray-500',
                                      'ml-6 pl-1 text-sm md:ml-0 md:pl-0 md:text-right',
                                    )}
                                  >
                                    <img
                                      className="inline-flex h-6 w-6 rounded-full object-cover"
                                      src={item.image}
                                      alt=""
                                    />
                                  </RadioGroup.Description>
                                </>
                              )}
                            </RadioGroup.Option>
                          ))}
                      </div>
                    </RadioGroup>
                  </div>
                </Tab.Panel>
              )}
              {/* Weight */}
              {product && product.weights.length > 0 && (
                <Tab.Panel>
                  <div className="items-center justify-center space-x-2 py-4 text-center">
                    <RadioGroup value={selectedWeight} onChange={setSelectedWeight}>
                      <RadioGroup.Label className="sr-only"> Pricing plans </RadioGroup.Label>
                      <div className="relative space-y-1 ">
                        {product &&
                          product.weights.map((item, planIdx) => (
                            <RadioGroup.Option
                              key={item.id}
                              value={item}
                              required
                              className={({ checked }) =>
                                classNames(
                                  planIdx === 0 ? '' : '',
                                  planIdx === item.length - 1 ? '' : '',
                                  checked
                                    ? 'z-10 border-purple-200 dark:bg-dark-accent dark:border-dark-primary  bg-purple-50'
                                    : 'border-gray-200 dark:border-dark-second dark:bg-dark-second',
                                  'relative flex flex-col py-2 px-4 sm:flex-row sm:items-center sm:justify-between sm:space-x-4 cursor-pointer border focus:outline-none md:grid md:grid-cols-3 md:pl-4 md:pr-6 rounded-md',
                                )
                              }
                            >
                              {({ active, checked }) => (
                                <>
                                  <span className="flex items-center text-sm">
                                    <RadioGroup.Label
                                      as="span"
                                      className={classNames(
                                        checked
                                          ? 'text-purple-900 dark:text-white'
                                          : 'text-gray-900 dark:text-dark-txt',
                                        'ml-3 font-medium',
                                      )}
                                    >
                                      {item.title}g
                                    </RadioGroup.Label>
                                  </span>
                                  <RadioGroup.Description
                                    as="span"
                                    className="ml-6 pl-1 text-sm md:ml-0 md:pl-0 md:text-center"
                                  >
                                    <span
                                      className={classNames(
                                        checked
                                          ? 'text-purple-900 dark:text-white'
                                          : 'text-gray-900 dark:text-dark-txt',
                                        'font-medium',
                                      )}
                                    >
                                      ${item.price}
                                    </span>
                                  </RadioGroup.Description>
                                  <RadioGroup.Description
                                    as="span"
                                    className={classNames(
                                      checked
                                        ? 'text-purple-700 dark:text-white'
                                        : 'text-gray-500 dark:text-dark-txt',
                                      'ml-6 pl-1 text-sm md:ml-0 md:pl-0 md:text-right',
                                    )}
                                  >
                                    Stock: {item.stock}
                                  </RadioGroup.Description>
                                </>
                              )}
                            </RadioGroup.Option>
                          ))}
                      </div>
                    </RadioGroup>
                  </div>
                </Tab.Panel>
              )}
            </Tab.Panels>
          </Tab.Group>

          {}
          {/* Add to Cart / Buy / Wishlist */}

          <div className=" grid w-full grid-cols-4 space-x-1">
            <button
              type="button"
              onClick={() => {
                handleAddToCart();
              }}
              onMouseDown={() => {
                setEffectCart(true);
              }}
              onMouseUp={() => setEffectCart(false)}
              className={`${
                effectCart &&
                'duration-400 animate-click hover:translate-x-0.5  hover:translate-y-0.5 hover:shadow-neubrutalism-sm'
              }
            ${isAuthenticated ? 'col-span-3' : 'col-span-4'}
            text-md
                      col-span-3
                      inline-flex 
                      w-full
                      items-center
                      justify-center
                      border 
                      border-dark-bg 
                      bg-iris-500
                      dark:bg-dark-primary
                      dark:shadow-none
                      rounded-2xl
                      px-10 
                        py-4
                      font-bold 
                      text-white 
                      shadow-neubrutalism-md 
                      transition
                      duration-300  
                      ease-in-out 
                      hover:-translate-x-0.5 
                      hover:-translate-y-0.5  
                      hover:bg-iris-400
                      hover:shadow-neubrutalism-lg  `}
            >
              {productExistsInCart ? 'Go to cart' : 'Add to Cart'}
            </button>
            {isAuthenticated && (
              <button
                type="button"
                // onClick={addToWishlist}
                className="text-md focus:ring-none col-span-1 mt-2 inline-flex w-full cursor-pointer items-center justify-center px-3 py-4 font-bold  leading-4 text-gray-600 transition  duration-300 ease-in-out hover:border-rose-400 hover:text-rose-500 focus:outline-none"
              >
                <HeartIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            )}
          </div>
          {isAuthenticated && (
            <div className=" py-4">
              <button
                type="button"
                onMouseDown={() => {
                  setEffectClick(true);
                }}
                onMouseUp={() => setEffectClick(false)}
                className={`${
                  effectClick &&
                  'duration-400 animate-click hover:translate-x-0.5  hover:translate-y-0.5 hover:shadow-neubrutalism-sm'
                } text-md inline-flex w-full 
                      items-center
                      justify-center
                      border 
                      border-dark-bg 
                      bg-white 
                      rounded-2xl
                      dark:shadow-none
                      px-10
                      py-4 
                      font-bold 
                      shadow-neubrutalism-md 
                      transition 
                      duration-300 
                      ease-in-out
                      hover:-translate-x-0.5  hover:-translate-y-0.5 hover:bg-gray-50 hover:text-iris-600  
                      hover:shadow-neubrutalism-lg
                      dark:text-dark `}
              >
                Buy now
              </button>
            </div>
          )}
        </div>
        {/* Coupon form */}
        <Tab.Group>
          <Tab.List className=" -mb-px  grid  space-x-1 space-y-1 p-1 sm:flex sm:space-x-2 sm:space-y-0  ">
            <div
              className="col-span-1 w-full py-2.5 text-md leading-5 md:col-span-2 flex items-center justify-center space-x-2 border-b-2 border-gray-50 p-1 font-base text-gray-600 hover:border-gray-200 dark:border-dark-third dark:text-dark-txt dark:hover:border-dark-border md:space-x-2 cursor-pointer"
              onClick={() => {
                setOpenShare(true);
              }}
            >
              Share
            </div>
            <Tab
              className={({ selected }) =>
                classNames(
                  'col-span-1 w-full py-2.5 text-md leading-5 md:col-span-2',
                  '',
                  selected
                    ? 'flex items-center justify-center space-x-2 border-b-4 border-gray-900 p-1 font-medium text-black focus:outline-none dark:text-dark-txt dark:border-dark-primary'
                    : 'flex items-center justify-center border-b-2 border-gray-50 p-1 font-base text-gray-600 hover:border-gray-200 dark:border-dark-third dark:text-dark-txt dark:hover:border-dark-border md:space-x-2',
                )
              }
            >
              Affiliate
            </Tab>

            <Tab
              className={({ selected }) =>
                classNames(
                  'col-span-1 w-full py-2.5 text-md leading-5 md:col-span-2',
                  '',
                  selected
                    ? 'flex items-center justify-center space-x-2 border-b-4 border-gray-900 p-1 font-medium text-black focus:outline-none dark:text-dark-txt dark:border-dark-primary'
                    : 'flex items-center justify-center border-b-2 border-gray-50 p-1 font-base text-gray-600 hover:border-gray-200 dark:border-dark-third dark:text-dark-txt dark:hover:border-dark-border md:space-x-2',
                )
              }
            >
              Coupon
            </Tab>
          </Tab.List>
          <Tab.Panels>
            {/* Affiliate Panel Course */}
            <Tab.Panel>
              {isAffiliate ? (
                <div className="relative pb-2 mt-4">
                  <div className="relative flex  flex-grow items-stretch focus-within:z-20">
                    <CopyToClipboard text={shareUrlAffiliate}>
                      <div
                        onClick={() => {
                          ToastSuccess('URL Copied to clipboard', 'success');
                        }}
                        className="relative cursor-pointer w-full"
                      >
                        <div className="hidden md:block w-full truncate border dark:text-dark-txt dark:bg-dark-second dark:border-dark-border border-gray-700 py-4 pl-2 pr-12 text-sm">
                          {shareUrlAffiliate.slice(0, 60)}...
                        </div>
                        <div className="md:hidden block w-full truncate border dark:text-dark-txt dark:bg-dark-second dark:border-dark-border border-gray-700 py-4 pl-2 pr-12 text-sm">
                          {shareUrlAffiliate.slice(0, 30)}
                        </div>
                        <div className="absolute inset-y-0 right-0 flex items-center dark:bg-dark-third border dark:border-dark-border dark:hover:bg-dark-main bg-dark-main px-6 hover:bg-gray-900">
                          <span
                            className="text-sm font-bold dark:text-dark-txt text-white"
                            id="price-currency"
                          >
                            Copy URL
                          </span>
                        </div>
                      </div>
                    </CopyToClipboard>
                  </div>
                </div>
              ) : (
                <form className="px-6 pb-2 mt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setOpenJoinAffiliate(true);
                    }}
                    className="text-md col-span-4 mt-1 mr-4 inline-flex w-full items-center justify-center dark:bg-dark-primary border border-purple-700 border-transparent bg-iris-500 px-3 py-4 font-bold leading-4 text-white shadow-neubrutalism-sm transition duration-300 ease-in-out hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-iris-800 hover:bg-iris-600 hover:text-iris-50 hover:shadow-neubrutalism-md"
                  >
                    Join Affiliate Program
                  </button>
                </form>
              )}
            </Tab.Panel>
            {/* Apply Coupon */}
            <Tab.Panel>
              <form onSubmit={(e) => applyCoupon(e)} className="relative mt-4">
                <div className="relative flex flex-grow items-stretch focus-within:z-20">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <ReceiptRefundIcon
                      className="h-5 w-5 dark:text-dark-txt-secondary text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                  {coupon ? (
                    <input
                      id="discount_coupon"
                      disabled
                      required
                      placeholder={coupon && coupon.name}
                      className="block w-full dark:bg-dark-second focus:outline-none focus:ring-none truncate border dark:text-dark-txt dark:border-dark-border border-gray-700 py-4 px-12 text-sm"
                    />
                  ) : (
                    <input
                      id="discount_coupon"
                      required
                      className="block w-full dark:bg-dark-second focus:outline-none focus:ring-none truncate border dark:text-dark-txt dark:border-dark-border border-gray-700 py-4 px-10 text-sm"
                    />
                  )}
                  <div className=" absolute inset-y-0 right-0 flex items-center dark:bg-dark-third border dark:border-dark-border dark:hover:bg-dark-main bg-dark-main px-6 hover:bg-gray-900">
                    {coupon ? (
                      <div
                        className="text-sm font-bold  dark:text-dark-txt  text-white "
                        id="price-currency"
                      >
                        Applied
                      </div>
                    ) : (
                      <button
                        type="submit"
                        className="text-sm font-bold  dark:text-dark-txt  text-white "
                        id="price-currency"
                      >
                        Apply
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </Tab.Panel>
            <Tab.Panel>
              <form onSubmit={(e) => applyCoupon(e)} className="px-6 py-4">
                <div>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <div className="relative flex flex-grow items-stretch focus-within:z-20">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <ReceiptRefundIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      {coupon ? (
                        <input
                          id="discount_coupon"
                          disabled
                          required
                          className="focus:border-indigo-500 focus:ring-indigo-500 block w-full rounded-none rounded-l-md border-gray-300 pl-10 font-medium sm:text-sm"
                          placeholder={coupon && coupon.name}
                        />
                      ) : (
                        <input
                          type="text"
                          name="coupon_name"
                          value={selectedCoupon}
                          onChange={(e) => setSelectedCoupon(e.target.value)}
                          id="discount_coupon"
                          required
                          className="focus:border-indigo-500 focus:ring-indigo-500 block w-full rounded-none rounded-l-md border-gray-300 pl-10 font-medium sm:text-sm"
                          placeholder="Discount coupon"
                        />
                      )}
                    </div>
                    {coupon ? (
                      <div className="relative -ml-px inline-flex cursor-default items-center space-x-2 rounded-r-md border border-gray-300 bg-dark px-4 py-2 text-sm font-medium text-white hover:bg-gray-900">
                        <span>Applied</span>
                      </div>
                    ) : (
                      <button
                        type="submit"
                        className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-gray-300 bg-dark px-4 py-2 text-sm font-medium text-white hover:bg-gray-900"
                      >
                        <span>Apply</span>
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
        <div className="-mb-2 mt-2">
          <LockClosedIcon className="text-cyan-600 mr-2 ml-4 inline-flex h-4 w-4" />
          <p className="text-cyan-900 inline-flex text-sm font-medium leading-6 ">
            Secure transaction
          </p>
        </div>
      </div>
    );
  };

  const mediaItems = [...product.videos, ...product.images];

  function getMediaType(file) {
    const fileExtension = file.split('.').pop();
    if (['mp4', 'webm', 'ogg'].includes(fileExtension)) {
      return 'video';
    }
    return 'image';
  }

  const detailSlice = [];

  if (product && product.detail.length >= 4) {
    [detailSlice[0], detailSlice[1], detailSlice[2], detailSlice[3]] = product.detail.slice(0, 4);
  }

  const nftAddress = product && product.details.nft_address;
  const ticketId = product && product.details.token_id;
  const [contractABI, setContractABI] = useState('');

  const [ownsTicket, setOwnsTicket] = useState(false);
  useEffect(() => {
    if (isAuthenticated && polygonAddress) {
      const fetchData = async () => {
        if (nftAddress && contractABI && ticketId) {
          const contract = new web3.eth.Contract(contractABI, nftAddress);
          const hasAccess = await contract.methods
            .hasAccess(parseInt(ticketId), polygonAddress)
            .call();
          console.log(hasAccess);
          setOwnsTicket(hasAccess);
        }
      };
      fetchData();
    }
  }, [nftAddress, ticketId, isAuthenticated, polygonAddress, contractABI]);

  const [stock, setStock] = useState(false);
  useEffect(() => {
    if (nftAddress) {
      const fetchData = async () => {
        let retry = true;
        while (retry) {
          const res = await GetContractABIPolygon(nftAddress);
          if (res.data.result === 'Contract source code not verified') {
            console.warn('Contract ABI not available: Contract source code not verified');
            setContractABI('');
            break;
          } else {
            try {
              const abi = JSON.parse(res.data.result);
              const contract = new web3.eth.Contract(abi, nftAddress);
              const fetchedStock = await contract.methods.getStock(Number(ticketId)).call();
              setStock(Number(fetchedStock));
              setContractABI(abi);
              retry = false;
            } catch (error) {
              console.warn('Invalid JSON data. Retrying...');
              await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 seconds before retrying
            }
          }
        }
      };
      fetchData();
    }
  }, [nftAddress, ticketId]);

  const [loadingAffiliate, setLoadingAffiliate] = useState(false);
  const [isAffiliate, setIsAffiliate] = useState(initialIsAffiliate);
  const handleBecomeAffiliate = async () => {
    setLoadingAffiliate(true);
    const res = await BecomeAffiliate(wallet.address, polygonAddress, ticketId);
    if (res.status === 200) {
      const response = await VerifyAffiliate(polygonAddress, ticketId);
      if (response.status === 200) {
        setIsAffiliate(res.data.results);
      }
    }
    setLoadingAffiliate(false);
  };
  useEffect(() => {
    if (isAuthenticated && polygonAddress) {
      const fetchData = async () => {
        let retry = true;
        while (retry) {
          const res = await GetContractABIPolygon(process.env.NEXT_PUBLIC_APP_BOOTH_CONTRACT);
          if (res.data.result === 'Contract source code not verified') {
            console.warn('Contract ABI not available: Contract source code not verified');
            break;
          } else {
            try {
              const abi = JSON.parse(res.data.result);
              const contract = new web3.eth.Contract(
                abi,
                process.env.NEXT_PUBLIC_APP_BOOTH_CONTRACT,
              );
              const verifyAffiliate = await contract.methods
                .verifyAffiliate(Number(ticketId), polygonAddress)
                .call();
              setIsAffiliate(Boolean(verifyAffiliate));
              retry = false;
            } catch (error) {
              console.warn('Invalid JSON data. Retrying...');
              await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 seconds before retrying
            }
          }
        }
      };
      fetchData();
    }
  }, [nftAddress, ticketId, isAuthenticated, polygonAddress]);

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

      <div>
        {topBar()}
        {/* =============================================== ABOVE FOLD ============================================ */}
        <div className="z-0 h-auto w-full py-8 ">
          <div className="mx-auto max-w-1340 px-4 sm:px-6 xl:px-8">
            <div className="mx-auto max-w-1340">
              {/* Content goes here */}
              <div className="relative grid xl:grid-cols-12">
                {/* Description */}
                <div className="col-span-12 xl:col-span-7">
                  {/* Image gallery */}
                  {product ? (
                    // Sticky Classname: className="md:sticky top-2 flex flex-col-reverse"
                    <Tab.Group as="div" className="top-2 flex flex-col-reverse ">
                      {/* Image selector */}

                      <div className=" mx-auto mt-6 block w-full max-w-2xl lg:max-w-none">
                        <Tab.List className="grid grid-cols-4 gap-6">
                          {mediaItems.map((mediaItem, index) => {
                            const type = getMediaType(mediaItem.file);

                            return (
                              <Tab
                                key={index}
                                className="relative flex h-24 cursor-pointer items-center justify-center rounded-md text-sm font-medium uppercase text-gray-900 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
                              >
                                {({ selected }) => (
                                  <>
                                    <span className="absolute inset-0 overflow-hidden rounded-md">
                                      {type === 'video' ? (
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="absolute h-6 w-6 text-gray-500"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                          />
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                          />
                                        </svg>
                                      ) : (
                                        <img
                                          src={mediaItem.file}
                                          alt=""
                                          className="h-full w-full object-cover object-center"
                                        />
                                      )}
                                    </span>
                                    <span
                                      className={classNames(
                                        selected
                                          ? 'ring-blue-500 dark:ring-dark-primary'
                                          : 'ring-transparent',
                                        'pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2 dark:ring-offset-dark-second',
                                      )}
                                      aria-hidden="true"
                                    />
                                  </>
                                )}
                              </Tab>
                            );
                          })}
                        </Tab.List>
                      </div>

                      {mediaItems.map((mediaItem, index) => {
                        const type = getMediaType(mediaItem.file);
                        return (
                          <Tab.Panel key={index}>
                            {type === 'video' ? (
                              <video
                                data-vjs-player
                                onContextMenu={(e) => e.preventDefault()}
                                controls
                                id={`my-video-${index}`}
                                poster={product.thumbnail}
                                controlsList="nodownload"
                                data-setup="{'playbackRates': [0.5, 1, 1.5, 2], 'fluid': true}"
                                className="h-full w-full rounded-xl  border-gray-100 object-contain dark:border-dark-second"
                                src={mediaItem.file}
                              >
                                <track kind="captions" src="" />
                              </video>
                            ) : (
                              <img
                                src={mediaItem.file}
                                alt=""
                                className="h-full w-full object-cover object-center sm:rounded-lg"
                              />
                            )}
                          </Tab.Panel>
                        );
                      })}
                    </Tab.Group>
                  ) : (
                    <div />
                  )}
                </div>
                <div className="absolute right-0 col-span-5 hidden items-start xl:flex">
                  <div
                    id="above-fold-video"
                    className="w-[397px] rounded-lg border-2 dark:bg-dark-bg border-gray-900 dark:border-dark-border dark:shadow-none bg-white p-4 shadow-neubrutalism-md  lg:row-span-3"
                  >
                    {addToCartForm()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =============================================== BELOW FOLD ============================================ */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* We've used 3xl here, but feel free to try other max-widths based on your needs */}
          <div className="mx-auto max-w-7xl">
            {/* Content goes here */}
            <div className="block xl:hidden">
              {/* LG HIDDEN ATT TO CART CTA */}
              {addToCartForm()}
            </div>

            {/* Content goes here */}
            <div className="mt-1.5 grid items-start gap-2  xl:grid-cols-3">
              {/* Video */}
              <div className=" col-span-12 mx-3 px-0 sm:mx-4 sm:px-4 xl:col-span-2 " />
              <div
                id="below-fold-video"
                className="top-4 z-10 col-span-12 mb-4 hidden w-full rounded-lg border-2 dark:bg-dark-bg border-gray-900 dark:border-dark-border dark:shadow-none bg-white p-0.5 pb-4 shadow-neubrutalism-md  lg:z-40  xl:sticky xl:col-span-1 xl:row-span-3"
              >
                {addToCartForm()}
              </div>
              {/* Course Overview */}
              <div className=" col-span-12 mx-3 px-0 sm:mx-4 sm:px-4 xl:col-span-2 ">
                <Description product={product && product} author={author && author} Link={Link} />
                <div className="py-4" />
                <p className="py-4 text-2xl font-black leading-6 text-gray-900 dark:text-dark-txt">
                  Product overview
                </p>

                <ul className="">
                  {detailSlice &&
                    detailSlice.map((item) => (
                      <li key={item.id} className="space-y-1">
                        <span className="text-md font-medium dark:text-dark-txt-secondary">
                          &#9679; {item.title}
                        </span>
                      </li>
                    ))}
                </ul>
                <div className="mt-4 flex-auto md:space-x-1 py-2 md:grid md:grid-cols-3 ">
                  <div className="border border-gray-400 p-4 dark:border-dark-third">
                    <dt>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full dark:bg-dark-txt bg-gray-700 text-white dark:text-dark-third">
                        <PlayIcon className="h-5 ml-0.5 w-auto" aria-hidden="true" />
                      </div>
                      <p className="mt-12 text-lg font-medium leading-6 text-gray-700" />
                    </dt>
                    <dd className="mt-2 text-xs font-black text-gray-900 dark:text-dark-txt-secondary">
                      {details && details.total_duration} hours of video
                    </dd>
                  </div>

                  <div className="border border-gray-400 p-4 dark:border-dark-third">
                    <dt>
                      <div className="flex h-8 w-8 items-center justify-center text-gray-700  dark:text-dark-txt">
                        <BookOpenIcon className="h-8 w-8" aria-hidden="true" />
                      </div>
                      <p className="mt-12 text-lg font-medium leading-6 text-gray-700" />
                    </dt>
                    <dd className="mt-2 text-xs font-black text-gray-900 dark:text-dark-txt-secondary">
                      {details && details.total_lectures} articles + resources
                    </dd>
                  </div>

                  {/* <div className="border border-gray-300 p-4">
                                            <dt>
                                            <div className="flex h-8 w-8 items-center justify-center text-gray-700">
                                                <CommandLineIcon className="h-8 w-8" aria-hidden="true" />
                                            </div>
                                            <p className="mt-12 text-lg font-medium leading-6 text-gray-700"></p>
                                            </dt>
                                            <dd className="mt-2 text-xs text-gray-900 font-bold">{sections.length} coding exercises</dd>
                                        </div> */}

                  <div className="border border-gray-400 p-4 dark:border-dark-third">
                    <dt>
                      <div className="flex h-8 w-8 items-center justify-center text-gray-900  dark:text-dark-txt ">
                        <IdentificationIcon className="h-8 w-8" aria-hidden="true" />
                      </div>
                      <p className="mt-12 text-lg font-medium leading-6 text-gray-900" />
                    </dt>
                    <dd className="mt-2 text-xs font-black text-gray-900 dark:text-dark-txt-secondary">
                      certificate of completion
                    </dd>
                  </div>
                </div>
                <div className="mt-2">
                  <Button type="button" onClick={() => setOpen(true)}>
                    Show full overview
                  </Button>
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

                    <div className="fixed inset-0 z-40 overflow-y-auto">
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
                          <Dialog.Panel className="relative w-full transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all dark:bg-dark-main sm:my-8 sm:max-w-3xl sm:p-6">
                            <div className=" pb-5">
                              <h3 className="text-lg font-bold leading-6 text-gray-900 dark:text-dark-txt">
                                Product details
                              </h3>
                            </div>
                            {/* <WhatLearnt whatlearnt={course && course.whatlearnt} /> */}

                            {/* Description */}
                            {/* <Disclosure>
                              {({ open }) => (
                                <>
                                  <Disclosure.Button className=" flex w-full justify-between border-y border-gray-300 px-4 py-2  text-left text-2xl font-black text-gray-900 dark:border-dark-third dark:text-dark-txt">
                                    <span>Description</span>
                                    <ChevronUpIcon
                                      className={`${
                                        open ? 'rotate-180 transform' : ''
                                      } mt-1 h-5 w-5 text-gray-500`}
                                    />
                                  </Disclosure.Button>
                                  <Disclosure.Panel className="px-4 py-2 text-sm text-gray-500">
                                    <div className="text-md font-regular my-2 text-gray-900 dark:text-dark-txt">
                                      {parsedDescription}
                                    </div>
                                  </Disclosure.Panel>
                                </>
                              )}
                            </Disclosure> */}
                            {/* Requirements */}
                            {/* <Disclosure>
                              {({ open }) => (
                                <>
                                  <Disclosure.Button className="mt-4 flex w-full justify-between border-y border-gray-300 px-4 py-2  text-left text-2xl font-black text-gray-900 dark:border-dark-third dark:text-dark-txt">
                                    <span>Requirements</span>
                                    <ChevronUpIcon
                                      className={`${
                                        open ? 'rotate-180 transform' : ''
                                      } mt-1 h-5 w-5 text-gray-500`}
                                    />
                                  </Disclosure.Button>
                                  <Disclosure.Panel className="px-4 py-2 text-sm text-gray-500">
                                    <Requisites requisites={course && course.requisites} />
                                  </Disclosure.Panel>
                                </>
                              )}
                            </Disclosure> */}
                          </Dialog.Panel>
                        </Transition.Child>
                      </div>
                    </div>
                  </Dialog>
                </Transition.Root>
              </div>

              {/* Related */}
              {/* {relatedCourses && (
                <div className="col-span-12 mr-8 pb-4 xl:col-span-2">
                  <RelatedCourses courses={relatedCourses && relatedCourses} />
                </div>
              )} */}

              <div className="col-span-12 mx-3 mt-4 px-0 sm:mx-4 sm:px-4 xl:col-span-2">
                <InstructorDetails
                  data={author && author}
                  profile={authorProfile && authorProfile}
                />
              </div>

              {/* Reviews */}
              <div className="col-span-12 mt-2 pb-4 xl:col-span-2">
                <Reviews product={product && product} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Transition.Root show={openShare} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setOpenShare}>
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

          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-100"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-75"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden bg-white dark:bg-dark-bg  px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6">
                  <div>
                    <div className="mt-3 ">
                      <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
                        <div className="ml-4">
                          <h3 className="text-lg font-black leading-6 dark:text-dark-txt text-gray-900">
                            Share this course
                          </h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setOpenShare(false);
                          }}
                          className="ml-4 flex-shrink-0"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="mt-4">
                        <div className="space-x-2 ">
                          <CopyToClipboard text={shareUrl}>
                            <div
                              // onClick={()=>{
                              //     dispatch(setAlert('URL Copied to clipboard','success'))
                              // }}
                              className="relative mb-4 cursor-pointer"
                            >
                              <div className="text-md block w-full truncate border dark:bg-dark-third dark:text-dark-txt-secondary dark:border-dark-border border-gray-700 py-4 pl-2 pr-12">
                                {shareUrl}
                              </div>
                              <div className=" absolute inset-y-0 right-0 flex items-center dark:bg-dark-second border dark:border-dark-border dark:hover:bg-dark-main bg-dark-main px-6 hover:bg-gray-900">
                                <span
                                  className="text-md font-bold dark:text-dark-txt text-white "
                                  id="price-currency"
                                >
                                  Copy URL
                                </span>
                              </div>
                            </div>
                          </CopyToClipboard>
                          <div className="items-center justify-center space-x-2 text-center">
                            <FacebookShareButton url={shareUrl}>
                              <FacebookIcon size={40} round />
                            </FacebookShareButton>
                            <WhatsappShareButton url={shareUrl}>
                              <WhatsappIcon size={40} round />
                            </WhatsappShareButton>
                            <TwitterShareButton url={shareUrl}>
                              <TwitterIcon size={40} round />
                            </TwitterShareButton>
                            <RedditShareButton url={shareUrl}>
                              <RedditIcon size={40} round />
                            </RedditShareButton>
                            <LinkedinShareButton url={shareUrl}>
                              <LinkedinIcon size={40} round />
                            </LinkedinShareButton>
                            <TelegramShareButton url={shareUrl}>
                              <TelegramIcon size={40} round />
                            </TelegramShareButton>
                            <EmailShareButton url={shareUrl}>
                              <EmailIcon size={40} round />
                            </EmailShareButton>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      <Transition.Root show={openJoinAffiliate} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setOpenJoinAffiliate}>
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

          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-100"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-75"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden bg-white  dark:bg-dark-bg px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6">
                  {/* Description about program */}
                  <div>
                    <div className="flex flex-wrap items-center justify-between sm:flex-nowrap">
                      <div className="">
                        <p className="text-xl font-semibold leading-6 dark:text-dark-txt text-gray-900">
                          Join Affiliate Program and Start Earning Passive Income
                        </p>
                        <p className="text-md mt-1 dark:text-dark-txt-secondary text-gray-500">
                          Start earning passive income in cryptocurrency by promoting online
                          courses!
                        </p>
                      </div>
                      <Link href="/affiliates" className=" mt-4 flex-shrink-0">
                        <Button>Learn More</Button>
                      </Link>
                    </div>
                    <div className="mt-5 border-t dark:border-dark-border border-gray-200">
                      <dl className="sm:divide-y dark:divide-dark-border sm:divide-gray-200">
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                          <dt className="text-sm font-medium dark:text-dark-txt text-gray-500">
                            Starting rank
                          </dt>
                          <dd className="mt-1 text-sm dark:text-dark-txt-secondary text-gray-900 sm:col-span-2 sm:mt-0">
                            Bronze
                          </dd>
                        </div>
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                          <dt className="text-sm font-medium dark:text-dark-txt text-gray-500">
                            Starting commission
                          </dt>
                          <dd className="mt-1 text-sm dark:text-dark-txt-secondary text-gray-900 sm:col-span-2 sm:mt-0">
                            16%
                          </dd>
                        </div>
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                          <dt className="text-sm font-medium dark:text-dark-txt text-gray-500">
                            Requisites
                          </dt>
                          <dd className="mt-1 text-sm dark:text-dark-txt-secondary text-gray-900 sm:col-span-2 sm:mt-0">
                            <p
                              className={`${
                                ownsTicket
                                  ? 'text-forest-green-300'
                                  : 'text-dark dark:text-dark-txt-secondary'
                              } text-md`}
                            >
                              <i
                                className={`bx ${
                                  ownsTicket ? 'bx-checkbox-square' : 'bx-checkbox'
                                }`}
                              />{' '}
                              Buy Product
                            </p>
                            <p
                              className={`text-md ${
                                ownsTicket
                                  ? isAffiliate
                                    ? 'text-forest-green-300'
                                    : 'text-dark dark:text-dark-txt-secondary'
                                  : 'cursor-default text-gray-500'
                              }`}
                            >
                              <i
                                className={`bx ${
                                  ownsTicket && isAffiliate ? 'bx-checkbox-square' : 'bx-checkbox'
                                }`}
                              />{' '}
                              Join Affiliate Program
                            </p>
                            {!isAffiliate && ownsTicket ? (
                              <>
                                {loadingAffiliate ? (
                                  <>
                                    <div className="my-2 dark:hidden flex">
                                      <LoadingMoon size={20} color="#1c1d1f" />
                                    </div>
                                    <div className="my-2 hidden dark:flex">
                                      <LoadingMoon size={20} color="#fff" />
                                    </div>
                                  </>
                                ) : (
                                  <Button
                                    onClick={() => {
                                      handleBecomeAffiliate();
                                    }}
                                    className="mt-3"
                                  >
                                    Become affiliate
                                  </Button>
                                )}
                              </>
                            ) : isAffiliate && ownsTicket ? (
                              <div className="mt-3 ">
                                <div className="mt-4">
                                  <div className="space-x-2 ">
                                    <CopyToClipboard text={shareUrlAffiliate}>
                                      <div
                                        // onClick={()=>{
                                        //     dispatch(setAlert('URL Copied to clipboard','success'))
                                        // }}
                                        className="relative mb-4 cursor-pointer"
                                      >
                                        <div className="block w-full truncate border dark:border-dark-border dark:bg-dark-bg  border-gray-700 py-4 pl-2 pr-12 text-sm">
                                          {shareUrlAffiliate}
                                        </div>
                                        <div className=" absolute inset-y-0 right-0 flex items-center border dark:border-dark-border bg-dark-main px-6 hover:bg-gray-900">
                                          <span
                                            className="text-sm font-bold text-white "
                                            id="price-currency"
                                          >
                                            Copy URL
                                          </span>
                                        </div>
                                      </div>
                                    </CopyToClipboard>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <></>
                            )}
                          </dd>
                        </div>
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                          <dt className="text-sm font-medium dark:text-dark-txt text-gray-500">
                            Pipeline
                          </dt>
                          <dd className="mt-1 text-sm dark:text-dark-txt-secondary text-gray-900 sm:col-span-2 sm:mt-0">
                            5 users
                          </dd>
                        </div>
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                          <dt className="text-sm font-medium dark:text-dark-txt text-gray-500">
                            How it works
                          </dt>
                          <dd className="mt-1 space-y-2 text-sm dark:text-dark-txt-secondary text-gray-900 sm:col-span-2 sm:mt-0">
                            <p className="block">
                              Our program offers you the opportunity to earn commissions by
                              referring others to our courses. As you refer more people, you'll
                              progress through the ranks and earn higher commissions.
                            </p>
                            <p className="block">
                              As you progress through our rank system, your commission rate will
                              increase. Our program has five different levels of ranks, each with
                              its own set of requirements for eligibility. The higher the rank, the
                              higher the commission rate you'll receive.
                            </p>
                            <p className="block">
                              Our system is powered by blockchain technology and our contract
                              automatically handles the payments for you. You don't have to worry
                              about any complicated payment processes or dealing with third-party
                              payment processors.{' '}
                            </p>
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}

Product.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

const fetchVerifyTokenOwnership = async (polygonAddress, nftAddress, ticketId, access) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_PAYMENT_URL}/api/crypto/verify_ticket_ownership/`,
      {
        nft_address: nftAddress,
        ticket_id: ticketId,
      },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `JWT ${access}`,
        },
      },
    );
    return response.data.results;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export async function getServerSideProps(context) {
  const { productUUID, referrer } = context.query;

  const cookies = cookie.parse(context.req.headers.cookie || '');
  // Read the JWT token from the cookie
  const { access, polygonAddress } = cookies;

  // Check if username is defined
  if (!productUUID || productUUID.length === 0) {
    return {
      redirect: {
        destination: '/', // Redirect to the homepage
        permanent: false, // This is a temporary redirect
      },
    };
  }

  try {
    const productRes = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_PRODUCTS_URL}/api/products/get/${productUUID}/`,
    );

    const authorId = productRes.data.results.details.author;

    const authorProfileRes = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_API_URL}/api/users/get/profile/${authorId}/`,
    );

    const authorRes = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_API_URL}/api/users/get/${authorId}/`,
    );

    let initialOwnsTicket = false;
    let initialIsAffiliate = false;

    if (access) {
      const nftAddress = productRes.data.results.details.nft_address;
      const ticketId = productRes.data.results.details.token_id;

      const isTokenOwner = await fetchVerifyTokenOwnership(
        polygonAddress,
        nftAddress,
        ticketId,
        access,
      );
    }

    return {
      props: {
        productUUID: productUUID,
        referrer: referrer ? referrer : null,
        product: productRes.data.results,
        authorProfile: authorProfileRes.data.results,
        author: authorRes.data.results,
        initialOwnsTicket: initialOwnsTicket,
        initialIsAffiliate: initialIsAffiliate,
      },
    };
  } catch (error) {
    // If the product is not found (404 error), redirect to the homepage
    if (error.response && error.response.status === 404) {
      return {
        redirect: {
          destination: '/', // Redirect to the homepage
          permanent: false, // This is a temporary redirect
        },
      };
    } else {
      // Log the error and return an error page for other errors
      console.error('Error fetching product:', error.message);
      return {
        notFound: true,
      };
    }
  }
}
