import axios from 'axios';

export default async function UpdateProductViews(productUUID) {
  const controller = new AbortController();
  const abortSignal = controller.signal;

  try {
    const access = localStorage.getItem('access');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${access}`,
      },
    };

    const body = JSON.stringify({
      productUUID,
    });

    await axios.put(
      `${process.env.NEXT_PUBLIC_APP_PRODUCTS_URL}/api/products/update/views/`,
      body,
      {
        ...config,
        signal: abortSignal,
      },
    );
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
