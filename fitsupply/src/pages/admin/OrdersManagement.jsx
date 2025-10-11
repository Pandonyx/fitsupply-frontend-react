import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Collapse,
  IconButton,
  Box,
} from "@mui/material";
import {
  Search,
  ArrowBack,
  KeyboardArrowDown,
  KeyboardArrowUp,
  LocalShipping,
} from "@mui/icons-material";
import { useAuthStore, useOrdersStore } from "../../store";
import { ordersAPI } from "../../services/api";

function OrderRow({ order, onStatusUpdate }) {
  const [open, setOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState(order.status);
  const [updating, setUpdating] = useState(false);

  const statusColors = {
    pending: "warning",
    processing: "info",
    shipped: "primary",
    delivered: "success",
    cancelled: "error",
  };

  const handleStatusUpdate = async () => {
    setUpdating(true);
    try {
      await ordersAPI.updateStatus(order.id, newStatus);
      setStatusDialogOpen(false);
      onStatusUpdate();
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <TableRow hover>
        <TableCell>
          <IconButton
            size='small'
            onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>
          <span className='font-mono text-sm font-semibold'>
            #{order.order_number || order.id}
          </span>
        </TableCell>
        <TableCell>
          <div>
            <p className='font-semibold'>
              {order.user?.first_name || order.user?.username || "Guest"}
            </p>
            <p className='text-sm text-gray-500'>{order.user?.email}</p>
          </div>
        </TableCell>
        <TableCell>
          {order.items?.length || 0} item{order.items?.length !== 1 ? "s" : ""}
        </TableCell>
        <TableCell>
          <span className='font-semibold'>${order.total_amount}</span>
        </TableCell>
        <TableCell>
          <Chip
            label={order.status}
            color={statusColors[order.status] || "default"}
            size='small'
            sx={{ textTransform: "capitalize" }}
          />
        </TableCell>
        <TableCell>
          <div className='text-sm'>
            {new Date(order.created_at).toLocaleDateString()}
          </div>
        </TableCell>
        <TableCell align='right'>
          <Button
            size='small'
            variant='outlined'
            startIcon={<LocalShipping />}
            onClick={() => setStatusDialogOpen(true)}>
            Update Status
          </Button>
        </TableCell>
      </TableRow>

      {/* Expandable Order Details */}
      <TableRow>
        <TableCell
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={8}>
          <Collapse
            in={open}
            timeout='auto'
            unmountOnExit>
            <Box className='py-4'>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                {/* Order Items */}
                <div>
                  <h3 className='mb-3 text-lg font-semibold'>Order Items</h3>
                  <div className='space-y-2'>
                    {order.items?.map((item) => (
                      <div
                        key={item.id}
                        className='flex items-center justify-between p-3 rounded bg-gray-50'>
                        <div className='flex items-center gap-3'>
                          {item.product?.image && (
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className='object-cover w-12 h-12 rounded'
                            />
                          )}
                          <div>
                            <p className='font-semibold'>
                              {item.product?.name || "Product"}
                            </p>
                            <p className='text-sm text-gray-600'>
                              Qty: {item.quantity} × ${item.price}
                            </p>
                          </div>
                        </div>
                        <p className='font-semibold'>
                          ${(item.quantity * item.price).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping & Payment Info */}
                <div>
                  <h3 className='mb-3 text-lg font-semibold'>
                    Shipping & Payment
                  </h3>
                  <div className='p-4 space-y-3 rounded bg-gray-50'>
                    <div>
                      <p className='text-sm font-semibold text-gray-600'>
                        Shipping Address
                      </p>
                      <p>{order.shipping_address?.street || "N/A"}</p>
                      <p>
                        {order.shipping_address?.city},{" "}
                        {order.shipping_address?.state}{" "}
                        {order.shipping_address?.zip_code}
                      </p>
                      <p>{order.shipping_address?.country}</p>
                    </div>
                    <div className='pt-2 border-t'>
                      <p className='text-sm font-semibold text-gray-600'>
                        Payment Method
                      </p>
                      <p className='capitalize'>
                        {order.payment_method || "N/A"}
                      </p>
                    </div>
                    <div className='pt-2 border-t'>
                      <p className='text-sm font-semibold text-gray-600'>
                        Order Notes
                      </p>
                      <p>{order.notes || "No notes"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      {/* Status Update Dialog */}
      <Dialog
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}>
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogContent>
          <p className='mb-4'>
            Update status for order #{order.order_number || order.id}
          </p>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              label='Status'>
              <MenuItem value='pending'>Pending</MenuItem>
              <MenuItem value='processing'>Processing</MenuItem>
              <MenuItem value='shipped'>Shipped</MenuItem>
              <MenuItem value='delivered'>Delivered</MenuItem>
              <MenuItem value='cancelled'>Cancelled</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleStatusUpdate}
            variant='contained'
            disabled={updating || newStatus === order.status}>
            {updating ? <CircularProgress size={24} /> : "Update"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function OrdersManagement() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { orders, fetchOrders, isLoading } = useOrdersStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!user?.is_staff) {
      navigate("/");
      return;
    }
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (orders) {
      applyFilters();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders, searchQuery, statusFilter]);

  const applyFilters = () => {
    let filtered = [...orders];

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (order) =>
          order.order_number?.toString().includes(searchQuery) ||
          order.id.toString().includes(searchQuery) ||
          order.user?.username
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          order.user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  };

  const handleStatusUpdate = () => {
    setSuccessMessage("Order status updated successfully");
    fetchOrders();
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const getStatusCounts = () => {
    const counts = {
      all: orders.length,
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };

    orders.forEach((order) => {
      if (counts[order.status] !== undefined) {
        counts[order.status]++;
      }
    });

    return counts;
  };

  const statusCounts = orders ? getStatusCounts() : {};

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <CircularProgress size={60} />
      </div>
    );
  }

  return (
    <div className='min-h-screen py-8 bg-gray-50'>
      <div className='px-4 mx-auto max-w-7xl sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-6'>
          <button
            onClick={() => navigate("/admin")}
            className='flex items-center gap-2 mb-4 text-gray-600 transition-colors hover:text-gray-900'>
            <ArrowBack />
            <span>Back to Dashboard</span>
          </button>
          <h1 className='mb-2 text-4xl font-bold text-gray-900'>
            Orders Management
          </h1>
          <p className='text-gray-600'>View and manage customer orders</p>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <Alert
            severity='success'
            className='mb-4'
            onClose={() => setSuccessMessage("")}>
            {successMessage}
          </Alert>
        )}

        {/* Status Filters */}
        <div className='grid grid-cols-2 gap-4 mb-6 md:grid-cols-6'>
          {[
            { value: "all", label: "All Orders" },
            { value: "pending", label: "Pending" },
            { value: "processing", label: "Processing" },
            { value: "shipped", label: "Shipped" },
            { value: "delivered", label: "Delivered" },
            { value: "cancelled", label: "Cancelled" },
          ].map((status) => (
            <button
              key={status.value}
              onClick={() => setStatusFilter(status.value)}
              className={`p-4 text-center rounded-lg transition-all ${
                statusFilter === status.value
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}>
              <p className='text-2xl font-bold'>
                {statusCounts[status.value] || 0}
              </p>
              <p className='text-sm'>{status.label}</p>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className='p-4 mb-6 bg-white rounded-lg shadow-sm'>
          <TextField
            placeholder='Search by order number, customer name, or email...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </div>

        {/* Orders Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow className='bg-gray-50'>
                <TableCell />
                <TableCell>Order #</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align='right'>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <OrderRow
                    key={order.id}
                    order={order}
                    onStatusUpdate={handleStatusUpdate}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    align='center'
                    className='py-12'>
                    <div className='text-gray-500'>
                      <p className='mb-2 text-lg'>No orders found</p>
                      {searchQuery && (
                        <p className='text-sm'>
                          Try adjusting your search query
                        </p>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Summary */}
        <div className='mt-4 text-sm text-gray-600'>
          Showing {filteredOrders.length} of {orders.length} orders
        </div>
      </div>
    </div>
  );
}

export default OrdersManagement;
