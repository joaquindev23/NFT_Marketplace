const ListSellerCourses = async (
  page,
  pageSize,
  maxPageSize,
  filterBy,
  orderBy,
  filterByAuthor,
  filterByCategory,
  filterByBusinessActivity,
  filterByType,
  searchBy,
) => {
  try {
    const res = await fetch(
      `/api/sell/courses/list?page=${page}&pageSize=${pageSize}&maxPageSize=${maxPageSize}&filterBy=${filterBy}&orderBy=${orderBy}&author=${filterByAuthor}&category=${filterByCategory}&businessActivity=${filterByBusinessActivity}&type=${filterByType}&search=${searchBy}`,
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching seller courses:', error);
  }
};

export default ListSellerCourses;
