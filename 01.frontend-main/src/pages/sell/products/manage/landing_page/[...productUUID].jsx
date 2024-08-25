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
  updateProduct,
  updateProductImage,
  updateProductRequisite,
  updateProductVideo,
  updateProductWhatLearnt,
  updateProductWhoIsFor,
} from '@/redux/actions/products/products';
import ManageProductLayout from '@/pages/sell/products/manage/components/ManageProductLayout';
import SetProductHandle from '@/api/manage/products/SetProductHandle';
import TitleSec from './components/TitleSec';
import SubTitleSec from './components/SubTitleSec';
import DescriptionSec from './components/DescriptionSec';
import BasicInfoSec from './components/BasicInfo';
import StockSec from './components/StockSec';
import ImageGallery from './components/ImageGallery';
import VideoGallery from './components/VideoGallery';
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/20/solid';

export default function Goals() {
  const router = useRouter();
  const { productUUID } = router.query;

  const myUser = useSelector((state) => state.auth.user);
  const profile = useSelector((state) => state.auth.profile);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const product = useSelector((state) => state.products.product);
  const title = useSelector((state) => state.products.title);
  const subTitle = useSelector((state) => state.products.sub_title);
  const description = useSelector((state) => state.products.description);
  const language = useSelector((state) => state.products.language);
  const category = useSelector((state) => state.products.category);
  const level = useSelector((state) => state.products.level);
  const stock = useSelector((state) => state.products.stock);
  const images = useSelector((state) => state.products.images);
  const videos = useSelector((state) => state.products.videos);

  const productImages = product && product.images;
  const [imagesList, setImagesList] = useState(
    productImages && productImages.length !== 0 ? productImages : [],
  );

  const productVideos = product && product.videos;
  const [videosList, setVideosList] = useState(
    productVideos && productVideos.length !== 0 ? productVideos : [],
  );

  const [loading, setLoading] = useState(false);
  const [hasChangesTitle, setHasChangesTitle] = useState(false);
  const [hasChangesSubTitle, setHasChangesSubTitle] = useState(false);
  const [hasChangesDescription, setHasChangesDescription] = useState(false);
  const [hasChangesLanguage, setHasChangesLanguage] = useState(false);
  const [hasChangesLevel, setHasChangesLevel] = useState(false);
  const [hasChangesCategory, setHasChangesCategory] = useState(false);
  const [hasChangesStock, setHasChangesStock] = useState(false);
  const [hasChangesImages, setHasChangesImages] = useState(false);
  const [hasChangesVideos, setHasChangesVideos] = useState(false);

  const dispatch = useDispatch();

  const fetchProduct = useCallback(() => {
    dispatch(getProduct(productUUID));
  }, [dispatch, productUUID]);

  useEffect(() => {
    if (productUUID) fetchProduct(productUUID);
  }, [fetchProduct, productUUID]);

  const [profileReady, setProfileReady] = useState(false);
  useEffect(() => {
    if (profile && myUser) {
      if (
        (myUser.role === 'seller' &&
          profile.location !== '' &&
          profile.birthday !== '' &&
          profile.profile_info !== '' &&
          profile.facebook !== '') ||
        profile.twitter !== '' ||
        profile.instagram !== '' ||
        profile.linkedin !== '' ||
        profile.youtube !== '' ||
        profile.github !== ''
      ) {
        setProfileReady(true);
      } else {
        setProfileReady(false);
      }
    }
  }, [profile, myUser]);

  const [percentage, setPercentage] = useState(0);
  const onUploadProgress = (progressEvent) => {
    setPercentage(Math.round((progressEvent.loaded * 100) / progressEvent.total));
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (productUUID && product && product.details && product.details.landing_page_bool === false) {
      await SetProductHandle(productUUID[0], true, 'landingPage');
    }

    const productBody = JSON.stringify({
      title,
      subTitle,
      description,
      language,
      category,
      level,
      stock,
    });

    const promises = [];

    if (
      hasChangesTitle ||
      hasChangesSubTitle ||
      hasChangesDescription ||
      hasChangesLanguage ||
      hasChangesLevel ||
      hasChangesCategory ||
      hasChangesStock
    ) {
      promises.push(dispatch(updateProduct(productUUID[0], productBody)));
    }

    if (hasChangesVideos) {
      promises.push(dispatch(updateProductVideo(productUUID[0], videosList, onUploadProgress)));
    }
    if (hasChangesImages) {
      promises.push(dispatch(updateProductImage(productUUID[0], imagesList)));
    }

    await Promise.all(promises);

    // setIsSaved(true);
    setLoading(false);
    if (hasChangesTitle) {
      setHasChangesTitle(false);
    }
    if (hasChangesSubTitle) {
      setHasChangesSubTitle(false);
    }
    if (hasChangesDescription) {
      setHasChangesDescription(false);
    }
    if (hasChangesLanguage) {
      setHasChangesLanguage(false);
    }
    if (hasChangesLevel) {
      setHasChangesLevel(false);
    }
    if (hasChangesCategory) {
      setHasChangesCategory(false);
    }
    if (hasChangesStock) {
      setHasChangesStock(false);
    }
    if (hasChangesVideos) {
      setHasChangesVideos(false);
    }
    if (hasChangesImages) {
      setHasChangesImages(false);
    }

    setPercentage(0);
  };

  return (
    <div>
      <Navbar
        user={myUser}
        isAuthenticated={isAuthenticated}
        product={product && product}
        productUUID={productUUID}
        loading={loading}
        setLoading={setLoading}
        hasChangesTitle={hasChangesTitle}
        hasChangesSubTitle={hasChangesSubTitle}
        hasChangesDescription={hasChangesDescription}
        hasChangesLevel={hasChangesLevel}
        hasChangesLanguage={hasChangesLanguage}
        hasChangesCategory={hasChangesCategory}
        hasChangesStock={hasChangesStock}
        hasChangesImages={hasChangesImages}
        hasChangesVideos={hasChangesVideos}
        fetchProduct={fetchProduct}
        handleSubmit={handleSubmit}
      />
      <div className="lg:pt-14 " />

      <ManageProductLayout
        myUser={myUser}
        isAuthenticated={isAuthenticated}
        product={product}
        productUUID={productUUID}
        title="Product Landing Page"
      >
        <p className="mb-8 dark:text-dark-txt-secondary">
          Your Product landing page is crucial to your success on Udemy. If it&apos;s done right, it
          can also help you gain visibility in search engines like Google. As you complete this
          section, think about creating a compelling Product Landing Page that demonstrates why
          someone would want to enroll in your Product. Learn more about
          <Link
            href="/teach-hub"
            className="ml-1 dark:text-dark-accent dark:hover:text-dark-primary text-iris-500 hover:text-iris-600"
          >
            creating your Product landing page and Product title standards.
          </Link>{' '}
          and
          <Link
            href="/teach-hub"
            className="ml-1 dark:text-dark-accent dark:hover:text-dark-primary text-iris-500 hover:text-iris-600"
          >
            {' '}
            Product title standards
          </Link>
          .
        </p>

        <div className="space-y-6 pb-6">
          {/* Product title */}
          {product ? (
            <>
              <TitleSec setHasChangesTitle={setHasChangesTitle} />

              {/* Product subtitle */}
              <SubTitleSec setHasChangesSubTitle={setHasChangesSubTitle} />

              {/* Product description */}
              <DescriptionSec setHasChangesDescription={setHasChangesDescription} />

              {/* Basic info */}
              <BasicInfoSec
                setHasChangesLanguage={setHasChangesLanguage}
                setHasChangesLevel={setHasChangesLevel}
                setHasChangesCategory={setHasChangesCategory}
              />

              {/* Stock */}
              <StockSec setHasChangesStock={setHasChangesStock} />

              {/* thumbnail */}
              <ImageGallery
                product={product}
                setHasChangesImages={setHasChangesImages}
                productUUID={productUUID}
                productImages={productImages}
                imagesList={imagesList}
                setImagesList={setImagesList}
              />

              {/* video */}
              <VideoGallery
                product={product}
                setHasChangesVideos={setHasChangesVideos}
                productUUID={productUUID}
                fetchProduct={fetchProduct}
                percentage={percentage}
                productVideos={productVideos}
                videosList={videosList}
                setVideosList={setVideosList}
              />
            </>
          ) : (
            <div>Loading...</div>
          )}

          {/* instructor profile */}
          <div className="pb-8">
            <span className="text-md mb-2 block  font-bold dark:text-dark-txt text-gray-900">
              Instructor profile(s)
            </span>
            {profileReady ? (
              <div className="w-full bg-success p-4">
                <div className="flex">
                  <div className="mr-4 flex-shrink-0">
                    <CheckCircleIcon className="h-10 w-10 dark:text-dark-txt text-gray-900" />
                  </div>
                  <div>
                    <p className="text-md mt-2 font-bold">All instructor bios are complete</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full bg-error p-4">
                <div className="flex">
                  <div className="mr-4 flex-shrink-0">
                    <XMarkIcon className="h-10 w-10 dark:text-dark-txt text-gray-900" />
                  </div>
                  <div>
                    <p className="text-md font-bold dark:text-dark-txt">
                      Instructor(s) bio incomplete
                    </p>
                    <p className="mt-1 text-sm dark:text-dark-txt-secondary">
                      You must have a description, social media links and a way for users to contact
                      you for support.
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="mt-4 flex px-4">
              <div className="mr-4 flex-shrink-0 self-center">
                <img
                  alt=""
                  src={profile && profile.picture}
                  className="h-12 w-12 rounded-full object-cover"
                />
              </div>
              <div>
                <p className="mt-1 font-bold dark:text-dark-primary text-purple-600">
                  {myUser && myUser.username}
                </p>
                <Link
                  href={`/@/${myUser && myUser.username}`}
                  className="mt-1 text-purple-600 dark:text-dark-accent underline underline-offset-2"
                >
                  View instructor profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </ManageProductLayout>
    </div>
  );
}
