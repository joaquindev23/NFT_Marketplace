import axios from 'axios';

export default async function ListPolygonTokens(
  page,
  pageSize,
  maxPageSize,
  search,
  name,
  symbol,
  address,
  decimals,
) {
  const controller = new AbortController();
  const abortSignal = controller.signal;

  try {
    const access = localStorage.getItem('access');
    const config = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `JWT ${access}`,
      },
    };

    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_CRYPTO_URL}/api/tokens/list/?filter=date_created&p=${page}&page_size=${pageSize}&max_page_size=${maxPageSize}&search=${search}&name=${name}&symbol=${symbol}&address=${address}&decimals=${decimals}`,
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
      // eslint-disable-next-line
      console.log('Request canceled', err.message);
    } else {
      // eslint-disable-next-line
      console.log(err);
    }
  }
}
