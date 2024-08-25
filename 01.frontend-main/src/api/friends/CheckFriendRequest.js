import axios from 'axios';
import { ToastError } from '../../components/toast/ToastError';

export default async function CheckFriendRequest(email) {
  const controller = new AbortController();
  const abortSignal = controller.signal;

  try {
    const body = {
      email,
    };

    const res = await axios.post(`/api/friends/check-friend-request`, body, {
      signal: abortSignal,
    });

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
