import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const cookies = cookie.parse(req.headers.cookie ?? '');
    const refresh = cookies.refresh ?? false;

    console.log(refresh);

    if (refresh === false) {
      return res.status(401).json({
        error: 'User unauthorized to make this request',
      });
    }

    const body = JSON.stringify({
      refresh,
    });

    try {
      const apiRes = await fetch(`${process.env.NEXT_PUBLIC_APP_API_URL}/auth/jwt/refresh/`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body,
      });

      const data = await apiRes.json();
      console.log('Dataa response after fetch: ', data);

      if (apiRes.status === 200) {
        res.setHeader('Set-Cookie', [
          cookie.serialize('access', data.access, {
            httpOnly: true,
            secure: process.env.NEXT_PUBLIC_APP_ENV !== 'development',
            maxAge: 900, // 15 minutes in seconds
            sameSite: 'strict',
            path: '/',
          }),
          cookie.serialize('refresh', refresh, {
            httpOnly: true,
            secure: process.env.NEXT_PUBLIC_APP_ENV !== 'development',
            maxAge: 604800, // 7 days in seconds
            sameSite: 'strict',
            path: '/',
          }),
        ]);

        return res.status(200).json({
          success: 'Refresh request successful',
        });
      } else {
        return res.status(apiRes.status).json({
          error: 'Failed to fulfill refresh request',
        });
      }
    } catch (err) {
      return res.status(500).json({
        error: 'Something went wrong when trying to fulfill refresh request',
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
