import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Divider } from "@mui/material";
import { CheckCircle, Receipt, Home, ShoppingBag } from "@mui/icons-material";
import { useOrdersStore } from "../store";

function OrderSuccess() {
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const { currentOrder, fetchOrderById } = useOrdersStore();

  useEffect(() => {
    if (orderNumber) {
      // Note: You might need to fetch by order_number instead of ID
      // For now, we'll use the currentOrder from the store that was set during checkout
    }
  }, [orderNumber]);

  const order = currentOrder;

  return (
    <div className='min-h-screen bg-gray-50 py-12'>
      <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Success Icon */}
        <div className='text-center mb-8'>
          <CheckCircle
            className='mx-auto text-green-500'
            style={{ fontSize: "5rem" }}
          />
          <h1 className='text-4xl font-bold text-gray-900 mt-6 mb-2'>
            Order Confirmed!
          </h1>
          <p className='text-lg text-gray-600'>
            Thank you for your purchase. Your order has been successfully
            placed.
          </p>
        </div>

        {/* Order Details Card */}
        <div className='bg-white rounded-xl shadow-lg p-8 mb-6'>
          <div className='flex items-center gap-3 mb-6'>
            <Receipt className='text-blue-600' />
            <h2 className='text-2xl font-bold text-gray-900'>Order Details</h2>
          </div>

          {order && (
            <>
              {/* Order Number */}
              <div className='mb-6 p-4 bg-blue-50 rounded-lg'>
                <p className='text-sm text-blue-900 font-semibold mb-1'>
                  Order Number
                </p>
                <p className='text-2xl font-bold text-blue-600 font-mono'>
                  {order.order_number || orderNumber}
                </p>
              </div>

              {/* Order Items */}
              {order.items && order.items.length > 0 && (
                <>
                  <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                    Items Ordered
                  </h3>
                  <div className='space-y-4 mb-6'>
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className='flex gap-4'>
                        <div className='w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden'>
                          {item.product?.image ? (
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className='w-full h-full object-cover'
                            />
                          ) : (
                            <div className='w-full h-full flex items-center justify-center text-gray-400 text-2xl'>
                              📦
                            </div>
                          )}
                        </div>
                        <div className='flex-1'>
                          <h4 className='font-semibold text-gray-900'>
                            {item.product?.name || "Product"}
                          </h4>
                          <p className='text-sm text-gray-600'>
                            Quantity: {item.quantity}
                          </p>
                          <p className='text-sm text-gray-600'>
                            Price: ${item.price_at_time}
                          </p>
                        </div>
                        <div className='text-right'>
                          <p className='font-bold text-gray-900'>
                            $
                            {item.subtotal ||
                              (
                                parseFloat(item.price_at_time) * item.quantity
                              ).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Divider className='my-6' />
                </>
              )}

              {/* Order Summary */}
              <div className='space-y-3'>
                <div className='flex justify-between text-gray-600'>
                  <span>Subtotal</span>
                  <span className='font-semibold'>${order.total_amount}</span>
                </div>
                <div className='flex justify-between text-gray-600'>
                  <span>Shipping</span>
                  <span className='font-semibold'>Free</span>
                </div>
                <div className='flex justify-between text-gray-600'>
                  <span>Tax</span>
                  <span className='font-semibold'>$0.00</span>
                </div>
                <Divider />
                <div className='flex justify-between text-xl font-bold text-gray-900'>
                  <span>Total</span>
                  <span>${order.total_amount}</span>
                </div>
              </div>

              <Divider className='my-6' />

              {/* Shipping Address */}
              <div>
                <h3 className='text-lg font-semibold text-gray-900 mb-3'>
                  Shipping Address
                </h3>
                <p className='text-gray-700 whitespace-pre-line'>
                  {order.shipping_address}
                </p>
              </div>

              <Divider className='my-6' />

              {/* Payment Method */}
              <div>
                <h3 className='text-lg font-semibold text-gray-900 mb-3'>
                  Payment Method
                </h3>
                <p className='text-gray-700'>
                  {order.payment_method === "credit_card"
                    ? "Credit Card"
                    : order.payment_method}
                </p>
              </div>
            </>
          )}

          {!order && (
            <div className='text-center py-8'>
              <p className='text-gray-600'>Order #{orderNumber}</p>
              <p className='text-sm text-gray-500 mt-2'>
                A confirmation email has been sent to your email address.
              </p>
            </div>
          )}
        </div>

        {/* What's Next */}
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6'>
          <h3 className='text-lg font-semibold text-blue-900 mb-3'>
            What's Next?
          </h3>
          <ul className='space-y-2 text-blue-800'>
            <li className='flex items-start gap-2'>
              <span className='mt-1'>✓</span>
              <span>You'll receive an order confirmation email shortly</span>
            </li>
            <li className='flex items-start gap-2'>
              <span className='mt-1'>✓</span>
              <span>We'll notify you when your order ships</span>
            </li>
            <li className='flex items-start gap-2'>
              <span className='mt-1'>✓</span>
              <span>Track your order status in your dashboard</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className='flex flex-col sm:flex-row gap-4'>
          <Button
            onClick={() => navigate("/dashboard")}
            variant='contained'
            size='large'
            startIcon={<Receipt />}
            className='flex-1'>
            View Orders
          </Button>
          <Button
            onClick={() => navigate("/products")}
            variant='outlined'
            size='large'
            startIcon={<ShoppingBag />}
            className='flex-1'>
            Continue Shopping
          </Button>
          <Button
            onClick={() => navigate("/")}
            variant='outlined'
            size='large'
            startIcon={<Home />}
            className='flex-1'>
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;
