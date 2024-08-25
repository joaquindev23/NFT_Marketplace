import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import Navbar from './components/Navbar';
import { getProduct, updateProductShipping } from '@/redux/actions/products/products';
import ManageProductLayout from '@/pages/sell/products/manage/components/ManageProductLayout';
import SetProductHandle from '@/api/manage/products/SetProductHandle';
import ShippingSec from './components/ShippingSec';

export default function Shipping() {
  const router = useRouter();
  const { productUUID } = router.query;

  const myUser = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const product = useSelector((state) => state.products.product);
  const shipping = useSelector((state) => state.products.shipping);
  const [loading, setLoading] = useState(false);

  const [hasChangesShipping, setHasChangesShipping] = useState(false);

  const dispatch = useDispatch();

  const fetchProduct = useCallback(async () => {
    dispatch(getProduct(productUUID));
  }, [dispatch, productUUID]);

  useEffect(() => {
    if (productUUID) {
      fetchProduct(productUUID[0]);
    }
  }, [fetchProduct, productUUID]);

  const handleSubmit = async () => {
    setLoading(true);
    if (productUUID && product && product.details && product.details.shipping_bool === false) {
      await SetProductHandle(productUUID[0], true, 'shipping');
    }

    const promises = [];

    if (hasChangesShipping) {
      promises.push(dispatch(updateProductShipping(productUUID[0], shipping)));
    }

    await Promise.all(promises);

    // setIsSaved(true);
    setLoading(false);
    if (hasChangesShipping) {
      setHasChangesShipping(false);
    }
  };

  return (
    <div>
      <Navbar
        user={myUser}
        isAuthenticated={isAuthenticated}
        product={product && product}
        productUUID={productUUID}
        loading={loading}
        hasChangesShipping={hasChangesShipping}
        setLoading={setLoading}
        handleSubmit={handleSubmit}
        fetchProduct={fetchProduct}
      />
      <div className="lg:pt-14 " />

      <ManageProductLayout
        myUser={myUser}
        isAuthenticated={isAuthenticated}
        product={product && product}
        productUUID={productUUID}
        title="Setup shipping"
      >
        <section className="w-full  p-0 md:p-6">
          <div className="grid md:grid-cols-12">
            <div className="px-8  py-16 md:col-span-7">
              <p className="my-6 text-2xl font-black dark:text-dark-txt text-gray-700">
                Shipping, young Skywalker, is the final step in the journey to unlimited power in
                the dark side of the force.
              </p>
              <p className="text-lg font-medium dark:text-dark-txt-secondary text-gray-700">
                It is the process of getting the product to the customer, and it is crucial for
                ensuring customer satisfaction and repeat business.
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
                  Ensure victory through
                </p>
                <p className=" text-mg justify-center text-center font-medium dark:text-dark-txt-secondary text-gray-700">
                  any means necessary commander!
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

        <ShippingSec
          product={product}
          loading={loading}
          setHasChangesShipping={setHasChangesShipping}
          productUUID={productUUID}
        />

        <section className="w-full py-4">
          <div className="">
            <div className="mx-auto px-8  lg:px-14">
              <div className="mt-2">
                <dl className="">
                  <div className="pt-6 pb-2 ">
                    <dt className="text-base font-bold dark:text-dark-txt text-gray-900 md:col-span-5">
                      Reasearch partners.
                    </dt>
                    <dd className="mt-2 md:col-span-7 ">
                      <p className="text-base text-gray-700 dark:text-dark-txt-secondary">
                        In order to reach unlimited power, we must master the art of shipping. We
                        must research and choose a reliable shipping partner that can provide fast
                        and cost-effective delivery options. We must optimize our shipping and
                        handling process by streamlining our inventory management, packaging and
                        labeling procedures.
                      </p>
                    </dd>
                  </div>
                  <div className="pt-6 pb-2 ">
                    <dt className="text-base font-bold dark:text-dark-txt text-gray-900 md:col-span-5">
                      Delivery options.
                    </dt>
                    <dd className="mt-2 md:col-span-7 ">
                      <p className="text-base text-gray-700 dark:text-dark-txt-secondary">
                        We must communicate delivery options and estimated arrival times to
                        customers, so they know when to expect their products. We must also have a
                        tracking system in place that allows customers to track their order and stay
                        informed about its progress.{' '}
                      </p>
                    </dd>
                  </div>
                  <div className="pt-6 pb-2 ">
                    <dt className="text-base font-bold dark:text-dark-txt text-gray-900 md:col-span-5">
                      Expedited shipping.
                    </dt>
                    <dd className="mt-2 md:col-span-7 ">
                      <p className="text-base text-gray-700 dark:text-dark-txt-secondary">
                        We must also offer expedited shipping options for customers who need their
                        products quickly. And we must have a clear and favorable return policy that
                        encourages customers to shop with confidence.
                      </p>
                    </dd>
                  </div>
                  <div className="pt-6 pb-2 ">
                    <dd className="mt-2 md:col-span-7 ">
                      <p className="text-base text-gray-700 dark:text-dark-txt-secondary">
                        Remember, young Skywalker, customer satisfaction is key to achieving
                        unlimited power. By mastering the art of shipping, we will ensure that our
                        customers are satisfied with their purchase, and that they will continue to
                        support our empire. Together, we will reach unlimited power in the dark side
                        of the force, and we will rule the galaxy for eternity.
                      </p>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>
      </ManageProductLayout>
    </div>
  );
}
