// utils/fetchAuthenticatedUser.js
import axios from 'axios';

const fetchAuthenticatedUser = async (access) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_API_URL}/auth/users/me/`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `JWT ${access}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export default fetchAuthenticatedUser;
