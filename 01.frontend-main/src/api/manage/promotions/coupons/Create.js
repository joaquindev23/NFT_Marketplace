import axios from 'axios';

export default async function CreateCoupon(name, uses, price, percentage, type, object) {
  const controller = new AbortController();
  const abortSignal = controller.signal;

  try {
    let body;
    if (price) {
      body = {
        name,
        fixed_price_coupon: {
          discount_price: price,
          uses,
        },
        content_type: type,
        object_id: object,
      };
    } else if (percentage) {
      body = {
        name,
        percentage_coupon: {
          discount_percentage: percentage,
          uses,
        },
        content_type: type,
        object_id: object,
      };
    }

    console.log(body);

    const res = await axios.post(`/api/sell/promotions/create`, body, {
      headers: {
        'Content-Type': 'application/json',
      },
      signal: abortSignal,
    });

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
      return { error: err.response.data.error };
    }
  } finally {
    controller.abort();
  }
}
