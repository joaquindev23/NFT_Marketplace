import axios from 'axios';
import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { title, category, businessActivity, type, user, address, polygonAddress } = req.body;

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
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `JWT ${access}`,
        },
      };

      const body = JSON.stringify({
        title,
        category,
        businessActivity,
        type,
        user,
        address,
        polygonAddress,
      });

      const apiRes = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_PRODUCTS_URL}/api/products/create/`,
        body,
        config,
      );

      if (apiRes.status === 201) {
        res.status(201).json({ results: apiRes.data.results });
      } else {
        res.status(apiRes.status).json({ error: 'Product creation failed' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
