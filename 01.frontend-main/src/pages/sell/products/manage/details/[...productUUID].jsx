import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getProduct,
  updateProductColors,
  updateProductDetails,
  updateProductMaterial,
  updateProductSizes,
  updateProductWeight,
} from '@/redux/actions/products/products';
import Navbar from './components/Navbar';
import ManageProductLayout from '@/pages/sell/products/manage/components/ManageProductLayout';
import SetProductHandle from '@/api/manage/products/SetProductHandle';
import DetailsSec from './components/DetailsSec';
import WeightSec from './components/WeightSec';
import SizeSec from './components/SizeSec';
import ColorSec from './components/ColorSec';
import MaterialSec from './components/MaterialSec';

export default function ValueProposition() {
  const router = useRouter();
  const { productUUID } = router.query;

  const myUser = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const product = useSelector((state) => state.products.product);
  const sizes = useSelector((state) => state.products.sizes);
  const colors = useSelector((state) => state.products.colors);
  const materials = useSelector((state) => state.products.materials);
  const weights = useSelector((state) => state.products.weights);
  const details = useSelector((state) => state.products.detail);

  const [loading, setLoading] = useState(false);
  const [hasChangesColors, setHasChangesColors] = useState(false);
  const [hasChangesSizes, setHasChangesSizes] = useState(false);
  const [hasChangesWeights, setHasChangesWeights] = useState(false);
  const [hasChangesMaterials, setHasChangesMaterials] = useState(false);
  const [hasChangesDetails, setHasChangesDetails] = useState(false);

  const dispatch = useDispatch();

  const fetchProduct = useCallback(() => {
    dispatch(getProduct(productUUID));
  }, [dispatch, productUUID]);

  useEffect(() => {
    if (productUUID) {
      fetchProduct(productUUID);
    }
  }, [fetchProduct, productUUID]);

  useEffect(() => {
    window.scrollTo(0, 0);
    // eslint-disable-next-line
  }, []);

  const handleSubmit = async () => {
    setLoading(true);

    const promises = [];

    if (hasChangesDetails) {
      await SetProductHandle(productUUID[0], true, 'details');
      promises.push(dispatch(updateProductDetails(productUUID[0], details)));
    }

    if (hasChangesSizes) {
      promises.push(dispatch(updateProductSizes(productUUID[0], sizes)));
    }

    if (hasChangesWeights) {
      promises.push(dispatch(updateProductWeight(productUUID[0], weights)));
    }

    if (hasChangesMaterials) {
      promises.push(dispatch(updateProductMaterial(productUUID[0], materials)));
    }

    if (hasChangesColors) {
      promises.push(dispatch(updateProductColors(productUUID[0], colors)));
    }

    await Promise.all(promises);

    // setIsSaved(true);
    setLoading(false);
    setHasChangesSizes(false);
    setHasChangesColors(false);
    setHasChangesWeights(false);
    setHasChangesDetails(false);
    setHasChangesMaterials(false);
    setHasChangesWeights(false);
  };

  return (
    <div>
      <Navbar
        user={myUser}
        isAuthenticated={isAuthenticated}
        product={product && product}
        productUUID={productUUID}
        loading={loading}
        hasChangesColors={hasChangesColors}
        hasChangesSizes={hasChangesSizes}
        hasChangesWeights={hasChangesWeights}
        hasChangesMaterials={hasChangesMaterials}
        hasChangesDetails={hasChangesDetails}
        handleSubmit={handleSubmit}
      />
      <div className="lg:pt-14 " />

      <ManageProductLayout
        myUser={myUser}
        isAuthenticated={isAuthenticated}
        product={product}
        productUUID={productUUID}
        title="Add product details"
      >
        <p className="dark:text-dark-txt-secondary">
          Young Skywalker, the{' '}
          <Link
            href="/teach-hub"
            className="ml-1 dark:text-dark-accent dark:hover:text-dark-primary text-iris-500 hover:text-iris-600"
          >
            Product details page
          </Link>{' '}
          is the key to unlocking the hearts and minds of the buyers. It is where you reveal the
          secrets of your product, the attributes that make it stand out. Size and color options,
          these are important details to include, for they are what the buyers often seek.
        </p>
        <p className="mb-8 mt-2 dark:text-dark-txt-secondary">
          By including them in your Product details page, you shall increase the likelihood of a
          sale and
          <Link
            href="/teach-hub"
            className="ml-1 dark:text-dark-accent dark:hover:text-dark-primary text-iris-500 hover:text-iris-600"
          >
            {' '}
            improve the experience of the user
          </Link>
          . The power of the dark side is subtle, use it to shape the future in your favor. , you
          can help increase the likelihood of a sale and .
        </p>

        <div className="space-y-6 pb-6">
          <DetailsSec
            product={product}
            loading={loading}
            setHasChangesDetails={setHasChangesDetails}
            productUUID={productUUID}
          />
          <WeightSec
            product={product}
            loading={loading}
            setHasChangesWeights={setHasChangesWeights}
            productUUID={productUUID}
          />
          <SizeSec
            product={product}
            loading={loading}
            setHasChangesSizes={setHasChangesSizes}
            productUUID={productUUID}
          />
          <ColorSec
            product={product}
            setHasChangesColors={setHasChangesColors}
            loading={loading}
            productUUID={productUUID}
          />
          <MaterialSec
            product={product}
            loading={loading}
            setHasChangesMaterials={setHasChangesMaterials}
            productUUID={productUUID}
          />
        </div>
      </ManageProductLayout>
    </div>
  );
}
