import axios from 'axios';
import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const cookies = cookie.parse(req.headers.cookie || '');
    const accessToken = cookies.access;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `JWT ${accessToken}`,
      },
    };

    const { from_user_username, to_user, to_user_username } = req.body;

    console.log(req.body);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_CHAT_API_URL}/api/chat/start_conversation/`,
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
