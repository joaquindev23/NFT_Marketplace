import { useRouter } from 'next/router';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import Navbar from './components/Navbar';
import { getProduct } from '@/redux/actions/products/products';
import ManageProductLayout from '@/pages/sell/products/manage/components/ManageProductLayout';
import SetProductHandle from '@/api/manage/products/SetProductHandle';

export default function Warehousing() {
  const router = useRouter();
  const { productUUID } = router.query;

  const myUser = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const product = useSelector((state) => state.products.product);

  const dispatch = useDispatch();

  const fetchProduct = useCallback(async () => {
    await SetProductHandle(productUUID[0], true, 'warehousing');
    dispatch(getProduct(productUUID));
  }, [dispatch, productUUID]);

  useEffect(() => {
    if (productUUID && product && product.details && product.details.warehousing_bool === false) {
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
        title="Warehousing"
      >
        <div className="space-y-4">
          <section className="w-full  p-0 md:p-6">
            <div className="grid md:grid-cols-12">
              <div className="px-8  py-16 md:col-span-7">
                <p className="my-6 text-2xl font-black dark:text-dark-txt text-gray-700">
                  Warehousing, young Skywalker, is an essential component of a successful product
                  launch and supply chain management.
                </p>
                <p className="text-lg font-medium dark:text-dark-txt-secondary text-gray-700">
                  It involves strategically storing and managing inventory in a safe and secure
                  location, ready for distribution to customers in the galaxy.
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
                    Expand your knowledge
                  </p>
                  <p className=" text-mg justify-center text-center font-medium dark:text-dark-txt-secondary text-gray-700">
                    Young padawan
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
                        Master Warehousing.
                      </dt>
                      <dd className="mt-2 md:col-span-7 ">
                        <p className="text-base text-gray-700 dark:text-dark-txt-secondary">
                          In order to rule the galaxy, we must master the art of warehousing. We
                          must identify our warehousing needs and choose the right location for our
                          base of operations, one that is easily accessible for both us and our
                          customers. We must invest in a warehouse management system that can help
                          us track and manage inventory, automate processes, and improve efficiency.
                        </p>
                      </dd>
                    </div>
                    <div className="pt-6 pb-2 ">
                      <dt className="text-base font-bold dark:text-dark-txt text-gray-900 md:col-span-5">
                        Safety and Security.
                      </dt>
                      <dd className="mt-2 md:col-span-7 ">
                        <p className="text-base text-gray-700 dark:text-dark-txt-secondary">
                          We must also implement safety and security measures to protect our
                          inventory and comply with the regulations of the galaxy. We must optimize
                          the layout of our warehouse to improve efficiency and reduce costs by
                          using vertical storage and implementing a FIFO (first in, first out)
                          system. We must maintain accurate inventory records to ensure that we
                          always have the right products in stock and can quickly fulfill customer
                          orders.
                        </p>
                      </dd>
                    </div>
                    <div className="pt-6 pb-2 ">
                      <dt className="text-base font-bold dark:text-dark-txt text-gray-900 md:col-span-5">
                        Automation.
                      </dt>
                      <dd className="mt-2 md:col-span-7 ">
                        <p className="text-base text-gray-700 dark:text-dark-txt-secondary">
                          We must also use automation to help us speed up the process of order
                          fulfillment, reduce errors and increase accuracy. And we must continuously
                          monitor and improve our warehouse processes to ensure that they are
                          efficient and cost-effective.
                        </p>
                      </dd>
                    </div>
                    <div className="pt-6 pb-2 ">
                      <dd className="mt-2 md:col-span-7 ">
                        <p className="text-base text-gray-700 dark:text-dark-txt-secondary">
                          Remember, young Skywalker, in order to rule the galaxy, we must have
                          control over our inventory and be able to quickly fulfill customer orders.
                          An efficient warehousing strategy will give us that control and ensure our
                          success. Together, we will master the art of warehousing and our empire
                          will thrive.
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
