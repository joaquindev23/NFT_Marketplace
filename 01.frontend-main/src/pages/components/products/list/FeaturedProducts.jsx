import React from 'react';
// eslint-disable-next-line
import LoadingMoon from '@/components/loaders/LoadingMoon';
import ProductCardHorizontal from '@/components/ProductCardHorizontal';
import ProductCard from '@/components/ProductCard';

export default function FeaturedProducts({ data }) {
  return (
    <div className="bg-white">
      <div className="py-16 sm:py-24 lg:mx-auto lg:max-w-7xl lg:px-8">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-0">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Trending products</h2>
          {/* <a
            href="#"
            className="hidden text-sm font-semibold text-indigo-600 hover:text-indigo-500 sm:block"
          >
            See everything
            <span aria-hidden="true"> &rarr;</span>
          </a> */}
        </div>

        <div className="relative mt-8">
          <div className="relative -mb-6 w-full overflow-x-auto pb-6">
            <ul className="mx-4 p-1 inline-flex space-x-8 sm:mx-6 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-x-8 lg:space-x-2">
              {data ? (
                data.map((product, index) => (
                  <ProductCard key={product.id} index={index} data={product} />
                ))
              ) : (
                <LoadingMoon size={20} color="#1c1d1f" />
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
