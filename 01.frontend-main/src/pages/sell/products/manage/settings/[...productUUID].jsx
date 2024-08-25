import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToastSuccess } from '@/components/ToastSuccess';
import ManageProductLayout from '../components/ManageProductLayout';
import Details from './components/Details';
import LoadingMoon from '@/components/loaders/LoadingMoon';
import { getProduct, updateProductStatus } from '@/redux/actions/products/products';
import DeleteProduct from '@/api/manage/products/Delete';
import Navbar from '../accessibility/components/Navbar';

export default function Settings() {
  const router = useRouter();
  const { productUUID } = router.query;

  const myUser = useSelector((state) => state.auth.user);
  const wallet = useSelector((state) => state.auth.wallet);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const product = useSelector((state) => state.products.product);
  const details = product && product.details;

  const dispatch = useDispatch();

  const fetchProduct = useCallback(async () => {
    dispatch(getProduct(productUUID));
  }, [dispatch, productUUID]);

  useEffect(() => {
    if (productUUID) {
      fetchProduct(productUUID[0]);
    }
  }, [fetchProduct, productUUID]);

  const [canPublish, setCanPublish] = useState(false);
  useEffect(() => {
    if (details) {
      if (
        details.target_audience_bool &&
        details.features_bool &&
        details.supply_chain_bool &&
        details.delivery_bool &&
        details.warehousing_bool &&
        details.value_proposition_bool &&
        details.marketing_strategy_bool &&
        details.product_details_bool &&
        details.accessibility_bool &&
        details.documentation_bool &&
        details.landing_page_bool &&
        details.pricing_bool &&
        details.promotions_bool &&
        details.shipping_bool &&
        details.messages_bool &&
        details.nft_address &&
        details.nft_address !== '0' &&
        details.nft_address !== null
      ) {
        setCanPublish(true);
      } else {
        setCanPublish(false);
      }
    }
  }, [details]);

  const canDelete = details && details.can_delete;
  const [loading, setLoading] = useState(false);
  async function handleDelete() {
    if (canDelete) {
      setLoading(true);
      const res = await DeleteProduct(productUUID[0]);
      ToastSuccess(res);
      setLoading(false);
      router.push('/sell/products/');
    }
  }

  const handlePublish = async () => {
    if (canPublish) {
      if (details.nft_address !== '0') {
        setLoading(true);
        if (details.status === 'published') {
          await dispatch(updateProductStatus(productUUID[0], false));
        } else {
          await dispatch(updateProductStatus(productUUID[0], true));
        }
        // await fetchProduct();
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <Navbar user={myUser} product={product} productUUID={productUUID} />
      <div className="lg:pt-14 " />
      <ManageProductLayout
        myUser={myUser}
        isAuthenticated={isAuthenticated}
        product={product}
        wallet={wallet}
        productUUID={productUUID}
        fetchProduct={fetchProduct}
        title="Settings"
      >
        <div className="border-b dark:border-dark-border border-gray-200 pb-5">
          <h2 className="mt-6 text-lg font-bold dark:text-dark-txt">Course Status</h2>
          <p className="text-md mt-2 max-w-4xl font-medium dark:text-dark-txt-secondary text-gray-700">
            {details && details.status === 'published' ? (
              <>This course is published on the boomslag marketplace.</>
            ) : (
              <>This course is not published on the boomslag marketplace.</>
            )}
          </p>
          <div className="mt-6 grid grid-cols-4">
            {loading ? (
              <button
                type="button"
                className=" w-full border dark:border-dark-border border-gray-900 py-3 font-bold dark:text-dark-txt-secondary text-dark hover:border-gray-500 hover:text-gray-500"
              >
                <LoadingMoon size={20} color="#0D1117" />{' '}
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePublish}
                disabled={!canPublish}
                className=" w-full border dark:border-dark-border border-gray-900 py-3 font-bold dark:text-dark-txt-secondary text-dark hover:border-gray-500 hover:text-gray-500"
              >
                {details && details.status === 'published' ? 'Draft' : 'Publish'} Product
              </button>
            )}
            <span className="col-span-3 ml-4 dark:text-dark-txt-secondary">
              New students cannot find your course via search, but existing students can still
              access content.
            </span>
          </div>
          {/* <div className="mt-6 grid grid-cols-4">
            {loading ? (
              <button
                type="button"
                className=" w-full border border-gray-900 py-3 font-bold text-dark hover:border-gray-500 hover:text-gray-500"
              >
                <LoadingMoon size={20} color="#0D1117" />
              </button>
            ) : (
              <button
                type="submit"
                onClick={handleDelete}
                disabled={!canDelete}
                className=" w-full border border-gray-900 py-3 font-bold text-dark hover:border-gray-500 hover:text-gray-500"
              >
                Delete
              </button>
            )}
            <span className="col-span-3 ml-4">
              We promise students lifetime access, so courses cannot be deleted after students have
              enrolled.
            </span>
          </div> */}
        </div>
        <div className="mt-4">
          <Details details={details} />
        </div>
      </ManageProductLayout>
    </div>
  );
}
