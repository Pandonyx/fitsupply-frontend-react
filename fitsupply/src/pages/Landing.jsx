import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { useProductsStore } from "../store";
import { ProductCard } from "../components/common";

function Landing() {
  const navigate = useNavigate();
  const { products, isLoading, fetchProducts } = useProductsStore();

  useEffect(() => {
    // Fetch all products on mount
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter featured products
  const featuredProducts = products.filter((p) => p.is_featured).slice(0, 4);

  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <section className='px-4 py-20 bg-gradient-to-br from-blue-900 via-blue-700 to-blue-600 sm:py-32'>
        <div className='mx-auto text-center max-w-7xl'>
          {/* Main Heading */}
          <h1 className='mb-6 text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl'>
            Fuel Your <span className='text-yellow-400'>Performance</span>
          </h1>

          {/* Subheading */}
          <p className='max-w-4xl px-4 mx-auto mb-12 text-lg leading-relaxed sm:text-xl md:text-2xl text-white/90'>
            Premium sports supplements engineered for athletes who demand
            excellence. Build strength, enhance performance, and achieve your
            goals.
          </p>

          {/* CTA Buttons */}
          <div className='flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6'>
            <button
              onClick={() => navigate("/products")}
              className='w-full px-8 py-4 text-lg font-bold text-blue-900 transition-all duration-300 transform bg-yellow-400 shadow-lg sm:w-auto rounded-xl hover:bg-yellow-300 hover:scale-105'>
              Shop Now
            </button>
            <button
              onClick={() => navigate("/products")}
              className='w-full px-8 py-4 text-lg font-bold text-white transition-all duration-300 transform bg-transparent border-2 border-white sm:w-auto rounded-xl hover:bg-white hover:text-blue-900 hover:scale-105'>
              Browse Catalog
            </button>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className='px-4 py-16 bg-white'>
        <div className='mx-auto max-w-7xl'>
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-3xl font-bold text-gray-900 md:text-4xl'>
              Featured Products
            </h2>
            <p className='text-lg text-gray-600'>
              Discover our most popular supplements trusted by athletes
              worldwide
            </p>
          </div>

          {isLoading ? (
            <div className='flex justify-center py-12'>
              <CircularProgress />
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <div className='py-12 text-center'>
              <p className='text-gray-600'>
                No featured products available at the moment.
              </p>
            </div>
          )}

          <div className='mt-12 text-center'>
            <button
              onClick={() => navigate("/products")}
              className='px-8 py-3 font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700'>
              View All Products
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='px-4 py-16 bg-gray-50'>
        <div className='mx-auto max-w-7xl'>
          <h2 className='mb-12 text-3xl font-bold text-center text-gray-900 md:text-4xl'>
            Why Choose FitSupply?
          </h2>

          <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
            {/* Feature 1 */}
            <div className='p-8 transition-shadow bg-white shadow-md rounded-xl hover:shadow-xl'>
              <div className='flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full'>
                <span className='text-3xl'>💪</span>
              </div>
              <h3 className='mb-3 text-xl font-bold text-center text-gray-900'>
                Premium Quality
              </h3>
              <p className='text-center text-gray-600'>
                Only the highest quality ingredients, tested and verified for
                purity and effectiveness.
              </p>
            </div>

            {/* Feature 2 */}
            <div className='p-8 transition-shadow bg-white shadow-md rounded-xl hover:shadow-xl'>
              <div className='flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full'>
                <span className='text-3xl'>🚀</span>
              </div>
              <h3 className='mb-3 text-xl font-bold text-center text-gray-900'>
                Fast Shipping
              </h3>
              <p className='text-center text-gray-600'>
                Quick and reliable delivery to get your supplements when you
                need them.
              </p>
            </div>

            {/* Feature 3 */}
            <div className='p-8 transition-shadow bg-white shadow-md rounded-xl hover:shadow-xl'>
              <div className='flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full'>
                <span className='text-3xl'>✅</span>
              </div>
              <h3 className='mb-3 text-xl font-bold text-center text-gray-900'>
                Trusted by Athletes
              </h3>
              <p className='text-center text-gray-600'>
                Join thousands of athletes who trust FitSupply for their
                nutrition needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='px-4 py-16 bg-blue-900'>
        <div className='max-w-4xl mx-auto text-center'>
          <h2 className='mb-6 text-3xl font-bold text-white md:text-4xl'>
            Ready to Start Your Journey?
          </h2>
          <p className='mb-8 text-xl text-white/90'>
            Browse our complete catalog of premium supplements and take the
            first step toward your goals.
          </p>
          <button
            onClick={() => navigate("/products")}
            className='px-10 py-4 text-lg font-bold text-blue-900 transition-all duration-300 transform bg-yellow-400 shadow-lg rounded-xl hover:bg-yellow-300 hover:scale-105'>
            View All Products
          </button>
        </div>
      </section>
    </div>
  );
}

export default Landing;
