import { useRouter } from 'next/router';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import Navbar from './components/Navbar';
import { getProduct } from '@/redux/actions/products/products';
import ManageProductLayout from '@/pages/sell/products/manage/components/ManageProductLayout';
import SetProductHandle from '@/api/manage/products/SetProductHandle';

export default function ValueProposition() {
  const router = useRouter();
  const { productUUID } = router.query;

  const myUser = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const product = useSelector((state) => state.products.product);

  const dispatch = useDispatch();

  const fetchProduct = useCallback(async () => {
    await SetProductHandle(productUUID[0], true, 'marketing');
    dispatch(getProduct(productUUID));
  }, [dispatch, productUUID]);

  useEffect(() => {
    if (
      productUUID &&
      product &&
      product.details &&
      product.details.marketing_strategy_bool === false
    ) {
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
        title="Create a marketing plan"
      >
        <div className="space-y-4">
          <section className="w-full  p-0 md:p-6">
            <div className="grid md:grid-cols-12">
              <div className="px-8  py-16 md:col-span-7">
                <p className="my-6 text-2xl font-black dark:text-dark-txt text-gray-700">
                  Creating a marketing plan, young Skywalker, is the key to using the power of
                  persuasion and manipulation to achieve mass planet annihilation.
                </p>
                <p className="text-lg font-medium dark:text-dark-txt-secondary text-gray-700">
                  A marketing plan is a comprehensive document that outlines the strategies,
                  tactics, and actions necessary to achieve specific marketing objectives.
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
                    Rule the galaxy and
                  </p>
                  <p className=" text-mg justify-center text-center font-medium dark:text-dark-txt-secondary text-gray-700">
                    enrich your powers with the dark side of the force
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
                        Plan.
                      </dt>
                      <dd className="mt-2 md:col-span-7 ">
                        <p className="text-base text-gray-700 dark:text-dark-txt-secondary">
                          In order to strike the moon of Endor with the Death Star, we must master
                          the art of creating a marketing plan. We must first identify our target
                          audience and understand their needs, wants, and desires. We must research
                          our competition and identify the gaps in the market. We must conduct user
                          research to understand the needs and preferences of potential customers,
                          and use that information to create a product that is tailored to their
                          needs.
                        </p>
                      </dd>
                    </div>
                    <div className="pt-6 pb-2 ">
                      <dt className="text-base font-bold dark:text-dark-txt text-gray-900 md:col-span-5">
                        Plot.
                      </dt>
                      <dd className="mt-2 md:col-span-7 ">
                        <p className="text-base text-gray-700 dark:text-dark-txt-secondary">
                          We must also set clear and specific marketing objectives, such as
                          increasing brand awareness, generating leads, and driving sales. We must
                          then develop strategies and tactics to achieve these objectives, such as
                          advertising, public relations, content marketing, and social media
                          marketing.
                        </p>
                      </dd>
                    </div>
                    <div className="pt-6 pb-2 ">
                      <dt className="text-base font-bold dark:text-dark-txt text-gray-900 md:col-span-5">
                        Strategize.
                      </dt>
                      <dd className="mt-2 md:col-span-7 ">
                        <p className="text-base text-gray-700 dark:text-dark-txt-secondary">
                          We must also develop a budget and allocate resources to support our
                          marketing plan. We must track and measure the effectiveness of our
                          marketing efforts, and make adjustments as necessary.
                        </p>
                      </dd>
                    </div>
                    <div className="pt-6 pb-2 ">
                      <dd className="mt-2 md:col-span-7 ">
                        <p className="text-base text-gray-700 dark:text-dark-txt-secondary">
                          Remember, young Skywalker, the dark side is not to be feared, but
                          embraced. It is the key to our success. Together, we will master the art
                          of creating a marketing plan, and we will use the power of persuasion and
                          manipulation to achieve mass planet annihilation. The galaxy will tremble
                          at our power.
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
