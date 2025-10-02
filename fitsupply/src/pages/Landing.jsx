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
  }, []);

  // Filter featured products
  const featuredProducts = products.filter((p) => p.is_featured).slice(0, 4);

  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <section className='bg-gradient-to-br from-blue-900 via-blue-700 to-blue-600 py-20 px-4 sm:py-32'>
        <div className='max-w-7xl mx-auto text-center'>
          {/* Main Heading */}
          <h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight'>
            Fuel Your <span className='text-yellow-400'>Performance</span>
          </h1>

          {/* Subheading */}
          <p className='text-lg sm:text-xl md:text-2xl text-white/90 max-w-4xl mx-auto mb-12 leading-relaxed px-4'>
            Premium sports supplements engineered for athletes who demand
            excellence. Build strength, enhance performance, and achieve your
            goals.
          </p>

          {/* CTA Buttons */}
          <div className='flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6'>
            <button
              onClick={() => navigate("/products")}
              className='w-full sm:w-auto px-8 py-4 bg-yellow-400 text-blue-900 font-bold text-lg rounded-xl hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 shadow-lg'>
              Shop Now
            </button>
            <button
              onClick={() => navigate("/products")}
              className='w-full sm:w-auto px-8 py-4 bg-transparent text-white font-bold text-lg rounded-xl border-2 border-white hover:bg-white hover:text-blue-900 transition-all duration-300 transform hover:scale-105'>
              Browse Catalog
            </button>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className='py-16 px-4 bg-white'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
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
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <div className='text-center py-12'>
              <p className='text-gray-600'>
                No featured products available at the moment.
              </p>
            </div>
          )}

          <div className='text-center mt-12'>
            <button
              onClick={() => navigate("/products")}
              className='px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors'>
              View All Products
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-16 px-4 bg-gray-50'>
        <div className='max-w-7xl mx-auto'>
          <h2 className='text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12'>
            Why Choose FitSupply?
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {/* Feature 1 */}
            <div className='bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow'>
              <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto'>
                <span className='text-3xl'>💪</span>
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-3 text-center'>
                Premium Quality
              </h3>
              <p className='text-gray-600 text-center'>
                Only the highest quality ingredients, tested and verified for
                purity and effectiveness.
              </p>
            </div>

            {/* Feature 2 */}
            <div className='bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow'>
              <div className='w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4 mx-auto'>
                <span className='text-3xl'>🚀</span>
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-3 text-center'>
                Fast Shipping
              </h3>
              <p className='text-gray-600 text-center'>
                Quick and reliable delivery to get your supplements when you
                need them.
              </p>
            </div>

            {/* Feature 3 */}
            <div className='bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow'>
              <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto'>
                <span className='text-3xl'>✅</span>
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-3 text-center'>
                Trusted by Athletes
              </h3>
              <p className='text-gray-600 text-center'>
                Join thousands of athletes who trust FitSupply for their
                nutrition needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-16 px-4 bg-blue-900'>
        <div className='max-w-4xl mx-auto text-center'>
          <h2 className='text-3xl md:text-4xl font-bold text-white mb-6'>
            Ready to Start Your Journey?
          </h2>
          <p className='text-xl text-white/90 mb-8'>
            Browse our complete catalog of premium supplements and take the
            first step toward your goals.
          </p>
          <button
            onClick={() => navigate("/products")}
            className='px-10 py-4 bg-yellow-400 text-blue-900 font-bold text-lg rounded-xl hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 shadow-lg'>
            View All Products
          </button>
        </div>
      </section>
    </div>
  );
}

export default Landing;
