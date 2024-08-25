import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import _ from 'lodash';

import {
  getProduct,
  updateProductCongratsMessage,
  updateProductWelcomeMessage,
} from '@/redux/actions/products/products';
import ManageProductLayout from '@/pages/sell/products/manage/components/ManageProductLayout';
import SetProductHandle from '@/api/manage/products/SetProductHandle';
import WelcomeMessageSec from './components/WelcomeMessageSec';

export default function Messages() {
  const router = useRouter();
  const { productUUID } = router.query;

  const myUser = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const product = useSelector((state) => state.products.product);
  const details = product && product.details;
  const [loading, setLoading] = useState(false);
  const [hasChangesWelcomeMessage, setHasChangesWelcomeMessage] = useState(false);
  const [hasChangesCongratsMessage, setHasChangesCongratsMessage] = useState(false);

  const dispatch = useDispatch();

  const fetchProduct = useCallback(async () => {
    dispatch(getProduct(productUUID));
  }, [dispatch, productUUID]);

  useEffect(() => {
    if (productUUID) {
      fetchProduct(productUUID[0]);
    }
  }, [fetchProduct, productUUID]);

  const [welcomeMessage, setWelcomeMessage] = useState((details && details.welcome_message) || '');
  const [congratsMessage, setCongratsMessage] = useState(
    (details && details.congrats_message) || '',
  );

  const handleSubmit = async () => {
    setLoading(true);

    if (productUUID && product && product.details && product.details.messages_bool === false) {
      await SetProductHandle(productUUID[0], true, 'messages');
    }

    const promises = [];

    if (hasChangesWelcomeMessage) {
      promises.push(dispatch(updateProductWelcomeMessage(productUUID[0], welcomeMessage)));
    }
    if (hasChangesCongratsMessage) {
      promises.push(dispatch(updateProductCongratsMessage(productUUID[0], congratsMessage)));
    }

    await Promise.all(promises);

    // setIsSaved(true);
    setLoading(false);
    if (hasChangesWelcomeMessage) {
      setHasChangesWelcomeMessage(false);
    }
    if (hasChangesCongratsMessage) {
      setHasChangesCongratsMessage(false);
    }
  };

  const [originalWelcomeMessage, setOriginalWelcomeMessage] = useState('');
  useEffect(() => {
    setWelcomeMessage(details && details.welcome_message ? details.welcome_message : '');
    setOriginalWelcomeMessage(JSON.parse(JSON.stringify(welcomeMessage)));
    // eslint-disable-next-line
  }, [product]);
  useEffect(() => {
    if (!_.isEqual(originalWelcomeMessage, welcomeMessage)) {
      setHasChangesWelcomeMessage(true);
    } else {
      setHasChangesWelcomeMessage(false);
    }
  }, [welcomeMessage, originalWelcomeMessage, setHasChangesWelcomeMessage]);

  const [originalCongratsMessage, setOriginalCongratsMessage] = useState('');
  useEffect(() => {
    setCongratsMessage(details && details.congrats_message ? details.congrats_message : '');
    setOriginalCongratsMessage(JSON.parse(JSON.stringify(congratsMessage)));
    // eslint-disable-next-line
  }, [product]);
  useEffect(() => {
    if (!_.isEqual(originalCongratsMessage, congratsMessage)) {
      setHasChangesCongratsMessage(true);
    } else {
      setHasChangesCongratsMessage(false);
    }
  }, [congratsMessage, originalCongratsMessage, setHasChangesCongratsMessage]);

  return (
    <div>
      <Navbar
        user={myUser}
        isAuthenticated={isAuthenticated}
        product={product && product}
        productUUID={productUUID}
        loading={loading}
        handleSubmit={handleSubmit}
        setLoading={setLoading}
        hasChangesWelcomeMessage={hasChangesWelcomeMessage}
        hasChangesCongratsMessage={hasChangesCongratsMessage}
      />
      <div className="lg:pt-14 " />

      <ManageProductLayout
        myUser={myUser}
        isAuthenticated={isAuthenticated}
        product={product && product}
        productUUID={productUUID}
        title="Welcome message"
      >
        <section className="w-full ">
          <div className="">
            <div className="mx-auto px-8 pb-8 lg:px-14">
              <p>
                Indeed, my apprentice, as we strive to conquer the e-commerce market, it is
                important to remember the importance of communication with our customers. A thank
                you message is a small but powerful gesture that can have a big impact on customer
                satisfaction and loyalty.
              </p>

              <WelcomeMessageSec
                welcomeMessage={welcomeMessage}
                setWelcomeMessage={setWelcomeMessage}
                congratsMessage={congratsMessage}
                setCongratsMessage={setCongratsMessage}
                // sanitizedWelcomeMessage={sanitizedWelcomeMessage}
                // sanitizedCongratsMessage={sanitizedCongratsMessage}
              />
            </div>
          </div>
        </section>
      </ManageProductLayout>
    </div>
  );
}
