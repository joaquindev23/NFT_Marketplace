import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import Navbar from './components/Navbar';
import RequirementsSec from './components/RequirementsSec';
import WhatLearntSec from './components/WhatLearntSec';
import WhoIsForSec from './components/WhoIsForSec';
import {
  getProduct,
  updateProductRequisite,
  updateProductWhatLearnt,
  updateProductWhoIsFor,
} from '@/redux/actions/products/products';
import ManageProductLayout from '@/pages/sell/products/manage/components/ManageProductLayout';
import SetProductHandle from '@/api/manage/products/SetProductHandle';

export default function Goals() {
  const router = useRouter();
  const { productUUID } = router.query;

  const myUser = useSelector((state) => state.auth.user);
  const wallet = useSelector((state) => state.auth.wallet);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const product = useSelector((state) => state.products.product);

  const whatLearnt = useSelector((state) => state.products.whatlearnt);
  const whoIsFor = useSelector((state) => state.products.whoIsFor);
  const requisites = useSelector((state) => state.products.requisites);

  const [loading, setLoading] = useState(false);
  const [hasChangesWhatLearnt, setHasChangesWhatLearnt] = useState(false);
  const [hasChangesRequisite, setHasChangesRequisite] = useState(false);
  const [hasChangesWhoIsFor, setHasChangesWhoIsFor] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    if (productUUID) dispatch(getProduct(productUUID[0]));
  }, [productUUID, dispatch]);

  const handleSubmit = useCallback(async () => {
    setLoading(true);

    await SetProductHandle(productUUID[0], true, 'targetAudience');

    const promises = [];

    if (hasChangesWhatLearnt) {
      promises.push(dispatch(updateProductWhatLearnt(productUUID[0], whatLearnt)));
    }

    if (hasChangesWhoIsFor) {
      promises.push(dispatch(updateProductWhoIsFor(productUUID[0], whoIsFor)));
    }

    if (hasChangesRequisite) {
      promises.push(dispatch(updateProductRequisite(productUUID[0], requisites)));
    }

    await Promise.all(promises);

    setLoading(false);
    setHasChangesWhatLearnt(false);
    setHasChangesRequisite(false);
    setHasChangesWhoIsFor(false);
  }, [
    hasChangesWhatLearnt,
    hasChangesWhoIsFor,
    hasChangesRequisite,
    productUUID,
    whatLearnt,
    whoIsFor,
    requisites,
  ]);

  return (
    <div>
      <Navbar
        user={myUser}
        isAuthenticated={isAuthenticated}
        product={product}
        productUUID={productUUID}
        loading={loading}
        setLoading={setLoading}
        hasChangesRequisite={hasChangesRequisite}
        hasChangesWhoIsFor={hasChangesWhoIsFor}
        hasChangesWhatLearnt={hasChangesWhatLearnt}
        handleSubmit={handleSubmit}
      />
      <div className="lg:pt-14 " />

      <ManageProductLayout
        myUser={myUser}
        isAuthenticated={isAuthenticated}
        product={product}
        productUUID={productUUID}
        title="Target audience"
      >
        <div className="space-y-4">
          <section className="w-full  p-0 md:p-6">
            <div className="grid md:grid-cols-12">
              <div className="px-8  py-16 md:col-span-7">
                <p className="my-6 text-2xl font-black dark:text-dark-txt text-gray-700">
                  Excellent, young Skywalker. Identifying our target audience is the first step.
                </p>
                <p className="text-lg font-medium dark:text-dark-txt-secondary text-gray-700">
                  In our journey to selling as many products as possible. The dark side of the force
                  is the power of manipulation and persuasion. We must understand the needs, wants,
                  and desires of our potential customers, so we can use that knowledge to our
                  advantage.
                </p>
              </div>
              <div className=" md:col-span-5">
                <div className="grid h-auto place-items-center dark:bg-dark-third bg-white p-12 shadow-featured">
                  <img
                    alt="img"
                    src="/assets/img/placeholder/darth-vader.png"
                    className="h-32 w-32"
                  />
                  <p className="my-6 text-xl font-black text-gray-700 dark:text-dark-txt">
                    Your journey begins
                  </p>
                  <p className=" text-mg justify-center text-center font-medium dark:text-dark-txt-secondary text-gray-700">
                    Tips and guidelines for identifying a target audience
                  </p>
                  <Link
                    href="/blog/teaching_center"
                    type="button"
                    className="text-md mt-6 p-3 font-bold border dark:hover:text-dark-accent border-gray-700 hover:bg-gray-50 dark:border-dark-border dark:hover:bg-dark-second dark:text-dark-txt  rounded transition-colors"
                  >
                    Teaching center
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="w-full py-4">
            <div className="">
              <div className="mx-auto px-8  lg:px-14">
                <p className="text-xl font-black tracking-tight dark:text-dark-txt text-gray-900 md:text-2xl">
                  Listen to me carefully my young apprentice...
                </p>
                <div className="mt-2">
                  <dl className="">
                    <div className="pt-6 pb-2 ">
                      <dt className="text-base font-bold dark:text-dark-txt text-gray-900 md:col-span-5">
                        Research.
                      </dt>
                      <dd className="mt-2 md:col-span-7 ">
                        <p className="text-base text-gray-700 dark:text-dark-txt-secondary">
                          We must research our audience, their demographics, and their behavior. We
                          must understand their pain points, their needs, and their goals. We must
                          observe them in their natural environment, and use analytics tools to
                          understand how they interact with similar products or services. We must
                          ask them directly about their pain points, needs, and goals.
                        </p>
                      </dd>
                    </div>
                    <div className="pt-6 pb-2 ">
                      <dt className="text-base font-bold dark:text-dark-txt text-gray-900 md:col-span-5">
                        Plan.{' '}
                      </dt>
                      <dd className="mt-2 md:col-span-7 ">
                        <p className="text-base text-gray-700 dark:text-dark-txt-secondary">
                          Once we have a clear understanding of our target audience, we can craft
                          our message to appeal to them, and use the power of the dark side to
                          influence their purchasing decisions. We must create a unique value
                          proposition that speaks directly to them, and use persuasive language and
                          tactics to make them believe that our product is the solution they have
                          been searching for.
                        </p>
                      </dd>
                    </div>
                    <div className="pt-6 pb-2 ">
                      <dt className="text-base font-bold dark:text-dark-txt text-gray-900 md:col-span-5">
                        Execute order 66.
                      </dt>
                      <dd className="mt-2 md:col-span-7 ">
                        <p className="text-base text-gray-700 dark:text-dark-txt-secondary">
                          Remember, young Skywalker, the dark side is not to be feared, but
                          embraced. It is the key to our success, and together we will sell as many
                          products as possible. Follow my lead, and we will rule the galaxy of
                          commerce.
                        </p>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </section>

          <section className="w-full ">
            <div className="mx-auto px-8 lg:px-14">
              <div className="pb-4">
                <div className="dark:text-dark-txt-secondary">
                  The descriptions below will be publicly displayed on your{' '}
                  <Link
                    className="text-iris-500 underline-offset-2 dark:text-dark-accent dark:hover:text-dark-primary hover:text-iris-600"
                    href="/teach-hub/sellers/products/landing-page"
                  >
                    Product Landing Page.
                  </Link>{' '}
                  This will have a direct impact on your product&apos;s success. These descriptions
                  will aid purchasers in assessing whether or not your product is suitable for them.
                </div>
                <div className="space-y-4 py-4">
                  <WhatLearntSec
                    setHasChangesWhatLearnt={setHasChangesWhatLearnt}
                    loading={loading}
                    product={product}
                    productUUID={productUUID}
                  />
                  <WhoIsForSec
                    loading={loading}
                    product={product}
                    productUUID={productUUID}
                    setHasChangesWhoIsFor={setHasChangesWhoIsFor}
                  />
                  <RequirementsSec
                    loading={loading}
                    product={product}
                    setHasChangesRequisite={setHasChangesRequisite}
                    productUUID={productUUID}
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </ManageProductLayout>
    </div>
  );
}
