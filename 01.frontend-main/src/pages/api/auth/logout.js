import cookie from 'cookie';

const logout = async (req, res) => {
  if (req.method === 'POST') {
    res.setHeader('Set-Cookie', [
      cookie.serialize('access', '', {
        httpOnly: true,
        secure: process.env.NEXT_PUBLIC_APP_ENV !== 'development',
        expires: new Date(0),
        sameSite: 'strict',
        path: '/',
      }),
      cookie.serialize('refresh', '', {
        httpOnly: true,
        secure: process.env.NEXT_PUBLIC_APP_ENV !== 'development',
        expires: new Date(0),
        sameSite: 'strict',
        path: '/',
      }),
    ]);

    return res.status(200).json({
      success: 'Successfully logged out',
    });
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({
      error: `Method ${req.method} not allowed`,
    });
  }
};

export default logout;
