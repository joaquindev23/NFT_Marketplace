const createCourse = async (
  type,
  title,
  category,
  subCategory,
  topic,
  dedication,
  user,
  ethAddress,
  polygonAddress,
) => {
  try {
    const res = await fetch(`/api/sell/courses/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type,
        title,
        category,
        subCategory,
        topic,
        dedication,
        user,
        ethAddress,
        polygonAddress,
      }),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error creating course:', error);
  }
};

export default createCourse;
