import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    try {
      const cookies = cookie.parse(req.headers.cookie ?? '');
      const access = cookies.access ?? false;

      if (access === false) {
        return res.status(401).json({
          error: 'User unauthorized to make this request',
        });
      }

      const { username } = req.body;
      const body = JSON.stringify({ username });

      const apiRes = await fetch(
        `${process.env.NEXT_PUBLIC_APP_API_URL}/api/profiles/edit/username`,
        {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `JWT ${access}`,
          },
          body,
        },
      );

      const data = await apiRes.json();

      return res.status(apiRes.status).json(data);
    } catch (err) {
      console.error('Error in API route handler:', err);

      return res.status(500).json({
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
