import axios from 'axios';
import { ToastError } from '../../components/toast/ToastError';

export default async function VotePoll(poll, option, chat) {
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
      poll,
      option,
      chat,
    });

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_CHAT_API_URL}/api/chat/vote_poll/`,
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
    } else {
      // eslint-disable-next-line
      // console.log(err);
      // eslint-disable-next-line
      ToastError(err.response.data.error);
    }
  }
}
