import moment from 'moment';
import { useSelector } from 'react-redux';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { StarIcon } from '@heroicons/react/24/solid';
import { CircleLoader } from 'react-spinners';
import Image from 'next/image';
import SimpleEditor from '@/components/SimpleEditor';
import CreateProductReview from '@/api/products/CreateReview';
import FetchProductReview from '@/api/products/GetReview';
import UpdateProductReview from '@/api/products/UpdateReview';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function OrderContentItem({ item, order, index }) {
  const [review, setReview] = useState(null);
  const product_id = item && item.product;

  const fetchReview = useCallback(async () => {
    const res = await FetchProductReview(product_id);
    setReview(res.data.results);
  }, [item]);

  useEffect(() => {
    fetchReview();
  }, [item]);

  const user = useSelector((state) => state.auth.user);

  const [open, setOpen] = useState(false);
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [openDeliveryAddress, setOpenDeliveryAddress] = useState(false);
  const [createReview, setCreateReview] = useState(false);
  const [editReview, setEditReview] = useState(false);

  const tax = (parseFloat(process.env.NEXT_PUBLIC_TAX) * (item.price * item.count)).toFixed(2);
  const sub_total = (Number(item.price) * item.count).toFixed(2);
  const shipping_total = Number(item.shipping_price).toFixed(2);
  const estimated_tax = (
    parseFloat(process.env.NEXT_PUBLIC_TAX) *
    (Number(item.price) * item.count)
  ).toFixed(2);
  const grand_total = (
    Number(item.price) * item.count +
    Number(item.shipping_price) +
    parseFloat(estimated_tax)
  ).toFixed(2);

  var date_bought = new Date(order && order.date_issued);
  const delivery_days = new Date(
    date_bought.setDate(date_bought.getDate() + Number(item.shipping_time)),
  );
  var delivery_date = new Date(delivery_days);

  const delivery_days_plus = new Date(delivery_date.setDate(delivery_date.getDate() + Number(3)));

  const [formData, setFormData] = useState({
    rating: '',
  });

  const { rating } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCreateReview = async (e) => {
    e.preventDefault();
    setLoading(true);
    await CreateProductReview(user.id, product_id, rating, body);
    fetchReview();
    setLoading(false);
    setEditReview(false);
    setBody('');
    setOpen(false);
    setFormData({
      rating: '',
    });
  };

  const handleEditReview = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (body !== '' || rating !== '') {
      await UpdateProductReview(user.id, product_id, rating, body);
      fetchReview();
      setLoading(false);
      setEditReview(false);
      setBody('');
      setOpen(false);
      setFormData({
        rating: '',
      });
    } else {
      alert('You must input something in your review body and select a rating.');
      setLoading(false);
      return;
    }
  };

  const handleCancelReview = () => {
    setEditReview(false);
    setCreateReview(false);
    setLoading(false);
    setBody('');
    setFormData({
      rating: '',
    });
  };

  return (
    <>
      <div className="divide-y dark:divide-dark-second divide-gray-200 overflow-hidden rounded-lg dark:border-dark-second dark:bg-dark-bg bg-white dark:shadow-none border-2 border-gray-900 shadow-neubrutalism-md">
        <div className="px-4 py-5 sm:px-6 dark:bg-dark-second bg-gray-50">
          {/* Content goes here */}
          {/* We use less vertical padding on card headers on desktop than on body sections */}
          <div className="-ml-4 -mt-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
            <div className="ml-4 mt-4">
              <h3 className="text-sm font-bold leading-6 dark:text-dark-txt text-gray-600">
                ORDER PLACED
              </h3>
              <p className="mt-1 text-sm dark:text-dark-txt-secondary text-gray-500">
                {moment(order && order.date_issued).format('MMMM Do YYYY, h:mm:ss a')}
              </p>
            </div>

            <div className="ml-4 mt-4 flex-shrink-0">
              <h3 className="text-xs font-medium leading-6 dark:text-dark-txt text-gray-600">
                ORDER: <span>{item && item.id}</span>
              </h3>
              <p className="mt-1 text-xs text-gray-500 space-x-2">
                <button className="inline-flex dark:text-dark-accent dark:hover:text-dark-primary text-purple-600 hover:underline">
                  Contact Seller
                </button>
                <button
                  onClick={() => {
                    if (review) {
                      setEditReview(true);
                    } else {
                      setCreateReview(true);
                    }
                  }}
                  className="inline-flex dark:text-dark-accent dark:hover:text-dark-primary text-purple-600 hover:underline"
                >
                  Review Product
                </button>
                <button
                  onClick={() => {
                    setOpenDeliveryAddress(true);
                  }}
                  className="inline-flex dark:text-dark-accent dark:hover:text-dark-primary text-purple-600 hover:underline"
                >
                  Delivery Address
                </button>
              </p>
            </div>
          </div>
          {createReview ? (
            <div className="w-full my-2 dark:bg-dark-bg bg-white dark:border-dark-second border">
              <form onSubmit={(e) => handleCreateReview(e)} className="w-full  p-4 pb-16  ">
                <div className="grid grid-cols-12">
                  <p className="text-md font-bold md:col-span-2 col-span-12 md:mt-3 mt-0">
                    Rating:
                  </p>
                  <div className="relative mt-1 rounded-md shadow-sm md:col-span-10 col-span-12">
                    <select
                      name="rating"
                      onChange={(e) => onChange(e)}
                      value={rating}
                      required
                      placeholder="1 - 5"
                    >
                      <option value="" disabled>
                        0 - 5
                      </option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-12">
                  <p className="text-md font-bold md:col-span-2 col-span-12 md:mt-3 mt-0">Body:</p>
                  <div className="relative mt-1 rounded-md shadow-sm md:col-span-10 col-span-12">
                    <SimpleEditor data={body} setData={setBody} />
                  </div>
                </div>
                <div className="float-right  mt-4 space-x-2">
                  <div
                    onClick={() => {
                      handleCancelReview();
                    }}
                    className="inline-flex cursor-pointer items-center border border-transparent px-4 py-2 text-sm font-medium text-black dark:text-dark-txt hover:bg-gray-50 dark:hover:bg-dark-second"
                  >
                    Cancel
                  </div>
                  {loading ? (
                    <div className="inline-flex items-center border border-transparent hover:bg-gray-900 bg-black px-4 py-2 text-sm font-bold text-white shadow-sm">
                      <CircleLoader
                        loading={loading}
                        className="inline-flex"
                        size={15}
                        color="#ffffff"
                      />
                    </div>
                  ) : (
                    <button
                      type="submit"
                      className="inline-flex items-center border border-transparent bg-black dark:bg-dark-primary px-4 py-2 text-sm font-bold text-white  shadow-sm hover:bg-gray-900 dark:hover:bg-dark-accent"
                    >
                      Create Review
                    </button>
                  )}
                </div>
              </form>
            </div>
          ) : editReview ? (
            <div className="w-full my-2 dark:bg-dark-bg bg-white dark:border-dark-second  border">
              <div className="p-4">
                <div className="flex items-center">
                  <img
                    src={review && review.thumbnail}
                    alt={`${review && review.user}.`}
                    className="h-12 w-12 rounded-full"
                  />
                  <div className="ml-4">
                    <h4 className="text-sm font-bold dark:text-dark-txt text-gray-900">
                      {user && user.username}
                    </h4>
                    <div className="mt-1 flex items-center">
                      {[0, 1, 2, 3, 4].map((rate) => (
                        <StarIcon
                          key={rate}
                          className={classNames(
                            review && review.rating > rate ? 'text-yellow-400' : 'text-gray-300',
                            'h-5 w-5 flex-shrink-0',
                          )}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <p className="sr-only">{review && review.rating} out of 5 stars</p>
                  </div>
                </div>

                <div
                  className="mt-4 space-y-6 text-base italic dark:text-dark-txt-secondary text-gray-600"
                  dangerouslySetInnerHTML={{ __html: review && review.comment }}
                />
              </div>

              <form onSubmit={(e) => handleEditReview(e)} className="w-full  p-4 pb-16  ">
                <div className="grid grid-cols-12">
                  <p className="text-md font-bold md:col-span-2 col-span-12 md:mt-3 mt-0">
                    Rating:
                  </p>
                  <div className="relative mt-1 rounded-md shadow-sm md:col-span-10 col-span-12">
                    <select
                      name="rating"
                      onChange={(e) => onChange(e)}
                      value={rating}
                      required
                      placeholder="1 - 5"
                    >
                      <option value="" disabled>
                        0 - 5
                      </option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <p className="text-md font-bold md:col-span-2 col-span-12 md:mt-3 mt-0">Body:</p>
                  <div className="relative mt-1 rounded-md shadow-sm md:col-span-10 col-span-12">
                    <SimpleEditor data={body} setData={setBody} />
                  </div>
                </div>
                <div className="float-right  mt-4 space-x-2">
                  <div
                    onClick={() => {
                      handleCancelReview();
                    }}
                    className="inline-flex cursor-pointer items-center border border-transparent px-4 py-2 text-sm font-medium text-black dark:text-dark-txt hover:bg-gray-50 dark:hover:bg-dark-second"
                  >
                    Cancel
                  </div>
                  {loading ? (
                    <div className="inline-flex items-center border border-transparent hover:bg-gray-900 bg-black px-4 py-2 text-sm font-bold text-white shadow-sm">
                      <CircleLoader
                        loading={loading}
                        className="inline-flex"
                        size={15}
                        color="#ffffff"
                      />
                    </div>
                  ) : (
                    <button
                      type="submit"
                      className="inline-flex items-center border border-transparent bg-black dark:bg-dark-primary px-4 py-2 text-sm font-bold text-white  shadow-sm hover:bg-gray-900 dark:hover:bg-dark-accent"
                    >
                      Edit Review
                    </button>
                  )}
                </div>
              </form>
            </div>
          ) : (
            <></>
          )}
        </div>
        <div className="px-4 py-5 sm:p-6">
          {/* Content goes here */}
          <div className="-ml-4 -mt-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
            <div className="ml-4 mt-4">
              <h3 className="text-lg font-bold leading-6 dark:text-dark-txt text-gray-700">
                Arriving {moment(delivery_days).format('MMMM Do')} -{' '}
                {moment(delivery_days_plus).format('MMMM Do')}{' '}
              </h3>
            </div>
            <div className="ml-4 mt-4 flex-shrink-0">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="relative inline-flex items-center rounded-md border border-transparent bg-yellow-400 hover:bg-yellow-500 px-4 py-2 text-sm font-medium text-gray-900 shadow-sm"
              >
                Track Package
              </button>
            </div>
          </div>

          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
            <dt className="text-sm font-medium text-gray-500">
              <Image
                width={512}
                height={512}
                src={item && item.thumbnail}
                alt="Thumbnail"
                className="w-full h-full object-center object-cover sm:w-full sm:h-full"
              />
            </dt>
            <dd className="mt-1 flex text-sm dark:text-dark-txt text-gray-900 sm:col-span-2 sm:mt-0">
              <span className="flex-grow">
                <p className="text-lg font-semibold">{item && item.name}</p>
                {/* <p className="mt-2 text-sm font-medium text-gray-900 dark:text-dark-txt">
                                    <img 
                                        className="h-4 w-4 inline-flex mr-1"
                                        src="/assets/img/eth.png"
                                    />
                                    {(item.price.toFixed(2))/(ethereum_price)}
                                </p> */}
                <p className="mt-2 text-sm text-gray-500 dark:text-dark-txt">
                  Quantity: {item && item.count}
                </p>
                {item && item.weight && (
                  <p className="mt-2 text-sm text-gray-500 dark:text-dark-txt">
                    Weight: {item && item.weight_name}.g
                  </p>
                )}
                {item && item.color && (
                  <p className="mt-2 text-sm text-gray-500 dark:text-dark-txt">
                    Color:{' '}
                    {item && item.color ? (
                      <div
                        className="rounded-full inline-flex ml-4 h-4 w-4"
                        style={{ backgroundColor: item && item.color_hex }}
                      />
                    ) : (
                      <></>
                    )}
                  </p>
                )}
                {item && item.size && (
                  <p className="text-gray-500 mt-2 dark:text-dark-txt">
                    <span>Size: </span>
                    {item.size ? item && item.size_name : <></>}
                  </p>
                )}
                {item && item.material && (
                  <p className="text-gray-500 mt-2 dark:text-dark-txt">
                    <span>Material: </span>
                    {item.material ? item && item.material_name : <></>}
                  </p>
                )}
              </span>
              <span className="ml-4 flex-shrink-0">
                <p className="font-bold dark:text-white">Order Summary</p>
                <div className="pt-1 sm:grid sm:grid-cols-2 ">
                  <div className="text-sm font-medium dark:text-dark-txt text-gray-700">
                    Item(s) Subtotal:
                  </div>
                  <div className="mt-1 ml-8 text-sm text-gray-900 dark:text-dark-txt-secondary sm:mt-0">
                    USD {sub_total}
                  </div>
                </div>
                <div className=" sm:grid sm:grid-cols-2 ">
                  <div className="text-sm font-medium dark:text-dark-txt text-gray-700">
                    Shipping & Handling:
                  </div>
                  <div className="mt-1 ml-8 text-sm text-gray-900 dark:text-dark-txt-secondary sm:mt-0">
                    USD {shipping_total}
                  </div>
                </div>
                <div className=" sm:grid sm:grid-cols-2 ">
                  <div className="text-sm font-medium dark:text-dark-txt text-gray-700">
                    Estimate before tax:
                  </div>
                  <div className="mt-1 ml-8 text-sm text-gray-900 dark:text-dark-txt-secondary sm:mt-0">
                    USD {estimated_tax}
                  </div>
                </div>
                <div className=" sm:grid sm:grid-cols-2 ">
                  <div className="text-sm font-medium dark:text-dark-txt text-gray-700">
                    Estimated tax to be:
                  </div>
                  <div className="mt-1 ml-8 text-sm text-gray-900 dark:text-dark-txt-secondary sm:mt-0">
                    USD {tax}
                  </div>
                </div>
                <div className=" sm:grid sm:grid-cols-2 ">
                  <div className="text-sm font-bold dark:text-dark-txt text-gray-700">
                    Grand total:
                  </div>
                  <div className="mt-1 ml-8 text-sm text-gray-900 dark:text-dark-txt-secondary sm:mt-0">
                    USD {grand_total}
                  </div>
                </div>
                {/* <div className=" sm:grid sm:grid-cols-2 ">
                <div className="text-sm font-bold text-gray-700">Payment Grand total:</div>
                <div className="mt-1 ml-8 text-sm text-gray-900  sm:mt-0">
                  <img className="h-4 w-4 inline-flex" src="/assets/img/eth.png" />{' '}
                  {payment_grand_total}
                </div>
              </div> */}
              </span>
            </dd>
          </div>
        </div>

        <div className="border-t border-gray-200 py-6 px-4 sm:px-6 ">
          <div className="" aria-hidden="true">
            <div className="hidden sm:grid grid-cols-4 text-sm font-medium text-gray-600 dark:text-dark-txt">
              <div
                className={classNames(
                  item && item.status === 'not_processed'
                    ? 'text-gray-600 rounded-full bg-gray-300'
                    : '',
                  'text-center',
                )}
              >
                Order placed
              </div>
              <div
                className={classNames(
                  item && item.status === 'processing'
                    ? 'text-blue-600 rounded-full bg-blue-300'
                    : '',
                  'text-center',
                )}
              >
                Processing
              </div>
              <div
                className={classNames(
                  item && item.status === 'shipping'
                    ? 'text-blue-600 rounded-full bg-blue-300'
                    : '',
                  'text-center',
                )}
              >
                Shipping
              </div>
              <div
                className={classNames(
                  item && item.status === 'delivered'
                    ? 'text-green-600 rounded-full bg-green-300'
                    : '',
                  'text-center',
                )}
              >
                Delivered
              </div>
            </div>
          </div>
        </div>
      </div>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-100"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-75"
            leaveFrom="opacity-75"
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
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg dark:bg-dark-bg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                  <div>
                    <div className=" ">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 dark:text-dark-txt text-gray-900"
                      >
                        Track your product
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm dark:text-dark-txt-secondary text-gray-500">
                          Tracking Number: {item && item.tracking_number}
                        </p>
                        <p className="text-sm dark:text-dark-txt-secondary text-gray-500">
                          Tracking Link: {item && item.tracking_url}
                        </p>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      <Transition.Root show={openDeliveryAddress} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpenDeliveryAddress}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-100"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-75"
            leaveFrom="opacity-75"
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
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg dark:bg-dark-bg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                  <dt className="font-medium text-gray-900 dark:text-white">Delivery address</dt>
                  <dd className="mt-3 text-gray-500 dark:text-dark-txt">
                    <span className="block">
                      Address1:{' '}
                      <span className="dark:text-dark-txt-secondary">
                        {item && item.address_line_1}
                      </span>
                    </span>
                    <span className="block">
                      Address 2:{' '}
                      <span className="dark:text-dark-txt-secondary">
                        {item && item.address_line_2 ? item.address_line_2 : ''}
                      </span>
                    </span>
                    <p>
                      Shipping:{' '}
                      <span className="dark:text-dark-txt-secondary">
                        {item && item.shipping_name}
                      </span>
                    </p>
                    <p>
                      Time to delivery:{' '}
                      <span className="dark:text-dark-txt-secondary">
                        {item && item.shipping_time} Days
                      </span>
                    </p>
                    <p>
                      Phone Number:{' '}
                      <span className="dark:text-dark-txt-secondary">
                        {item && item.telephone_number}
                      </span>
                    </p>
                  </dd>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
