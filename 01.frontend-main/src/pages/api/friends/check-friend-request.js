import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Process a GET request

    const cookies = cookie.parse(req.headers.cookie ?? ''); // Verify authentication
    const access = cookies.access ?? false; // Get access token from cookie with "access" value

    if (access === false) {
      return res.status(401).json({
        error: 'User unauthorized to make this request',
      });
    } // If access token (not authenticated) then response == 401 Unauthorized

    const { email } = req.body;

    const body = JSON.stringify({
      email,
    });

    try {
      // Your Fetch Code Here
      const apiRes = await fetch(
        `${process.env.NEXT_PUBLIC_APP_API_URL}/api/friends/friend-requests/check-sent/`,
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

      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({
        error: 'Something went wrong',
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({
      error: `Method ${req.method} not allowed`,
    }); // Error, METHOD not allowed
  }
}
