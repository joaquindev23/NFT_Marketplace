import axios from 'axios';
import { ToastError } from '../../../../components/toast/ToastError';

export default async function FetchSectionsUnpaid(courseUUID, page, pageSize, maxPageSize) {
  const controller = new AbortController();
  const abortSignal = controller.signal;

  try {
    const config = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };

    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_COURSES_URL}/api/courses/list/sections/unpaid/${courseUUID}/?p=${page}&page_size=${pageSize}&max_page_size=${maxPageSize}`,
      {
        ...config,
        signal: abortSignal,
      },
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
