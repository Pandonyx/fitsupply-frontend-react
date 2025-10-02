import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CircularProgress,
  Button,
  IconButton,
  Snackbar,
  Alert,
  Chip,
} from "@mui/material";
import {
  ArrowBack,
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  Add,
  Remove,
} from "@mui/icons-material";
import { useProductsStore, useCartStore, useAuthStore } from "../../store";

function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { currentProduct, isLoading, fetchProductById } = useProductsStore();
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    // Extract ID from slug if needed, or fetch by slug
    // For now, assuming slug contains the ID
    const productId = slug;
    fetchProductById(productId);
  }, [slug]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const result = await addItem(currentProduct.id, quantity);

    if (result.success) {
      setSnackbar({
        open: true,
        message: `Added ${quantity} item(s) to cart!`,
        severity: "success",
      });
      setQuantity(1);
    } else {
      setSnackbar({
        open: true,
        message: "Failed to add to cart",
        severity: "error",
      });
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= currentProduct?.stock_quantity) {
      setQuantity(newQuantity);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <CircularProgress size={60} />
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen'>
        <h2 className='text-2xl font-bold text-gray-900 mb-4'>
          Product Not Found
        </h2>
        <Button
          onClick={() => navigate("/products")}
          variant='contained'>
          Back to Products
        </Button>
      </div>
    );
  }

  const isOutOfStock = currentProduct.stock_quantity === 0;
  const isLowStock =
    currentProduct.stock_quantity > 0 &&
    currentProduct.stock_quantity <= currentProduct.low_stock_threshold;
  const discount = currentProduct.compare_price
    ? Math.round(
        ((parseFloat(currentProduct.compare_price) -
          parseFloat(currentProduct.price)) /
          parseFloat(currentProduct.compare_price)) *
          100
      )
    : 0;

  return (
    <>
      <div className='min-h-screen bg-gray-50 py-8'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          {/* Back Button */}
          <button
            onClick={() => navigate("/products")}
            className='flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors'>
            <ArrowBack />
            <span>Back to Products</span>
          </button>

          {/* Product Detail */}
          <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 p-8'>
              {/* Product Image */}
              <div className='relative'>
                <div className='aspect-square bg-gray-100 rounded-lg overflow-hidden'>
                  {currentProduct.image ? (
                    <img
                      src={currentProduct.image}
                      alt={currentProduct.name}
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <div className='w-full h-full flex items-center justify-center text-gray-400'>
                      <span className='text-6xl'>📦</span>
                    </div>
                  )}
                </div>

                {/* Badges */}
                <div className='absolute top-4 left-4 flex flex-col gap-2'>
                  {currentProduct.is_featured && (
                    <Chip
                      label='Featured'
                      className='bg-yellow-400 text-gray-900 font-bold'
                    />
                  )}
                  {discount > 0 && (
                    <Chip
                      label={`${discount}% OFF`}
                      className='bg-green-500 text-white font-bold'
                    />
                  )}
                  {isOutOfStock && (
                    <Chip
                      label='Out of Stock'
                      className='bg-red-500 text-white font-bold'
                    />
                  )}
                  {isLowStock && (
                    <Chip
                      label='Low Stock'
                      className='bg-orange-500 text-white font-bold'
                    />
                  )}
                </div>

                {/* Favorite Button */}
                <IconButton
                  onClick={() => setIsFavorite(!isFavorite)}
                  className='absolute top-4 right-4 bg-white shadow-md hover:shadow-lg'>
                  {isFavorite ? (
                    <Favorite className='text-red-500' />
                  ) : (
                    <FavoriteBorder />
                  )}
                </IconButton>
              </div>

              {/* Product Info */}
              <div className='flex flex-col'>
                {/* Category */}
                <div className='mb-2'>
                  <span className='text-sm text-blue-600 font-semibold'>
                    {currentProduct.category?.name}
                  </span>
                </div>

                {/* Product Name */}
                <h1 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
                  {currentProduct.name}
                </h1>

                {/* Short Description */}
                {currentProduct.short_description && (
                  <p className='text-lg text-gray-600 mb-6'>
                    {currentProduct.short_description}
                  </p>
                )}

                {/* Price */}
                <div className='flex items-center gap-4 mb-6'>
                  <span className='text-4xl font-bold text-gray-900'>
                    ${currentProduct.price}
                  </span>
                  {currentProduct.compare_price && (
                    <span className='text-2xl text-gray-400 line-through'>
                      ${currentProduct.compare_price}
                    </span>
                  )}
                </div>

                {/* SKU and Stock */}
                <div className='mb-6 space-y-2'>
                  <p className='text-sm text-gray-600'>
                    <span className='font-semibold'>SKU:</span>{" "}
                    {currentProduct.sku}
                  </p>
                  <p className='text-sm text-gray-600'>
                    <span className='font-semibold'>Stock:</span>{" "}
                    <span
                      className={
                        isOutOfStock
                          ? "text-red-600"
                          : isLowStock
                          ? "text-orange-600"
                          : "text-green-600"
                      }>
                      {isOutOfStock
                        ? "Out of Stock"
                        : `${currentProduct.stock_quantity} available`}
                    </span>
                  </p>
                </div>

                {/* Quantity Selector */}
                {!isOutOfStock && (
                  <div className='mb-6'>
                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                      Quantity
                    </label>
                    <div className='flex items-center gap-4'>
                      <div className='flex items-center border border-gray-300 rounded-lg'>
                        <button
                          onClick={() => handleQuantityChange(-1)}
                          disabled={quantity <= 1}
                          className='p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'>
                          <Remove />
                        </button>
                        <span className='px-6 py-2 text-lg font-semibold'>
                          {quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(1)}
                          disabled={quantity >= currentProduct.stock_quantity}
                          className='p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'>
                          <Add />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Add to Cart Button */}
                <Button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  variant='contained'
                  size='large'
                  startIcon={<ShoppingCart />}
                  className='w-full py-4 text-lg font-semibold mb-4'
                  sx={{
                    bgcolor: isOutOfStock ? "gray.300" : "primary.main",
                    "&:hover": {
                      bgcolor: isOutOfStock ? "gray.300" : "primary.dark",
                    },
                  }}>
                  {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                </Button>

                {/* Stock Warning */}
                {isLowStock && (
                  <p className='text-sm text-orange-600 text-center'>
                    ⚠️ Only {currentProduct.stock_quantity} left in stock!
                  </p>
                )}
              </div>
            </div>

            {/* Product Description */}
            <div className='border-t border-gray-200 p-8'>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                Product Description
              </h2>
              <p className='text-gray-700 leading-relaxed whitespace-pre-line'>
                {currentProduct.description || "No description available."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Snackbar */}
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

export default ProductDetail;
