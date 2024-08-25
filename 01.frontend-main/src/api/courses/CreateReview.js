import axios from 'axios';

export default async function CreateReview(courseUUID, rating, content) {
  const controller = new AbortController();
  const abortSignal = controller.signal;

  try {
    const body = {
      courseUUID,
      rating,
      content,
    };

    const res = await axios.post(`/api/courses/reviews/create`, body, { signal: abortSignal });

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
