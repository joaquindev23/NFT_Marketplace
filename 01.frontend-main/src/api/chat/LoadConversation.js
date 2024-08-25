import axios from 'axios';

export default async function LoadConversation(roomName, roomGroupName) {
  const controller = new AbortController();
  const abortSignal = controller.signal;

  try {
    const res = await axios.get(
      `/api/chat/load_conversation/?roomName=${roomName}&roomGroupName=${roomGroupName}`,
      {
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
    } else {
      // eslint-disable-next-line
      console.log(err);
    }
  }
}
