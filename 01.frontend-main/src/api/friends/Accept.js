import axios from 'axios';

export default async function AcceptFriend(friendRequestId, action) {
  const controller = new AbortController();
  const abortSignal = controller.signal;

  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = {
      friend_request_id: friendRequestId,
      action,
    };

    const res = await axios.put(`/api/friends/accept-request`, body, {
      ...config,
      signal: abortSignal,
    });

    return res;
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
