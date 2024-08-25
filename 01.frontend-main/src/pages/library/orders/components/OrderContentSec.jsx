import OrderContentList from './OrderContentList';

export default function OrderContentSec({ order, orderItems }) {
  return (
    <div>
      <OrderContentList order={order} orderItems={orderItems} />
    </div>
  );
}
