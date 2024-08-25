import axios from 'axios';

export default async function AddAnswerLike(answerId, action) {
  try {
    const res = await axios.put('/api/courses/episodes/questions/answers/like', {
      answerId,
      action,
    });

    if (res.status === 200) {
      return res;
    }
  } catch (err) {
    // eslint-disable-next-line
    console.log(err);
  }
}
