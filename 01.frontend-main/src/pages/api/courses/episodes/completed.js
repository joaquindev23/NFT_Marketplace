import axios from 'axios';
import cookie from 'cookie';

const addEpisodeViewed = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const { episodeUUID } = req.body;
      const cookies = cookie.parse(req.headers.cookie || '');
      const { access } = cookies;

      const apiUrl = `${process.env.NEXT_PUBLIC_APP_COURSES_URL}/api/courses/episodes/completed/`;
      const apiRes = await axios.post(
        apiUrl,
        { episodeUUID },
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

export default addEpisodeViewed;
