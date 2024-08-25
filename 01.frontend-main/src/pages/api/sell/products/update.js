import axios from 'axios';
import cookie from 'cookie';

const updateProductHandler = async (req, res) => {
  if (req.method === 'PUT') {
    const { productUUID, productBody } = req.body;

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

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_APP_PRODUCTS_URL}/api/products/update/`,
        {
          productUUID,
          productBody: JSON.parse(productBody), // Parse the productBody back to an object
        },
        config,
      );

      if (response.status === 200) {
        res.status(200).json(response.data);
      } else {
        res.status(response.status).json({ message: 'Failed to update product' });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
};

export default updateProductHandler;
