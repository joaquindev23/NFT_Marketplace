import axios from 'axios';
import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { courseUUID, page, pageSize, maxPageSize, sortBy, filterBy, userId, search } = req.query;
    const cookies = cookie.parse(req.headers.cookie || '');
    const { access } = cookies;

    try {
      const config = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `JWT ${access}`,
        },
      };

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_COURSES_URL}/api/courses/questions/list/?id=${courseUUID}&sort_by=${sortBy}&filter_by=${filterBy}&p=${page}&page_size=${pageSize}&max_page_size=${maxPageSize}&user_id=${userId}&search=${search}`,
        config,
      );

      res.status(200).json(response.data);
    } catch (error) {
      res.status(error.response.status).json(error.response.data);
    }
  } else {
    res.setHeader('Allow', 'GET');
    res.status(405).end('Method Not Allowed');
  }
}
