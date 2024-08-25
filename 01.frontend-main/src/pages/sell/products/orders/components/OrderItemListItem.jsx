import { CalendarIcon, MapIcon, UsersIcon } from '@heroicons/react/20/solid';
import moment from 'moment';
import Link from 'next/link';

export default function OrderItemListItem({ item }) {
  return (
    <li key={item && item.id}>
      <div className="block bg-white dark:bg-dark-bg dark:border-dark-second dark:hover:bg-dark-third my-0.5 shadow-neubrutalism-md border-2 dark:shadow-none  border-gray-900 hover:bg-gray-50">
        <div className="px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <Link
              href={`/sell/products/orders/${item && item.id}`}
              className="text-sm font-medium text-iris-500 dark:text-dark-primary truncate"
            >
              Order Item: {item && item.name}
            </Link>
            <div className="ml-2 flex-shrink-0 flex">
              {item && item.status === 'delivered' ? (
                <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Enviado
                </p>
              ) : item && item.status === 'shipping' ? (
                <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  En Camino
                </p>
              ) : item && item.status === 'processing' ? (
                <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  Procesando
                </p>
              ) : item && item.status === 'cancelled' ? (
                <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-rose-100 text-rose-800">
                  Cancelado
                </p>
              ) : (
                <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                  Por Procesar
                </p>
              )}
            </div>
          </div>
          <div className="mt-2 sm:flex sm:justify-between">
            <div className="sm:flex">
              <p className="flex items-center text-sm text-gray-500">
                <UsersIcon
                  className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                @{' '}
                <Link
                  className="ml-1 text-iris-500 hover:text-iris-400 dark:text-dark-accent dark:hover:text-dark-primary"
                  href={`/@/${item && item.buyer}`}
                >
                  Message Buyer
                </Link>
              </p>
              <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                <MapIcon
                  className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                {item && item.delivery_address ? (
                  <>
                    {item && item.delivery_address.address_line_1} |{' '}
                    {item && item.delivery_address.address_line_2}
                  </>
                ) : (
                  <>
                    {item && item.address_line_1} | {item && item.address_line_2}
                  </>
                )}
              </p>
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
              <CalendarIcon
                className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              <p>{moment(item && item.date_added).format('MMMM Do YYYY')}</p>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
