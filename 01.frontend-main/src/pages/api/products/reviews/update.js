import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { userID, productUUID, rating, content } = req.body;

    try {
      const { access } = req.cookies;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${access}`,
        },
      };

      const body = JSON.stringify({
        user_id: userID,
        productUUID,
        rating,
        content,
      });

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_APP_PRODUCTS_URL}/api/reviews/edit/`,
        body,
        config,
      );

      if (response.status === 200) {
        res.status(200).json(response.data);
      } else {
        res.status(response.status).json({ message: 'Error updating review' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating review' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
