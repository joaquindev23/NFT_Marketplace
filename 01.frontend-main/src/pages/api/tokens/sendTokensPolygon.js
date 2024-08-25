import cookie from 'cookie';

const sendTokensPolygon = async (req, res) => {
  if (req.method === 'POST') {
    const cookies = cookie.parse(req.headers.cookie ?? '');
    const access = cookies.access ?? false;

    if (access === false) {
      return res.status(401).json({
        error: 'User unauthorized to make this request',
      });
    }

    const { fromAccount, toAccount, amount, token, speed, gasLimit } = req.body;

    const body = JSON.stringify({
      fromAccount,
      toAccount,
      amount,
      token,
      speed,
      gasLimit,
    });

    try {
      const apiRes = await fetch(
        `${process.env.NEXT_PUBLIC_APP_CRYPTO_URL}/api/tokens/send/polygon/`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `JWT ${access}`,
          },
          body,
        },
      );

      const data = await apiRes.json();

      if (apiRes.status === 200) {
        return res.status(200).json(data);
      } else {
        return res.status(apiRes.status).json({
          error: 'Error requesting to become seller',
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

export default sendTokensPolygon;
