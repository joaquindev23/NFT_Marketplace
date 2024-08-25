import axios from 'axios';
// import { ToastError } from '../../components/ToastError';

export default async function FetchPopularCourseCategories() {
  const controller = new AbortController();
  const abortSignal = controller.signal;

  try {
    const config = {
      headers: {
        Accept: 'application/json',
      },
    };

    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_COURSES_URL}/api/category/popular/`,
      {
        ...config,
        signal: abortSignal,
      },
    );

    return res;
  } catch (err) {
    if (axios.isCancel(err)) {
      // ToastError(`Error: ${err.response.statusText}`);
    } else {
      // ToastError(`Error: ${err.response.statusText}`);
    }
  }
}
