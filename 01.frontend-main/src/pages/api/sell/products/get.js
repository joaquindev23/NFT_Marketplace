import axios from 'axios';
import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { productUUID } = req.query;

    try {
      const cookies = cookie.parse(req.headers.cookie ?? '');
      const access = cookies.access ?? false;

      if (access === false) {
        return res.status(403).json({
          error: 'User forbidden from making the request',
        });
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${access}`,
        },
      };

      const apiRes = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_PRODUCTS_URL}/api/products/seller/get/${productUUID}/`,
        config,
      );

      if (apiRes.status === 200) {
        res.status(200).json({ results: apiRes.data.results });
      } else {
        res.status(apiRes.status).json({ error: 'Failed to get product' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
