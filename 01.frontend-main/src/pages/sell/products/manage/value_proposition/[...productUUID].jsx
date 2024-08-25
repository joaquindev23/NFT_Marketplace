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
    await SetProductHandle(productUUID[0], true, 'proposition');
    dispatch(getProduct(productUUID));
  }, [dispatch, productUUID]);

  useEffect(() => {
    if (
      productUUID &&
      product &&
      product.details &&
      product.details.value_proposition_bool === false
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
        title="Develop a unique value proposition"
      >
        <div className="space-y-4">
          <section className="w-full  p-0 md:p-6">
            <div className="grid md:grid-cols-12">
              <div className="px-8  py-16 md:col-span-7">
                <p className="my-6 text-2xl font-black dark:text-dark-txt text-gray-700">
                  Creating a unique value proposition, young Skywalker, is a crucial step in using
                  the dark side of the force to influence potential customers.
                </p>
                <p className="text-lg font-medium dark:text-dark-txt-secondary text-gray-700">
                  It is the power of persuasion, the ability to make a product stand out in the
                  minds of potential customers, and make it irresistible to them.
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
                    Embrace this knowledge
                  </p>
                  <p className=" text-mg justify-center text-center font-medium dark:text-dark-txt-secondary text-gray-700">
                    and learn more about the dark side of the force
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
                        Understand Needs and Desires.
                      </dt>
                      <dd className="mt-2 md:col-span-7 ">
                        <p className="text-base text-gray-700 dark:text-dark-txt-secondary">
                          In order to rule the galaxy, we must master the art of creating a unique
                          value proposition. We must understand the needs, wants, and desires of our
                          target audience and use that knowledge to craft a message that speaks
                          directly to them. We must use persuasive language and tactics to highlight
                          the unique benefits of our product, and make it clear how it solves their
                          pain points and improves their lives.
                        </p>
                      </dd>
                    </div>
                    <div className="pt-6 pb-2 ">
                      <dt className="text-base font-bold dark:text-dark-txt text-gray-900 md:col-span-5">
                        Annihilate the Competition.
                      </dt>
                      <dd className="mt-2 md:col-span-7 ">
                        <p className="text-base text-gray-700 dark:text-dark-txt-secondary">
                          We must research our competition and identify the gaps in the market, use
                          that information to create a product that is different and better. We must
                          conduct user research to understand the needs and preferences of potential
                          customers, and use that information to create a product that is tailored
                          to their needs.
                        </p>
                      </dd>
                    </div>
                    <div className="pt-6 pb-2 ">
                      <dt className="text-base font-bold dark:text-dark-txt text-gray-900 md:col-span-5">
                        The Power of Storytelling.
                      </dt>
                      <dd className="mt-2 md:col-span-7 ">
                        <p className="text-base text-gray-700 dark:text-dark-txt-secondary">
                          We must also use the power of storytelling to create an emotional
                          connection with potential customers, by creating a compelling narrative
                          about our product and how it can improve their lives.
                        </p>
                      </dd>
                    </div>
                    <div className="pt-6 pb-2 ">
                      <dd className="mt-2 md:col-span-7 ">
                        <p className="text-base text-gray-700 dark:text-dark-txt-secondary">
                          The dark side is not to be feared, but embraced. It is the key to our
                          success. Together, we will master the art of creating a unique value
                          proposition, and we will make our product irresistible to potential
                          customers. We will use the dark side of the force to influence their
                          purchasing decisions, and we will rule the galaxy.
                        </p>
                      </dd>
                    </div>
                    <div className="pt-6 pb-2 ">
                      <dd className="mt-2 md:col-span-7 ">
                        <p className="text-base text-gray-700 dark:text-dark-txt-secondary">
                          General grievous himself will assist you on creating the perfect value
                          proposition. Complete your training my young padawawn, and become one with
                          the dark side of the force.
                        </p>
                      </dd>
                    </div>
                  </dl>
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
                        Ah, young Skywalker, welcome to my chambers.
                      </dt>
                      <dd className="mt-2 md:col-span-7 ">
                        <p className="text-base text-gray-700 dark:text-dark-txt-secondary">
                          The Emperor has tasked me with instructing you on the art of creating a
                          value proposition for selling a product. Are you ready to learn the ways
                          of the Force in this matter?
                        </p>
                      </dd>
                    </div>
                    <div className="pt-6 pb-2 ">
                      <dt className="text-base font-bold dark:text-dark-txt text-gray-900 md:col-span-5">
                        Identify the unique benefits of your product.
                      </dt>
                      <dd className="mt-2 md:col-span-7 ">
                        <p className="text-base text-gray-700 dark:text-dark-txt-secondary">
                          First and foremost, it is crucial to identify the unique benefits of your
                          product. What sets it apart from the competition? Is it faster than a
                          podracer? More powerful than a lightsaber? Make sure to highlight these
                          unique selling points in your proposition.
                        </p>
                      </dd>
                    </div>
                    <div className="pt-6 pb-2 ">
                      <dt className="text-base font-bold dark:text-dark-txt text-gray-900 md:col-span-5">
                        Understand your target audience.{' '}
                      </dt>
                      <dd className="mt-2 md:col-span-7 ">
                        <p className="text-base text-gray-700 dark:text-dark-txt-secondary">
                          Next, it is important to understand your target audience. Who are they?
                          What do they desire? A Jedi craves not these things. Identifying your
                          target audience will help tailor your proposition to their specific needs
                          and wants.
                        </p>
                      </dd>
                    </div>
                    <div className="pt-6 pb-2 ">
                      <dt className="text-base font-bold dark:text-dark-txt text-gray-900 md:col-span-5">
                        Use clear and concise language.
                      </dt>
                      <dd className="mt-2 md:col-span-7 ">
                        <p className="text-base text-gray-700 dark:text-dark-txt-secondary">
                          Clear and concise language is also crucial. Do not speak in riddles like a
                          Jedi Master, but be direct and to the point. Use simple language that even
                          a Gungan can understand.
                        </p>
                      </dd>
                    </div>
                    <div className="pt-6 pb-2 ">
                      <dt className="text-base font-bold dark:text-dark-txt text-gray-900 md:col-span-5">
                        Make it memorable.
                      </dt>
                      <dd className="mt-2 md:col-span-7 ">
                        <p className="text-base text-gray-700 dark:text-dark-txt-secondary">
                          Make it memorable. A good proposition is like the theme of the Imperial
                          March - it sticks in one&apos;s mind. Use catchy phrases and memorable
                          examples to leave a lasting impression on potential customers.
                        </p>
                      </dd>
                    </div>
                    <div className="pt-6 pb-2 ">
                      <dt className="text-base font-bold dark:text-dark-txt text-gray-900 md:col-span-5">
                        Use specific numbers.
                      </dt>
                      <dd className="mt-2 md:col-span-7 ">
                        <p className="text-base text-gray-700 dark:text-dark-txt-secondary">
                          Finally, use specific numbers. Give hard data and statistics to back up
                          your claims. This will add credibility to your proposition and make it
                          more persuasive. Remember, a good value proposition is like the power of
                          the Death Star - it can destroy the competition.
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
