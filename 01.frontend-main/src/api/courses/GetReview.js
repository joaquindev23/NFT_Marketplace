import axios from 'axios';

export default async function GetCourseReview(courseUUID) {
  const controller = new AbortController();
  const abortSignal = controller.signal;

  try {
    const res = await axios.get(`/api/courses/reviews/get?courseUUID=${courseUUID}`, {
      signal: abortSignal,
    });

    if (res.status === 200) {
      return res;
    }
  } catch (err) {
    if (axios.isCancel(err)) {
      console.log(err.response.statusText);
    } else {
      console.log(err.response.statusText);
    }
  }
}
