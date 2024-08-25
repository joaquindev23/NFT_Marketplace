import axios from 'axios';
import { parse } from 'cookie';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { id } = req.query;
    const cookies = parse(req.headers.cookie || '');
    const { access } = cookies;

    if (access) {
      const config = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `JWT ${access}`,
        },
      };

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_ORDERS_URL}/api/orders/get_item/${id}/`,
        config,
      );

      res.status(200).json(response.data);
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
