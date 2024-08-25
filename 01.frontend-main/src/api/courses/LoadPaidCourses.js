import axios from 'axios';

export default async function LoadPaidCourses(
  page,
  pageSize,
  maxPageSize,
  filterBy,
  orderBy,
  author,
  category,
  search,
) {
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
      `/api/library/courses/list?p=${page}&page_size=${pageSize}&max_page_size=${maxPageSize}&filter=${filterBy}&order=${orderBy}&category=${category}&author=${author}&search=${search}`,
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
      console.log('Request canceled', err.message);
    } else {
      console.log(err);
    }
  }
}
