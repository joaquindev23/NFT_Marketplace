import Link from 'next/link';
import { Router, useRouter } from 'next/router';
import Web3 from 'web3';
import Layout from '@/hocs/Layout';
import axios from 'axios';
import cookie from 'cookie';
import Head from 'next/head';
import { useState, Fragment, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import sanitizeHtml from 'sanitize-html';

import parse from 'html-react-parser';
import FetchSectionsUnpaid from '@/api/courses/sections/unpaid/List';
import { ToastError } from '@/components/toast/ToastError';
import FetchCourseReviews from '@/api/courses/ListReviews';
import UpdateAnalytics from '@/api/courses/UpdateAnalytics';
import {
  addItem,
  addItemAnonymous,
  addItemAuthenticated,
  getItems,
} from '@/redux/actions/cart/cart';
import AddOrRemoveWishlist from '@/api/courses/AddOrRemoveWishlist';
import CheckWishlist from '@/api/courses/CheckWishlist';
import VerifyTokenOwnership from '@/api/tokens/VerifyTicketOwnership';
import VerifyAffiliate from '@/api/tokens/VerifyAffiliate';
import GetNFTStock from '@/api/tokens/GetNFTStock';
import EnlistNFT from '@/api/EnlistNFT';
import { Dialog, Transition, Disclosure, Tab } from '@headlessui/react';
import MoonLoader from 'react-spinners/MoonLoader';
import LoadingMoon from '@/components/loaders/LoadingMoon';

import moment from 'moment';
import {
  BookOpenIcon,
  LockClosedIcon,
  IdentificationIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';
import {
  ShoppingCartIcon,
  CheckIcon,
  CheckBadgeIcon,
  GlobeAltIcon,
  InformationCircleIcon,
  BellAlertIcon,
  CakeIcon,
  CalendarIcon,
  ChatBubbleLeftIcon,
  ChevronUpIcon,
  EnvelopeIcon,
  PlayIcon,
  ReceiptPercentIcon,
  ReceiptRefundIcon,
  ChevronRightIcon,
  HomeIcon,
  XMarkIcon,
  StarIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/solid';
import { CopyToClipboard } from 'react-copy-to-clipboard';
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
import Clock from '@/components/CountDownTimer/Clock';

import WhatLearnt from './components/WhatLearnt';
import Requisites from './components/Requisites';
import CourseDetailComponent from './components/CourseDetail';
import RelatedCourses from './components/RelatedCourses';
import Reviews from './components/Reviews';
import InstructorDetails from './components/InstructorDetails';
import CustomVideo from '@/components/CustomVideo';
import { checkCoupon } from '@/redux/actions/coupons/coupons';
import BecomeAffiliate from '@/api/tokens/BecomeAffiliate';
import Button from '@/components/Button';
import { ToastSuccess } from '@/components/ToastSuccess';
import BuyNow from '@/api/BuyNow';
import GetContractABIPolygon from '@/api/tokens/GetContractABIPolygon';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Courses({ course, author, courseUUID, referrer, authorProfile }) {
  const web3 = new Web3(process.env.NEXT_PUBLIC_APP_RPC_POLYGON_PROVIDER);
  const SeoList = {
    title: course.details.title
      ? `${course.details.title} - ${course.details.short_description}`
      : 'Boomslag - Online Courses Marketplace',
    description:
      course.description ||
      'Discover and learn from the best online courses in various categories on Boomslag - the ultimate NFT marketplace for courses and products. Buy and sell using ERC1155 tokens to ensure seamless and secure transactions.',
    href: course.details.slug ? `/courses/${course.details.slug}` : '/',
    url: course.details.slug
      ? `https://boomslag.com/courses/${course.details.slug}`
      : 'https://boomslag.com',
    keywords: course.details.keywords
      ? `${course.details.keywords}, online courses, blockchain courses, boomslag courses, nft online courses`
      : 'online courses, blockchain courses, boomslag courses, nft online courses',
    robots: 'all',
    author: author.username || 'BoomSlag',
    publisher: 'BoomSlag',
    image:
      course.images && course.images.length > 0
        ? course.images[0].file
        : 'https://bafybeiaor24mrcurzyzccxl7xw46zdqpor4sfuhddl6tzblujoiukchxnq.ipfs.w3s.link/teach.png',
    twitterHandle: '@BoomSlag',
  };

  const dispatch = useDispatch();
  const router = useRouter();

  const wallet = useSelector((state) => state.auth.wallet);
  const user = useSelector((state) => state.auth.user);
  const polygonAddress = wallet && wallet.polygon_address;
  const buyerAddress = wallet && wallet.address;
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const cartItems = useSelector((state) => state.cart.items);
  const coupon = useSelector((state) => state.coupons.coupon);
  const couponType = useSelector((state) => state.coupons.type);
  const couponDiscount = useSelector((state) => state.coupons.discount);

  const [openShare, setOpenShare] = useState(false);
  const [openTrade, setOpenTrade] = useState(false);
  const [openJoinAffiliate, setOpenJoinAffiliate] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);
  const [effectClick, setEffectClick] = useState(false);
  const [effectClickAff, setEffectClickAff] = useState(false);
  const [effectCart, setEffectCart] = useState(false);
  const [effectFullOverview, setEffectFullOverview] = useState(false);
  const [relatedCourses, setRelatedCourses] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState('');

  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState(false);
  const [sectionsCount, setSectionsCount] = useState(false);
  const [sectionsPage, setSectionsPage] = useState(1);
  const [sectionsPageSize, setSectionsPageSize] = useState(6);
  const [sectionsMaxPageSize, setSectionsMaxPageSize] = useState(100);
  const [sectionsNext, setSectionsNext] = useState(null);
  const [sectionsPrevious, setSectionsPrevious] = useState(null);

  const fetchSections = useCallback(async () => {
    setLoading(true);
    try {
      const res = await FetchSectionsUnpaid(
        courseUUID[0],
        sectionsPage,
        sectionsPageSize,
        sectionsMaxPageSize,
      );

      setSections(res.data.results);
      setSectionsNext(res.data.next);
      setSectionsPrevious(res.data.previous);
      setSectionsCount(res.data.count);
    } catch (err) {
      ToastError('Error loading sections');
    } finally {
      setLoading(false);
    }
  }, [courseUUID, sectionsPage, sectionsPageSize, sectionsMaxPageSize]);

  useEffect(() => {
    fetchSections();
    // eslint-disable-next-line
  }, [courseUUID]);

  const handleViewMoreSections = () => {
    setSectionsPageSize(sectionsPageSize + 6);
  };

  const [reviews, setReviews] = useState(false);
  const [reviewsCount, setReviewsCount] = useState(false);
  const [reviewsPage, setReviewsPage] = useState(1);
  const [reviewsPageSize, setReviewsPageSize] = useState(6);
  const [reviewsMaxPageSize, setReviewsMaxPageSize] = useState(100);
  const [reviewsNext, setReviewsNext] = useState(null);
  const [reviewsPrevious, setReviewsPrevious] = useState(null);
  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await FetchCourseReviews(
        courseUUID,
        reviewsPage,
        reviewsPageSize,
        reviewsMaxPageSize,
      );

      setReviews(res.data.results);
      setReviewsNext(res.data.next);
      setReviewsPrevious(res.data.previous);
      setReviewsCount(res.data.count);
    } catch (err) {
      // ToastError('Error loading Reviews');
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [courseUUID, reviewsPage, reviewsPageSize, reviewsMaxPageSize]);

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line
  }, [courseUUID]);

  const handleViewMoreReviews = () => {
    setReviewsPageSize(reviewsPageSize + 6);
  };

  const details = course && course.details;
  const courseId = details && details.id;

  const allowedTags = [
    'p',
    'h1',
    'h2',
    'ul',
    'ol',
    'li',
    'sub',
    'sup',
    'blockquote',
    'pre',
    'a',
    'img',
    'video',
    'span',
    'strong',
    'em',
    'u',
    's',
    'br',
  ];

  const allowedAttributes = {
    a: ['href', 'target', 'rel'],
    img: ['src', 'alt', 'title'],
    video: ['src', 'controls'],
    span: ['style'],
    p: ['style'],
    h1: ['style'],
    h2: ['style'],
  };

  const sanitizeConfig = {
    allowedTags,
    allowedAttributes,
    allowedStyles: {
      '*': {
        'text-align': [/^left$/, /^right$/, /^center$/, /^justify$/],
        'font-size': [/^\d+(?:px|em|%)$/],
        'background-color': [/^#[0-9A-Fa-f]+$/],
        color: [/^#[0-9A-Fa-f]+$/],
        'font-family': [/^[-\w\s,"']+$/],
      },
    },
  };

  const sanitizedShortDescription =
    details && sanitizeHtml(details.short_description, sanitizeConfig);

  const sanitizedDescription = sanitizeHtml(details && details.description, sanitizeConfig);

  const shareUrl = `${process.env.NEXT_PUBLIC_APP_PUBLIC_URL}/course/${details && details.slug}`;
  const shareUrlAffiliate = `${process.env.NEXT_PUBLIC_APP_PUBLIC_URL}/course/${
    details && details.slug
  }?referrer=${polygonAddress}`;

  const [openVideo, setOpenVideo] = useState(false);
  const [open, setOpen] = useState(false);
  const courseExistsInCart =
    cartItems && cartItems.some((u) => u.course && u.course.includes(courseId));

  async function handleAddToCart(e) {
    e.preventDefault();
    if (courseExistsInCart) {
      router.push('/cart');
    }

    if (isAuthenticated) {
      if (coupon) {
        dispatch(
          addItemAuthenticated(
            courseId,
            'Course',
            coupon,
            null,
            null,
            null,
            null,
            null,
            null,
            referrer,
          ),
        );
      } else {
        dispatch(
          addItemAuthenticated(
            courseId,
            'Course',
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            referrer,
          ),
        );
      }
    }

    if (!isAuthenticated) {
      if (coupon) {
        dispatch(
          addItemAnonymous(
            courseId,
            'Course',
            coupon,
            null,
            null,
            null,
            null,
            null,
            null,
            referrer,
          ),
        );
      } else {
        dispatch(
          addItemAnonymous(courseId, 'Course', null, null, null, null, null, null, null, referrer),
        );
      }
    }
  }

  function applyCoupon(e) {
    e.preventDefault();
    dispatch(checkCoupon(selectedCoupon, courseId, 'courses'));
  }

  const [inWishlist, setInWishlist] = useState(false);

  async function handleAddOrRemoveWishlist() {
    if (isAuthenticated) {
      const res = await AddOrRemoveWishlist(courseId);
      if (res.status === 200) {
        setInWishlist(res.data.results);
      }
    }
  }

  useEffect(() => {
    if (isAuthenticated && courseUUID) {
      const apiRes = async () => {
        const res = await CheckWishlist(courseId);
        if (res.status === 200) {
          setInWishlist(res.data.results);
        }
      };
      apiRes();
    }
  }, [courseUUID, isAuthenticated]);

  const coursePrice =
    course && course.details.compare_price && course.discount
      ? details.compare_price
      : details.price;

  const [maticUsdPrice, setMaticUsdPrice] = useState(0);
  const [priceInMatic, setPriceInMatic] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price?ids=matic-network%2Cethereum&vs_currencies=usd',
      );
      setMaticUsdPrice(res.data['matic-network'].usd);
    };
    fetchData();
  }, []);
  useEffect(() => {
    // Convert coursePrice from dollars to matic using matiUsdPrice
    // Set the priceInMatic
    setPriceInMatic(coursePrice / maticUsdPrice);
  }, [coursePrice, maticUsdPrice]);

  const whatLearntSlice = [];

  if (course && course.whatlearnt.length >= 4) {
    [whatLearntSlice[0], whatLearntSlice[1], whatLearntSlice[2], whatLearntSlice[3]] =
      course.whatlearnt.slice(0, 4);
  }

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
      if (document.body.scrollTop > 320 || document.documentElement.scrollTop > 320) {
        document.getElementById('above-fold-video').classList.add('hidden');
      } else {
        document.getElementById('above-fold-video').classList.remove('hidden');
      }
    }

    if (document.getElementById('below-fold-video')) {
      if (
        document.body.scrollTop > 320 ||
        (document.documentElement.scrollTop > 320 && document.body.clientWidth > 1239)
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

  const nftAddress = course && course.details.nft_address;
  const ticketId = course && course.details.token_id;
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
  const [isAffiliate, setIsAffiliate] = useState(false);

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

  const [loadingBuyNow, setLoadingBuyNow] = useState(false);
  async function handleBuyNow() {
    if (isAuthenticated) {
      try {
        setLoadingBuyNow(true);
        const buyNowResponse = await BuyNow(
          buyerAddress,
          polygonAddress,
          course && course.details.id,
          coupon,
          referrer,
        );

        if (buyNowResponse.status === 200 && nftAddress) {
          const tokenOwnershipResponse = await VerifyTokenOwnership(
            polygonAddress,
            nftAddress,
            ticketId,
          );

          if (tokenOwnershipResponse && tokenOwnershipResponse.status === 200) {
            setOwnsTicket(tokenOwnershipResponse.data.results);
          } else {
            console.error('Failed to verify token ownership.');
          }

          const affiliateResponse = await VerifyAffiliate(polygonAddress, ticketId);

          if (affiliateResponse && affiliateResponse.status === 200) {
            setIsAffiliate(affiliateResponse.data.results);
          } else {
            console.error('Failed to verify affiliate status.');
          }
        } else {
          console.error('Failed to buy now.');
        }
      } catch (error) {
        console.error('Error in handleBuyNow:', error);
      } finally {
        setLoadingBuyNow(false);
      }
    } else {
      router.push('/auth/login');
    }
  }

  const [nftPrice, setNFTPrice] = useState(0);
  const [auctionDate, setAuctionDate] = useState('');

  const onSubmitEnlistNFT = async (e) => {
    e.preventDefault();

    const res = await EnlistNFT(nftPrice, auctionDate);
    if (res.status === 200) {
      ToastSuccess('NFT Enlisted for Sale');
      setOpenTrade(false);
      setAuctionDate('');
      setNFTPrice(0);
    }
  };

  // ====== ANALYTICS // ============
  useEffect(() => {
    if (course && course.details && course.details.id) {
      const startTime = new Date();
      const startTimeInSeconds = startTime.getSeconds();

      return () => {
        const endTime = new Date();
        const endTimeInSeconds = endTime.getSeconds();
        const duration = endTimeInSeconds - startTimeInSeconds;
        UpdateAnalytics(course.details.id, duration);
      };
    }
  }, []);

  const addToCartCTA = () => {
    return (
      <div className="w-full p-2">
        {/* Price */}
        <div className="block dark:text-dark-txt text-dark">
          <div>
            <div className=" flex flex-wrap items-center justify-between sm:flex-nowrap">
              <div className=" w-full ">
                {!loading && details && details.discount ? (
                  <>
                    <Clock time={details && details.discount_until} />
                    <div className="mb-2" />
                  </>
                ) : (
                  <div />
                )}
              </div>
            </div>
            <div className=" flex">
              {coupon && couponType && couponDiscount ? (
                couponType === 'fixed' ? (
                  <p className="inline-flex text-xl font-bold dark:text-dark-txt-secondary">
                    {((parseFloat(coursePrice) - couponDiscount) / maticUsdPrice).toFixed(2)}{' '}
                    <span className="ml-1 font-semibold">MATIC</span>
                  </p>
                ) : (
                  couponType === 'percentage' && (
                    <p className="inline-flex text-xl font-bold dark:text-dark-txt-secondary">
                      {(
                        (parseFloat(coursePrice) * (1 - couponDiscount / 100)) /
                        maticUsdPrice
                      ).toFixed(2)}{' '}
                      <span className="ml-1 font-semibold">MATIC</span>
                    </p>
                  )
                )
              ) : (
                <p className="inline-flex text-xl font-bold dark:text-dark-txt-secondary">
                  {parseFloat(priceInMatic).toFixed(2)}{' '}
                  <span className="ml-1 font-semibold">MATIC</span>
                </p>
              )}

              <div className="ml-2 flex-shrink-0">
                {coupon ? (
                  <p className="inline-flex items-center rounded-full bg-almond-100 px-2.5 py-0.5 text-xs font-bold text-almond-800">
                    {coupon.name}
                  </p>
                ) : (
                  <div />
                )}
              </div>
              <div className="ml-2 flex-shrink-0">
                {course.discount ? (
                  <p className="inline-flex items-center rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-800">
                    {parseInt(((details.price - details.compare_price) / details.price) * 100, 10)}%
                    Off
                  </p>
                ) : (
                  <div />
                )}
              </div>
            </div>
            <div className="mb-2 flex items-center text-xl font-semibold dark:text-dark-txt-secondary">
              {stock !== false ? (
                stock === -1 ? (
                  <i className="bx bx-infinite text-xl" />
                ) : (
                  stock
                )
              ) : (
                <>
                  <MoonLoader loading size={15} className="mr-1" color="#1c1d1f" />
                  <span>Loading</span>
                </>
              )}
              &nbsp;Stock
            </div>
          </div>
        </div>
        {/* ADD TO CART / BUY NOW */}
        {!ownsTicket && (details && details.author) !== (user && user.id) && (
          <div>
            {stock !== false && (stock === -1 || stock > 0) && (
              <div className=" grid grid-cols-4 space-x-1">
                {courseExistsInCart ? (
                  <Link
                    href="/cart"
                    className="
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
                      hover:shadow-neubrutalism-lg 
                    "
                  >
                    Go to cart
                  </Link>
                ) : (
                  <form
                    className={`${isAuthenticated ? 'col-span-3' : 'col-span-4'}`}
                    onSubmit={handleAddToCart}
                  >
                    <button
                      type="submit"
                      onMouseDown={() => {
                        setEffectCart(true);
                      }}
                      onMouseUp={() => setEffectCart(false)}
                      className={`
                        ${
                          effectCart &&
                          'duration-400 animate-click hover:translate-x-0.5  hover:translate-y-0.5 hover:shadow-neubrutalism-sm'
                        }
                        text-md
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
                        hover:text-iris-200 
                        hover:shadow-neubrutalism-lg 
                        dark:border-dark-third
                        dark:hover:text-white
                      `}
                    >
                      Add to Cart
                    </button>
                  </form>
                )}
                {isAuthenticated && (
                  <>
                    {inWishlist ? (
                      <button
                        type="button"
                        onClick={handleAddOrRemoveWishlist}
                        className="text-md focus:ring-none col-span-1 inline-flex w-full cursor-pointer items-center justify-center border-rose-400 px-3 py-4  font-bold leading-4  text-rose-500 transition duration-300 ease-in-out focus:outline-none"
                      >
                        <i className="bx bxs-heart text-2xl" aria-hidden="true" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleAddOrRemoveWishlist}
                        className="text-md focus:ring-none col-span-1 inline-flex w-full cursor-pointer items-center justify-center px-3 py-4 font-bold  leading-4 text-gray-600 transition  duration-300 ease-in-out hover:border-rose-400 hover:text-rose-500 focus:outline-none"
                      >
                        <i className="bx bx-heart text-2xl" aria-hidden="true" />
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
            {stock !== false && (stock === -1 || stock > 0) && isAuthenticated && (
              <div className=" py-2">
                {loadingBuyNow ? (
                  <>
                    <div className="mt-2 dark:hidden flex">
                      <LoadingMoon size={20} color="#1c1d1f" />
                    </div>
                    <div className="mt-2 hidden dark:flex">
                      <LoadingMoon size={20} color="#fff" />
                    </div>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      handleBuyNow();
                    }}
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
                      dark:text-dark`}
                  >
                    Buy now
                  </button>
                )}
              </div>
            )}
            {/* <div className="my-2 items-center text-center text-xs font-medium text-gray-700 dark:text-dark-txt">
              1-Day Money-Back Guarantee (Limited)
            </div> */}
            <div className="items-left text-md mt-8 my-3 text-left font-bold dark:text-dark-txt">
              This course includes:
            </div>
            <div className="space-y-2">
              <li className="flex">
                <i className="bx bx-movie-play rounded-full text-xl" alt="" />
                <div className="ml-3">
                  <p className="text-sm font-medium dark:text-dark-txt-secondary text-gray-900">
                    {details && details.total_duration} Videos
                  </p>
                </div>
              </li>
              <li className="flex">
                <i className="bx bx-file-blank rounded-full text-xl" alt="" />
                <div className="ml-3">
                  <p className="text-sm font-medium dark:text-dark-txt-secondary text-gray-900">
                    {details && details.total_lectures} Articles
                  </p>
                </div>
              </li>
              <li className="flex">
                <i className="bx bx-infinite rounded-full text-xl" alt="" />
                <div className="ml-3">
                  <p className="text-sm font-medium dark:text-dark-txt-secondary text-gray-900">
                    Unlimited access
                  </p>
                </div>
              </li>
              <li className="flex">
                <i className="bx bx-notepad rounded-full text-xl" alt="" />
                <div className="ml-3">
                  <p className="text-sm font-medium dark:text-dark-txt-secondary text-gray-900">
                    Assignments
                  </p>
                </div>
              </li>
              <li className="flex">
                <i className="bx bx-trophy rounded-full text-xl" alt="" />
                <div className="ml-3">
                  <p className="text-sm font-medium dark:text-dark-txt-secondary text-gray-900">
                    Certificate of completion
                  </p>
                </div>
              </li>
            </div>
          </div>
        )}

        {/* ACCESS COURSE */}
        {(ownsTicket || (details && details.author) === (user && user.id)) && (
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => {
                router.push(`/course/w/${details && details.id}`);
              }}
              onMouseDown={() => {
                setEffectCart(true);
              }}
              onMouseUp={() => setEffectCart(false)}
              className={`${
                effectCart &&
                'duration-400 animate-click hover:translate-x-0.5  hover:translate-y-0.5 hover:shadow-neubrutalism-sm'
              }
                text-md
                inline-flex w-full
                items-center
                justify-center
                border 
                border-dark-bg 
                bg-mughal-green-300
                dark:bg-mughal-green-300
                px-10 
                py-4
                font-bold 
                rounded-2xl
                text-white 
                shadow-neubrutalism-md 
                dark:shadow-none 
                transition 
                duration-300 
                ease-in-out
                hover:-translate-x-0.5  hover:-translate-y-0.5 hover:bg-mughal-green-400 hover:text-mughal-green-100  
                hover:shadow-neubrutalism-lg
                dark:border-dark-border  dark:hover:text-green-800 `}
            >
              View Course
            </button>
            {ownsTicket && (
              <button
                type="button"
                onClick={() => {
                  setOpenTrade(true);
                }}
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
                  dark:bg-dark-accent
                  dark:border-dark-border
                  px-10
                  py-4 
                  font-bold 
                  shadow-neubrutalism-md 
                  transition 
                  duration-300 
                  ease-in-out
                  hover:-translate-x-0.5  hover:-translate-y-0.5 hover:bg-gray-50 hover:text-iris-600  
                  hover:shadow-neubrutalism-lg   dark:hover:text-dark-primary `}
              >
                Trade NFT
              </button>
            )}
          </div>
        )}

        <Tab.Group>
          <Tab.List className="-mb-px mt-4 grid space-x-1 space-y-1 p-1 sm:flex sm:space-x-2 sm:space-y-0">
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
          </Tab.Panels>
        </Tab.Group>

        <div className="items-left mt-4 space-x-2 py-2 text-left">
          <h3 className=" text-md ml-2 text-left font-semibold dark:text-dark-txt">
            Creator Subscriptions
          </h3>
          <p className="dark:text-dark-txt-secondary text-sm">
            Upgrade to a subscription tier to unlock access to all content from the creator within
            that specific tier.
          </p>
        </div>
      </div>
    );
  };

  const topBar = () => {
    return (
      <div
        id="navbar"
        className="fixed top-0 z-40 hidden w-full dark:bg-dark-main bg-black bg-cover bg-center py-1.5 shadow-neubrutalism-sm "
      >
        <div>
          <div className="py-3">
            <div className="ml-5 text-lg font-bold leading-6 text-white">
              {details && details.title}
              <div className="float-right flex xl:hidden">
                {/* Price */}
                <div className="flex px-4 text-white">
                  <div className="mr-4 text-base flex-shrink-0 self-end">
                    {parseFloat(priceInMatic.toFixed(2))} MATIC
                  </div>
                  <div className="mr-4 text-base flex-shrink-0 self-end">Stock {stock}</div>
                </div>
              </div>
            </div>
            {
              // eslint-disable-next-line
              details && details.best_seller ? (
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
                    details.student_rating > rating ? 'text-almond-600' : 'text-gray-200',
                    'h-5 w-5 flex-shrink-0',
                  )}
                  aria-hidden="true"
                />
              ))}
            </span>
            <span className="text-sm text-purple-300">
              ({details && details.student_rating_no} ratings)
            </span>
            <span className="ml-2 text-sm font-medium text-dark hidden sm:inline-flex">
              {details && details.students} Students
            </span>
          </div>
          {/* <div className="px-4 -mt-1 block lg:hidden">
            <Button>Buy Now</Button>
          </div> */}
        </div>
      </div>
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
      {/* =============================================== ABOVE FOLD ============================================ */}
      {topBar()}
      {/* =============================================== ABOVE FOLD ============================================ */}
      <div className="relative z-0 h-auto w-full bg-cover bg-center py-6">
        <div className="absolute inset-0 bg-black dark:bg-dark-main bg-opacity-90" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 xl:px-8">
          {/* We've used 3xl here, but feel free to try other max-widths based on your needs */}
          <div className="mx-auto max-w-7xl">
            {/* Content goes here */}
            <div className="relative grid  xl:grid-cols-12">
              {/* DETAILS (LEFT SIDE) */}
              <div className="col-span-12 xl:col-span-7">
                {/* Breadcrumbs */}
                <nav className="flex " aria-label="Breadcrumb">
                  <ol className="flex items-center space-x-4">
                    <li>
                      <div>
                        <button
                          type="button"
                          onClick={() => {
                            router.back();
                          }}
                          className="dark:text-dark-accent dark:hover:text-dark-primary text-purple-200 hover:text-purple-400"
                        >
                          <HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                          <span className="sr-only">Home</span>
                        </button>
                      </div>
                    </li>
                    <li>
                      <div className="flex items-center">
                        <ChevronRightIcon
                          className="h-5 w-5 flex-shrink-0 dark:text-dark-accent text-iris-300"
                          aria-hidden="true"
                        />
                        <Link
                          href={`/category/${details && details.category.slug}`}
                          className="ml-4 text-sm font-bold dark:text-dark-accent dark:hover:text-dark-primary text-iris-300 hover:text-iris-500"
                        >
                          {details && details.category.name}
                        </Link>
                      </div>
                    </li>
                  </ol>
                </nav>
                {/* Title */}
                <p className="text-xl font-bold dark:text-dark-txt text-white sm:text-2xl sm:tracking-tight lg:text-3xl">
                  {details.title}
                </p>
                {/* Description */}
                <div
                  className="text-md font-regular mt-2 text-dark-txt dark:text-dark-txt lg:text-lg"
                  dangerouslySetInnerHTML={{
                    __html: sanitizedShortDescription,
                  }}
                />
                {/* Ratings */}
                <div className="mb-2 mt-4">
                  {
                    // eslint-disable-next-line
                    details.best_seller ? (
                      <span className=" mr-2 inline-flex items-center justify-center rounded-full bg-almond-100 px-3 py-0.5 text-sm font-bold text-almond-800">
                        Best Seller
                      </span>
                    ) : (
                      <div />
                    )
                  }
                  <div className="mr-2  inline-flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <StarIcon
                        key={rating}
                        className={classNames(
                          details.student_rating > rating ? 'text-almond-600' : 'text-gray-200',
                          'h-5 w-5 flex-shrink-0',
                        )}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <span className="text-md font-regular dark:text-dark-accent text-iris-400">
                    ({details.student_rating_no} ratings){' '}
                    <span className="text-md ml-2 font-medium text-gray-100">
                      {details.students} Students
                    </span>
                  </span>
                </div>

                {/* Author */}
                <div className="flex ">
                  <div>
                    <p className=" text-sm font-medium text-white ">
                      Created by:{' '}
                      <span className="font-bold dark:text-dark-accent dark:hover:text-dark-primary text-iris-400 underline">
                        <Link href={`/@/${author.username}`}>{author.username}</Link>
                        {author.verified ? (
                          <CheckBadgeIcon
                            className="ml-1 inline-flex h-4 w-4 dark:text-dark-accent  text-iris-400"
                            aria-hidden="true"
                          />
                        ) : (
                          <div />
                        )}
                      </span>
                    </p>
                    <p className="mt-2 text-sm font-medium dark:text-dark-txt text-white ">
                      Token ID:{' '}
                      <span className="font-regular text-xs dark:text-dark-accent  text-iris-400">
                        {details && details.token_id}
                      </span>
                    </p>
                    <p className="mt-2 text-sm font-medium dark:text-dark-txt text-white ">
                      NFT Address:{' '}
                      <span className="font-regular text-xs dark:text-dark-accent  text-iris-400">
                        <Link
                          target="_blank"
                          rel="noreferrer"
                          href={`https://mumbai.polygonscan.com/address/${
                            details && details.nft_address
                          }`}
                        >
                          {details && details.nft_address}
                        </Link>
                      </span>
                    </p>

                    <span className="mt-1 block" />
                  </div>
                </div>

                {/* Details */}
                <div className="mt-1 flex gap-x-4">
                  <div>
                    <InformationCircleIcon className="mr-2 inline-flex h-5 w-5 text-white dark:text-dark-txt " />
                    <span className="text-xs font-medium text-white dark:text-dark-txt sm:text-sm">
                      <span>Updated </span>
                      {moment(details.updated).format('MMMM YYYY')}
                    </span>
                  </div>
                  <div>
                    <GlobeAltIcon className="mr-2 inline-flex h-5 w-5 text-white dark:text-dark-txt" />
                    <span className="font-regular text-xs text-white dark:text-dark-txt sm:text-sm">
                      {details.language}
                    </span>
                  </div>
                </div>
              </div>
              {/* VIDEO (RIGHT SIDE) */}
              <div className="absolute right-0 col-span-5 hidden items-start xl:flex">
                <div
                  id="above-fold-video"
                  className="w-[397px] border-2 border-gray-900 dark:bg-dark-second dark:border-dark-border bg-white p-2 dark:shadow-none shadow-neubrutalism-md  lg:row-span-3"
                >
                  {details ? (
                    <div className="">
                      <button
                        type="button"
                        onClick={() => {
                          setOpenVideo(true);
                        }}
                        className="relative h-48 w-full"
                      >
                        <div className="absolute top-1/2 left-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 transform ">
                          <div className="absolute inset-0 bg-gray-500 bg-opacity-10 " />
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60 transition-opacity duration-300 ease-in-out hover:opacity-20" />
                        </div>
                        <img
                          className="h-full w-full object-cover"
                          src="/assets/img/headers/boomslag_h.jpg"
                          alt=""
                        />
                        <PlayIcon className="absolute top-1/2 left-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 transform  rounded-full dark:bg-dark-bg bg-white p-2.5" />
                      </button>
                      {addToCartCTA()}
                    </div>
                  ) : (
                    <LoadingMoon size={20} color="#1c1d1f" />
                  )}
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
          <div className="mt-1.5 grid items-start gap-2  xl:grid-cols-3">
            {/* Video */}
            <div className=" col-span-12 mx-3 px-0 sm:mx-4 sm:px-4 xl:col-span-2 " />
            <div
              id="below-fold-video"
              className="top-4 z-10 col-span-12 mb-4 hidden w-full border-2 border-gray-900 bg-white p-0.5 dark:bg-dark-second dark:border-dark-border dark:shadow-none shadow-neubrutalism-md transition duration-300 ease-in-out  xl:z-40 xl:sticky xl:col-span-1 xl:row-span-3"
            >
              {details ? (
                <div className="hidden p-1.5 xl:block">{addToCartCTA()}</div>
              ) : (
                <>loading</>
              )}
            </div>
            {/* Course Overview */}
            <div className=" col-span-12 mx-3 px-0 sm:mx-4 sm:px-4 xl:col-span-2 ">
              <div className="w-full py-4 xl:hidden">
                {details ? (
                  <div className="">
                    <CustomVideo url={course && course.videos[0].file} />

                    {addToCartCTA()}
                  </div>
                ) : (
                  <LoadingMoon />
                )}
              </div>
              <p className="py-4 text-2xl font-black leading-6 text-gray-900 dark:text-dark-txt">
                Course overview
              </p>
              <ul className="">
                {whatLearntSlice &&
                  whatLearntSlice.map((item) => (
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
                <Button
                  onMouseDown={() => {
                    setEffectFullOverview(true);
                  }}
                  onMouseUp={() => setEffectFullOverview(false)}
                  onClick={() => setOpen(true)}
                  type="button"
                >
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
                              Details and curriculum
                            </h3>
                          </div>
                          <WhatLearnt whatlearnt={course && course.whatlearnt} />

                          {/* Description */}
                          <Disclosure>
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
                                  <div
                                    className="text-md font-regular my-2 text-gray-900 dark:text-dark-txt"
                                    dangerouslySetInnerHTML={{
                                      __html: sanitizedDescription,
                                    }}
                                  />
                                </Disclosure.Panel>
                              </>
                            )}
                          </Disclosure>
                          {/* Requirements */}
                          <Disclosure>
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
                          </Disclosure>
                        </Dialog.Panel>
                      </Transition.Child>
                    </div>
                  </div>
                </Dialog>
              </Transition.Root>
            </div>

            {/* SoloPython for Business */}
            {course && course.tiers && course.tiers.length !== 0 && (
              <div className="col-span-12 mx-3 mt-4 py-4 px-0 sm:mx-4 sm:px-4 xl:col-span-2">
                <div className="mx-auto max-w-7xl border border-gray-300 p-4 dark:border-dark-third">
                  <h2 className="text-md font-bold tracking-tight text-gray-900 dark:text-dark-txt">
                    Access to More Courses for Less
                  </h2>

                  <div className=" pb-2 sm:flex sm:items-center sm:justify-between">
                    <p className="font-regular text-sm tracking-tight text-gray-900 dark:text-dark-txt">
                      You may access this course if you subscribe to any of these.
                    </p>
                    <div className="mt-3 sm:mt-0 sm:ml-4">
                      <Link
                        href={`/@/${details.author.username}`}
                        className=" inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium dark:text-dark-accent hover:dark:text-dark-primary text-purple-700 underline underline-offset-4 "
                      >
                        Subscribe
                      </Link>
                    </div>
                  </div>

                  <div className="mt-4 flow-root ">
                    <div className="-mt-4 -ml-8 flex flex-wrap justify-between lg:-ml-4">
                      {details &&
                        details.tiers &&
                        details.tiers.map((tier) => (
                          <div className="mt-4 ml-8 flex flex-shrink-0 flex-grow lg:ml-4 lg:flex-grow-0">
                            <span className="bg-green-100 text-green-800 inline-flex items-center rounded-md px-2.5 py-0.5 text-sm font-medium">
                              {tier.name}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sections */}
            <div className="col-span-12 mx-3 mt-4 px-0 sm:mx-4 sm:px-4 xl:col-span-2">
              <CourseDetailComponent
                sections={sections && sections}
                handleViewMoreSections={handleViewMoreSections}
                totalLength={details && details.total_duration}
                totalLectures={details && details.total_lectures}
                sectionsPageSize={sectionsPageSize}
                sectionsCount={sectionsCount}
              />
            </div>

            {/* Related */}
            {relatedCourses && (
              <div className="col-span-12 mr-8 pb-4 xl:col-span-2">
                <RelatedCourses courses={relatedCourses && relatedCourses} />
              </div>
            )}

            <div className="col-span-12 mx-3 mt-4 px-0 sm:mx-4 sm:px-4 xl:col-span-2">
              <InstructorDetails data={author && author} profile={authorProfile && authorProfile} />
            </div>

            {/* Reviews */}
            <div className="col-span-12 mt-2 pb-4 xl:col-span-2">
              <Reviews
                details={details && details}
                courseUUID={courseUUID}
                reviews={reviews && reviews}
                handleViewMoreReviews={handleViewMoreReviews}
                reviewsCount={reviewsCount}
                reviewsPageSize={reviewsPageSize}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Video Play */}
      <Transition.Root show={openVideo} as={Fragment}>
        <Dialog as="div" className="relative z-20" onClose={setOpenVideo}>
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
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-black px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                  <div>
                    <div className=" px-4 py-5 sm:px-6">
                      <div className="-ml-4 -mt-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
                        <div className="ml-4 mt-4">
                          <h3 className="text-sm font-medium leading-6 text-gray-500">
                            Course Preview
                          </h3>
                          <p className="text-md  mt-1 font-bold text-white">
                            {details && details.title}
                          </p>
                        </div>
                        <div className="ml-4 mt-4 flex-shrink-0">
                          {/* <button
                                        type="button"
                                        className="relative inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        Create new job
                                    </button> */}
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-2 text-white sm:px-4">
                      {/* <video src={test_video} controls className="w-full h-96"/> */}
                      <CustomVideo
                        className=" h-96 w-full object-contain "
                        url={course && course.videos[0].file}
                      />
                      <div className="h-full w-full bg-white" />
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

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
                              Buy Course NFT
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
                                    onMouseDown={() => {
                                      setEffectClickAff(true);
                                    }}
                                    onMouseUp={() => setEffectClickAff(false)}
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
      <Transition.Root show={openTrade} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setOpenTrade}>
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
                <Dialog.Panel className="relative transform overflow-hidden bg-white   px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6">
                  {/* Description about program */}
                  <form onSubmit={(e) => onSubmitEnlistNFT(e)}>
                    <div className=" flex flex-wrap items-center justify-between sm:flex-nowrap">
                      <h3 className="text-base font-semibold leading-6 text-gray-900">
                        Enlist NFT in Auction
                      </h3>
                      <div className=" flex-shrink-0">
                        <button
                          type="submit"
                          className="relative inline-flex items-center rounded-md bg-iris-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-iris-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iris-600"
                        >
                          Enlist for Sale
                        </button>
                      </div>
                    </div>
                    <div className="relative mt-4 rounded-md shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <CurrencyDollarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        type="number"
                        name="nftPrice"
                        required
                        value={nftPrice}
                        onChange={(e) => {
                          let formattedValue = e.target.value;
                          let numValue = parseFloat(formattedValue);

                          if (isNaN(numValue) || numValue < 0) {
                            formattedValue = '0';
                          } else {
                            formattedValue = numValue.toString();
                          }

                          setNFTPrice(formattedValue);
                        }}
                        className="text-md duration block w-full  py-3 pl-10 font-medium shadow-neubrutalism-sm transition ease-in-out focus:border-gray-900 focus:ring-gray-900 dark:bg-dark-second dark:text-dark-txt"
                        placeholder="Starting price (e.g. 250)"
                      />
                    </div>
                    <label className="mt-4 block text-sm font-medium leading-6 text-gray-900">
                      End Date
                    </label>
                    <div className="relative  rounded-md shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <CalendarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        type="date"
                        required
                        value={auctionDate}
                        onChange={(e) => {
                          setAuctionDate(e.target.value);
                        }}
                        className="text-md duration block w-full  py-3 pl-10 font-medium shadow-neubrutalism-sm transition ease-in-out focus:border-gray-900 focus:ring-gray-900 dark:bg-dark-second dark:text-dark-txt"
                        aria-describedby="price-currency"
                      />
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}

Courses.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export async function getServerSideProps(context) {
  const { courseUUID } = context.query;
  const { referrer } = context.query;

  const cookies = cookie.parse(context.req.headers.cookie || '');
  const { access } = cookies;

  if (!courseUUID || courseUUID.length === 0) {
    return {
      notFound: true,
    };
  }

  const courseRes = await axios.get(
    `${process.env.NEXT_PUBLIC_APP_COURSES_URL}/api/courses/get/${courseUUID}/`,
  );

  const authorId = courseRes.data.results.details.author;

  const authorProfileRes = await axios.get(
    `${process.env.NEXT_PUBLIC_APP_API_URL}/api/users/get/profile/${authorId}/`,
  );

  const authorRes = await axios.get(
    `${process.env.NEXT_PUBLIC_APP_API_URL}/api/users/get/${authorId}/`,
  );

  return {
    props: {
      courseUUID: courseUUID,
      referrer: referrer ? referrer : null,
      course: courseRes.data.results,
      authorProfile: authorProfileRes.data.results,
      author: authorRes.data.results,
    },
  };
}
