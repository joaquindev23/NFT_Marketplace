import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { orderItemId, trackingUrl } = req.body;

    console.log(req.body);

    try {
      const { access } = req.cookies;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${access}`,
        },
      };

      const body = JSON.stringify({
        trackingUrl,
      });

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_APP_ORDERS_URL}/api/orders/edit/tracking_url/${orderItemId}/`,
        body,
        config,
      );

      if (response.status === 200) {
        res.status(200).json(response.data);
      } else {
        res.status(response.status).json({ message: 'Error updating tracking URL' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating tracking URL' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
