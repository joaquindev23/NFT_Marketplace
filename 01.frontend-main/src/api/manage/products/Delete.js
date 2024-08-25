import axios from 'axios';

export default async function DeleteProduct(productUUID) {
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

    const body = JSON.stringify({
      productUUID,
    });

    await axios.post(`${process.env.NEXT_PUBLIC_APP_PRODUCTS_URL}/api/products/delete/`, body, {
      ...config,
      signal: abortSignal,
    });
  } catch (err) {
    if (axios.isCancel(err)) {
      // eslint-disable-next-line
      console.log('Request canceled', err.message);
    } else {
      // eslint-disable-next-line
      console.log(err);
    }
  }
}
