import axios from 'axios';
import Cookies from 'js-cookie';

export default async function AddTokenToList(
  address,
  name,
  symbol,
  decimals,
  network,
  userAddress,
) {
  const controller = new AbortController();
  const abortSignal = controller.signal;

  try {
    const access = Cookies.get('access');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${access}`,
      },
    };

    const body = JSON.stringify({
      address,
      name,
      symbol,
      decimals,
      network,
      userAddress,
    });

    await axios.put(`${process.env.NEXT_PUBLIC_APP_CRYPTO_URL}/api/tokens/list/add/`, body, {
      ...config,
      signal: abortSignal,
    });
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
