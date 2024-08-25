async function FetchInstructorSections(courseUUID) {
  try {
    const res = await fetch('/api/sell/courses/getSections', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        courseUUID,
      }),
    });

    if (res.status === 200) {
      const sectionsData = await res.json();
      return sectionsData;
    } else {
      console.error('Error fetching instructor sections:', res.status);
      return null;
    }
  } catch (err) {
    console.error('Error fetching instructor sections:', err);
    return null;
  }
}

export default FetchInstructorSections;
