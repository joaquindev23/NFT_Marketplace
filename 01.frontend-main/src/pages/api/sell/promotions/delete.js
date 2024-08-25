import cookie from 'cookie';

const deleteCoupon = async (req, res) => {
  if (req.method === 'DELETE') {
    const cookies = cookie.parse(req.headers.cookie ?? '');
    const access = cookies.access ?? false;

    if (access === false) {
      return res.status(401).json({
        error: 'User unauthorized to make this request',
      });
    }

    const { couponUUID } = req.query;

    const body = JSON.stringify({
      couponUUID,
    });
    try {
      const apiRes = await fetch(
        `${process.env.NEXT_PUBLIC_APP_COUPONS_API_URL}/api/coupons/delete/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `JWT ${access}`,
          },
          body,
        },
      );

      if (apiRes.status === 200) {
        return res.status(200).json({ message: 'Coupon deleted successfully' });
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
    res.setHeader('Allow', ['DELETE']);
    return res.status(405).json({
      error: `Method ${req.method} not allowed`,
    });
  }
};

export default deleteCoupon;
