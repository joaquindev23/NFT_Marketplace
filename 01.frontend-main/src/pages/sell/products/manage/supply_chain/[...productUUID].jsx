import { useRouter } from 'next/router';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import Navbar from './components/Navbar';
import { getProduct } from '@/redux/actions/products/products';
import ManageProductLayout from '@/pages/sell/products/manage/components/ManageProductLayout';
import SetProductHandle from '@/api/manage/products/SetProductHandle';

export default function SupplyChain() {
  const router = useRouter();
  const { productUUID } = router.query;

  const myUser = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const product = useSelector((state) => state.products.product);

  const dispatch = useDispatch();

  const fetchProduct = useCallback(async () => {
    await SetProductHandle(productUUID[0], true, 'supplyChain');
    dispatch(getProduct(productUUID));
  }, [dispatch, productUUID]);

  useEffect(() => {
    if (productUUID && product && product.details && product.details.supply_chain_bool === false) {
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
        title="Develop a supply chain"
      >
        <div className="space-y-4">
          <section className="w-full  p-0 md:p-6">
            <div className="grid md:grid-cols-12">
              <div className="px-8  py-16 md:col-span-7">
                <p className="my-6 text-2xl font-black dark:text-dark-txt text-gray-700">
                  I implore you, young Skywalker, to carefully consider the suppliers and
                  manufacturers you will align yourself with.{' '}
                </p>
                <p className="text-lg font-medium dark:text-dark-txt-secondary text-gray-700">
                  Strong relationships with them must be established in order to guarantee timely
                  delivery of materials and finished products. Such strategic alliances will be
                  crucial in your quest for success and will provide the necessary foundation for
                  your growth. Trust me, the power of a well-executed supply chain should not be
                  underestimated. Together, we can achieve greatness.
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
                <p className="text-xl font-black tracking-tight dark:text-dark-txt text-gray-900 md:text-2xl">
                  Tips
                </p>
                <div className="mt-2">
                  <dl className="">
                    <div className="pt-6 pb-2 ">
                      <dt className="text-base font-bold dark:text-dark-txt text-gray-900 md:col-span-5">
                        Size and weight.
                      </dt>
                      <dd className="mt-2 md:col-span-7 ">
                        <p className="text-base text-gray-700 dark:text-dark-txt-secondary">
                          How large or small is your product and how much does it weigh? This
                          information is important for customers who may have limited space or need
                          to transport the product.
                        </p>
                      </dd>
                    </div>
                    <div className="pt-6 pb-2 ">
                      <dt className="text-base font-bold dark:text-dark-txt text-gray-900 md:col-span-5">
                        Materials.
                      </dt>
                      <dd className="mt-2 md:col-span-7 ">
                        <p className="text-base text-gray-700 dark:text-dark-txt-secondary">
                          What materials are used to make your product? This information can affect
                          the durability, quality, and overall appearance of your product.{' '}
                          <Link
                            className="text-purple-700 dark:text-dark-accent dark:hover:text-dark-primary underline underline-offset-4 hover:text-purple-800"
                            href="/teach-hub/instructors/courses/course-creation-outline"
                          >
                            Learn more
                          </Link>
                        </p>
                      </dd>
                    </div>
                    <div className="pt-6 pb-2 ">
                      <dt className="text-base font-bold dark:text-dark-txt text-gray-900 md:col-span-5">
                        Certifications.
                      </dt>
                      <dd className="mt-2 md:col-span-7 ">
                        <p className="text-base text-gray-700 dark:text-dark-txt-secondary">
                          Are there any certifications or safety standards that your product must
                          meet? This information is important for customers who may have specific
                          requirements or concerns.
                        </p>
                      </dd>
                    </div>
                    <div className="pt-6 pb-2 ">
                      <dt className="text-base font-bold dark:text-dark-txt text-gray-900 md:col-span-5">
                        Functionality.
                      </dt>
                      <dd className="mt-2 md:col-span-7 ">
                        <p className="text-base text-gray-700 dark:text-dark-txt-secondary">
                          What does your product do? How does it work? This information is important
                          for customers to understand the benefits and capabilities of your product.
                        </p>
                      </dd>
                    </div>
                    <div className="pt-6 pb-2 ">
                      <dt className="text-base font-bold dark:text-dark-txt text-gray-900 md:col-span-5">
                        Durability.
                      </dt>
                      <dd className="mt-2 md:col-span-7 ">
                        <p className="text-base text-gray-700 dark:text-dark-txt-secondary">
                          How long is your product designed to last? What kind of warranty or
                          guarantee do you offer? This information can affect a customer&apos;s
                          purchasing decision and their perception of the value of your product.
                        </p>
                      </dd>
                    </div>
                    <div className="pt-6 pb-2 ">
                      <dt className="text-base font-bold dark:text-dark-txt text-gray-900 md:col-span-5">
                        Branding and packaging.
                      </dt>
                      <dd className="mt-2 md:col-span-7 ">
                        <p className="text-base text-gray-700 dark:text-dark-txt-secondary">
                          How will your product be packaged and branded? Will it have a logo or a
                          specific design? This information is important for customers who may be
                          looking for a specific look or style.
                        </p>
                      </dd>
                    </div>
                    <div className="pt-6 pb-2 ">
                      <dt className="text-base font-bold dark:text-dark-txt text-gray-900 md:col-span-5">
                        Price and availability.
                      </dt>
                      <dd className="mt-2 md:col-span-7 ">
                        <p className="text-base text-gray-700 dark:text-dark-txt-secondary">
                          How much will your product cost and when will it be available? This
                          information is important for customers who may be budgeting for your
                          product or who need it for a specific time.
                        </p>
                      </dd>
                    </div>
                    <div className="pt-6 pb-2 ">
                      <dt className="text-base font-bold dark:text-dark-txt text-gray-900 md:col-span-5">
                        Eco-friendliness.
                      </dt>
                      <dd className="mt-2 md:col-span-7 ">
                        <p className="text-base text-gray-700 dark:text-dark-txt-secondary">
                          Is your product environmentally friendly? Does it use sustainable
                          materials or have a low carbon footprint? This information is important
                          for customers who may be looking for products that align with their
                          environmental values.
                        </p>
                      </dd>
                    </div>
                    <div className="pt-6 pb-2 ">
                      <dt className="text-base font-bold dark:text-dark-txt text-gray-900 md:col-span-5">
                        Customization.
                      </dt>
                      <dd className="mt-2 md:col-span-7 ">
                        <p className="text-base text-gray-700 dark:text-dark-txt-secondary">
                          Is your product customizable? Will customers be able to make specific
                          requests for their order? This information is important for customers who
                          may want to tailor the product to their specific needs
                        </p>
                      </dd>
                    </div>
                    <div className="pt-6 pb-2 ">
                      <dt className="text-base font-bold dark:text-dark-txt text-gray-900 md:col-span-5">
                        Support and maintenance.
                      </dt>
                      <dd className="mt-2 md:col-span-7 ">
                        <p className="text-base text-gray-700 dark:text-dark-txt-secondary">
                          What kind of support and maintenance do you offer for your product? This
                          information is important for customers who may have questions or concerns
                          about their purchase.
                        </p>
                      </dd>
                    </div>
                    <div className="pt-6 pb-2 ">
                      <dd className="mt-2 md:col-span-7 ">
                        <p className="text-base text-gray-700 dark:text-dark-txt-secondary">
                          It&apos;s important to note that, the features and specifications of your
                          product should align with the needs and preferences of your target
                          audience. Additionally, be sure to accurately and completely list the
                          features and specifications in your product listing to ensure that
                          customers have a clear understanding of what they are purchasing.
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
