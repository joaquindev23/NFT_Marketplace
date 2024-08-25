import Link from 'next/link';

export default function ProductsByUser({ product, products }) {
  return (
    <div className="max-w-full py-4 ">
      <div className="flex items-center pt-8 justify-between">
        <h2 className="text-2xl font-black text-gray-900 mb-4 dark:text-dark-txt">
          More Products from:{' '}
          <span className="text-purple-500">
            <Link href={`/@/${product && product.author.username}`}>
              @{product && product.author.username}
            </Link>
          </span>
        </h2>
      </div>
      <div className="relative -mb-6 w-full overflow-x-auto pb-6">
        <ul className="mx-4 inline-flex space-x-8 sm:mx-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-x-8 lg:space-x-28">
          {products && products.map((p) => <div>Prooduct Card</div>)}
        </ul>
      </div>
    </div>
  );
}
