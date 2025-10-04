import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, IconButton, CircularProgress, Divider } from "@mui/material";
import {
  Add,
  Remove,
  Delete,
  ShoppingCartOutlined,
  ArrowBack,
} from "@mui/icons-material";
import { useCartStore } from "../store";

function Cart() {
  const navigate = useNavigate();
  const {
    items,
    isLoading,
    fetchCart,
    updateQuantity,
    removeItem,
    clearCart,
    getTotal,
  } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    await updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = async (itemId) => {
    await removeItem(itemId);
  };

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      await clearCart();
    }
  };

  const total = getTotal();

  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <CircularProgress size={60} />
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className='min-h-screen bg-gray-50 py-12'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex flex-col items-center justify-center py-20'>
            <ShoppingCartOutlined
              className='w-24 h-24 text-gray-400 mb-6'
              style={{ fontSize: "6rem" }}
            />
            <h2 className='text-3xl font-bold text-gray-900 mb-4'>
              Your Cart is Empty
            </h2>
            <p className='text-gray-600 mb-8 text-center max-w-md'>
              Looks like you haven't added any items to your cart yet. Start
              shopping to fill it up!
            </p>
            <Button
              variant='contained'
              size='large'
              onClick={() => navigate("/products")}>
              Browse Products
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-8'>
          <button
            onClick={() => navigate("/products")}
            className='flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors'>
            <ArrowBack />
            <span>Continue Shopping</span>
          </button>
          <h1 className='text-4xl font-bold text-gray-900'>Shopping Cart</h1>
          <p className='text-gray-600 mt-2'>
            {items.length} {items.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Cart Items */}
          <div className='lg:col-span-2 space-y-4'>
            {items.map((item) => (
              <div
                key={item.id}
                className='bg-white rounded-lg shadow-sm p-6'>
                <div className='flex gap-4'>
                  {/* Product Image */}
                  <div className='w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden'>
                    {item.product.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      <div className='w-full h-full flex items-center justify-center text-gray-400'>
                        📦
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className='flex-1'>
                    <div className='flex justify-between items-start mb-2'>
                      <div>
                        <h3
                          className='text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer'
                          onClick={() =>
                            navigate(`/products/${item.product.slug}`)
                          }>
                          {item.product.name}
                        </h3>
                        {item.product.short_description && (
                          <p className='text-sm text-gray-600 mt-1'>
                            {item.product.short_description}
                          </p>
                        )}
                      </div>
                      <IconButton
                        onClick={() => handleRemoveItem(item.id)}
                        size='small'
                        className='text-red-500'>
                        <Delete />
                      </IconButton>
                    </div>

                    <div className='flex items-center justify-between mt-4'>
                      {/* Quantity Controls */}
                      <div className='flex items-center border border-gray-300 rounded-lg'>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          className='p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'>
                          <Remove />
                        </button>
                        <span className='px-4 py-2 text-lg font-semibold min-w-[3rem] text-center'>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity + 1)
                          }
                          disabled={
                            item.quantity >= item.product.stock_quantity
                          }
                          className='p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'>
                          <Add />
                        </button>
                      </div>

                      {/* Price */}
                      <div className='text-right'>
                        <p className='text-2xl font-bold text-gray-900'>
                          $
                          {(
                            parseFloat(item.product.price) * item.quantity
                          ).toFixed(2)}
                        </p>
                        <p className='text-sm text-gray-600'>
                          ${item.product.price} each
                        </p>
                      </div>
                    </div>

                    {/* Stock Warning */}
                    {item.quantity >= item.product.stock_quantity && (
                      <p className='text-sm text-orange-600 mt-2'>
                        Maximum stock reached
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Clear Cart Button */}
            <Button
              onClick={handleClearCart}
              variant='outlined'
              color='error'
              startIcon={<Delete />}
              fullWidth>
              Clear Cart
            </Button>
          </div>

          {/* Order Summary */}
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-lg shadow-sm p-6 sticky top-24'>
              <h2 className='text-2xl font-bold text-gray-900 mb-6'>
                Order Summary
              </h2>

              <div className='space-y-4 mb-6'>
                <div className='flex justify-between text-gray-600'>
                  <span>Subtotal</span>
                  <span className='font-semibold'>${total.toFixed(2)}</span>
                </div>
                <div className='flex justify-between text-gray-600'>
                  <span>Shipping</span>
                  <span className='font-semibold'>Calculated at checkout</span>
                </div>
                <Divider />
                <div className='flex justify-between text-xl font-bold text-gray-900'>
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                onClick={() => navigate("/checkout")}
                variant='contained'
                size='large'
                fullWidth
                className='mb-4'>
                Proceed to Checkout
              </Button>

              <p className='text-xs text-gray-500 text-center'>
                Taxes and shipping calculated at checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
