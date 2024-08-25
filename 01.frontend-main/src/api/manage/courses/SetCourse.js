const setCourseHandle = async (courseUUID, bool, url) => {
  try {
    const response = await fetch('/api/sell/courses/setHandle', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ courseUUID, bool, url }),
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, data };
    } else {
      const error = await response.json();
      return { success: false, error };
    }
  } catch (err) {
    console.error(err);
    return { success: false, error: 'Something went wrong' };
  }
};

export default setCourseHandle;
