import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    try {
      const cookies = cookie.parse(req.headers.cookie ?? '');
      const access = cookies.access ?? false;

      const { sectionUUID } = req.query;

      const apiRes = await fetch(
        `${process.env.NEXT_PUBLIC_APP_COURSES_URL}/api/courses/teacher/sections/delete/?sectionUUID=${sectionUUID}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `JWT ${access}`,
          },
        },
      );

      const data = await apiRes.json();

      if (apiRes.status === 200) {
        res.status(200).json(data);
      } else {
        res.status(apiRes.status).json({
          error: 'Error',
        });
      }
    } catch (err) {
      res.status(500).json({
        error: 'Something went wrong',
      });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    return res.status(405).json({
      error: `Method ${req.method} not allowed`,
    });
  }
}
