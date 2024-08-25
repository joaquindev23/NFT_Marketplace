import axios from 'axios';
import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const cookies = cookie.parse(req.headers.cookie || '');
    const accessToken = cookies.access ? `JWT ${cookies.access}` : null;

    if (!accessToken) {
      return res.status(401).json({
        error: 'User unauthorized to make this request',
      });
    }

    const { body } = req;

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_APP_API_URL}/auth/users/set_password/`, body, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: accessToken,
        },
      });
      return res.status(204).json({ message: 'Password changed' });
    } catch (err) {
      return res.status(500).json({
        error: err.message,
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({
      error: `Method ${req.method} not allowed`,
    });
  }
}
