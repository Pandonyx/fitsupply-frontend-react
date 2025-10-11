import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Grid,
  Button,
  CircularProgress,
  Chip,
} from "@mui/material";
import {
  ShoppingCart,
  Inventory,
  People,
  AttachMoney,
  TrendingUp,
  Add,
  Edit,
  Visibility,
} from "@mui/icons-material";
import { useAuthStore, useProductsStore, useOrdersStore } from "../../store";

function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    products,
    fetchProducts,
    isLoading: productsLoading,
  } = useProductsStore();
  const { orders, fetchOrders, isLoading: ordersLoading } = useOrdersStore();

  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
  });

  useEffect(() => {
    // Redirect if not admin
    if (!user?.is_staff) {
      navigate("/");
      return;
    }

    fetchProducts();
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (products && orders) {
      calculateStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, orders]);

  const calculateStats = () => {
    // Calculate statistics
    const totalProducts = products.length;
    const lowStockProducts = products.filter(
      (p) => p.stock_quantity <= p.low_stock_threshold
    ).length;

    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o) => o.status === "pending").length;

    const totalRevenue = orders.reduce((sum, order) => {
      return sum + parseFloat(order.total_amount);
    }, 0);

    const recentOrders = orders.slice(0, 5);

    setStats({
      totalProducts,
      lowStockProducts,
      totalOrders,
      pendingOrders,
      totalRevenue,
      recentOrders,
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "warning",
      confirmed: "info",
      processing: "info",
      shipped: "primary",
      delivering: "primary",
      delivered: "success",
      cancelled: "error",
    };
    return colors[status] || "default";
  };

  if (productsLoading || ordersLoading) {
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
        <div className='mb-8'>
          <h1 className='mb-2 text-4xl font-bold text-gray-900'>
            Admin Dashboard
          </h1>
          <p className='text-gray-600'>
            Welcome back, {user?.first_name || user?.username}
          </p>
        </div>

        {/* Quick Actions */}
        <div className='flex flex-wrap gap-4 mb-8'>
          <Button
            variant='contained'
            startIcon={<Add />}
            onClick={() => navigate("/admin/products/new")}>
            Add Product
          </Button>
          <Button
            variant='outlined'
            startIcon={<Visibility />}
            onClick={() => navigate("/admin/products")}>
            Manage Products
          </Button>
          <Button
            variant='outlined'
            startIcon={<ShoppingCart />}
            onClick={() => navigate("/admin/orders")}>
            Manage Orders
          </Button>
        </div>

        {/* Stats Cards */}
        <Grid
          container
          spacing={3}
          className='mb-8'>
          {/* Total Products */}
          <Grid
            item
            xs={12}
            sm={6}
            md={3}>
            <Card className='transition-shadow hover:shadow-lg'>
              <CardContent>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='mb-1 text-sm text-gray-600'>Total Products</p>
                    <p className='text-3xl font-bold text-gray-900'>
                      {stats.totalProducts}
                    </p>
                  </div>
                  <div className='p-3 bg-blue-100 rounded-full'>
                    <Inventory
                      className='text-blue-600'
                      style={{ fontSize: "2rem" }}
                    />
                  </div>
                </div>
                {stats.lowStockProducts > 0 && (
                  <p className='mt-2 text-sm text-orange-600'>
                    {stats.lowStockProducts} low stock
                  </p>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Total Orders */}
          <Grid
            item
            xs={12}
            sm={6}
            md={3}>
            <Card className='transition-shadow hover:shadow-lg'>
              <CardContent>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='mb-1 text-sm text-gray-600'>Total Orders</p>
                    <p className='text-3xl font-bold text-gray-900'>
                      {stats.totalOrders}
                    </p>
                  </div>
                  <div className='p-3 bg-green-100 rounded-full'>
                    <ShoppingCart
                      className='text-green-600'
                      style={{ fontSize: "2rem" }}
                    />
                  </div>
                </div>
                {stats.pendingOrders > 0 && (
                  <p className='mt-2 text-sm text-yellow-600'>
                    {stats.pendingOrders} pending
                  </p>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Total Revenue */}
          <Grid
            item
            xs={12}
            sm={6}
            md={3}>
            <Card className='transition-shadow hover:shadow-lg'>
              <CardContent>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='mb-1 text-sm text-gray-600'>Total Revenue</p>
                    <p className='text-3xl font-bold text-gray-900'>
                      ${stats.totalRevenue.toFixed(2)}
                    </p>
                  </div>
                  <div className='p-3 bg-purple-100 rounded-full'>
                    <AttachMoney
                      className='text-purple-600'
                      style={{ fontSize: "2rem" }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Grid>

          {/* Average Order */}
          <Grid
            item
            xs={12}
            sm={6}
            md={3}>
            <Card className='transition-shadow hover:shadow-lg'>
              <CardContent>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='mb-1 text-sm text-gray-600'>
                      Avg. Order Value
                    </p>
                    <p className='text-3xl font-bold text-gray-900'>
                      $
                      {stats.totalOrders > 0
                        ? (stats.totalRevenue / stats.totalOrders).toFixed(2)
                        : "0.00"}
                    </p>
                  </div>
                  <div className='p-3 bg-yellow-100 rounded-full'>
                    <TrendingUp
                      className='text-yellow-600'
                      style={{ fontSize: "2rem" }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Orders */}
        <div className='p-6 mb-8 bg-white shadow-sm rounded-xl'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-2xl font-bold text-gray-900'>Recent Orders</h2>
            <Button
              variant='text'
              onClick={() => navigate("/admin/orders")}>
              View All
            </Button>
          </div>

          {stats.recentOrders.length > 0 ? (
            <div className='space-y-4'>
              {stats.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className='flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50'
                  onClick={() => navigate(`/orders/${order.id}`)}>
                  <div className='flex-1'>
                    <p className='font-semibold text-gray-900'>
                      Order #{order.order_number?.slice(0, 8)}
                    </p>
                    <p className='text-sm text-gray-600'>
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className='flex items-center gap-4'>
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status)}
                      size='small'
                    />
                    <p className='font-bold text-gray-900'>
                      ${order.total_amount}
                    </p>
                    <Button
                      size='small'
                      startIcon={<Edit />}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/admin/orders/${order.id}`);
                      }}>
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='py-12 text-center text-gray-600'>
              <ShoppingCart
                className='mx-auto mb-4 text-gray-400'
                style={{ fontSize: "3rem" }}
              />
              <p>No orders yet</p>
            </div>
          )}
        </div>

        {/* Low Stock Alert */}
        {stats.lowStockProducts > 0 && (
          <div className='p-6 border border-orange-200 rounded-lg bg-orange-50'>
            <div className='flex items-start gap-4'>
              <div className='p-2 bg-orange-100 rounded-full'>
                <Inventory className='text-orange-600' />
              </div>
              <div className='flex-1'>
                <h3 className='mb-2 text-lg font-semibold text-orange-900'>
                  Low Stock Alert
                </h3>
                <p className='mb-4 text-orange-700'>
                  {stats.lowStockProducts} product
                  {stats.lowStockProducts > 1 ? "s" : ""}{" "}
                  {stats.lowStockProducts > 1 ? "are" : "is"} running low on
                  stock
                </p>
                <Button
                  variant='contained'
                  color='warning'
                  onClick={() => navigate("/admin/products")}>
                  Review Products
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
