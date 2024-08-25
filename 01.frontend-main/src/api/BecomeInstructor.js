import axios from 'axios';
import Cookies from 'js-cookie';

import { ToastSuccess } from '../components/toast/ToastSuccess';

export default async function BecomeInstructor(userID) {
  const controller = new AbortController();
  const abortSignal = controller.signal;

  try {
    const access = Cookies.get('access');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${access}`,
      },
    };

    const body = JSON.stringify({
      userID,
    });

    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_APP_API_URL}/api/users/instructor/request/`,
      body,
      {
        ...config,
        signal: abortSignal,
      },
    );
    if (res.status === 200) {
      ToastSuccess('Instructor request sent succesfully/');
    }
  } catch (err) {
    if (axios.isCancel(err)) {
      // eslint-disable-next-line
      console.log('Request canceled', err.message);
    } else {
      // eslint-disable-next-line
      console.log(err);
    }
  }
}
