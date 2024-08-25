import axios from 'axios';

export default async function FetchEpisodeQuestions(
  episodeUUID,
  page,
  pageSize,
  maxPageSize,
  sortBy,
  filterBy,
  userId,
  search,
) {
  const controller = new AbortController();
  const abortSignal = controller.signal;

  try {
    const res = await axios.get(
      `/api/courses/episodes/questions/list?episodeUUID=${episodeUUID}&page=${page}&pageSize=${pageSize}&maxPageSize=${maxPageSize}&sortBy=${sortBy}&filterBy=${filterBy}&userId=${userId}&search=${search}`,
      { signal: abortSignal },
    );

    if (res.status === 200) {
      return res;
    }
  } catch (err) {
    if (axios.isCancel(err)) {
      // ToastError(`Error: ${err.response.statusText}`);
    } else {
      // ToastError(`Error: ${err.response.statusText}`);
    }
  }
}
