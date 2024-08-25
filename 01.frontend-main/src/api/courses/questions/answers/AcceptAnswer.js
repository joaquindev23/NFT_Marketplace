import axios from 'axios';

export default async function AcceptAnswer(answerId) {
  try {
    const body = JSON.stringify({
      answerId,
    });

    const res = await axios.put('/api/courses/episodes/questions/answers/accept', body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.status === 200) {
      return res;
    }
  } catch (err) {
    if (axios.isCancel(err)) {
      // console.log('Request canceled', err.message);
    } else {
      // console.log(err);
    }
  }
}
