import axios from 'axios';

export default async function ListCouponsPaginated(page, pageSize, maxPagesize, type, objectUUID) {
  const controller = new AbortController();
  const abortSignal = controller.signal;

  try {
    const res = await axios.get(
      `/api/sell/promotions/list?type=${type}&object=${objectUUID}&p=${page}&page_size=${pageSize}&max_page_size=${maxPagesize}`,
      {
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
      // console.log(err);
      return err;
    }
  }
}
