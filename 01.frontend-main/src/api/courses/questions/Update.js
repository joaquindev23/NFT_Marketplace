import axios from 'axios';

export default async function UpdateQuestion(questionId, title, body) {
  try {
    const res = await axios.put('/api/courses/episodes/questions/update', {
      questionId,
      title,
      body,
    });

    if (res.status === 200) {
      return res;
    }
  } catch (err) {
    // eslint-disable-next-line
    console.log(err);
  }
}
