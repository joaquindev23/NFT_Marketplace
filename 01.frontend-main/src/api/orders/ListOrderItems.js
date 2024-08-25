import axios from 'axios';
import { ToastError } from '@/components/toast/ToastError';

export default async function FetchOrderItems(
  page,
  pageSize,
  maxPageSize,
  filterBy,
  orderBy,
  search,
) {
  const controller = new AbortController();
  const abortSignal = controller.signal;

  try {
    const res = await axios.get(
      `/api/orders/get-orders?page=${page}&pageSize=${pageSize}&maxPageSize=${maxPageSize}&filterBy=${filterBy}&orderBy=${orderBy}&search=${search}`,
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
