import axios from 'axios';
import cookie from 'cookie';

const createQuestionAnswer = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const cookies = cookie.parse(req.headers.cookie || '');
      const { access } = cookies;

      const { questionUUID, content } = req.body;

      const apiUrl = `${process.env.NEXT_PUBLIC_APP_COURSES_URL}/api/courses/answers/create/`;
      const apiRes = await axios.post(
        apiUrl,
        { questionUUID, content },
        { headers: { Authorization: `JWT ${access}` } },
      );

      res.status(200).json(apiRes.data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};

export default createQuestionAnswer;
