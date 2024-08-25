import axios from 'axios';

export default async function CreateProduct(title, category, businessActivity, type) {
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
      title,
      category,
      businessActivity,
      type,
    });

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_PRODUCTS_API_URL}/api/products/create/`,
      body,
      {
        ...config,
        signal: abortSignal,
      },
    );

    if (res.status === 201) {
      return res.data;
    }
  } catch (err) {
    if (axios.isCancel(err)) {
      // eslint-disable-next-line
      console.log('Request canceled', err.message);
    } else {
      // eslint-disable-next-line
      console.log(err);
      throw err;
    }
  }
}
