const setProductHandle = async (productUUID, bool, url) => {
  try {
    const response = await fetch('/api/sell/products/setHandle', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productUUID, bool, url }),
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

export default setProductHandle;
