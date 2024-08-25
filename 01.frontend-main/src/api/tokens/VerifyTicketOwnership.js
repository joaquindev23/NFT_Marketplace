import axios from 'axios';

export default async function VerifyTokenOwnership(polygonAddress, address, ticketId) {
  const controller = new AbortController();
  const abortSignal = controller.signal;

  try {
    const config = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify({
      polygon_address: polygonAddress,
      nft_address: address,
      ticket_id: ticketId,
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
