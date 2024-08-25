import axios from 'axios';

export default async function LoadMessages(
  roomName,
  roomGroupName,
  page,
  pageSize,
  maxPageSize,
  filterBy,
  orderBy,
  search,
) {
  const controller = new AbortController();
  const abortSignal = controller.signal;

  try {
    const res = await axios.get(
      `/api/chat/load_conversation_messages?roomName=${roomName}&roomGroupName=${roomGroupName}&p=${page}&page_size=${pageSize}&max_page_size=${maxPageSize}&filter_by=${filterBy}&order_by=${orderBy}&search=${search}`,
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
