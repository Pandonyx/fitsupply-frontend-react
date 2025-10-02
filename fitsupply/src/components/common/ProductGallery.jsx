import { ProductCard } from "./index";
import { CircularProgress } from "@mui/material";

function ProductGallery({
  products,
  isLoading,
  emptyMessage = "No products found",
}) {
  if (isLoading) {
    return (
      <div className='flex justify-center items-center py-20'>
        <CircularProgress size={60} />
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-20'>
        <div className='text-center'>
          <svg
            className='mx-auto h-24 w-24 text-gray-400'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={1.5}
              d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
            />
          </svg>
          <h3 className='mt-4 text-xl font-semibold text-gray-900'>
            {emptyMessage}
          </h3>
          <p className='mt-2 text-gray-600'>
            Try adjusting your filters or search query
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
}

export default ProductGallery;
