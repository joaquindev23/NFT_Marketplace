import axios from 'axios';

export default async function DeleteAnswer(answerId) {
  try {
    const res = await axios.post('/api/courses/episodes/questions/answers/delete', { answerId });

    if (res.status === 200) {
      // ToastSuccess('Answer deleted successfully.');
      return res;
    }
  } catch (err) {
    // ToastError(`Error: ${err.response.statusText}`);
  }

  return false;
}
