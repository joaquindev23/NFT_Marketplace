import cookie from 'cookie';

const listCoupons = async (req, res) => {
  if (req.method === 'GET') {
    const cookies = cookie.parse(req.headers.cookie ?? '');
    const access = cookies.access ?? false;

    if (access === false) {
      return res.status(401).json({
        error: 'User unauthorized to make this request',
      });
    }

    const { type, object, p, page_size, max_page_size } = req.query;
    try {
      const apiRes = await fetch(
        `${process.env.NEXT_PUBLIC_APP_COUPONS_API_URL}/api/coupons/list/?type=${type}&object=${object}&p=${p}&page_size=${page_size}&max_page_size=${max_page_size}`,
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
};

export default listCoupons;
