import axios from 'axios';
import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const cookies = cookie.parse(req.headers.cookie ?? '');
    const access = cookies.access ?? false;

    if (access === false) {
      return res.status(401).json({
        error: 'User unauthorized to make this request',
      });
    }

    try {
      const config = {
        headers: {
          Authorization: `JWT ${access}`,
          Accept: 'application/json',
        },
      };

      const apiRes = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_API_URL}/api/delivery/get_addresses/`,
        config,
      );

      if (apiRes.status === 200) {
        return res.status(200).json(apiRes.data);
      } else {
        return res.status(apiRes.status).json({
          error: 'Error',
        });
      }
    } catch (err) {
      return res.status(500).json({
        error: 'Something went wrong',
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({
      error: `Method ${req.method} not allowed`,
    });
  }
}
