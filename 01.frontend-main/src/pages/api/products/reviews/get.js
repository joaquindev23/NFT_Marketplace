import axios from 'axios';

export default async function handler(req, res) {
  const { productUUID } = req.query;

  try {
    const { access } = req.cookies;
    const config = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `JWT ${access}`,
      },
    };

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_PRODUCTS_URL}/api/reviews/get/${productUUID}/`,
      config,
    );

    if (response.status === 200) {
      res.status(200).json(response.data);
    } else {
      res.status(response.status).json({ message: 'Error fetching reviews' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews' });
  }
}
