import cookie from 'cookie';

const updateWelcomeMessage = async (req, res) => {
  if (req.method === 'PUT') {
    const cookies = cookie.parse(req.headers.cookie ?? '');
    const access = cookies.access ?? false;

    if (access === false) {
      return res.status(401).json({
        error: 'User unauthorized to make this request',
      });
    }

    const { courseUUID, message } = req.body;

    try {
      const body = JSON.stringify({ courseUUID, message });

      const apiRes = await fetch(
        `${process.env.NEXT_PUBLIC_APP_COURSES_URL}/api/courses/update/welcome_message/`,
        {
          method: 'PUT',
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
          error: 'Error',
        });
      }
    } catch (err) {
      return res.status(500).json({
        error: 'Something went wrong',
      });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).json({
      error: `Method ${req.method} not allowed`,
    });
  }
};

export default updateWelcomeMessage;
