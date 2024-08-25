import axios from 'axios';

export default async function GetNFTStock(address, ticketId) {
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
      address,
      ticketId,
    });

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_PAYMENT_URL}/api/crypto/get_stock/`,
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
