import moment from 'moment';
import Link from 'next/link';
import StandardPagination from '@/components/pagination/StandardPagination';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function OrdersList({ pageSize, orders, count, currentPage, setCurrentPage }) {
  return (
    <div className="my-12">
      <div className="flex flex-col">
        <div className="mb-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b dark:border-dark-third border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 dark:bg-dark-second">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Transaction ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-dark-txt"
                    >
                      Date Purchased
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-dark-txt"
                    >
                      Amount
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-dark-txt"
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders &&
                    orders.map((order, personIdx) => (
                      <tr
                        key={order.id}
                        className={
                          personIdx % 2 === 0
                            ? 'bg-white dark:bg-dark-second'
                            : 'bg-gray-50 dark:bg-dark-third'
                        }
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium  text-gray-900 dark:text-dark-txt">
                          <Link
                            className="hover:text-blue-500"
                            href={`/library/orders/${order.transaction_id}`}
                          >
                            {order.transaction_id}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-txt">
                          {moment(order.date_issued).format('MMMM Do YYYY, h:mm:ss a')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-txt">
                          $ {order.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-txt">
                          {order.status == 'not_processed' ? (
                            <div
                              className={classNames(
                                order.status == 'not_processed'
                                  ? 'text-gray-600 rounded-full bg-gray-300'
                                  : '',
                                'text-center',
                              )}
                            >
                              Order placed
                            </div>
                          ) : order.status == 'processing' ? (
                            <div
                              className={classNames(
                                order.status == 'processing'
                                  ? 'text-blue-600 rounded-full bg-blue-300'
                                  : '',
                                'text-center',
                              )}
                            >
                              Processing
                            </div>
                          ) : order.status == 'shipping' ? (
                            <div
                              className={classNames(
                                order.status == 'shipping'
                                  ? 'text-blue-600 rounded-full bg-blue-300'
                                  : '',
                                'text-center',
                              )}
                            >
                              Shipping
                            </div>
                          ) : order.status == 'delivered' ? (
                            <div
                              className={classNames(
                                order.status == 'delivered'
                                  ? 'text-green-600 rounded-full bg-green-300'
                                  : '',
                                'text-center',
                              )}
                            >
                              Delivered
                            </div>
                          ) : (
                            <></>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
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
