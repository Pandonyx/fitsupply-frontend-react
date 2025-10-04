/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  CircularProgress,
  Divider,
  Alert,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";
import { CreditCard, Lock } from "@mui/icons-material";
import { useCartStore, useOrdersStore, useAuthStore } from "../store";

function Checkout() {
  const navigate = useNavigate();
  const { items, getTotal, clearCart, fetchCart } = useCartStore();
  const { createOrder, isLoading: orderLoading } = useOrdersStore();
  const { user } = useAuthStore();

  const [formData, setFormData] = useState({
    // Shipping Address
    shipping_first_name: user?.first_name || "",
    shipping_last_name: user?.last_name || "",
    shipping_address: "",
    shipping_city: "",
    shipping_state: "",
    shipping_zip: "",
    shipping_country: "USA",

    // Billing Address
    same_as_shipping: true,
    billing_address: "",
    billing_city: "",
    billing_state: "",
    billing_zip: "",
    billing_country: "USA",

    // Payment
    payment_method: "credit_card",
    card_number: "",
    card_name: "",
    card_expiry: "",
    card_cvv: "",
  });

  const [formError, setFormError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    if (!items || items.length === 0) {
      navigate("/cart");
    }
  }, [items, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    setFormError("");
  };

  const validateForm = () => {
    if (!formData.shipping_first_name || !formData.shipping_last_name) {
      return "Please enter your full name";
    }
    if (
      !formData.shipping_address ||
      !formData.shipping_city ||
      !formData.shipping_state ||
      !formData.shipping_zip
    ) {
      return "Please complete shipping address";
    }
    if (!formData.same_as_shipping) {
      if (
        !formData.billing_address ||
        !formData.billing_city ||
        !formData.billing_state ||
        !formData.billing_zip
      ) {
        return "Please complete billing address";
      }
    }
    if (
      !formData.card_number ||
      !formData.card_name ||
      !formData.card_expiry ||
      !formData.card_cvv
    ) {
      return "Please complete payment information";
    }
    // Validate test card
    const testCards = [
      "4242424242424242",
      "4000056655665556",
      "5555555555554444",
    ];
    const cleanCard = formData.card_number.replace(/\s/g, "");
    if (!testCards.includes(cleanCard)) {
      return "Please use a test card number (4242 4242 4242 4242)";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const error = validateForm();
    if (error) {
      setFormError(error);
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Prepare order data
      const shippingAddress = `${formData.shipping_first_name} ${formData.shipping_last_name}, ${formData.shipping_address}, ${formData.shipping_city}, ${formData.shipping_state} ${formData.shipping_zip}, ${formData.shipping_country}`;

      const billingAddress = formData.same_as_shipping
        ? shippingAddress
        : `${formData.shipping_first_name} ${formData.shipping_last_name}, ${formData.billing_address}, ${formData.billing_city}, ${formData.billing_state} ${formData.billing_zip}, ${formData.billing_country}`;

      const orderData = {
        total_amount: total.toFixed(2),
        shipping_address: shippingAddress,
        billing_address: billingAddress,
        payment_method: formData.payment_method,
        notes: "",
        items: items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price_at_time: item.product.price,
        })),
      };

      const result = await createOrder(orderData);

      if (result.success) {
        await clearCart();
        navigate(`/order-success/${result.order.order_number}`);
      } else {
        setFormError("Failed to create order. Please try again.");
      }
    } catch (err) {
      setFormError("An error occurred during checkout. Please try again.");
      console.error("Checkout error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const total = getTotal();

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <h1 className='text-4xl font-bold text-gray-900 mb-8'>Checkout</h1>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Checkout Form */}
          <div className='lg:col-span-2 space-y-6'>
            {formError && (
              <Alert
                severity='error'
                onClose={() => setFormError("")}>
                {formError}
              </Alert>
            )}

            <form
              onSubmit={handleSubmit}
              className='space-y-6'>
              {/* Shipping Information */}
              <div className='bg-white rounded-lg shadow-sm p-6'>
                <h2 className='text-2xl font-bold text-gray-900 mb-6'>
                  Shipping Information
                </h2>

                <div className='grid grid-cols-2 gap-4 mb-4'>
                  <TextField
                    label='First Name'
                    name='shipping_first_name'
                    required
                    fullWidth
                    value={formData.shipping_first_name}
                    onChange={handleChange}
                  />
                  <TextField
                    label='Last Name'
                    name='shipping_last_name'
                    required
                    fullWidth
                    value={formData.shipping_last_name}
                    onChange={handleChange}
                  />
                </div>

                <TextField
                  label='Address'
                  name='shipping_address'
                  required
                  fullWidth
                  value={formData.shipping_address}
                  onChange={handleChange}
                  className='mb-4'
                />

                <div className='grid grid-cols-2 gap-4 mb-4'>
                  <TextField
                    label='City'
                    name='shipping_city'
                    required
                    fullWidth
                    value={formData.shipping_city}
                    onChange={handleChange}
                  />
                  <TextField
                    label='State'
                    name='shipping_state'
                    required
                    fullWidth
                    value={formData.shipping_state}
                    onChange={handleChange}
                  />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <TextField
                    label='ZIP Code'
                    name='shipping_zip'
                    required
                    fullWidth
                    value={formData.shipping_zip}
                    onChange={handleChange}
                  />
                  <TextField
                    label='Country'
                    name='shipping_country'
                    required
                    fullWidth
                    value={formData.shipping_country}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Billing Information */}
              <div className='bg-white rounded-lg shadow-sm p-6'>
                <h2 className='text-2xl font-bold text-gray-900 mb-6'>
                  Billing Information
                </h2>

                <div className='mb-4'>
                  <label className='flex items-center'>
                    <input
                      type='checkbox'
                      name='same_as_shipping'
                      checked={formData.same_as_shipping}
                      onChange={handleChange}
                      className='mr-2'
                    />
                    <span className='text-gray-700'>
                      Same as shipping address
                    </span>
                  </label>
                </div>

                {!formData.same_as_shipping && (
                  <>
                    <TextField
                      label='Billing Address'
                      name='billing_address'
                      required
                      fullWidth
                      value={formData.billing_address}
                      onChange={handleChange}
                      className='mb-4'
                    />

                    <div className='grid grid-cols-2 gap-4 mb-4'>
                      <TextField
                        label='City'
                        name='billing_city'
                        required
                        fullWidth
                        value={formData.billing_city}
                        onChange={handleChange}
                      />
                      <TextField
                        label='State'
                        name='billing_state'
                        required
                        fullWidth
                        value={formData.billing_state}
                        onChange={handleChange}
                      />
                    </div>

                    <div className='grid grid-cols-2 gap-4'>
                      <TextField
                        label='ZIP Code'
                        name='billing_zip'
                        required
                        fullWidth
                        value={formData.billing_zip}
                        onChange={handleChange}
                      />
                      <TextField
                        label='Country'
                        name='billing_country'
                        required
                        fullWidth
                        value={formData.billing_country}
                        onChange={handleChange}
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Payment Information */}
              <div className='bg-white rounded-lg shadow-sm p-6'>
                <h2 className='text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2'>
                  <Lock className='text-green-600' />
                  Payment Information
                </h2>

                <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6'>
                  <p className='text-sm text-blue-900 font-semibold mb-2'>
                    Test Card Numbers
                  </p>
                  <p className='text-sm text-blue-700'>
                    Use: <span className='font-mono'>4242 4242 4242 4242</span>
                  </p>
                  <p className='text-xs text-blue-600 mt-1'>
                    Any future expiry date and CVV will work
                  </p>
                </div>

                <TextField
                  label='Card Number'
                  name='card_number'
                  required
                  fullWidth
                  value={formData.card_number}
                  onChange={handleChange}
                  placeholder='4242 4242 4242 4242'
                  className='mb-4'
                  inputProps={{ maxLength: 19 }}
                />

                <TextField
                  label='Cardholder Name'
                  name='card_name'
                  required
                  fullWidth
                  value={formData.card_name}
                  onChange={handleChange}
                  className='mb-4'
                />

                <div className='grid grid-cols-2 gap-4'>
                  <TextField
                    label='Expiry Date'
                    name='card_expiry'
                    required
                    fullWidth
                    value={formData.card_expiry}
                    onChange={handleChange}
                    placeholder='MM/YY'
                    inputProps={{ maxLength: 5 }}
                  />
                  <TextField
                    label='CVV'
                    name='card_cvv'
                    required
                    fullWidth
                    value={formData.card_cvv}
                    onChange={handleChange}
                    placeholder='123'
                    inputProps={{ maxLength: 4 }}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type='submit'
                variant='contained'
                size='large'
                fullWidth
                disabled={isProcessing || orderLoading}
                startIcon={
                  isProcessing ? <CircularProgress size={20} /> : <CreditCard />
                }>
                {isProcessing ? "Processing..." : `Pay $${total.toFixed(2)}`}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-lg shadow-sm p-6 sticky top-24'>
              <h2 className='text-2xl font-bold text-gray-900 mb-6'>
                Order Summary
              </h2>

              <div className='space-y-4 mb-6'>
                {items.map((item) => (
                  <div
                    key={item.id}
                    className='flex gap-3'>
                    <div className='w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden'>
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
                    <div className='flex-1'>
                      <p className='font-semibold text-gray-900 text-sm'>
                        {item.product.name}
                      </p>
                      <p className='text-sm text-gray-600'>
                        Qty: {item.quantity} × ${item.product.price}
                      </p>
                    </div>
                    <p className='font-semibold text-gray-900'>
                      $
                      {(parseFloat(item.product.price) * item.quantity).toFixed(
                        2
                      )}
                    </p>
                  </div>
                ))}
              </div>

              <Divider className='my-4' />

              <div className='space-y-2'>
                <div className='flex justify-between text-gray-600'>
                  <span>Subtotal</span>
                  <span className='font-semibold'>${total.toFixed(2)}</span>
                </div>
                <div className='flex justify-between text-gray-600'>
                  <span>Shipping</span>
                  <span className='font-semibold'>Free</span>
                </div>
                <div className='flex justify-between text-gray-600'>
                  <span>Tax</span>
                  <span className='font-semibold'>$0.00</span>
                </div>
                <Divider className='my-2' />
                <div className='flex justify-between text-xl font-bold text-gray-900'>
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
