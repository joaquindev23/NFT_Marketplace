import axios from 'axios';

export default async function EditSection(title, learningObjective, number, sectionUUID) {
  const controller = new AbortController();
  const abortSignal = controller.signal;

  try {
    const res = await axios.put(
      '/api/sell/courses/sections/edit',
      {
        title,
        learningObjective,
        number,
        sectionUUID,
      },
      {
        signal: abortSignal,
      },
    );

    if (res.status === 200) {
      return res.data.results;
    }
  } catch (err) {
    if (axios.isCancel(err)) {
      // eslint-disable-next-line
      console.log('Request canceled', err.message);
    } else {
      // eslint-disable-next-line
      console.log(err);
    }
  } finally {
    controller.abort();
  }
}
