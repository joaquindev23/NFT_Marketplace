import axios from 'axios';
import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

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

    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_APP_CART_URL}/api/cart/update-item/`,
      req.body,
      config,
    );

    res.status(201).json(response.data);
  } catch (err) {
    res.status(err.response.status).json({ error: err.response.data.error });
  }
}
