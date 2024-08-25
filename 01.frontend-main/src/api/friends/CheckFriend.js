import axios from 'axios';
import { ToastError } from '../../components/toast/ToastError';

export default async function CheckFriend(email) {
  const controller = new AbortController();
  const abortSignal = controller.signal;

  try {
    const config = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      signal: abortSignal,
    };

    const body = {
      email,
    };

    const res = await axios.post(`/api/friends/check-friend`, body, config);

    if (res.status === 200) {
      return res;
    }
  } catch (err) {
    if (axios.isCancel(err)) {
      ToastError(`Error: ${err.response.statusText}`);
    } else {
      ToastError(`Error: ${err.response.statusText}`);
    }
  }
}
