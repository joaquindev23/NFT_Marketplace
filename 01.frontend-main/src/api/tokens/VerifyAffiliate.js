import axios from 'axios';

export default async function VerifyAffiliate(polygonAddress, ticketId) {
  const controller = new AbortController();
  const abortSignal = controller.signal;

  try {
    const access = localStorage.getItem('access');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${access}`,
      },
    };

    const body = JSON.stringify({
      polygon_address: polygonAddress,
      ticket_id: ticketId,
    });

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_CRYPTO_URL}/api/courses/verify_affiliate/`,
      body,
      {
        ...config,
        signal: abortSignal,
      },
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
