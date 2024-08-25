import axios from 'axios';

export default async function CancelFriendRequest(email) {
  const controller = new AbortController();
  const abortSignal = controller.signal;

  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = {
      email,
    };

    const res = await axios.put(`/api/friends/cancel-request`, body, {
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
    } else {
      // eslint-disable-next-line
      console.log(err);
    }
  }
}
