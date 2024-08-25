import axios from 'axios';
import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  try {
    const cookies = cookie.parse(req.headers.cookie || '');
    const accessToken = cookies.access;

    const config = {
      headers: {
        Accept: 'application/json',
        Authorization: `JWT ${accessToken}`,
      },
    };

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_CART_URL}/api/cart/clear/`,
      config,
    );

    res.status(200).json(response.data);
  } catch (err) {
    res.status(err.response.status).json({ error: err.response.data.error });
  }
}
