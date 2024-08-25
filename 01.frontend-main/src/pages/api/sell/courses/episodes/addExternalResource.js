import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    try {
      const cookies = cookie.parse(req.headers.cookie ?? '');
      const access = cookies.access ?? false;

      const { title, url, episodeUUID } = req.body;

      // Here, call the Django API to create an external resource
      const apiRes = await fetch(
        `${process.env.NEXT_PUBLIC_APP_COURSES_URL}/api/courses/teacher/episodes/resources/edit/external/`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `JWT ${access}`,
          },
          body: JSON.stringify({
            title,
            url,
            episodeUUID,
          }),
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
