import axios from 'axios';

export default async function CreateQuestionAnswer(questionUUID, content) {
  const controller = new AbortController();
  const abortSignal = controller.signal;

  try {
    const body = JSON.stringify({
      questionUUID,
      content,
    });

    console.log(body);

    const res = await axios.post('/api/courses/episodes/questions/answers/create', body, {
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
      // eslint-disable-next-line
      console.log('Request canceled', err.message);
    } else {
      // eslint-disable-next-line
      console.log(err);
    }
  }
}
