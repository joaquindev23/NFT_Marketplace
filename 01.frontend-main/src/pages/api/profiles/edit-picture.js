// pages/api/profiles/edit-picture.js
import axios from 'axios';
import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    try {
      const cookies = cookie.parse(req.headers.cookie ?? '');
      const access = cookies.access ?? false;

      if (access === false) {
        return res.status(401).json({
          error: 'User unauthorized to make this request',
        });
      }

      const config = {
        headers: {
          'Content-Type': req.headers['content-type'],
          Authorization: `JWT ${access}`,
        },
      };

      const apiRes = await axios.put(
        `${process.env.NEXT_PUBLIC_APP_API_URL}/api/profiles/edit/picture`,
        req.body,
        config,
      );

      const { data } = apiRes;

      return res.status(apiRes.status).json(data);
    } catch (err) {
      console.error('Error in API route handler:', err);

      return res.status(500).json({
        error: 'Something went wrong',
      });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).json({
      error: `Method ${req.method} not allowed`,
    });
  }
}
