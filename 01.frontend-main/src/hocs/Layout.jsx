import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import ScrollToTop from './components/ScrollToTop';
import Footer from '@/features/footer';
import Navbar from '@/features/navbar';

import { getCartTotal, getItems } from '@/redux/actions/cart/cart';
import {
  loadEthereumBalance,
  loadMaticPolygonBalance,
  loadPraediumBalance,
} from '@/redux/actions/auth/auth';

export default function Layout({ children }) {
  const [cookiesAccepted, setCookiesAccepted] = useState(true);
  useEffect(() => {
    const gdprCookieValue = Cookies.get('gdpr');
    if (gdprCookieValue !== 'accepted') {
      setCookiesAccepted(false);
    }
  }, []);

  const acceptCookies = () => {
    Cookies.set('gdpr', 'accepted', { expires: 365 });
    setCookiesAccepted(true);
  };

  const rejectCookies = () => {
    Cookies.set('gdpr', 'rejected', { expires: 365 });
    setCookiesAccepted(false);
  };

  // useTokenRefresh();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const wallet = useSelector((state) => state.auth.wallet);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(loadEthereumBalance(wallet && wallet.address));
      dispatch(loadPraediumBalance(wallet && wallet.polygon_address));
      // dispatch(loadGalrBalance(wallet && wallet.polygon_address));
      dispatch(loadMaticPolygonBalance(wallet && wallet.polygon_address));
    }
  }, [dispatch, isAuthenticated]);

  // Fetch cart items when the page is reloaded or when isAuthenticated value changes
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getItems());
    }
  }, [dispatch, isAuthenticated]);

  // Fetch cart total when the cartItems value changes
  useEffect(() => {
    dispatch(getCartTotal(cartItems));
  }, [dispatch, cartItems]);

  return (
    <>
      <ScrollToTop />
      <Navbar />
      {children}
      {cookiesAccepted === false && (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 px-6 pb-6">
          <div className="pointer-events-auto ml-auto max-w-xl rounded-xl bg-white dark:bg-dark-second p-6 shadow-lg dark:ring-gray-900/10">
            <p className="text-sm leading-6 text-gray-900 dark:text-dark-txt">
              This website uses cookies to supplement a balanced diet and provide a much deserved
              reward to the senses after consuming bland but nutritious meals. Accepting our cookies
              is optional but recommended, as they are delicious. See our{' '}
              <Link href="/terms" className="font-semibold text-iris-600 dark:text-dark-primary">
                cookie policy
              </Link>
              .
            </p>
            <div className="mt-4 flex items-center gap-x-5">
              <button
                type="button"
                onClick={() => {
                  acceptCookies();
                }}
                className="rounded-md bg-dark-main px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 dark:hover:bg-dark-third focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
              >
                I love cookies
              </button>
              <button
                type="button"
                onClick={() => {
                  rejectCookies();
                }}
                className="text-sm font-semibold leading-6 text-gray-900 dark:text-dark-txt"
              >
                I&apos;m on a diet
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}
