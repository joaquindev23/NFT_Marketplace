import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getCartTotal } from '@/redux/actions/cart/cart';
import DesktopNavbar from './components/Navbar';
import ScrollToTop from '../components/ScrollToTop';
import {
  loadEthereumBalance,
  loadMaticPolygonBalance,
  loadPraediumBalance,
} from '@/redux/actions/auth/auth';

export default function Layout({ children }) {
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
    dispatch(getCartTotal(cartItems));
  }, [dispatch, cartItems]);

  return (
    <>
      <ScrollToTop />
      <DesktopNavbar />
      {children}
    </>
  );
}
