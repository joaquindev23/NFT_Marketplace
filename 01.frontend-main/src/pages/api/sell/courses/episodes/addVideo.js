import axios from 'axios';
import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
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

    try {
      const apiRes = await axios.put(
        `${process.env.NEXT_PUBLIC_APP_COURSES_URL}/api/courses/teacher/episodes/add/video/`,
        req.body,
        config,
      );

      if (apiRes.status === 200) {
        res.status(200).json(apiRes.data);
      } else {
        res.status(apiRes.status).json({
          error: 'Error',
        });
      }
    } catch (err) {
      res.status(500).json({
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
