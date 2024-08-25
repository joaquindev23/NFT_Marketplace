import axios from 'axios';

export default async function AddQuestionLike(questionId, action) {
  try {
    const res = await axios.put('/api/courses/episodes/questions/like', {
      questionId,
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
