const fetchCourse = async (courseUUID) => {
  try {
    const res = await fetch(`/api/sell/courses/get`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ courseUUID }),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching course:', error);
  }
};

export default fetchCourse;
