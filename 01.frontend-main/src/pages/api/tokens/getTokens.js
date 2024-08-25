import cookie from 'cookie';

const getTokens = async (req, res) => {
  if (req.method === 'GET') {
    const cookies = cookie.parse(req.headers.cookie ?? '');
    const access = cookies.access ?? false;

    if (access === false) {
      return res.status(401).json({
        error: 'User unauthorized to make this request',
      });
    }

    const { page, pageSize, maxPageSize, search, name, symbol, address, decimals, walletAddress } =
      req.query;

    try {
      const apiRes = await fetch(
        `${process.env.NEXT_PUBLIC_APP_CRYPTO_URL}/api/tokens/list/?filter=date_created&p=${page}&page_size=${pageSize}&max_page_size=${maxPageSize}&search=${search}&name=${name}&symbol=${symbol}&address=${address}&decimals=${decimals}&wallet=${walletAddress}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: `JWT ${access}`,
          },
        },
      );
      const data = await apiRes.json();

      if (apiRes.status === 200) {
        return res.status(200).json({
          data: data,
        });
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
};

export default getTokens;
