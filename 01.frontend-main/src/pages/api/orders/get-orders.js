import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { page, pageSize, maxPageSize, filterBy, orderBy, search } = req.query;
    console.log(req.query);

    try {
      const { access } = req.cookies;
      const config = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `JWT ${access}`,
        },
      };

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_ORDERS_URL}/api/orders/list_items/?filter=date_created&p=${page}&page_size=${pageSize}&max_page_size=${maxPageSize}&filter=${filterBy}&order=${orderBy}&search=${search}`,
        config,
      );

      if (response.status === 200) {
        res.status(200).json(response.data);
      } else {
        res.status(response.status).json({ message: 'Error fetching orders' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching orders' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
