import axios from 'axios';
import { ToastError } from '../components/toast/ToastError';

export default async function CreateOrder(userID, address, cartItems, deliveryAddress, agreed) {
  const controller = new AbortController();
  const abortSignal = controller.signal;

  try {
    const access = localStorage.getItem('access');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${access}`,
      },
    };

    const body = JSON.stringify({
      userID,
      address,
      cartItems,
      deliveryAddress,
      agreed,
    });

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_ORDERS_URL}/api/orders/create/`,
      body,
      {
        ...config,
        signal: abortSignal,
      },
    );

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
