import axios from 'axios';

export default async function EditCourse(
  courseUUID,
  title,
  subTitle,
  description,
  language,
  level,
  taught,
  category,
  image,
  imageFilename,
  video,
) {
  const controller = new AbortController();
  const abortSignal = controller.signal;

  try {
    const access = localStorage.getItem('access');
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `JWT ${access}`,
      },
    };

    // const body = JSON.stringify({
    //   courseUUID,
    //   title,
    //   subTitle,
    //   description,
    //   language,
    //   level,
    //   taught,
    //   category,
    //   thumbnail,
    //   filename,
    //   video,
    // });

    const formData = new FormData();
    formData.append('courseUUID', courseUUID);
    formData.append('title', title);
    formData.append('subTitle', subTitle);
    formData.append('description', description);
    formData.append('language', language);
    formData.append('level', level);
    formData.append('taught', taught);
    formData.append('category', category);
    formData.append('thumbnail', image);
    formData.append('filename', imageFilename);
    formData.append('video', video);

    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_APP_COURSES_API_URL}/api/courses/edit/`,
      formData,
      {
        ...config,
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
