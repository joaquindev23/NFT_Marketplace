import axios from 'axios';
import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const cookies = cookie.parse(req.headers.cookie || '');
    const accessToken = cookies.access;

    const config = {
      headers: {
        ...req.headers,
        Authorization: `JWT ${accessToken}`,
      },
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_CHAT_API_URL}/api/chat/send_message/`,
        req.body,
        config,
      );

      res.status(response.status).json(response.data);
    } catch (error) {
      res.status(error.response.status).json({ message: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
