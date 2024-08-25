import axios from 'axios';

export default async function VerifyTokenOwnershipSSR(address, ticketId, access) {
  const controller = new AbortController();
  const abortSignal = controller.signal;

  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${access}`,
      },
    };

    const body = JSON.stringify({
      address,
      ticketId,
    });

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_PAYMENT_URL}/api/crypto/verify_ticket_ownership/`,
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
