import axios from 'axios';

export default async function DeleteQuestion(questionId) {
  try {
    const res = await axios.post('/api/courses/episodes/questions/delete', { questionId });

    if (res.status === 200) {
      // ToastSuccess('Question deleted successfully.');
      return res;
    }
  } catch (err) {
    // ToastError(`Error: ${err.response.statusText}`);
  }
}
