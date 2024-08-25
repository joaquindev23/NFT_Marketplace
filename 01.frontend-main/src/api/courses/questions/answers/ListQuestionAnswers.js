import axios from 'axios';
import { ToastError } from '../../../../components/toast/ToastError';

export default async function FetchQuestionAnswers(
  questionId,
  page,
  pageSize,
  maxPageSize,
  orderBy,
  filterBy,
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
      `${process.env.NEXT_PUBLIC_APP_COURSES_URL}/api/courses/questions/answers/${questionId}/?order_by=${orderBy}&filter_by=${filterBy}&p=${page}&page_size=${pageSize}&max_page_size=${maxPageSize}&search=${search}`,
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
      // eslint-disable-next-line
      console.log(err);
    }
  }
}
