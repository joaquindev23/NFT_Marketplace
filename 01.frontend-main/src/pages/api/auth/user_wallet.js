import cookie from 'cookie';

const user_wallet = async (req, res) => {
  if (req.method === 'GET') {
    const cookies = cookie.parse(req.headers.cookie ?? '');
    const access = cookies.access ?? false;

    if (access === false) {
      return res.status(401).json({
        error: 'User unauthorized to make this request',
      });
    }

    try {
      const apiRes = await fetch(`${process.env.NEXT_PUBLIC_APP_API_URL}/api/wallets/my_wallet`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `JWT ${access}`,
        },
      });

      const data = await apiRes.json();

      if (apiRes.status === 200) {
        return res.status(200).json({
          wallet: data.results,
        });
      } else {
        return res.status(apiRes.status).json({
          error: 'Error',
        });
      }
    } catch (err) {
      res.status(500).json({ name: 'Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({
      error: `Method ${req.method} not allowed`,
    });
  }
};

export default user_wallet;
