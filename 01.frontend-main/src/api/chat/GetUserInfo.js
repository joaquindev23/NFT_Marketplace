import axios from 'axios';

export default async function GetUserInfo(userId) {
  const controller = new AbortController();
  const abortSignal = controller.signal;

  try {
    const res = await axios.get(`/api/chat/get_user_info?userId=${userId}`, {
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
