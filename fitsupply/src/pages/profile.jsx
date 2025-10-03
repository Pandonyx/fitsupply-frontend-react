import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Tabs,
  Tab,
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  Card,
  CardContent,
} from "@mui/material";
import {
  Person,
  Receipt,
  Settings,
  AdminPanelSettings,
  Edit,
  Save,
} from "@mui/icons-material";
import { useAuthStore, useOrdersStore } from "../store";

function TabPanel({ children, value, index }) {
  return (
    <div
      hidden={value !== index}
      className='py-6'>
      {value === index && <div>{children}</div>}
    </div>
  );
}

function Profile() {
  const navigate = useNavigate();
  const { user, updateProfile, isLoading: authLoading } = useAuthStore();
  const { orders, isLoading: ordersLoading, fetchOrders } = useOrdersStore();

  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        username: user.username || "",
      });
    }
    fetchOrders();
  }, [user]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveProfile = async () => {
    setSuccessMessage("");
    setErrorMessage("");

    const result = await updateProfile({
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
    });

    if (result.success) {
      setSuccessMessage("Profile updated successfully!");
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    } else {
      setErrorMessage("Failed to update profile. Please try again.");
    }
  };

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!user) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <CircularProgress size={60} />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-8'>
          <div className='flex justify-between items-center'>
            <div>
              <h1 className='text-4xl font-bold text-gray-900 mb-2'>
                My Profile
              </h1>
              <p className='text-gray-600'>
                Welcome back, {user.first_name || user.username}!
              </p>
            </div>
            {user.is_staff && (
              <Button
                variant='contained'
                color='secondary'
                startIcon={<AdminPanelSettings />}
                onClick={() => navigate("/admin")}>
                Admin Dashboard
              </Button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className='bg-white rounded-xl shadow-sm'>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}>
              <Tab
                icon={<Person />}
                label='Profile Info'
              />
              <Tab
                icon={<Receipt />}
                label='Order History'
              />
              <Tab
                icon={<Settings />}
                label='Account Settings'
              />
            </Tabs>
          </Box>

          {/* Profile Info Tab */}
          <TabPanel
            value={tabValue}
            index={0}>
            <div className='max-w-2xl mx-auto'>
              {successMessage && (
                <Alert
                  severity='success'
                  className='mb-4'
                  onClose={() => setSuccessMessage("")}>
                  {successMessage}
                </Alert>
              )}
              {errorMessage && (
                <Alert
                  severity='error'
                  className='mb-4'
                  onClose={() => setErrorMessage("")}>
                  {errorMessage}
                </Alert>
              )}

              <div className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <TextField
                    label='First Name'
                    name='first_name'
                    value={formData.first_name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    fullWidth
                  />
                  <TextField
                    label='Last Name'
                    name='last_name'
                    value={formData.last_name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    fullWidth
                  />
                </div>

                <TextField
                  label='Email'
                  name='email'
                  type='email'
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  fullWidth
                />

                <TextField
                  label='Username'
                  name='username'
                  value={formData.username}
                  disabled
                  fullWidth
                  helperText='Username cannot be changed'
                />

                <div className='flex gap-4 pt-4'>
                  {!isEditing ? (
                    <Button
                      variant='contained'
                      startIcon={<Edit />}
                      onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant='contained'
                        startIcon={<Save />}
                        onClick={handleSaveProfile}
                        disabled={authLoading}>
                        {authLoading ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button
                        variant='outlined'
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            first_name: user.first_name || "",
                            last_name: user.last_name || "",
                            email: user.email || "",
                            username: user.username || "",
                          });
                        }}>
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </TabPanel>

          {/* Order History Tab */}
          <TabPanel
            value={tabValue}
            index={1}>
            {ordersLoading ? (
              <div className='flex justify-center py-12'>
                <CircularProgress />
              </div>
            ) : orders && orders.length > 0 ? (
              <div className='space-y-4'>
                {orders.map((order) => (
                  <Card
                    key={order.id}
                    className='hover:shadow-lg transition-shadow'>
                    <CardContent>
                      <div className='flex justify-between items-start mb-4'>
                        <div>
                          <p className='text-sm text-gray-600 mb-1'>
                            Order Number
                          </p>
                          <p className='font-mono font-semibold text-lg'>
                            {order.order_number}
                          </p>
                          <p className='text-sm text-gray-600 mt-2'>
                            Placed on {formatDate(order.created_at)}
                          </p>
                        </div>
                        <div className='text-right'>
                          <Chip
                            label={order.status}
                            color={getStatusColor(order.status)}
                            className='mb-2'
                          />
                          <p className='text-2xl font-bold text-gray-900'>
                            ${order.total_amount}
                          </p>
                        </div>
                      </div>

                      <Divider className='my-4' />

                      {/* Order Items */}
                      <div className='space-y-3'>
                        {order.items &&
                          order.items.map((item, idx) => (
                            <div
                              key={idx}
                              className='flex gap-3'>
                              <div className='w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden'>
                                {item.product?.image ? (
                                  <img
                                    src={item.product.image}
                                    alt={item.product?.name}
                                    className='w-full h-full object-cover'
                                  />
                                ) : (
                                  <div className='w-full h-full flex items-center justify-center text-gray-400'>
                                    📦
                                  </div>
                                )}
                              </div>
                              <div className='flex-1'>
                                <p className='font-semibold text-gray-900'>
                                  {item.product?.name || "Product"}
                                </p>
                                <p className='text-sm text-gray-600'>
                                  Qty: {item.quantity} × ${item.price_at_time}
                                </p>
                              </div>
                              <p className='font-semibold text-gray-900'>
                                $
                                {item.subtotal ||
                                  (
                                    parseFloat(item.price_at_time) *
                                    item.quantity
                                  ).toFixed(2)}
                              </p>
                            </div>
                          ))}
                      </div>

                      <Divider className='my-4' />

                      <div className='flex justify-between items-center'>
                        <div>
                          <p className='text-sm text-gray-600'>
                            Shipping Address
                          </p>
                          <p className='text-sm text-gray-900'>
                            {order.shipping_address}
                          </p>
                        </div>
                        <Button
                          variant='outlined'
                          size='small'
                          onClick={() => navigate(`/orders/${order.id}`)}>
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className='text-center py-12'>
                <Receipt
                  className='mx-auto text-gray-400 mb-4'
                  style={{ fontSize: "4rem" }}
                />
                <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                  No Orders Yet
                </h3>
                <p className='text-gray-600 mb-6'>
                  Start shopping to see your order history here
                </p>
                <Button
                  variant='contained'
                  onClick={() => navigate("/products")}>
                  Browse Products
                </Button>
              </div>
            )}
          </TabPanel>

          {/* Account Settings Tab */}
          <TabPanel
            value={tabValue}
            index={2}>
            <div className='max-w-2xl mx-auto space-y-6'>
              {/* Change Password Section */}
              <div className='bg-gray-50 rounded-lg p-6'>
                <h3 className='text-xl font-semibold text-gray-900 mb-4'>
                  Change Password
                </h3>
                <p className='text-gray-600 mb-4'>
                  Update your password to keep your account secure
                </p>
                <Button variant='outlined'>Change Password</Button>
              </div>

              {/* Payment Methods Section */}
              <div className='bg-gray-50 rounded-lg p-6'>
                <h3 className='text-xl font-semibold text-gray-900 mb-4'>
                  Payment Methods
                </h3>
                <p className='text-gray-600 mb-4'>
                  Manage your saved payment methods
                </p>
                <Alert severity='info'>
                  Payment methods will be available soon
                </Alert>
              </div>

              {/* Notifications Section */}
              <div className='bg-gray-50 rounded-lg p-6'>
                <h3 className='text-xl font-semibold text-gray-900 mb-4'>
                  Email Notifications
                </h3>
                <div className='space-y-3'>
                  <label className='flex items-center'>
                    <input
                      type='checkbox'
                      className='mr-3'
                      defaultChecked
                    />
                    <span className='text-gray-700'>Order confirmations</span>
                  </label>
                  <label className='flex items-center'>
                    <input
                      type='checkbox'
                      className='mr-3'
                      defaultChecked
                    />
                    <span className='text-gray-700'>Shipping updates</span>
                  </label>
                  <label className='flex items-center'>
                    <input
                      type='checkbox'
                      className='mr-3'
                    />
                    <span className='text-gray-700'>Promotional emails</span>
                  </label>
                </div>
                <Button
                  variant='outlined'
                  className='mt-4'>
                  Save Preferences
                </Button>
              </div>

              {/* Delete Account Section */}
              <div className='bg-red-50 border border-red-200 rounded-lg p-6'>
                <h3 className='text-xl font-semibold text-red-900 mb-2'>
                  Delete Account
                </h3>
                <p className='text-red-700 mb-4'>
                  Permanently delete your account and all associated data
                </p>
                <Button
                  variant='outlined'
                  color='error'>
                  Delete Account
                </Button>
              </div>
            </div>
          </TabPanel>
        </div>
      </div>
    </div>
  );
}

export default Profile;
