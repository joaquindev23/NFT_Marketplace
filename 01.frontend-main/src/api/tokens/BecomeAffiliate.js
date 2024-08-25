import axios from 'axios';

export default async function BecomeAffiliate(address, polygonAddress, ticketId) {
  const controller = new AbortController();
  const abortSignal = controller.signal;

  try {
    const res = await axios.post(
      '/api/tokens/becomeAffiliate',
      { address, polygonAddress, ticketId },
      { signal: abortSignal },
    );

    return res;
  } catch (err) {
    if (axios.isCancel(err)) {
      // eslint-disable-next-line
      // console.log('Request canceled', err.message);
    } else {
      // eslint-disable-next-line
      // console.log(err);
    }
  }
}
