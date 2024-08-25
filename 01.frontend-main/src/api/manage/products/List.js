const ListSellerProducts = async (
  page,
  pageSize,
  maxPageSize,
  filterBy,
  orderBy,
  author,
  category,
  businessActivity,
  type,
  search,
) => {
  try {
    const res = await fetch(
      `/api/sell/products/list?page=${page}&pageSize=${pageSize}&maxPageSize=${maxPageSize}&filterBy=${filterBy}&orderBy=${orderBy}&author=${author}&category=${category}&businessActivity=${businessActivity}&type=${type}&search=${search}`,
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching seller courses:', error);
  }
};

export default ListSellerProducts;
