import axios from 'axios';
import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }
  const { userID, address, polygonAddress, cartItems, deliveryAddress, agreed } = req.body;

  try {
    const cookies = cookie.parse(req.headers.cookie || '');
    const accessToken = cookies.access;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${accessToken}`,
      },
    };

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_PAYMENT_URL}/api/crypto/pay/`,
      { userID, address, polygonAddress, cartItems, deliveryAddress, agreed },
      config,
    );

    res.status(200).json(response.data);
  } catch (err) {
    console.error(err);
    res.status(err.response.status).json({ error: err.response.data.error });
  }
}
