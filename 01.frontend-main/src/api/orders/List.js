import axios from 'axios';
import { ToastError } from '../../components/toast/ToastError';

export default async function FetchOrders(page, pageSize, maxPageSize, filterBy, orderBy, search) {
  const controller = new AbortController();
  const abortSignal = controller.signal;

  try {
    const res = await axios.get(
      `/api/orders/list?p=${page}&page_size=${pageSize}&max_page_size=${maxPageSize}&filter=${filterBy}&order=${orderBy}&search=${search}`,
      {
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
