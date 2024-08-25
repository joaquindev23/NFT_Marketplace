import axios from 'axios';
import { ToastError } from '../components/toast/ToastError';

export default async function BuyNow(address, polygonAddress, courseUUID, coupon, referrer) {
  const controller = new AbortController();
  const abortSignal = controller.signal;

  try {
    const body = JSON.stringify({
      buyer_address: address,
      polygon_address: polygonAddress,
      course: courseUUID,
      coupon,
      referrer,
    });

    const res = await axios.post('/api/tokens/buyNow', body, {
      headers: {
        'Content-Type': 'application/json',
      },
      signal: abortSignal,
    });

    return res;
  } catch (err) {
    if (axios.isCancel(err)) {
      // eslint-disable-next-line
      console.log('Request canceled', err.message);
      //   ToastError('Request canceled', err.message);
    } else {
      // eslint-disable-next-line
      ToastError(err.response.data.error);
    }
  }
}
