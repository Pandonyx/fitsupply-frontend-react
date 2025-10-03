import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TextField, Button, Alert, CircularProgress } from "@mui/material";
import { useAuthStore } from "../../store";

function Login() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [formError, setFormError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.username || !formData.password) {
      setFormError("Please fill in all fields");
      return;
    }

    const result = await login({
      username: formData.username,
      password: formData.password,
    });

    if (result.success) {
      navigate("/");
    } else {
      setFormError(error || "Invalid username or password");
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        {/* Header */}
        <div className='text-center'>
          <h2 className='text-3xl font-bold text-gray-900 mb-2'>
            Welcome Back
          </h2>
          <p className='text-gray-600'>Sign in to your account to continue</p>
        </div>

        {/* Login Form */}
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
                placeholder='Enter your username'
                disabled={isLoading}
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
                placeholder='Enter your password'
                disabled={isLoading}
              />
            </div>

            {/* Forgot Password */}
            <div className='flex items-center justify-end'>
              <Link
                to='/forgot-password'
                className='text-sm text-blue-600 hover:text-blue-700'>
                Forgot password?
              </Link>
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
                "Sign In"
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
                  Don't have an account?
                </span>
              </div>
            </div>
          </div>

          {/* Register Link */}
          <div className='mt-6'>
            <Link
              to='/register'
              className='w-full flex justify-center py-3 px-4 border border-blue-600 rounded-lg text-blue-600 font-semibold hover:bg-blue-50 transition-colors'>
              Create Account
            </Link>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm'>
          <p className='text-blue-900 font-semibold mb-1'>Demo Credentials</p>
          <p className='text-blue-700'>
            Username: <span className='font-mono'>demo</span> | Password:{" "}
            <span className='font-mono'>demo123</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
