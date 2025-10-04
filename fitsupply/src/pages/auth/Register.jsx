import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TextField, Button, Alert, CircularProgress } from "@mui/material";
import { useAuthStore } from "../../store";

function Register() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    first_name: "",
    last_name: "",
  });
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setFormError("");
    setFieldErrors({});
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.username) errors.username = "Username is required";
    if (!formData.email) errors.email = "Email is required";
    if (!formData.password) errors.password = "Password is required";
    if (!formData.password2) errors.password2 = "Please confirm password";
    if (!formData.first_name) errors.first_name = "First name is required";
    if (!formData.last_name) errors.last_name = "Last name is required";

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email";
    }

    if (formData.password && formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.password2) {
      errors.password2 = "Passwords do not match";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFieldErrors({});

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    const result = await register({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      password2: formData.password2, // Include password2 for backend validation
      first_name: formData.first_name,
      last_name: formData.last_name,
    });

    if (result.success) {
      navigate("/");
    } else {
      if (result.error) {
        if (typeof result.error === "object") {
          setFieldErrors(result.error);
        } else {
          setFormError(result.error);
        }
      } else {
        setFormError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        {/* Header */}
        <div className='text-center'>
          <h2 className='text-3xl font-bold text-gray-900 mb-2'>
            Create Account
          </h2>
          <p className='text-gray-600'>
            Join FitSupply and start your fitness journey
          </p>
        </div>

        {/* Register Form */}
        <div className='bg-white rounded-xl shadow-lg p-8'>
          <form
            onSubmit={handleSubmit}
            className='space-y-6'>
            {/* Error Alert */}
            {formError && (
              <Alert
                severity='error'
                onClose={() => setFormError("")}>
                {formError}
              </Alert>
            )}

            {/* Name Fields */}
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label
                  htmlFor='first_name'
                  className='block text-sm font-semibold text-gray-700 mb-2'>
                  First Name
                </label>
                <TextField
                  id='first_name'
                  name='first_name'
                  type='text'
                  required
                  fullWidth
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder='John'
                  disabled={isLoading}
                  error={!!fieldErrors.first_name}
                  helperText={fieldErrors.first_name}
                />
              </div>
              <div>
                <label
                  htmlFor='last_name'
                  className='block text-sm font-semibold text-gray-700 mb-2'>
                  Last Name
                </label>
                <TextField
                  id='last_name'
                  name='last_name'
                  type='text'
                  required
                  fullWidth
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder='Doe'
                  disabled={isLoading}
                  error={!!fieldErrors.last_name}
                  helperText={fieldErrors.last_name}
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label
                htmlFor='username'
                className='block text-sm font-semibold text-gray-700 mb-2'>
                Username
              </label>
              <TextField
                id='username'
                name='username'
                type='text'
                required
                fullWidth
                value={formData.username}
                onChange={handleChange}
                placeholder='johndoe'
                disabled={isLoading}
                error={!!fieldErrors.username}
                helperText={fieldErrors.username}
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-semibold text-gray-700 mb-2'>
                Email
              </label>
              <TextField
                id='email'
                name='email'
                type='email'
                required
                fullWidth
                value={formData.email}
                onChange={handleChange}
                placeholder='john@example.com'
                disabled={isLoading}
                error={!!fieldErrors.email}
                helperText={fieldErrors.email}
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor='password'
                className='block text-sm font-semibold text-gray-700 mb-2'>
                Password
              </label>
              <TextField
                id='password'
                name='password'
                type='password'
                required
                fullWidth
                value={formData.password}
                onChange={handleChange}
                placeholder='Min. 8 characters'
                disabled={isLoading}
                error={!!fieldErrors.password}
                helperText={fieldErrors.password}
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor='password2'
                className='block text-sm font-semibold text-gray-700 mb-2'>
                Confirm Password
              </label>
              <TextField
                id='password2'
                name='password2'
                type='password'
                required
                fullWidth
                value={formData.password2}
                onChange={handleChange}
                placeholder='Re-enter password'
                disabled={isLoading}
                error={!!fieldErrors.password2}
                helperText={fieldErrors.password2}
              />
            </div>

            {/* Submit Button */}
            <Button
              type='submit'
              variant='contained'
              fullWidth
              size='large'
              disabled={isLoading}
              className='py-3'>
              {isLoading ? (
                <CircularProgress
                  size={24}
                  color='inherit'
                />
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className='mt-6'>
            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-300'></div>
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-2 bg-white text-gray-500'>
                  Already have an account?
                </span>
              </div>
            </div>
          </div>

          {/* Login Link */}
          <div className='mt-6'>
            <Link
              to='/login'
              className='w-full flex justify-center py-3 px-4 border border-blue-600 rounded-lg text-blue-600 font-semibold hover:bg-blue-50 transition-colors'>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
