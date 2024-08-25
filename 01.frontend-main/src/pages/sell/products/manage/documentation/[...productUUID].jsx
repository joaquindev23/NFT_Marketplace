import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import Navbar from './components/Navbar';
import { getProduct } from '@/redux/actions/products/products';
import ManageProductLayout from '@/pages/sell/products/manage/components/ManageProductLayout';
import SetProductHandle from '@/api/manage/products/SetProductHandle';
import DocumentationSec from './components/DocumentationSec';

export default function Documentation() {
  const router = useRouter();
  const { productUUID } = router.query;

  const myUser = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const product = useSelector((state) => state.products.product);

  const dispatch = useDispatch();

  const fetchProduct = useCallback(async () => {
    await SetProductHandle(productUUID[0], true, 'documentation');
    dispatch(getProduct(productUUID));
  }, [dispatch, productUUID]);

  useEffect(() => {
    if (productUUID && product && product.details && product.details.documentation_bool === false) {
      fetchProduct(productUUID[0]);
    }
  }, [fetchProduct, productUUID, product]);

  const [hasChangesDocs, setHasChangesDocs] = useState(false);

  return (
    <div>
      <Navbar
        user={myUser}
        isAuthenticated={isAuthenticated}
        product={product}
        productUUID={productUUID}
        hasChangesDocs={hasChangesDocs}
      />
      <div className="lg:pt-14 " />

      <ManageProductLayout
        myUser={myUser}
        isAuthenticated={isAuthenticated}
        product={product}
        productUUID={productUUID}
        title="Upload any certificates or licenses (optional)"
      >
        <div className="space-y-4">
          <div className="block dark:text-dark-txt-secondary">
            Products that have certificates tend to get more sales and customers. If you sell any
            controlled substance you must upload the documentation. These documents will be revised
            by our legal team and you will then be provided access to sell your product.
          </div>
          <DocumentationSec
            product={product}
            productUUID={productUUID}
            setHasChangesDocs={setHasChangesDocs}
          />
        </div>
      </ManageProductLayout>
    </div>
  );
}
