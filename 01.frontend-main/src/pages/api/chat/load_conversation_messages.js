import axios from 'axios';
import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { roomName, roomGroupName, p, page_size, max_page_size, filter_by, order_by, search } =
      req.query;
    const cookies = cookie.parse(req.headers.cookie || '');
    const accessToken = cookies.access;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `JWT ${accessToken}`,
      },
    };

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_CHAT_API_URL}/api/chat/load_conversation_messages/${roomName}/${roomGroupName}/?p=${p}&page_size=${page_size}&max_page_size=${max_page_size}&filter_by=${filter_by}&order_by=${order_by}&search=${search}`,
        config,
      );

      res.status(response.status).json(response.data);
    } catch (error) {
      res.status(error.response.status).json({ message: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
