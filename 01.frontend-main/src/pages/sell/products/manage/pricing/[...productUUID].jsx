import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import Navbar from './components/Navbar';
import { getProduct, updateProductPricing } from '@/redux/actions/products/products';
import ManageProductLayout from '@/pages/sell/products/manage/components/ManageProductLayout';
import SetProductHandle from '@/api/manage/products/SetProductHandle';
import PriceSec from './components/PriceSec';
import ComparePriceSec from './components/ComparePriceSec';
import DiscountUntilSec from './components/DiscountUntilSec';
import { ToastSuccess } from '@/components/ToastSuccess';
import { ToastError } from '@/components/ToastError';

export default function Goals() {
  const router = useRouter();
  const { productUUID } = router.query;

  const myUser = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const product = useSelector((state) => state.products.product);
  const price = useSelector((state) => state.products.price);
  const comparePrice = useSelector((state) => state.products.compare_price);
  const discountUntil = useSelector((state) => state.products.discount_until);
  const discount = useSelector((state) => state.products.discount);
  const nftAddress = product && product.details && product.details.nft_address;

  const [loading, setLoading] = useState(false);
  const [hasChangesPrice, setHasChangesPrice] = useState(false);
  const [hasChangesComparePrice, setHasChangesComparePrice] = useState(false);
  const [hasChangesDiscountUntil, setHasChangesDiscountUntil] = useState(false);

  const dispatch = useDispatch();

  const fetchProduct = useCallback(() => {
    dispatch(getProduct(productUUID));
  }, [dispatch, productUUID]);

  useEffect(() => {
    if (productUUID) fetchProduct(productUUID);
  }, [fetchProduct, productUUID]);

  const handleSubmit = async () => {
    setLoading(true);
    if (productUUID && product && product.details && product.details.pricing_bool === false) {
      await SetProductHandle(productUUID[0], true, 'pricing');
    }

    const productBody = JSON.stringify({
      price,
      comparePrice,
      discountUntil,
      discount,
    });

    const promises = [];

    if (hasChangesPrice || hasChangesComparePrice || hasChangesDiscountUntil) {
      promises.push(dispatch(updateProductPricing(productUUID[0], productBody)));

      Promise.all(promises)
        .then((responses) => {
          // Check if all responses have a status of 200
          const allSuccessful = responses.every((res) => res && res.status === 200);

          if (allSuccessful && (nftAddress !== 0 || nftAddress !== '0')) {
            ToastSuccess('Successfully Updated NFT Price');
          } else {
            // Handle the case when not all responses are successful
          }
        })
        .catch((error) => {
          // Handle errors
          console.log(error);
          ToastError('Failed to Update NFT Price');
        });
    }

    await Promise.all(promises);

    // setIsSaved(true);
    setLoading(false);
    if (hasChangesPrice) {
      setHasChangesPrice(false);
    }
    if (hasChangesComparePrice) {
      setHasChangesComparePrice(false);
    }
    if (hasChangesDiscountUntil) {
      setHasChangesDiscountUntil(false);
    }
  };

  useEffect(() => {
    if (product && product.weights.length > 0) {
      SetProductHandle(productUUID[0], true, 'pricing');
    }
  }, [product]);

  return (
    <div>
      <Navbar
        user={myUser}
        isAuthenticated={isAuthenticated}
        product={product && product}
        productUUID={productUUID}
        loading={loading}
        hasChangesPrice={hasChangesPrice}
        hasChangesComparePrice={hasChangesComparePrice}
        hasChangesDiscountUntil={hasChangesDiscountUntil}
        setLoading={setLoading}
        handleSubmit={handleSubmit}
      />
      <div className="lg:pt-14 " />

      <ManageProductLayout
        myUser={myUser}
        isAuthenticated={isAuthenticated}
        product={product && product}
        productUUID={productUUID}
        title="Pricing"
      >
        <section className="w-full  p-0 md:p-6">
          <div className="grid md:grid-cols-12">
            <div className="px-8  py-16 md:col-span-7">
              <p className="my-6 text-2xl font-black dark:text-dark-txt text-gray-700">
                Ah, my apprentice, you have much to learn about the ways of the dark side and the
                art of pricing.{' '}
              </p>
              <p className="text-lg font-medium dark:text-dark-txt-secondary text-gray-700">
                As a Sith Lord, I understand the power of manipulation and control, much like how we
                control the force to bend it to our will. The key to creating a best-selling product
                is to find the perfect balance between supply and demand, much like how we balance
                the power of the dark side and the light side to achieve victory.
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
                  Embrace this knowledge{' '}
                </p>
                <p className=" text-mg justify-center text-center font-medium dark:text-dark-txt-secondary text-gray-700">
                  and learn more about the dark side of the force{' '}
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
                Pay close attention, young Skywalker.
              </p>
              <div className="mt-2">
                <dl className="">
                  <div className="pt-6 pb-2 ">
                    <dt className="text-base font-bold dark:text-dark-txt text-gray-900 md:col-span-5">
                      Understand Their Weakness.
                    </dt>
                    <dd className="mt-2 md:col-span-7 ">
                      <p className="text-base text-gray-700 dark:text-dark-txt-secondary">
                        First, we must study the market and understand our competition, much like
                        how we study our enemies and understand their weaknesses. We must analyze
                        the prices of similar products and understand the general price range for
                        our product. This is known as market research, a crucial tool in the arsenal
                        of any savvy Sith Lord.
                      </p>
                    </dd>
                  </div>
                  <div className="pt-6 pb-2 ">
                    <dt className="text-base font-bold dark:text-dark-txt text-gray-900 md:col-span-5">
                      Determine Cost and Value.
                    </dt>
                    <dd className="mt-2 md:col-span-7 ">
                      <p className="text-base text-gray-700 dark:text-dark-txt-secondary">
                        Next, I would determine the optimal balance between cost and value for the
                        product. We must make sure that we offer enough features and specifications
                        to make our product stand out from the competition, while keeping the cost
                        low enough to be competitive.
                      </p>
                    </dd>
                  </div>
                  <div className="pt-6 pb-2 ">
                    <dt className="text-base font-bold dark:text-dark-txt text-gray-900 md:col-span-5">
                      Cost of Production.
                    </dt>
                    <dd className="mt-2 md:col-span-7 ">
                      <p className="text-base text-gray-700 dark:text-dark-txt-secondary">
                        Next, we must consider the cost of production and all related expenses, such
                        as shipping and marketing. We must also factor in our desired profit margin.
                        This is known as cost-plus pricing, a strategy used by many successful Sith
                        Lords.
                      </p>
                    </dd>
                  </div>
                  <div className="pt-6 pb-2 ">
                    <dt className="text-base font-bold dark:text-dark-txt text-gray-900 md:col-span-5">
                      Study the Marketplace.
                    </dt>
                    <dd className="mt-2 md:col-span-7 ">
                      <p className="text-base text-gray-700 dark:text-dark-txt-secondary">
                        Once we have a clear understanding of these factors, we can then set our
                        price. We must not be afraid to be aggressive with our pricing, much like
                        how we fear nothing in battle. But we must also be mindful of the market
                        conditions and the competition, much like how we stay vigilant and
                        anticipate the moves of our enemies.
                      </p>
                    </dd>
                  </div>
                  <div className="pt-6 pb-2 ">
                    <dd className="mt-2 md:col-span-7 ">
                      <p className="text-base text-gray-700 dark:text-dark-txt-secondary">
                        Remember, the key is to find the sweet spot where we can maximize profits
                        while still remaining competitive and appealing to consumers, much like how
                        we find the perfect balance between the dark side and the light side to
                        achieve ultimate power. And always remember, the force is strong in pricing
                        strategy, just like it&apos;s strong in a Sith Lord. May the dark side guide
                        you in your journey to conquer the e-commerce market.
                      </p>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full ">
          <div className="mx-auto space-y-4 px-8 py-8 lg:px-14">
            <p className="text-xl font-black tracking-tight dark:text-dark-txt text-gray-900 md:text-2xl">
              Configure your Pricing
            </p>
            {product && product.weights.length === 0 ? (
              <div className="flex">
                <PriceSec setHasChangesPrice={setHasChangesPrice} />
                <ComparePriceSec setHasChangesComparePrice={setHasChangesComparePrice} />
                <DiscountUntilSec setHasChangesDiscountUntil={setHasChangesDiscountUntil} />
              </div>
            ) : (
              <div>Handled by weight</div>
            )}
            {/* <div className="mt-2 flex">
              <input
                className="form-checkbox h-4 w-4 text-black transition duration-150 ease-in-out"
                type="checkbox"
                id="activate-discount"
                onChange={toggleDiscount}
              />
              <label
                className="ml-2 flex text-sm leading-5 text-gray-900 focus-within:text-blue-800"
                htmlFor="activate-discount"
              >
                {discount ? (
                  <span className="inline-flex text-gray-900">Deactivate Discount</span>
                ) : (
                  <span className="inline-flex text-gray-900">Activate Discount</span>
                )}
              </label>
            </div> */}
          </div>
        </section>
      </ManageProductLayout>
    </div>
  );
}
