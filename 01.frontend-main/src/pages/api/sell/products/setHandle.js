import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const cookies = cookie.parse(req.headers.cookie ?? '');
    const access = cookies.access ?? false;

    if (access === false) {
      return res.status(403).json({
        error: 'User forbidden from making the request',
      });
    }

    const { productUUID, bool, url } = req.body;

    const body = JSON.stringify({
      productUUID,
      bool,
    });

    try {
      const apiRes = await fetch(
        `${process.env.NEXT_PUBLIC_APP_PRODUCTS_URL}/api/products/edit/handle/${url}/`,
        {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `JWT ${access}`,
          },
          body: body,
        },
      );

      const data = await apiRes.json();

      if (apiRes.status === 200) {
        return res.status(200).json(data);
      } else {
        return res.status(apiRes.status).json({
          error: data.error,
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        error: 'Something went wrong',
      });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
