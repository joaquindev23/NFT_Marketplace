import axios from 'axios';
import cookie from 'cookie';

const acceptAnswer = async (req, res) => {
  if (req.method === 'PUT') {
    try {
      const { answerId } = req.body;
      const cookies = cookie.parse(req.headers.cookie || '');
      const { access } = cookies;

      const apiUrl = `${process.env.NEXT_PUBLIC_APP_COURSES_URL}/api/courses/answers/accept/`;
      const apiRes = await axios.put(
        apiUrl,
        { answerId },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `JWT ${access}`,
          },
        },
      );

      res.status(200).json(apiRes.data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};

export default acceptAnswer;
