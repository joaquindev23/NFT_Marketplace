// pages/api/deleteQuestion.js
import axios from 'axios';
import cookie from 'cookie';

const deleteQuestion = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const { questionId } = req.body;
      const cookies = cookie.parse(req.headers.cookie || '');
      const { access } = cookies;

      const apiUrl = `${process.env.NEXT_PUBLIC_APP_COURSES_URL}/api/courses/questions/delete/`;
      const apiRes = await axios.post(
        apiUrl,
        { questionId },
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

export default deleteQuestion;
