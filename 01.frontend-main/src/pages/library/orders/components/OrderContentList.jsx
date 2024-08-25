import OrderContentItem from '@/components/OrderContentItem';

export default function OrderContentList({ order, orderItems }) {
  return (
    <div className="space-y-4">
      {order &&
        orderItems &&
        orderItems.map((item, index) => (
          <OrderContentItem item={item} order={order} key={item.id} index={index} />
        ))}
      {order && orderItems.length === 0 && <div>No order items</div>}
    </div>
  );
}
