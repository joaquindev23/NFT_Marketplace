import axios from 'axios';
import { ToastError } from '../components/toast/ToastError';

export default async function ClearCart() {
  const controller = new AbortController();
  const abortSignal = controller.signal;

  try {
    const access = localStorage.getItem('access');
    const config = {
      headers: {
        Accept: 'application/json',
        Authorization: `JWT ${access}`,
      },
    };

    const res = await axios.get(`${process.env.NEXT_PUBLIC_APP_CART_URL}/api/cart/clear/`, {
      ...config,
      signal: abortSignal,
    });

    if (res.status === 200) {
      return res;
    }
  } catch (err) {
    if (axios.isCancel(err)) {
      // eslint-disable-next-line
      console.log('Request canceled', err.message);
      ToastError(`Error: ${err}`);
    } else {
      // eslint-disable-next-line
      console.log(err);
      ToastError(`Error: ${err}`);
    }
  }
}
