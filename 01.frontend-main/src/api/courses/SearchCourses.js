import axios from 'axios';
// import { ToastError } from '../../components/ToastError';

export default async function FetchSearchCourses(
  page,
  pageSize,
  maxPageSize,
  filterBy,
  orderBy,
  searchBy,
  rating,
  language,
  duration,
  categoryId,
  level,
  pricing,
  author,
) {
  const controller = new AbortController();
  const abortSignal = controller.signal;

  try {
    const config = {
      headers: {
        Accept: 'application/json',
      },
    };

    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_COURSES_URL}/api/courses/search/?p=${page}&page_size=${pageSize}&max_page_size=${maxPageSize}&filter=${filterBy}&order=${orderBy}&search=${searchBy}&rating=${rating}&language=${language}&duration=${duration}&category=${categoryId}&level=${level}&pricing=${pricing}&author=${author}`,
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
      //   ToastError(`Error: ${err.response.statusText}`);
    } else {
      //   ToastError(`Error: ${err.response.statusText}`);
    }
  }
}
