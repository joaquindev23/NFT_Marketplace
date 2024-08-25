import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Popover, RadioGroup } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';
// import { ListBulletIcon, AcademicCapIcon, BuildingLibraryIcon } from '@heroicons/react/24/outline';

import Navbar from '../components/Navbar';
import { setProductStep4 } from '@/redux/actions/create/create';
import { createProduct } from '@/redux/actions/products/products';
// import { setCourseStep1 } from '../../../../redux/actions/create/create';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function CreateProduct4() {
  const router = useRouter();
  const [selected, setSelected] = useState(null);
  const dispatch = useDispatch();
  const handleChange = (plan) => {
    setSelected(plan);
    dispatch(setProductStep4(plan.name));
  };

  const wallet = useSelector((state) => state.auth.wallet);
  const myUser = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const businessActivity = useSelector((state) => state.create.business_activity);
  const type = useSelector((state) => state.create.product_type);
  const category = useSelector((state) => state.create.product_category);
  const title = useSelector((state) => state.create.product_title);
  const product = useSelector((state) => state.products.product);

  // useEffect(() => {
  //   if (product) {
  //     router.push(`/sell/products/manage/goals/${product.id}`);
  //   }
  // }, [product]);

  const plans = [
    {
      id: '1',
      disabled: false,
      name: 'Normal',
      type: 'B2C',
      description: 'Sell anything that does not require a permit.',
      title: 'I want to sell this product.',
    },
    {
      id: '2',
      disabled: false,
      name: 'Export',
      type: 'B2B',
      description: 'Example: 100~ units of product.',
      title: 'I want to export this product in bulk.',
    },
    {
      id: '3',
      disabled: true,
      name: 'Controlled Substance',
      type: 'B2C',
      description: 'Example: THC and CBD products.',
      title: 'I have a permit to sell this product.',
    },
    {
      id: '4',
      disabled: true,
      name: 'Controlled Substance Export',
      type: 'B2B',
      description: 'Example: Cannabis flower measured in kilograms.',
      title: 'I have a permit to sell and export this product.',
    },
  ];

  useEffect(() => {
    if (!isAuthenticated || (!type && myUser && myUser.role !== 'seller')) {
      router.push('/');
    }
  }, []);

  return (
    <div className="dark:bg-dark-main">
      <Navbar myUser={myUser} title="Step 4 of 4" />
      <div className="overflow-hidden  bg-gray-200">
        <div className="h-1 dark:bg-dark-primary bg-purple-800" style={{ width: '100%' }} />
      </div>
      <div className="grid w-full place-items-center py-14">
        <h2 className="font-bold mx-12 text-xl dark:text-dark-txt md:mx-0 md:text-2xl">
          What path shall you choose, young Skywalker?
        </h2>
        <p className="font-regular mx-12 mt-4 text-sm md:mx-0 dark:text-dark-txt-secondary md:text-lg">
          Will you sell your product to the masses, or will you supply it to other businesses?
        </p>
        <p className="font-regular mx-12 mt-4 text-sm md:mx-0 dark:text-dark-txt-secondary md:text-lg">
          Will you seek permits to sell controlled substances?
        </p>
        <div className="mt-12 pb-20">
          <fieldset>
            <legend className="sr-only">Plan</legend>

            <RadioGroup value={selected} onChange={handleChange}>
              <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
              <div className="space-y-2">
                {plans.map((plan) => (
                  <RadioGroup.Option
                    key={plan.name}
                    value={plan}
                    disabled={plan.disabled}
                    className={({ active, checked }) =>
                      classNames(
                        'relative block cursor-pointer border px-6 py-4 focus:outline-none sm:flex sm:justify-between transition-colors duration-200 ease-in',
                        checked || active
                          ? 'border-gray-700 bg-blue-100 dark:bg-blue-800 dark:border-blue-500 focus:border-blue-500'
                          : 'border-gray-300 dark:border-dark-border dark:bg-dark-bg',
                      )
                    }
                  >
                    {({ active, checked }) => (
                      <>
                        <span className="flex items-center">
                          <span className="flex flex-col space-y-1 text-sm">
                            <RadioGroup.Label
                              as="span"
                              className={`
                  ${
                    plan.disabled
                      ? 'text-lg font-bold text-gray-300 dark:text-dark-second'
                      : 'text-lg font-bold text-gray-900 dark:text-dark-txt'
                  }
                  `}
                            >
                              {plan.title}
                            </RadioGroup.Label>
                            <RadioGroup.Description
                              as="span"
                              className={`${
                                plan.disabled
                                  ? 'text-md text-gray-300 dark:text-dark-second'
                                  : 'text-md text-gray-600 dark:text-dark-txt-secondary'
                              }`}
                            >
                              <span className="block sm:inline">{plan.type}</span>{' '}
                              <span className="hidden sm:mx-1 sm:inline" aria-hidden="true">
                                &middot;
                              </span>{' '}
                              <span className="block sm:inline">{plan.description}</span>
                            </RadioGroup.Description>
                          </span>
                        </span>
                        <RadioGroup.Description
                          as="span"
                          className="mt-2 flex text-sm sm:mt-0 sm:ml-4 sm:flex-col sm:text-right"
                        >
                          <span className="select-none font-medium text-transparent">.</span>
                          <span
                            className={`${
                              plan.disabled
                                ? 'text-gray-300 dark:text-dark-second'
                                : 'text-gray-500 dark:text-dark-txt-secondary'
                            }ml-1 mt-2.5 sm:ml-0 dark:text-dark-txt-secondary`}
                          >
                            {plan.name}
                          </span>
                        </RadioGroup.Description>
                        <span
                          className={classNames(
                            checked ? 'border-gray-600' : 'border-transparent',
                            'pointer-events-none absolute -inset-px',
                          )}
                          aria-hidden="true"
                        />
                      </>
                    )}
                  </RadioGroup.Option>
                ))}
              </div>
            </RadioGroup>
          </fieldset>
        </div>
      </div>

      <Popover
        as="footer"
        className={({ open }) =>
          classNames(
            open ? 'fixed inset-0 overflow-y-auto' : '',
            ' fixed inset-x-0 bottom-0 z-30 w-full border dark:border-dark-border bg-white  py-4 shadow-2xl dark:bg-dark-main dark:shadow-none lg:overflow-y-visible',
          )
        }
      >
        <div className="px-8 sm:flex sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => {
              router.back();
            }}
            className="text-lg font-medium leading-6 dark:text-dark-txt text-gray-900"
          >
            Previous
          </button>
          <div className="mt-3 sm:mt-0 sm:ml-4">
            {businessActivity ? (
              <button
                type="button"
                onClick={() => {
                  dispatch(
                    createProduct(
                      title,
                      category,
                      businessActivity,
                      type,
                      myUser,
                      wallet.address,
                      wallet.polygon_address,
                    ),
                  );
                }}
                className={classNames(
                  'text-md inline-flex items-center px-4 py-3 font-black',
                  'border border-transparent',
                  'bg-dark text-white hover:bg-gray-700',
                  'dark:bg-dark-primary dark:hover:bg-dark-accent',
                )}
              >
                Create Product
              </button>
            ) : (
              <div className="text-md inline-flex select-none items-center border border-transparent bg-gray-300 px-4 py-3 font-black text-white dark:bg-dark-third dark:text-dark-txt">
                Create Product
              </div>
            )}
          </div>
        </div>
      </Popover>
    </div>
  );
}
