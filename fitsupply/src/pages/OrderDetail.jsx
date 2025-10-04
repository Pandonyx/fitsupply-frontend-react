import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  CircularProgress,
  Chip,
  Divider,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { ArrowBack, LocalShipping } from "@mui/icons-material";
import { useOrdersStore } from "../store";

function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentOrder, isLoading, fetchOrderById } = useOrdersStore();

  useEffect(() => {
    fetchOrderById(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getStatusColor = (status) => {
    const colors = {
      pending: "default",
      confirmed: "info",
      processing: "info",
      shipped: "primary",
      delivering: "primary",
      delivered: "success",
      cancelled: "error",
    };
    return colors[status] || "default";
  };

  const getStatusSteps = () => {
    return ["Pending", "Confirmed", "Processing", "Shipped", "Delivered"];
  };

  const getActiveStep = (status) => {
    const stepMap = {
      pending: 0,
      confirmed: 1,
      processing: 2,
      shipped: 3,
      delivering: 3,
      delivered: 4,
      cancelled: -1,
    };
    return stepMap[status] || 0;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <CircularProgress size={60} />
      </div>
    );
  }

  if (!currentOrder) {
    return (
      <div className='min-h-screen py-12 bg-gray-50'>
        <div className='px-4 mx-auto max-w-7xl sm:px-6 lg:px-8'>
          <div className='text-center'>
            <h2 className='mb-4 text-2xl font-bold text-gray-900'>
              Order Not Found
            </h2>
            <Button
              onClick={() => navigate("/profile")}
              variant='contained'>
              Back to Profile
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const activeStep = getActiveStep(currentOrder.status);

  return (
    <div className='min-h-screen py-8 bg-gray-50'>
      <div className='px-4 mx-auto max-w-7xl sm:px-6 lg:px-8'>
        {/* Back Button */}
        <button
          onClick={() => navigate("/profile")}
          className='flex items-center gap-2 mb-6 text-gray-600 transition-colors hover:text-gray-900'>
          <ArrowBack />
          <span>Back to Profile</span>
        </button>

        {/* Header */}
        <div className='p-6 mb-6 bg-white shadow-sm rounded-xl'>
          <div className='flex flex-col items-start justify-between gap-4 mb-6 md:flex-row md:items-center'>
            <div>
              <h1 className='mb-2 text-3xl font-bold text-gray-900'>
                Order Details
              </h1>
              <p className='text-gray-600'>
                Order #{currentOrder.order_number}
              </p>
              <p className='mt-1 text-sm text-gray-500'>
                Placed on {formatDate(currentOrder.created_at)}
              </p>
            </div>
            <div className='text-right'>
              <Chip
                label={currentOrder.status.toUpperCase()}
                color={getStatusColor(currentOrder.status)}
                className='mb-2'
              />
              <p className='text-3xl font-bold text-gray-900'>
                ${currentOrder.total_amount}
              </p>
            </div>
          </div>

          {/* Order Status Stepper */}
          {currentOrder.status !== "cancelled" && (
            <div className='mt-8'>
              <Stepper
                activeStep={activeStep}
                alternativeLabel>
                {getStatusSteps().map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </div>
          )}

          {currentOrder.status === "cancelled" && (
            <div className='p-4 mt-8 border border-red-200 rounded-lg bg-red-50'>
              <p className='font-semibold text-red-800'>
                This order has been cancelled
              </p>
            </div>
          )}
        </div>

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          {/* Order Items */}
          <div className='lg:col-span-2'>
            <div className='p-6 bg-white shadow-sm rounded-xl'>
              <h2 className='flex items-center gap-2 mb-6 text-xl font-bold text-gray-900'>
                <LocalShipping />
                Order Items
              </h2>

              <div className='space-y-4'>
                {currentOrder.items &&
                  currentOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className='flex gap-4 pb-4 border-b last:border-b-0'>
                      <div className='flex-shrink-0 w-20 h-20 overflow-hidden bg-gray-100 rounded-lg'>
                        {item.product?.image ? (
                          <img
                            src={item.product.image}
                            alt={item.product?.name}
                            className='object-cover w-full h-full'
                          />
                        ) : (
                          <div className='flex items-center justify-center w-full h-full text-2xl text-gray-400'>
                            📦
                          </div>
                        )}
                      </div>
                      <div className='flex-1'>
                        <h3 className='mb-1 font-semibold text-gray-900'>
                          {item.product?.name || "Product"}
                        </h3>
                        <p className='mb-2 text-sm text-gray-600'>
                          SKU: {item.product?.sku}
                        </p>
                        <div className='flex items-center gap-4'>
                          <p className='text-sm text-gray-600'>
                            Quantity: {item.quantity}
                          </p>
                          <p className='text-sm text-gray-600'>
                            Price: ${item.price_at_time}
                          </p>
                        </div>
                      </div>
                      <div className='text-right'>
                        <p className='text-lg font-bold text-gray-900'>
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
            </div>
          </div>

          {/* Order Summary & Info */}
          <div className='space-y-6 lg:col-span-1'>
            {/* Order Summary */}
            <div className='p-6 bg-white shadow-sm rounded-xl'>
              <h2 className='mb-4 text-xl font-bold text-gray-900'>
                Order Summary
              </h2>
              <div className='space-y-3'>
                <div className='flex justify-between text-gray-600'>
                  <span>Subtotal</span>
                  <span className='font-semibold'>
                    ${currentOrder.total_amount}
                  </span>
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
                  <span>${currentOrder.total_amount}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className='p-6 bg-white shadow-sm rounded-xl'>
              <h2 className='mb-4 text-xl font-bold text-gray-900'>
                Shipping Address
              </h2>
              <p className='text-gray-700 whitespace-pre-line'>
                {currentOrder.shipping_address}
              </p>
            </div>

            {/* Billing Address */}
            <div className='p-6 bg-white shadow-sm rounded-xl'>
              <h2 className='mb-4 text-xl font-bold text-gray-900'>
                Billing Address
              </h2>
              <p className='text-gray-700 whitespace-pre-line'>
                {currentOrder.billing_address}
              </p>
            </div>

            {/* Payment Method */}
            <div className='p-6 bg-white shadow-sm rounded-xl'>
              <h2 className='mb-4 text-xl font-bold text-gray-900'>
                Payment Method
              </h2>
              <p className='text-gray-700'>
                {currentOrder.payment_method === "credit_card"
                  ? "Credit Card"
                  : currentOrder.payment_method}
              </p>
            </div>

            {/* Notes */}
            {currentOrder.notes && (
              <div className='p-6 bg-white shadow-sm rounded-xl'>
                <h2 className='mb-4 text-xl font-bold text-gray-900'>
                  Order Notes
                </h2>
                <p className='text-gray-700'>{currentOrder.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;
