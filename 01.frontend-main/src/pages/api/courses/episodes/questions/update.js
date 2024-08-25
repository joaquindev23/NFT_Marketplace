import axios from 'axios';
import cookie from 'cookie';

const updateQuestion = async (req, res) => {
  if (req.method === 'PUT') {
    try {
      const { questionId, title, body } = req.body;
      const cookies = cookie.parse(req.headers.cookie || '');
      const { access } = cookies;

      const apiUrl = `${process.env.NEXT_PUBLIC_APP_COURSES_URL}/api/courses/questions/update/`;
      const apiRes = await axios.put(
        apiUrl,
        { questionId, title, body },
        {
          headers: { Authorization: `JWT ${access}` },
        },
      );

      res.status(200).json(apiRes.data);
    } catch (error) {
      res.status(error.response.status).json({ message: error.message });
    }
  } else {
    res.setHeader('Allow', 'PUT');
    res.status(405).end('Method Not Allowed');
  }
};

export default updateQuestion;
