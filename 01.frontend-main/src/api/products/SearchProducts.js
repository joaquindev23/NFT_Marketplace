import axios from 'axios';
// import { ToastError } from '../../components/ToastError';

export default async function FetchSearchProducts(
  page,
  pageSize,
  maxPageSize,
  filterBy,
  orderBy,
  searchBy,
  rating,
  categoryId,
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
      `${process.env.NEXT_PUBLIC_APP_PRODUCTS_URL}/api/products/search/?p=${page}&page_size=${pageSize}&max_page_size=${maxPageSize}&filter=${filterBy}&order=${orderBy}&search=${searchBy}&rating=${rating}&category=${categoryId}&pricing=${pricing}&author=${author}`,
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
