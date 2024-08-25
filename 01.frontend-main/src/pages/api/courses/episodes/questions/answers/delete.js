import axios from 'axios';
import cookie from 'cookie';

const deleteAnswer = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const { answerId } = req.body;
      const cookies = cookie.parse(req.headers.cookie || '');
      const { access } = cookies;

      const apiUrl = `${process.env.NEXT_PUBLIC_APP_COURSES_URL}/api/courses/answers/delete/`;
      const apiRes = await axios.post(
        apiUrl,
        { answerId },
        {
          headers: { Authorization: `JWT ${access}` },
        },
      );

      res.status(200).json(apiRes.data);
    } catch (error) {
      res.status(error.response.status).json({ message: error.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

export default deleteAnswer;
