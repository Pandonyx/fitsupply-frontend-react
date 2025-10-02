import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton, Snackbar, Alert } from "@mui/material";
import { ShoppingCart, Favorite, FavoriteBorder } from "@mui/icons-material";
import { useCartStore, useAuthStore } from "../../store";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [isFavorite, setIsFavorite] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleAddToCart = async (e) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const result = await addItem(product.id, 1);

    if (result.success) {
      setSnackbar({
        open: true,
        message: "Added to cart!",
        severity: "success",
      });
    } else {
      setSnackbar({
        open: true,
        message: "Failed to add to cart",
        severity: "error",
      });
    }
  };

  const handleFavoriteToggle = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleCardClick = () => {
    navigate(`/products/${product.slug}`);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const isOutOfStock = product.stock_quantity === 0;
  const isLowStock =
    product.stock_quantity > 0 &&
    product.stock_quantity <= product.low_stock_threshold;

  return (
    <>
      <div
        onClick={handleCardClick}
        className='bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group'>
        {/* Image Container */}
        <div className='relative overflow-hidden bg-gray-100'>
          <img
            src={product.image}
            alt={product.name}
            className='w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300'
          />

          {/* Badges */}
          <div className='absolute top-3 left-3 flex flex-col gap-2'>
            {product.is_featured && (
              <span className='bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full'>
                Featured
              </span>
            )}
            {isOutOfStock && (
              <span className='bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full'>
                Out of Stock
              </span>
            )}
            {isLowStock && (
              <span className='bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full'>
                Low Stock
              </span>
            )}
            {product.compare_price && (
              <span className='bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full'>
                Sale
              </span>
            )}
          </div>

          {/* Favorite Button */}
          <div className='absolute top-3 right-3'>
            <IconButton
              onClick={handleFavoriteToggle}
              className='bg-white hover:bg-gray-100 shadow-md'
              size='small'>
              {isFavorite ? (
                <Favorite className='text-red-500' />
              ) : (
                <FavoriteBorder className='text-gray-600' />
              )}
            </IconButton>
          </div>
        </div>

        {/* Product Info */}
        <div className='p-4'>
          {/* Product Name */}
          <h3 className='text-lg font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]'>
            {product.name}
          </h3>

          {/* Short Description */}
          {product.short_description && (
            <p className='text-sm text-gray-600 mb-3 line-clamp-2'>
              {product.short_description}
            </p>
          )}

          {/* Price Section */}
          <div className='flex items-center gap-2 mb-4'>
            <span className='text-2xl font-bold text-gray-900'>
              ${product.price}
            </span>
            {product.compare_price && (
              <span className='text-lg text-gray-400 line-through'>
                ${product.compare_price}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
              isOutOfStock
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105"
            }`}>
            <ShoppingCart className='w-5 h-5' />
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </button>

          {/* Stock Info */}
          {!isOutOfStock && product.stock_quantity <= 20 && (
            <p className='text-xs text-orange-600 mt-2 text-center'>
              Only {product.stock_quantity} left in stock!
            </p>
          )}
        </div>
      </div>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default ProductCard;
