import axios from 'axios';

export default async function AddVideo(video, filename, episodeUUID) {
  const controller = new AbortController();
  const abortSignal = controller.signal;

  try {
    const access = localStorage.getItem('access');
    const config = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `JWT ${access}`,
      },
    };

    const formData = new FormData();
    formData.append('video', video);
    formData.append('filename', filename);
    formData.append('episodeUUID', episodeUUID);

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_COURSES_URL}/api/courses/teacher/episodes/create/`,
      formData,
      {
        ...config,
        signal: abortSignal,
        // onUploadProgress: (progressEvent) => {
        //     let percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
        //     console.log(`Upload progress: ${percentCompleted}%`);
        // },
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
