import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const cookies = cookie.parse(req.headers.cookie ?? '');
    const access = cookies.access ?? false;

    if (!access) {
      return res.status(401).json({
        error: 'User unauthorized to make this request',
      });
    }

    // Extract query parameters from the request
    const { p, page_size, max_page_size, filter, order, author, category, search } = req.query;
    try {
      const apiRes = await fetch(
        `${process.env.NEXT_PUBLIC_APP_COURSES_URL}/api/courses/paid_library/?p=${p}&page_size=${page_size}&max_page_size=${max_page_size}&filter=${filter}&order=${order}&category=${category}&author=${author}&search=${search}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `JWT ${access}`,
          },
        },
      );

      const data = await apiRes.json();

      if (apiRes.status === 200) {
        return res.status(200).json(data);
      } else {
        return res.status(apiRes.status).json({
          error: 'Error',
        });
      }
    } catch (err) {
      return res.status(500).json({
        error: 'Something went wrong',
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({
      error: `Method ${req.method} not allowed`,
    });
  }
}
