import axios from 'axios';

export default async function DeleteResource(resourceUUID) {
  const controller = new AbortController();
  const abortSignal = controller.signal;

  try {
    const res = await axios.post(
      '/api/sell/courses/episodes/deleteResource',
      { resourceUUID },
      {
        signal: abortSignal,
      },
    );

    if (res.status === 200) {
      return res.data.results;
    }
  } catch (err) {
    if (axios.isCancel(err)) {
      // eslint-disable-next-line
      console.log('Request canceled', err.message);
    } else {
      // eslint-disable-next-line
      console.log(err);
    }
  } finally {
    controller.abort();
  }
}
