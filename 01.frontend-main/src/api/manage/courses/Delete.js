import axios from 'axios';

export default async function DeleteCourse(courseUUID) {
  try {
    const body = { courseUUID };
    const res = await axios.post('/api/sell/courses/delete', body);

    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error(res.data.message);
    }
  } catch (err) {
    console.error(err.message);
  }
}
