import axios from 'axios';
import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { address, polygonAddress, ticketId } = req.body;
    const cookies = cookie.parse(req.headers.cookie || '');
    const { access } = cookies;

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${access}`,
        },
      };

      const body = JSON.stringify({ address, polygonAddress, ticketId });

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_CRYPTO_URL}/api/courses/become_affiliate/`,
        body,
        config,
      );

      res.status(200).json(response.data);
    } catch (error) {
      res.status(error.response.status).json(error.response.data);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
