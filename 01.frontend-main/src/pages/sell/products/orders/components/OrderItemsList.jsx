import StandardPagination from '@/components/pagination/StandardPagination';
import OrderItemListItem from './OrderItemListItem';

export default function OrderItemList({
  pageSize,
  setPageSize,
  maxPageSize,
  setMaxPageSize,
  count,
  setCount,
  loading,
  currentPage,
  setCurrentPage,
  orders,
  setOrders,
}) {
  return (
    <div className="overflow-hidden px-8 ">
      <ul className="gap-2 space-y-2">
        {orders && orders.map((item) => <OrderItemListItem key={item.id} item={item} />)}
      </ul>
      <StandardPagination
        data={orders}
        count={count}
        pageSize={pageSize}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
