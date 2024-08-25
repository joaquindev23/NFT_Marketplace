import React from 'react';
import StandardPagination from '@/components/pagination/StandardPagination';
import ProductCardHorizontal from './create/ProductCardHorizontal';

export default function ProductsList({ pageSize, products, count, currentPage, setCurrentPage }) {
  return (
    <div className="overflow-hidden px-8 ">
      <ul className="gap-2 space-y-2">
        {products &&
          products.map((product) => <ProductCardHorizontal key={product.id} data={product} />)}
      </ul>
      <StandardPagination
        data={products && products}
        count={count}
        pageSize={pageSize}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
