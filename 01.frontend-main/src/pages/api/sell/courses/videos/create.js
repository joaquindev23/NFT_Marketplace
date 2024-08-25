import axios from 'axios';
import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const cookies = cookie.parse(req.headers.cookie ?? '');
      const access = cookies.access ?? false;

      const config = {
        headers: {
          'Content-Type': req.headers['content-type'],
          Authorization: `JWT ${access}`,
        },
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_COURSES_URL}/api/courses/videos/create/`,
        req.body,
        config,
      );

      res.status(200).json(response.data);
    } catch (err) {
      res.status(err.response.status).json({
        error: `Error: ${err.response.statusText}`,
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({
      error: `Method ${req.method} not allowed`,
    });
  }
}
