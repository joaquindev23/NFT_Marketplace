import axios from 'axios';

export default async function ListTokenBalances(tokens, address) {
  try {
    const access = localStorage.getItem('access');
    const config = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `JWT ${access}`,
      },
    };

    const body = JSON.stringify({
      tokens,
      address,
    });

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_CRYPTO_URL}/api/tokens/list/balances/`,
      body,
      {
        ...config,
        // signal: abortSignal,
      },
    );

    if (res.status === 200) {
      return res;
    }
  } catch (err) {
    if (axios.isCancel(err)) {
      // eslint-disable-next-line
      console.log('Request canceled', err.message);
    } else {
      // eslint-disable-next-line
      console.log(err);
    }
  }
}
