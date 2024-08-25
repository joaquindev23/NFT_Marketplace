import axios from 'axios';
import { ToastError } from '../../components/toast/ToastError';

export default async function FetchOrderItem(id) {
  const controller = new AbortController();
  const abortSignal = controller.signal;

  try {
    const res = await axios.get(`/api/orders/get-order-item?id=${id}`, {
      signal: abortSignal,
    });

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
