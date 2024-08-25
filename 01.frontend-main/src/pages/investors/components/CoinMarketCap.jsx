const stats = [
  { id: 1, name: 'Token Holders', value: '8,000+' },
  { id: 2, name: 'Price', value: '$0.01' },
  { id: 3, name: 'Daily Change', value: '20%' },
  { id: 4, name: 'Market Cap', value: '$100,000' },
  { id: 5, name: 'Total Supply', value: '1,005,577' },
];

export default function CoinMarketCap() {
  return (
    <div className=" py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight dark:text-dark-txt text-gray-900 sm:text-4xl">
              Praedium Token
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-dark-txt-secondary">
              Realtime analytics about our DAO governance token.{' '}
              <span className="ml-2 font-bold text-iris-400 dark:text-dark-accent">View More</span>
            </p>
          </div>
          <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-5">
            {stats.map((stat) => (
              <div key={stat.id} className="flex flex-col bg-gray-400/5 p-8">
                <dt className="text-sm font-semibold leading-6 dark:text-dark-txt-secondary text-gray-600">
                  {stat.name}
                </dt>
                <dd className="order-first text-3xl font-semibold tracking-tight dark:text-dark-txt text-gray-900">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
