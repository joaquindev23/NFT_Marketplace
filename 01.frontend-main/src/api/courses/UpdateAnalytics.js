import axios from 'axios';

export default async function UpdateAnalytics(courseUUID, watchTime) {
  const controller = new AbortController();
  const abortSignal = controller.signal;

  try {
    const access = localStorage.getItem('access');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${access}`,
      },
    };

    const body = JSON.stringify({
      courseUUID,
      watchTime,
    });

    await axios.put(
      `${process.env.NEXT_PUBLIC_APP_COURSES_URL}/api/courses/update/analytics/${courseUUID}/`,
      body,
      {
        ...config,
        signal: abortSignal,
      },
    );
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
