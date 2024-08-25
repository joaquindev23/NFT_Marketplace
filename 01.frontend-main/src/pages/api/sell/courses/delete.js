import axios from 'axios';
import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { courseUUID } = req.body;

  try {
    const cookies = cookie.parse(req.headers.cookie ?? '');
    const access = cookies.access ?? false;

    if (!access) {
      throw new Error('Access token not found in cookies.');
    }

    const config = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `JWT ${access}`,
      },
      withCredentials: true,
    };

    const body = JSON.stringify({ courseUUID });

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_COURSES_URL}/api/courses/delete/`,
      body,
      config,
    );

    if (response.status === 200) {
      res.status(200).json(response.data.results);
    } else {
      res.status(response.status).json({ message: 'Error deleting course' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
