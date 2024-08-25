import axios from 'axios';

export default async function GenerateCertificate(courseUUID) {
  const controller = new AbortController();
  const abortSignal = controller.signal;

  try {
    const body = JSON.stringify({ courseUUID });

    const res = await axios.post('/api/courses/certificates/create', body, { signal: abortSignal });

    if (res.status === 200) {
      return res;
    }
  } catch (err) {
    if (axios.isCancel(err)) {
      console.log('Request canceled', err.message);
    } else {
      console.log(err);
    }
  }
}
