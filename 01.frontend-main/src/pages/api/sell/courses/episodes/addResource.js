import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const cookies = cookie.parse(req.headers.cookie ?? '');
    const access = cookies.access ?? false;

    if (access === false) {
      return res.status(401).json({
        error: 'User unauthorized to make this request',
      });
    }

    try {
      const apiRes = await fetch(
        `${process.env.NEXT_PUBLIC_APP_COURSES_URL}/api/courses/teacher/episodes/resources/edit/`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': req.headers['content-type'],
            Authorization: `JWT ${access}`,
          },
          body: req.body,
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
    res.setHeader('Allow', ['PUT']);
    return res.status(405).json({
      error: `Method ${req.method} not allowed`,
    });
  }
}
