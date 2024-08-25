import Head from 'next/head';
import jwtDecode from 'jwt-decode';
import cookie from 'cookie';

import { Fragment, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CircleLoader } from 'react-spinners';
import { useRouter } from 'next/router';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

import Layout from '../../components/Layout';
import ListSellerProducts from '@/api/manage/products/List';
import { resetCreateVariables } from '@/redux/actions/courses/courses';
import ProductsList from '../components/ProductsList';
import Link from 'next/link';
import FetchOrderItems from '@/api/orders/ListOrderItems';
import LoadingBar from '@/components/loaders/LoadingBar';
import OrderItemList from './components/OrderItemsList';
import axios from 'axios';
import moment from 'moment';
import Image from 'next/image';
import Button from '@/components/Button';
import UpdateTrackingUrl from '@/api/orders/UpdateTrackingUrl';
import UpdateTrackingNumber from '@/api/orders/UpdateTrackingNumber';
import UpdateOrderItemStatus from '@/api/orders/UpdateOrderitemStatus';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const SeoList = {
  title: 'Order Item - Buy & Sell Products with NFTs on our Marketplace',
  description:
    'Discover a new way to buy and sell products using NFTs on Boomslag. Our revolutionary platform lets you purchase and sell physical and digital products securely and seamlessly using ERC1155 tokens.',
  href: '/',
  url: 'https://boomslag.com',
  keywords: 'buy and sell products, nft product marketplace, nft marketplace, sell nfts',
  robots: 'all',
  author: 'BoomSlag',
  publisher: 'BoomSlag',
  image:
    'https://bafybeiaor24mrcurzyzccxl7xw46zdqpor4sfuhddl6tzblujoiukchxnq.ipfs.w3s.link/friends.png',
  twitterHandle: '@BoomSlag',
};

export default function OrderItem({ id, order, initialOrderItem }) {
  const router = useRouter();
  const [orderItem, setOrderItem] = useState(initialOrderItem);

  const [formData, setFormData] = useState({
    status: '',
  });

  const { status } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [loadingOrderStatus, setLoadingOrderStatus] = useState(false);
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoadingOrderStatus(true);
    const res = await UpdateOrderItemStatus(id[0], status);
    setOrderItem(res.data.results.order_item);
    setLoadingOrderStatus(false);
  };

  const [formDataTracking, setFormDataTracking] = useState({
    tracking_number: '',
  });

  const { tracking_number } = formDataTracking;

  const onChangeTracking = (e) => {
    setFormDataTracking({ ...formDataTracking, [e.target.name]: e.target.value });
  };

  const [loadingOrderTracking, setLoadingOrderTracking] = useState(false);
  const onSubmitTracking = async (e) => {
    e.preventDefault();
    setLoadingOrderTracking(true);
    const res = await UpdateTrackingNumber(id[0], tracking_number);
    setOrderItem(res.data.results.order_item);
    setLoadingOrderTracking(false);
  };

  const [formDataTrackingUrl, setFormDataTrackingUrl] = useState({
    tracking_url: '',
  });

  const { tracking_url } = formDataTrackingUrl;

  const [loadingOrderTrackingUrl, setLoadingOrderTrackingUrl] = useState(false);
  const onChangeTrackingUrl = (e) => {
    setFormDataTrackingUrl({ ...formDataTrackingUrl, [e.target.name]: e.target.value });
  };

  const onSubmitTrackingUrl = async (e) => {
    e.preventDefault();
    setLoadingOrderTrackingUrl(true);
    const res = await UpdateTrackingUrl(id[0], tracking_url);
    setOrderItem(res.data.results.order_item);
    setLoadingOrderTrackingUrl(false);
  };

  var date_bought = new Date(order && order.date_issued);
  const delivery_days = new Date(
    date_bought.setDate(date_bought.getDate() + Number(orderItem && orderItem.shipping_time)),
  );
  var delivery_date = new Date(delivery_days);

  const delivery_days_plus = new Date(delivery_date.setDate(delivery_date.getDate() + Number(3)));

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
      <div className="px-8 pb-5 sm:flex sm:items-center sm:justify-between">
        <h3 className="font-recife-bold text-xl leading-6 dark:text-dark-txt text-gray-900 md:text-4xl">
          Order: {order.transaction_id}
        </h3>
      </div>
      <div className="px-4 py-5 sm:px-6 ">
        <div className=" -ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
          <div className="ml-4 mt-4">
            <h3 className="text-sm font-bold leading-6 dark:text-dark-txt text-gray-900">
              ORDER PLACED
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-dark-txt-secondary">
              {moment(order.date_issued).format('MMMM Do YYYY, h:mm:ss a')}
            </p>
          </div>

          <div className="ml-4 mt-2 flex-shrink-0 grid sm:grid-cols-3 space-x-2">
            <form onSubmit={(e) => onSubmitTrackingUrl(e)}>
              <label
                htmlFor="location"
                className="block text-sm font-bold dark:text-dark-txt text-gray-700"
              >
                Tracking Url
              </label>
              <input
                type="text"
                name="tracking_url"
                value={tracking_url}
                onChange={(e) => onChangeTrackingUrl(e)}
                required
                placeholder={(orderItem.tracking_url && orderItem.tracking_url) || ''}
                className="ring-none w-full border dark:border-dark-border border-gray-700 py-3 outline-none dark:bg-dark-second pl-4 focus:border-gray-500 focus:outline-transparent focus:ring-transparent"
              />
              {loadingOrderTrackingUrl ? (
                <div className="text-gray-700 hover:text-blue-500 float-right text-sm font-regularr">
                  <CircleLoader
                    loading={loadingOrderTrackingUrl}
                    className="inline-flex"
                    size={15}
                    color="#1e1f48"
                  />
                </div>
              ) : (
                <button
                  type="submit"
                  className="text-gray-700 dark:text-dark-accent hover:text-blue-500 float-right text-sm font-regularr"
                >
                  Actualizar
                </button>
              )}
            </form>
            <form onSubmit={(e) => onSubmitTracking(e)}>
              <label
                htmlFor="location"
                className="block text-sm font-bold dark:text-dark-txt text-gray-700"
              >
                Tracking Number
              </label>
              <input
                type="text"
                name="tracking_number"
                value={tracking_number}
                onChange={(e) => onChangeTracking(e)}
                required
                placeholder={orderItem.tracking_number && orderItem.tracking_number}
                className="ring-none w-full border dark:border-dark-border border-gray-700 py-3 outline-none dark:bg-dark-second pl-4 focus:border-gray-500 focus:outline-transparent focus:ring-transparent"
              />
              {loadingOrderTracking ? (
                <div className="text-gray-700 hover:text-blue-500 float-right text-sm font-regular">
                  <CircleLoader
                    loading={loadingOrderTracking}
                    className="inline-flex"
                    size={15}
                    color="#1e1f48"
                  />
                </div>
              ) : (
                <button
                  type="submit"
                  className="text-gray-700 dark:text-dark-accent hover:text-blue-500 float-right text-sm font-regular"
                >
                  Actualizar
                </button>
              )}
            </form>
            <form onSubmit={(e) => onSubmit(e)}>
              <label
                htmlFor="location"
                className="block text-sm font-bold dark:text-dark-txt text-gray-700"
              >
                Estado de Orden
              </label>
              <select
                name="status"
                value={status}
                required
                onChange={(e) => onChange(e)}
                selectedvalue="DEFAULT"
                className=" block w-full pl-3 pr-10 py-2 text-base text-gray-500 border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option className="text-gray-500 dark:text-dark-txt-secondary" value="DEFAULT">
                  -- Delivery status --
                </option>
                <option
                  className="text-gray-700 dark:text-dark-txt-secondary"
                  value="not_processed"
                >
                  Not Processed
                </option>
                <option className="text-gray-700 dark:text-dark-txt-secondary" value="processing">
                  Processing
                </option>
                <option className="text-gray-700 dark:text-dark-txt-secondary" value="shipping">
                  Shipping
                </option>
                <option className="text-gray-700 dark:text-dark-txt-secondary" value="delivered">
                  Delivered
                </option>
                <option className="text-gray-700 dark:text-dark-txt-secondary" value="cancelled">
                  Cancelled
                </option>
              </select>
              {loadingOrderStatus ? (
                <div className="text-gray-700 hover:text-blue-500 float-right text-sm font-regularr">
                  <CircleLoader
                    loading={loadingOrderStatus}
                    className="inline-flex"
                    size={15}
                    color="#1e1f48"
                  />
                </div>
              ) : (
                <button
                  type="submit"
                  className="text-gray-700 dark:text-dark-accent hover:text-blue-500 float-right text-sm font-regularr"
                >
                  Actualizar
                </button>
              )}
            </form>
          </div>
        </div>
      </div>

      <div className="">
        <div className="space-y-8">
          <div className="px-4 sm:px-6 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:p-8">
            <div className="sm:flex lg:col-span-7">
              <div className="flex-shrink-0 w-full aspect-w-1 aspect-h-1 rounded-lg overflow-hidden sm:aspect-none sm:w-40 sm:h-40">
                <Image
                  width={256}
                  height={256}
                  src={orderItem.thumbnail}
                  alt="order thumbnail"
                  className="w-full h-full object-center object-cover sm:w-full sm:h-full"
                />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-medium dark:text-dark-txt text-gray-900">
                  <Link href={`/product/${orderItem.product}`}>{orderItem.name}</Link>
                </h3>
                <h2 className="">{orderItem.product.title}</h2>
                {/* <p className=" text-gray-500 text-base select-none" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(orderItem.product.description.length)  > 97 ? DOMPurify.sanitize(orderItem.product.description.slice(0,96)) : data && DOMPurify.sanitize(orderItem.product.description) }}/> */}
                <div className="text-gray-500 flex">
                  {orderItem && orderItem.color && (
                    <>
                      <span className="inline-flex font-bold">Color: </span>
                      <div
                        className="inline-flex ml-2 rounded-full h-5 w-5"
                        style={{ backgroundColor: orderItem.color.hex }}
                      />
                    </>
                  )}
                </div>
                <p className="text-gray-500 dark:text-dark-txt">
                  {orderItem && orderItem.size && (
                    <>
                      <span className="font-bold">Size: </span>
                      {orderItem.size_name}
                    </>
                  )}
                </p>
                <p className="text-gray-500 dark:text-dark-txt">
                  {orderItem && orderItem.weight && (
                    <>
                      <span className="font-bold">Weight: </span>
                      {orderItem.weight_name}
                    </>
                  )}
                </p>
                <p className="text-gray-500 dark:text-dark-txt">
                  {orderItem && orderItem.material && (
                    <>
                      <span className="font-bold">Material: </span>
                      {orderItem.material_name}
                    </>
                  )}
                </p>
                <p className="text-gray-500 dark:text-dark-txt">
                  {orderItem && orderItem.color && (
                    <>
                      <span className="font-bold">Color: </span>
                      {orderItem.color_hex}
                    </>
                  )}
                </p>
                <p className="text-gray-500 dark:text-dark-txt">
                  <span className="font-bold">Qty: </span>
                  {orderItem.count}
                </p>
              </div>
            </div>

            {orderItem.delivery_address ? (
              <div className=" lg:col-span-5">
                <dl className="grid grid-cols-2 gap-x-6 text-sm">
                  <div>
                    <dt className="font-bold text-lg dark:text-dark-txt text-gray-900">
                      Delivery address
                    </dt>
                    <dd className="mt-3 text-gray-500">
                      <span className="block">
                        <span className="font-semibold">Country: </span>{' '}
                        {orderItem.delivery_address.country_region}
                      </span>
                      <span className="block">
                        <span className="font-semibold">City: </span>
                        {orderItem.delivery_address.city}
                      </span>
                      <span className="block">
                        <span className="font-semibold">Address 1: </span>{' '}
                        {orderItem.delivery_address.address_line_1}
                      </span>
                      <span className="block">
                        <span className="font-semibold">Address 2: </span>{' '}
                        {orderItem.delivery_address.address_line_2}
                      </span>
                      <span className="block">
                        <span className="font-semibold">Postal Code: </span>{' '}
                        {orderItem.delivery_address.postal_zip_code}
                      </span>
                      <span className="block">
                        <span className="font-semibold">Email: </span> {orderItem.buyer.email}
                      </span>
                      <span className="block">
                        <span className="font-semibold">Telephone: </span>{' '}
                        {orderItem.delivery_address.telephone_number}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="font-bold text-lg text-gray-900">Shipping</dt>
                    <dd className="mt-3 text-gray-500 space-y-1">
                      <span className="block">
                        <span className="font-semibold">Name: </span> {orderItem.shipping_name}
                      </span>
                      <span className="block">
                        <span className="font-semibold">Time to Delivery: </span>{' '}
                        {orderItem.shipping_time}
                      </span>
                      <span className="block font-regular bg-yellow-300 p-4 rounded-xl text-gray-700">
                        <span className="font-bold text-black text-md">
                          Delivery Date Deadline:{' '}
                        </span>{' '}
                        {moment(delivery_days).format('MMMM Do')} -{' '}
                        {moment(delivery_days_plus).format('MMMM Do')}
                      </span>
                      {contactBuyer(orderItem)}
                    </dd>
                  </div>
                </dl>
              </div>
            ) : (
              <div className=" lg:col-span-5">
                <dl className="grid grid-cols-2 gap-x-6 text-sm">
                  <div>
                    <dt className="font-bold text-lg dark:text-dark-txt text-gray-900">
                      Delivery address
                    </dt>
                    <dd className="mt-3 text-gray-500 dark:text-dark-txt-secondary">
                      <span className="block">
                        <span className="font-semibold dark:text-dark-txt">Country: </span>{' '}
                        {orderItem.country_region}
                      </span>
                      <span className="block">
                        <span className="font-semibold dark:text-dark-txt">City: </span>
                        {orderItem.city}
                      </span>
                      <span className="block">
                        <span className="font-semibold dark:text-dark-txt">Address 1: </span>{' '}
                        {orderItem.address_line_1}
                      </span>
                      <span className="block">
                        <span className="font-semibold dark:text-dark-txt">Address 2: </span>{' '}
                        {orderItem.address_line_2}
                      </span>
                      <span className="block">
                        <span className="font-semibold dark:text-dark-txt">Postal Code: </span>{' '}
                        {orderItem.postal_zip_code}
                      </span>
                      <span className="block">
                        <span className="font-semibold dark:text-dark-txt">Email: </span>{' '}
                        {orderItem.buyer.email}
                      </span>
                      <span className="block">
                        <span className="font-semibold dark:text-dark-txt">Telephone: </span>{' '}
                        {orderItem.telephone_number}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="font-bold text-lg dark:text-dark-txt text-gray-900">Shipping</dt>
                    <dd className="mt-3 dark:text-dark-txt-secondary text-gray-500 space-y-3">
                      <span className="block">
                        <span className="font-semibold dark:text-dark-txt">Name: </span>{' '}
                        {orderItem.shipping_name}
                      </span>
                      <span className="block">
                        <span className="font-semibold dark:text-dark-txt">Time to Delivery: </span>{' '}
                        {orderItem.shipping_time}
                      </span>
                      <span className="block">
                        <span className="font-semibold dark:text-dark-txt">Deadline: </span>
                        {moment(delivery_days).format('MMMM Do')} -{' '}
                        {moment(delivery_days_plus).format('MMMM Do')}
                      </span>
                      <Button
                        onClick={() => {
                          router.push(`/inbox`);
                        }}
                      >
                        Message Buyer
                      </Button>
                    </dd>
                  </div>
                </dl>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-t dark:border-dark-second border-gray-200 pr-16">
        <div className="mt-6" aria-hidden="true">
          <div className="hidden sm:grid grid-cols-4 text-sm font-medium text-gray-600 mt-6 dark:text-dark-txt">
            <div
              className={classNames(
                orderItem.status === 'not_processed' ? 'text-iris-600 dark:text-dark-primary' : '',
                'text-center',
              )}
            >
              Order placed
            </div>
            <div
              className={classNames(
                orderItem.status === 'processing' ? 'text-iris-600 dark:text-dark-primary' : '',
                'text-center',
              )}
            >
              Processing
            </div>
            <div
              className={classNames(
                orderItem.status === 'shipping' ? 'text-iris-600 dark:text-dark-primary' : '',
                'text-center',
              )}
            >
              Shipping
            </div>
            <div
              className={classNames(
                orderItem.status === 'delivered' ? 'text-iris-600 dark:text-dark-primary' : '',
                'text-right',
              )}
            >
              Delivered
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

OrderItem.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export async function getServerSideProps(context) {
  const { id } = context.query;

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

  if (!id || id.length === 0 || !isAuthenticated) {
    return {
      redirect: {
        destination: isAuthenticated ? '/library/orders' : '/',
        permanent: false,
      },
    };
  }

  try {
    const orderItemRes = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_ORDERS_URL}/api/orders/get_item/${id}/`,
      { headers: { Authorization: `JWT ${access}` } },
    );

    return {
      props: {
        id: id,
        order: orderItemRes.data.results.order,
        initialOrderItem: orderItemRes.data.results.order_item,
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: '/library/orders',
        permanent: false,
      },
    };
  }
}
