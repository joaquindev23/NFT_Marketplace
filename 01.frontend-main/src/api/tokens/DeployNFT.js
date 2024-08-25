import axios from 'axios';
import { ToastError } from '../../components/toast/ToastError';

export default async function DeployNFT(
  id,
  price,
  tokenId,
  stock,
  teamMembers,
  uri,
  userAddress,
  userPolygonAddress,
) {
  const controller = new AbortController();
  const abortSignal = controller.signal;

  try {
    const body = JSON.stringify({
      id,
      price,
      tokenId,
      stock,
      teamMembers,
      uri,
      userAddress,
      userPolygonAddress,
    });

    const res = await axios.post('/api/tokens/deployNFT', body, {
      headers: {
        'Content-Type': 'application/json',
      },
      signal: abortSignal,
    });

    if (res.status === 200) {
      return res;
    }
  } catch (err) {
    if (axios.isCancel(err)) {
      console.log('Request canceled', err.message);
      ToastError(`Error: ${err.response.statusText}`);
    } else {
      console.log(err);
      ToastError(`Error: ${err.response.statusText}`);
    }
  }
}
