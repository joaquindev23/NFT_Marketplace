import axios from 'axios';
import cookie from 'cookie';

const handler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      // Extract access token from cookie
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
      const { productUUID, shippingList } = req.body;

      const body = JSON.stringify({
        productUUID,
        shippingList,
      });

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_PRODUCTS_URL}/api/shipping/create/`,
        body,
        config,
      );

      res.status(200).json(response.data);
    } catch (err) {
      if (err.response) {
        res.status(err.response.status).json({
          error: `Error: ${err.response.statusText}`,
        });
      } else {
        res.status(500).json({
          error: `Error: ${err.message}`,
        });
      }
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
};

export default handler;
