import axios from 'axios';
// import { ToastError } from '../../components/ToastError';

export default async function FetchCourseReviews(courseSlug, page, pageSize, maxPageSize, rating) {
  const controller = new AbortController();
  const abortSignal = controller.signal;

  try {
    const config = {
      headers: {
        Accept: 'application/json',
      },
    };

    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_COURSES_URL}/api/reviews/list/${courseSlug}/?filter=date_created&p=${page}&page_size=${pageSize}&max_page_size=${maxPageSize}&rating=${rating}`,
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
      // ToastError(`Error: ${err.response.statusText}`);
      // eslint-disable-next-line
      console.log(err.response.statusText);
    } else {
      // ToastError(`Error: ${err.response.statusText}`);
      // eslint-disable-next-line
      console.log(err.response.statusText);
    }
  }
}
