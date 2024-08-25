import { useRouter } from 'next/router';
import { Dialog, RadioGroup, Transition } from '@headlessui/react';
import {
  BanknotesIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  TicketIcon,
} from '@heroicons/react/24/outline';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import CircleLoader from 'react-spinners/CircleLoader';
import { useDispatch, useSelector } from 'react-redux';
import ManageCourseLayout from '../components/ManageCourseLayout';
import Navbar from '../course_structure/components/Navbar';
import CreateCoupon from '@/api/manage/promotions/coupons/Create';
import DeleteCoupon from '@/api/manage/promotions/coupons/Delete';
import StandardPagination from '@/components/pagination/StandardPagination';
import ListCouponsPaginated from '@/api/manage/promotions/coupons/ListPage';
import SetCourseHandle from '@/api/manage/courses/SetCourse';
import { getCourse } from '@/redux/actions/courses/courses';
import Button from '@/components/Button';

const couponTypes = [
  {
    id: 1,
    title: 'Fixed Price',
    description: 'Fixed amount discount on product price.',
    users: 'Example: $ 20',
  },
  {
    id: 2,
    title: 'Percentage',
    description: 'Fixed percentage discount based on price',
    users: 'Example: 20%',
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Promotions() {
  const router = useRouter();
  const { courseUUID } = router.query;

  const course = useSelector((state) => state.courses.course);
  const myUser = useSelector((state) => state.auth.user);
  const wallet = useSelector((state) => state.auth.wallet);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const dispatch = useDispatch();

  const fetchCourse = useCallback(async () => {
    if (courseUUID && course && course.details && course.details.promotions === false) {
      await SetCourseHandle(courseUUID[0], true, 'promotions');
    }
    dispatch(getCourse(courseUUID));
  }, [dispatch, courseUUID]);

  useEffect(() => {
    if (courseUUID) {
      fetchCourse(courseUUID);
    }
  }, [fetchCourse, courseUUID]);

  const [coupons, setCoupons] = useState([]);
  const [count, setCount] = useState([]);
  const [pageSize, setPageSize] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPageSize, setMaxPageSize] = useState(100);

  // const fetchCourse = useCallback(() => {
  //   dispatch(getCourse(courseUUID));
  // }, [dispatch, courseUUID]);

  const fetchCouponsCallback = useCallback(
    async (page) => {
      const res = await ListCouponsPaginated(page, pageSize, maxPageSize, 'courses', courseUUID[0]);
      if (res.status === 200) {
        setCoupons(res.data.results);
        setCount(res.data.count);
      }
    },
    [courseUUID, pageSize, maxPageSize],
  );

  useEffect(() => {
    if (courseUUID) {
      fetchCouponsCallback(currentPage);
    }
  }, [fetchCouponsCallback, courseUUID, currentPage]);

  const [openDiscount, setOpenDiscount] = useState(false);

  const [loadingCoupon, setLoadingCoupon] = useState(false);

  const [selectedCouponType, setSelectedCouponType] = useState(null);

  const [formDataCoupon, setFormDataCoupon] = useState({
    couponName: '',
    couponUses: '',
    discountPrice: null,
    discountPercentage: null,
  });

  const { couponName, couponUses, discountPrice, discountPercentage } = formDataCoupon;

  const onChangeCoupon = (e) => {
    setFormDataCoupon({ ...formDataCoupon, [e.target.name]: e.target.value });
  };

  const handleDeleteCoupon = async (coupon) => {
    setLoadingCoupon(true);
    await DeleteCoupon(coupon.id);
    fetchCouponsCallback(currentPage);
    setLoadingCoupon(false);
  };

  const onSubmitCoupon = async (e) => {
    e.preventDefault();

    setLoadingCoupon(true);

    const result = await CreateCoupon(
      couponName,
      couponUses,
      discountPrice,
      discountPercentage,
      'courses',
      courseUUID,
    );

    if (!result.error) {
      await fetchCouponsCallback(currentPage);

      setOpenDiscount(false);

      setFormDataCoupon({
        couponName: '',
        couponUses: '',
        discountPrice: null,
        discountPercentage: null,
      });
    } else {
      // Handle the error as you need, for example:
      console.log('Error while creating coupon:', result.error);
    }
    setLoadingCoupon(false);
  };

  return (
    <div>
      <Navbar user={myUser} course={course} courseUUID={courseUUID} />
      <div className="lg:pt-14 " />
      <ManageCourseLayout
        myUser={myUser}
        isAuthenticated={isAuthenticated}
        wallet={wallet}
        course={course}
        fetchCourse={fetchCourse}
        courseUUID={courseUUID}
        title="Promotions"
      >
        <div className="-mb-6 h-auto w-full ">
          {/* Discount Coupons */}
          <div className=" sm:flex sm:items-center sm:justify-between">
            <p className="text-xl font-bold leading-6 text-gray-900 dark:text-dark-txt">
              Discount Coupons
            </p>
            <div className="mt-3 flex sm:mt-0 sm:ml-4">
              <button
                type="button"
                onClick={() => setOpenDiscount(true)}
                className="inline-flex items-center border border-transparent hover:dark:bg-dark-accent dark:bg-dark-primary bg-black px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-gray-900 "
              >
                Create Discount
              </button>
              {/* Add Discount */}
              <Transition.Root show={openDiscount} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={setOpenDiscount}>
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="fixed inset-0  bg-gray-500 bg-opacity-75 transition-opacity" />
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
                        <Dialog.Panel className="relative transform overflow-hidden rounded-lg dark:bg-dark-bg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6">
                          <form onSubmit={onSubmitCoupon} className="space-y-2">
                            <div className="relative rounded-md">
                              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <DocumentTextIcon
                                  className="h-5 w-5 text-gray-400 dark:text-dark-txt"
                                  aria-hidden="true"
                                />
                              </div>
                              <input
                                name="couponName"
                                value={couponName}
                                onChange={(e) => onChangeCoupon(e)}
                                type="text"
                                required
                                className="ring-none w-full border dark:border-dark-border border-gray-700 py-3 outline-none dark:bg-dark-second pl-10 focus:border-gray-500 focus:outline-transparent focus:ring-transparent"
                                placeholder="Coupon Name, Ex: 20OFF"
                              />
                            </div>
                            <div className="relative rounded-md py-2">
                              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <TicketIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                              </div>
                              <input
                                name="couponUses"
                                value={couponUses}
                                onChange={(e) => onChangeCoupon(e)}
                                type="number"
                                required
                                className="ring-none w-full border dark:border-dark-border border-gray-700 py-3 outline-none dark:bg-dark-second pl-10 focus:border-gray-500 focus:outline-transparent focus:ring-transparent"
                                placeholder="Number of Uses"
                              />
                            </div>

                            <RadioGroup value={selectedCouponType} onChange={setSelectedCouponType}>
                              <RadioGroup.Label className="text-lg font-bold dark:text-dark-txt text-gray-900">
                                Select a coupon
                              </RadioGroup.Label>

                              <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4">
                                {couponTypes.map((mailingList) => (
                                  <RadioGroup.Option
                                    key={mailingList.id}
                                    value={mailingList}
                                    className={({ checked, active }) =>
                                      classNames(
                                        checked
                                          ? 'border-transparent'
                                          : 'border-gray-300 dark:border-dark-border',
                                        active
                                          ? 'border-purple-500 ring-2 ring-purple-500 dark:border-dark-primary dark:ring-dark-primary'
                                          : '',
                                        'relative flex cursor-pointer rounded-lg border p-4 shadow-sm focus:outline-none',
                                        'bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-txt',
                                      )
                                    }
                                  >
                                    {({ checked, active }) => (
                                      <>
                                        <span className="flex flex-1">
                                          <span className="flex flex-col">
                                            <RadioGroup.Label
                                              as="span"
                                              className="block text-sm font-medium dark:text-dark-txt text-gray-900"
                                            >
                                              {mailingList.title}
                                            </RadioGroup.Label>
                                            <RadioGroup.Description
                                              as="span"
                                              className="mt-1 flex items-center text-sm dark:text-dark-txt-secondary text-gray-500"
                                            >
                                              {mailingList.description}
                                            </RadioGroup.Description>
                                            <RadioGroup.Description
                                              as="span"
                                              className="font-sm mt-6 text-sm text-gray-700 dark:text-dark-txt-secondary"
                                            >
                                              {mailingList.users}
                                            </RadioGroup.Description>
                                          </span>
                                        </span>
                                        <CheckCircleIcon
                                          className={classNames(
                                            !checked ? 'invisible' : '',
                                            'h-5 w-5 text-purple-600',
                                          )}
                                          aria-hidden="true"
                                        />
                                        <span
                                          className={classNames(
                                            active ? 'border' : 'border-2',
                                            checked ? 'border-purple-500' : 'border-transparent',
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

                            {selectedCouponType === null ||
                              (selectedCouponType.id === 1 && (
                                <div className="relative rounded-md shadow-sm">
                                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <BanknotesIcon
                                      className="h-5 w-5 text-gray-400"
                                      aria-hidden="true"
                                    />
                                  </div>
                                  <input
                                    name="discountPrice"
                                    value={discountPrice || ''}
                                    onChange={(e) => onChangeCoupon(e)}
                                    type="number"
                                    className="ring-none w-full border dark:border-dark-border border-gray-700 py-3 outline-none dark:bg-dark-second pl-10 focus:border-gray-500 focus:outline-transparent focus:ring-transparent"
                                    placeholder="Discount Amount in $USD"
                                  />
                                </div>
                              )) ||
                              (selectedCouponType.id === 2 && (
                                <div className="relative rounded-md shadow-sm">
                                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <BanknotesIcon
                                      className="h-5 w-5 text-gray-400"
                                      aria-hidden="true"
                                    />
                                  </div>
                                  <input
                                    name="discountPercentage"
                                    value={discountPercentage || ''}
                                    onChange={(e) => onChangeCoupon(e)}
                                    type="number"
                                    className="ring-none w-full border dark:border-dark-border border-gray-700 py-3 outline-none dark:bg-dark-second pl-10 focus:border-gray-500 focus:outline-transparent focus:ring-transparent"
                                    placeholder="Discount Percentage"
                                  />
                                </div>
                              )) || <div />}
                            <div className="py-1" />
                            {loadingCoupon ? (
                              <Button type="button">
                                {' '}
                                <CircleLoader loading={loadingCoupon} size={25} color="#ffffff" />
                              </Button>
                            ) : (
                              <Button type="submit">Add</Button>
                            )}
                          </form>
                        </Dialog.Panel>
                      </Transition.Child>
                    </div>
                  </div>
                </Dialog>
              </Transition.Root>
            </div>
          </div>
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="my-8 flex flex-col">
              <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle">
                  <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5">
                    <table className=" min-w-full">
                      <thead className="dark:bg-dark-second bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold dark:text-dark-txt text-gray-900 sm:pl-6 lg:pl-8"
                          >
                            Name
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold dark:text-dark-txt text-gray-900"
                          >
                            Coupon Type
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold dark:text-dark-txt text-gray-900"
                          >
                            Discount
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold dark:text-dark-txt text-gray-900"
                          >
                            Uses Left
                          </th>

                          <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8">
                            <span className="sr-only">Edit</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {coupons &&
                          coupons.map((coupon) => (
                            <tr key={coupon.id}>
                              <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium dark:text-dark-txt text-gray-900 sm:pl-6 lg:pl-8">
                                {coupon.name}
                              </td>
                              <td className="whitespace-nowrap px-3 py-3 text-sm dark:text-dark-txt-secondary text-gray-500">
                                {coupon.fixed_price_coupon ? 'Fixed Price' : 'Percentage'}
                              </td>
                              {coupon.fixed_price_coupon ? (
                                <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500 dark:text-dark-txt-secondary">
                                  $ {coupon.fixed_price_coupon.discount_price}
                                </td>
                              ) : (
                                <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500 dark:text-dark-txt-secondary">
                                  % {coupon.percentage_coupon.discount_percentage}
                                </td>
                              )}
                              <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500 dark:text-dark-txt-secondary">
                                {coupon.fixed_price_coupon && (
                                  <p className="whitespace-nowrap px-3 py-3 text-sm text-gray-500 dark:text-dark-txt-secondary">
                                    {coupon.fixed_price_coupon.uses}
                                  </p>
                                )}
                                {coupon.percentage_coupon && (
                                  <p className="whitespace-nowrap px-3 py-3 text-sm text-gray-500 dark:text-dark-txt-secondary">
                                    {coupon.percentage_coupon.uses}
                                  </p>
                                )}
                              </td>
                              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
                                {loadingCoupon ? (
                                  <CircleLoader loading={loadingCoupon} size={10} color="#1e1f48" />
                                ) : (
                                  <button
                                    type="button"
                                    onClick={async () => handleDeleteCoupon(coupon)}
                                    className="text-purple-600 dark:text-dark-accent hover:dark:text-dark-primary hover:text-purple-900"
                                  >
                                    Delete<span className="sr-only">, {coupon.name}</span>
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>

                    {coupons && coupons.length === 0 && (
                      <div className="my-4 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
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
                            d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
                          />
                        </svg>
                        <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
                          No hay Cupones
                        </p>
                        <p className="mt-1 text-sm text-gray-500 dark:text-dark-txt">
                          Add discounts to your course.
                        </p>
                      </div>
                    )}

                    {/* {count <= pageSize ? (
                      <div />
                    ) : (
                      )} */}
                    <StandardPagination
                      data={coupons}
                      count={count}
                      pageSize={pageSize}
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ManageCourseLayout>
    </div>
  );
}
