import axios from 'axios';

export default async function GetDeployNFTPrice(userAddress, userPolygonAddress) {
  const controller = new AbortController();
  const abortSignal = controller.signal;

  try {
    const res = await axios.get(
      `/api/sell/courses/deploy-price?userAddress=${userAddress}&userPolygonAddress=${userPolygonAddress}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        signal: abortSignal,
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
