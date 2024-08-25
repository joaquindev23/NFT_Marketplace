import axios from 'axios';
import { ToastError } from '../components/toast/ToastError';

export default async function EnlistNFT(price, date) {
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
      price,
      date,
    });

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_AUCTIONS_URL}/api/auctions/create_auction/`,
      body,
      {
        ...config,
        signal: abortSignal,
      },
    );
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
