import axios from 'axios';
import { ToastError } from '../../components/toast/ToastError';

export default async function FetchCourses(
  page,
  pageSize,
  maxPageSize,
  filterBy,
  orderBy,
  author,
  category,
  businessActivity,
  type,
  search,
) {
  const controller = new AbortController();
  const abortSignal = controller.signal;

  try {
    const access = localStorage.getItem('access');
    const config = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `JWT ${access}`,
      },
    };

    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_COURSES_URL}/api/courses/list/?filter=date_created&p=${page}&page_size=${pageSize}&max_page_size=${maxPageSize}&filter=${filterBy}&order=${orderBy}&category=${category}&author=${author}&business_activity=${businessActivity}&type=${type}&search=${search}`,
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
