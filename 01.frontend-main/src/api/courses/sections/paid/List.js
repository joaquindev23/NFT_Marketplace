import axios from 'axios';
import { ToastError } from '../../../../components/toast/ToastError';

export default async function FetchSectionsPaid(courseUUID, page, pageSize, maxPageSize) {
  const controller = new AbortController();
  const abortSignal = controller.signal;

  try {
    const res = await axios.get(
      `/api/courses/sections/paid/list?courseUUID=${courseUUID}&page=${page}&pageSize=${pageSize}&maxPageSize=${maxPageSize}`,
      { signal: abortSignal },
    );

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
