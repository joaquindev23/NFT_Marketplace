import axios from 'axios';
import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { productUUID, weightsList } = req.body;

    try {
      const cookies = cookie.parse(req.headers.cookie || '');
      const { access } = cookies;

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${access}`,
        },
      };

      const body = JSON.stringify({
        productUUID,
        weightsList,
      });

      const apiRes = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_PRODUCTS_URL}/api/products/weights/create/`,
        body,
        config,
      );

      if (apiRes.status === 200) {
        res.status(200).json({ results: apiRes.data.results });
      } else {
        res.status(apiRes.status).json({ error: 'Failed to update product weights' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
