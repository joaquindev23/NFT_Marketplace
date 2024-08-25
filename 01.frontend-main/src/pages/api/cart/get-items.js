import axios from 'axios';
import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Parse cookies and get the access token
    const cookies = cookie.parse(req.headers.cookie || '');
    const accessToken = cookies.access;

    // Update the config object to use the access token
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `JWT ${accessToken}`,
      },
    };

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_CART_URL}/api/cart/cart-items/`,
        config,
      );
      res.status(200).json(response.data);
    } catch (error) {
      res.status(error.response.status).json(error.response.data);
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
