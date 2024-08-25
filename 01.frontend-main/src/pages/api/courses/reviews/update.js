import axios from 'axios';
import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { courseUUID, rating, content } = req.body;
    const cookies = cookie.parse(req.headers.cookie || '');
    const { access } = cookies;

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${access}`,
        },
      };

      const body = JSON.stringify({
        courseUUID,
        rating,
        content,
      });

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_APP_COURSES_URL}/api/reviews/edit/`,
        body,
        config,
      );

      res.status(200).json(response.data);
    } catch (error) {
      res.status(error.response.status).json(error.response.data);
    }
  } else {
    res.setHeader('Allow', 'PUT');
    res.status(405).end('Method Not Allowed');
  }
}
