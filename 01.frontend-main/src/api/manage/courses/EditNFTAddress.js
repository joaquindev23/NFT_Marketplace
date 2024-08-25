import axios from 'axios';

export default async function EditNFTAddress(courseUUID, nftAddress) {
  const controller = new AbortController();
  const abortSignal = controller.signal;

  try {
    const body = JSON.stringify({
      courseUUID,
      nftAddress,
    });

    const res = await axios.put('/api/sell/courses/editNFTAddress', body, {
      headers: {
        'Content-Type': 'application/json',
      },
      signal: abortSignal,
    });

    if (res.status === 200) {
      return res.data.results;
    }
  } catch (err) {
    if (axios.isCancel(err)) {
      console.log('Request canceled', err.message);
    } else {
      console.log(err);
    }
  }
}
