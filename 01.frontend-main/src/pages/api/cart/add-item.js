import axios from 'axios';
import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const { itemID, type, coupon, shipping, quantity, size, color, weight, material, referrer } =
    req.body;

  try {
    const cookies = cookie.parse(req.headers.cookie || '');
    const accessToken = cookies.access;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `JWT ${accessToken}`,
      },
    };

    const body = JSON.stringify({
      itemID,
      type,
      shipping: shipping || '',
      color: color || '',
      size: size || '',
      weight: weight || '',
      material: material || '',
      count: quantity,
      coupon,
      referrer,
    });

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_CART_URL}/api/cart/add-item/`,
      body,
      config,
    );

    res.status(200).json(response.data);
  } catch (err) {
    res.status(err.response.status).json({ error: err.response.data.error });
  }
}
