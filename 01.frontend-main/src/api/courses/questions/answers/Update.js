import axios from 'axios';

export default async function UpdateQuestionAnswer(answerId, body) {
  const controller = new AbortController();
  const abortSignal = controller.signal;

  try {
    const content = JSON.stringify({
      answerId,
      body,
    });

    const res = await axios.put('/api/courses/episodes/questions/answers/update', content, {
      headers: {
        'Content-Type': 'application/json',
      },
      signal: abortSignal,
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
