import { useRouter } from 'next/router';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import Navbar from './components/Navbar';
import { getProduct } from '@/redux/actions/products/products';
import ManageProductLayout from '@/pages/sell/products/manage/components/ManageProductLayout';
import SetProductHandle from '@/api/manage/products/SetProductHandle';

export default function Delivery() {
  const router = useRouter();
  const { productUUID } = router.query;

  const myUser = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const product = useSelector((state) => state.products.product);

  const dispatch = useDispatch();

  const fetchProduct = useCallback(async () => {
    await SetProductHandle(productUUID[0], true, 'delivery');
    dispatch(getProduct(productUUID));
  }, [dispatch, productUUID]);

  useEffect(() => {
    if (productUUID && product && product.details && product.details.delivery_bool === false) {
      fetchProduct(productUUID[0]);
    }
  }, [fetchProduct, productUUID, product]);

  return (
    <div>
      <Navbar
        user={myUser}
        isAuthenticated={isAuthenticated}
        product={product}
        productUUID={productUUID}
      />
      <div className="lg:pt-14 " />

      <ManageProductLayout
        myUser={myUser}
        isAuthenticated={isAuthenticated}
        product={product}
        productUUID={productUUID}
        title="Prepare for delivery"
      >
        <div className="space-y-4">
          <section className="w-full  p-0 md:p-6">
            <div className="grid md:grid-cols-12">
              <div className="px-8  py-16 md:col-span-7">
                <p className="my-6 text-2xl font-black dark:text-dark-txt text-gray-700">
                  Delivery, young Skywalker, is a crucial aspect of any product launch and can
                  greatly impact the success of a business, especially for small businesses.{' '}
                </p>
                <p className="text-lg font-medium dark:text-dark-txt-secondary text-gray-700">
                  Efficient delivery can lead to increased customer satisfaction and encourage
                  repeat business, whereas poor delivery can lead to negative customer experiences
                  and lost sales.
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
                    Our library of resources
                  </p>
                  <p className=" text-mg justify-center text-center font-medium dark:text-dark-txt-secondary text-gray-700">
                    Tips and guidelines for creating a sellable product{' '}
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
                <div className="mt-2">
                  <dl className="">
                    <div className="pt-6 pb-2 ">
                      <dt className="text-base font-bold dark:text-dark-txt text-gray-900 md:col-span-5">
                        Understand Customer Experience.
                      </dt>
                      <dd className="mt-2 md:col-span-7 ">
                        <p className="text-base text-gray-700 dark:text-dark-txt-secondary">
                          In order to rule the galaxy, we must be the best at delivery. We must
                          understand that the customer&apos;s experience doesn&apos;t end when they
                          make a purchase, but when they receive the product and are satisfied with
                          it. We must take control of the delivery process and make sure that it is
                          seamless, efficient, and timely.
                        </p>
                      </dd>
                    </div>
                    <div className="pt-6 pb-2 ">
                      <dt className="text-base font-bold dark:text-dark-txt text-gray-900 md:col-span-5">
                        Research Shipping Partners.
                      </dt>
                      <dd className="mt-2 md:col-span-7 ">
                        <p className="text-base text-gray-700 dark:text-dark-txt-secondary">
                          We must research and choose a reliable shipping partner that can provide
                          fast and cost-effective delivery options. We must optimize our shipping
                          and handling process by streamlining our inventory management, packaging
                          and labeling procedures. We must communicate delivery options and
                          estimated arrival times to customers, so they know when to expect their
                          products. We must also have a tracking system in place that allows
                          customers to track their order and stay informed about its progress.
                        </p>
                      </dd>
                    </div>
                    <div className="pt-6 pb-2 ">
                      <dt className="text-base font-bold dark:text-dark-txt text-gray-900 md:col-span-5">
                        Fast Delivery.
                      </dt>
                      <dd className="mt-2 md:col-span-7 ">
                        <p className="text-base text-gray-700 dark:text-dark-txt-secondary">
                          We must also offer expedited shipping options for customers who need their
                          products quickly. And we must have a clear and favorable return policy
                          that encourages customers to shop with confidence.
                        </p>
                      </dd>
                    </div>
                    <div className="pt-6 pb-2 ">
                      <dd className="mt-2 md:col-span-7 ">
                        <p className="text-base text-gray-700 dark:text-dark-txt-secondary">
                          Remember, young Skywalker, delivery is not only about getting the product
                          to the customer, but also about creating a positive customer experience.
                          And in order to rule the galaxy, we must be the best at creating positive
                          customer experiences. Together, we will ensure efficient delivery, and we
                          will be able to satisfy our customers and increase their loyalty to our
                          brand.
                        </p>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </section>
        </div>
      </ManageProductLayout>
    </div>
  );
}
