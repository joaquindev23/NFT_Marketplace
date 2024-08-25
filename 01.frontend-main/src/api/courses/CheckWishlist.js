import axios from 'axios';

export default async function CheckWishlist(courseUUID) {
  const controller = new AbortController();
  const abortSignal = controller.signal;

  try {
    const config = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify({
      courseUUID,
    });

    const res = await axios.post(`/api/courses/checkWishlist`, body, {
      ...config,
      signal: abortSignal,
    });

    return res;
  } catch (err) {
    if (axios.isCancel(err)) {
      //   ToastError(`Error: ${err.response.statusText}`);
    } else {
      //   ToastError(`Error: ${err.response.statusText}`);
    }
  }
}
