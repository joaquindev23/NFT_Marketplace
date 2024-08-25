import axios from 'axios';
import { ToastError } from '../components/toast/ToastError';

export default async function MarkNotificationAsSeen(id) {
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
      id,
    });

    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_APP_NOTIFICATIONS_URL}/api/notifications/seen/`,
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
