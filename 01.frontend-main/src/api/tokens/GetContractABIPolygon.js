import axios from 'axios';
import { ToastError } from '../../components/toast/ToastError';

export default async function GetContractABIPolygon(tokenAddress) {
  const controller = new AbortController();
  const abortSignal = controller.signal;

  try {
    const config = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };

    const res = await axios.get(
      `https://api-testnet.polygonscan.com/api?module=contract&action=getabi&address=${tokenAddress}&apikey=${process.env.NEXT_PUBLIC_APP_POLYGONSCAN_API_KEY}`,
      {
        ...config,
        signal: abortSignal,
      },
    );

    if (res.status === 200) {
      return res;
    }
  } catch (err) {
    if (axios.isCancel(err)) {
      ToastError(`Error: ${err}`);
    } else {
      ToastError(`Error: ${err}`);
    }
  }
}
