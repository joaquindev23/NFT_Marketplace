import cookie from 'cookie';

const createCoupon = async (req, res) => {
  if (req.method === 'POST') {
    const cookies = cookie.parse(req.headers.cookie ?? '');
    const access = cookies.access ?? false;

    if (access === false) {
      return res.status(401).json({
        error: 'User unauthorized to make this request',
      });
    }

    const { name, fixed_price_coupon, percentage_coupon, content_type, object_id } = req.body;

    try {
      const body = JSON.stringify({
        name,
        ...(fixed_price_coupon ? { fixed_price_coupon } : { percentage_coupon }),
        content_type,
        object_id,
      });

      const apiRes = await fetch(
        `${process.env.NEXT_PUBLIC_APP_COUPONS_API_URL}/api/coupons/create/`,
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

      if (apiRes.status === 201) {
        return res.status(201).json(data);
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
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({
      error: `Method ${req.method} not allowed`,
    });
  }
};

export default createCoupon;
