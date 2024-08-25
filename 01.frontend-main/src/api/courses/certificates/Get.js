import axios from 'axios';
// import { ToastError } from '../../../components/ToastError';

export default async function FetchCourseCertificate(courseUUID) {
  const controller = new AbortController();
  const abortSignal = controller.signal;

  try {
    const access = localStorage.getItem('access');
    const config = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `JWT ${access}`,
      },
    };

    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_COURSES_API_URL}/api/certificates/get/${courseUUID}/`,
      {
        ...config,
        signal: abortSignal,
      },
    );

    if (res.status === 200) {
      return res;
    }
  } catch (err) {
    if (axios.isCancel(err)) {
      //   ToastError(`Error: ${err.response.statusText}`);
      // eslint-disable-next-line
      console.log(err.response.statusText);
    } else {
      //   ToastError(`Error: ${err.response.statusText}`);
      // eslint-disable-next-line
      console.log(err.response.statusText);
    }
  }
}
