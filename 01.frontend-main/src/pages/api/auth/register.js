const register = async (req, res) => {
  if (req.method === 'POST') {
    const { first_name, last_name, email, username, password, re_password, agreed } = req.body;

    const body = JSON.stringify({
      first_name,
      last_name,
      email,
      username,
      password,
      re_password,
      agreed,
    });

    try {
      const apiRes = await fetch(`${process.env.NEXT_PUBLIC_APP_API_URL}/auth/users/`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body,
      });

      const data = await apiRes.json();

      if (apiRes.status === 201) {
        return res.status(201).json(data);
      } else {
        return res.status(apiRes.status).json({
          error: 'User or email already exist.',
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

export default register;
