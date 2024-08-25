import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ManageCourseLayout from '../components/ManageCourseLayout';
import Navbar from './components/Navbar';
import { getCourse, updateCoursePricing } from '@/redux/actions/courses/courses';
import PriceSec from './components/PriceSec';
import ComparePriceSec from './components/ComparePriceSec';
import DiscountUntilSec from './components/DiscountUntilSec';
import SetCourseHandle from '@/api/manage/courses/SetCourse';
import { ToastSuccess } from '@/components/ToastSuccess';
import { ToastError } from '@/components/ToastError';

export default function Pricing() {
  const router = useRouter();
  const { courseUUID } = router.query;

  const myUser = useSelector((state) => state.auth.user);
  const wallet = useSelector((state) => state.auth.wallet);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const course = useSelector((state) => state.courses.course);
  const dispatch = useDispatch();

  const fetchCourse = useCallback(() => {
    dispatch(getCourse(courseUUID));
  }, [dispatch, courseUUID]);

  useEffect(() => {
    if (courseUUID) {
      fetchCourse(courseUUID);
    }
  }, [fetchCourse, courseUUID]);

  const price = useSelector((state) => state.courses.price);
  const comparePrice = useSelector((state) => state.courses.compare_price);
  const discountUntil = useSelector((state) => state.courses.discount_until);
  const discount = useSelector((state) => state.courses.discount);

  const nftAddress = course && course.details && course.details.nft_address;

  const [loading, setLoading] = useState(false);
  const [hasChangesPrice, setHasChangesPrice] = useState(false);
  const [hasChangesComparePrice, setHasChangesComparePrice] = useState(false);
  const [hasChangesDiscountUntil, setHasChangesDiscountUntil] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    if (courseUUID && course && course.details && course.details.pricing === false) {
      await SetCourseHandle(courseUUID[0], true, 'pricing');
    }

    const courseBody = JSON.stringify({
      price,
      comparePrice,
      discountUntil,
      discount,
      nftAddress,
    });

    const promises = [];

    if (hasChangesPrice || hasChangesComparePrice || hasChangesDiscountUntil) {
      promises.push(dispatch(updateCoursePricing(courseUUID[0], courseBody)));

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

  return (
    <div>
      <Navbar
        user={myUser}
        isAuthenticated={isAuthenticated}
        course={course && course}
        courseUUID={courseUUID}
        loading={loading}
        hasChangesPrice={hasChangesPrice}
        hasChangesComparePrice={hasChangesComparePrice}
        hasChangesDiscountUntil={hasChangesDiscountUntil}
        setLoading={setLoading}
        handleSubmit={handleSubmit}
      />
      <div className="lg:pt-14 " />
      <ManageCourseLayout
        myUser={myUser}
        isAuthenticated={isAuthenticated}
        course={course}
        fetchCourse={fetchCourse}
        courseUUID={courseUUID}
        wallet={wallet}
        title="Pricing"
      >
        <div className="  px-8 lg:px-14">
          <p className="text-md font-bold dark:text-dark-txt">Course Price Tier</p>
          <p className="text-md mt-2 max-w-4xl font-medium text-gray-700 dark:text-dark-txt-secondary">
            My apprentice, Lord Zenith, as a Sith Lord, it is important to understand the power of
            pricing in order to dominate the galaxy of commerce.
          </p>
        </div>
        <section className="w-full ">
          <div className="">
            <div className="mx-auto px-8 py-8 lg:px-14">
              <p className="text-xl font-black tracking-tight text-gray-900 md:text-2xl dark:text-dark-txt">
                Tips
              </p>
              <div className="mt-2">
                <dl className="">
                  <div className="pt-6 pb-2 ">
                    <dt className="text-base font-bold dark:text-dark-txt text-gray-900 md:col-span-5">
                      Research your competition.
                    </dt>
                    <dd className="mt-2 md:col-span-7 ">
                      <p className="text-base text-gray-700 dark:text-dark-txt-secondary">
                        Look at the prices of similar courses in your niche and use that information
                        to determine a fair price for your course.
                      </p>
                    </dd>
                  </div>
                  <div className="pt-6 pb-2 ">
                    <dt className="text-base font-bold dark:text-dark-txt text-gray-900 md:col-span-5">
                      Consider the value of your course.
                    </dt>
                    <dd className="mt-2 md:col-span-7 ">
                      <p className="text-base dark:text-dark-txt-secondary text-gray-700">
                        What knowledge and skills will your learners gain from taking your course?
                        How will it benefit them in their lives or careers? The value of your course
                        should be reflected in the price.
                      </p>
                    </dd>
                  </div>
                  <div className="pt-6 pb-2 ">
                    <dt className="text-base font-bold dark:text-dark-txt text-gray-900 md:col-span-5">
                      Test different prices.
                    </dt>
                    <dd className="mt-2 md:col-span-7 ">
                      <p className="text-base dark:text-dark-txt-secondary text-gray-700">
                        Try different prices to see what works best for your target audience. You
                        can use A/B testing to determine the most effective price point.
                      </p>
                    </dd>
                  </div>
                  <div className="pt-6 pb-2 ">
                    <dt className="text-base font-bold dark:text-dark-txt text-gray-900 md:col-span-5">
                      Bundle your courses.
                    </dt>
                    <dd className="mt-2 md:col-span-7 ">
                      <p className="text-base dark:text-dark-txt-secondary text-gray-700">
                        Consider offering a bundle of related courses at a discounted price. This
                        can make your courses more affordable and increase the perceived value of
                        your offerings.
                      </p>
                    </dd>
                  </div>
                  <div className="pt-6 pb-2 ">
                    <dt className="text-base font-bold dark:text-dark-txt text-gray-900 md:col-span-5">
                      Offer different pricing tiers.
                    </dt>
                    <dd className="mt-2 md:col-span-7 ">
                      <p className="text-base dark:text-dark-txt-secondary text-gray-700">
                        Give your learners the option to purchase a basic or premium version of your
                        course at different price points. The premium version should offer
                        additional features and benefits.
                      </p>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>
        <div className="w-full p-8 lg:p-14 ">
          <span className="text-md mb-2 block font-bold text-gray-900 dark:text-dark-txt">
            Basic info
          </span>
          <div className="flex">
            <PriceSec setHasChangesPrice={setHasChangesPrice} />
            <ComparePriceSec setHasChangesComparePrice={setHasChangesComparePrice} />
            <DiscountUntilSec setHasChangesDiscountUntil={setHasChangesDiscountUntil} />
          </div>
        </div>
      </ManageCourseLayout>
    </div>
  );
}
