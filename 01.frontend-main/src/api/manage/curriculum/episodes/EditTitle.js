import axios from 'axios';

export default async function EditEpisodeTitle(episodeUUID, title) {
  const controller = new AbortController();
  const abortSignal = controller.signal;

  try {
    const body = JSON.stringify({
      episodeUUID,
      title,
    });

    const res = await axios.put('/api/sell/courses/episodes/editTitle', body, {
      headers: {
        'Content-Type': 'application/json',
      },
      signal: abortSignal,
    });

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
