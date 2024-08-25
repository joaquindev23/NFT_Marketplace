import axios from 'axios';

export default async function AddEpisodeViewed(episodeUUID) {
  try {
    const body = {
      episodeUUID,
    };

    const res = await axios.post('/api/courses/episodes/completed', body);

    if (res.status === 200) {
      return res;
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
