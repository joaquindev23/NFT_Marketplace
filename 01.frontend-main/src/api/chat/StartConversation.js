import axios from 'axios';

export default async function StartConversation(fromUserUsername, toUser, username) {
  const controller = new AbortController();
  const abortSignal = controller.signal;

  try {
    const body = {
      from_user_username: fromUserUsername,
      to_user: toUser,
      to_user_username: username,
    };

    const res = await axios.post('/api/chat/start_conversation', body, {
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
