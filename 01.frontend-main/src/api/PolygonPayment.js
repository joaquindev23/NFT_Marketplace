import axios from 'axios';
import { ToastError } from '../components/toast/ToastError';

export default async function PolygonPayment(
  userID,
  address,
  polygonAddress,
  cartItems,
  deliveryAddress,
  agreed,
) {
  const controller = new AbortController();
  const abortSignal = controller.signal;

  try {
    const body = JSON.stringify({
      userID,
      address,
      polygonAddress,
      cartItems,
      deliveryAddress,
      agreed,
    });

    const res = await axios.post('/api/checkout/polygon-payment', body, {
      headers: { 'Content-Type': 'application/json' },
      signal: abortSignal,
    });

    return res;
  } catch (err) {
    if (axios.isCancel(err)) {
      // eslint-disable-next-line
      console.log('Request canceled', err.message);
      ToastError(`Error: ${err}`);
    } else {
      // eslint-disable-next-line
      console.log(err);
      ToastError(`Error: ${err.response.data.error}`);
    }
  }
}
