import cookie from 'cookie';

const login = async (req, res) => {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    const body = JSON.stringify({
      email,
      password,
    });

    try {
      const apiRes = await fetch(`${process.env.NEXT_PUBLIC_APP_API_URL}/auth/jwt/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });

      const data = await apiRes.json();

      if (apiRes.status === 200) {
        res.setHeader('Set-Cookie', [
          cookie.serialize('access', data.access, {
            httpOnly: true,
            secure: process.env.NEXT_PUBLIC_APP_ENV !== 'development',
            maxAge: 60 * 60 * 24 * 90, // 90 days in seconds
            sameSite: 'strict',
            path: '/',
          }),
          cookie.serialize('refresh', data.refresh, {
            httpOnly: true,
            secure: process.env.NEXT_PUBLIC_APP_ENV !== 'development',
            maxAge: 60 * 60 * 24 * 180, // 180 days in seconds
            sameSite: 'strict',
            path: '/',
          }),
        ]);

        return res.status(200).json({
          success: 'Logged in successfully',
        });
      } else {
        return res.status(apiRes.status).json({
          error: 'Authentication failed',
        });
      }
    } catch (err) {
      return res.status(500).json({
        error: 'Something went wrong',
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
};

export default login;
