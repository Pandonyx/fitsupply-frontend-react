import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IconButton, Badge, Menu, MenuItem, Divider } from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";
import { useAuthStore, useCartStore } from "../../store";

function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { getItemCount } = useCartStore();

  const [anchorEl, setAnchorEl] = useState(null);

  const cartItemCount = getItemCount();

  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleUserMenuClose();
    navigate("/");
  };

  return (
    <nav className='bg-white shadow-sm sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <Link
            to='/'
            className='flex items-center'>
            <h1 className='text-2xl font-bold text-gray-900'>FitSupply</h1>
          </Link>

          {/* Center Navigation */}
          <div className='flex items-center space-x-8'>
            <Link
              to='/products'
              className='text-gray-700 hover:text-gray-900 font-medium transition-colors'>
              Products
            </Link>
          </div>

          {/* Right Side - Cart & Login */}
          <div className='flex items-center space-x-4'>
            {/* Cart Icon */}
            <IconButton
              onClick={() => navigate("/cart")}
              className='text-gray-700'>
              <Badge
                badgeContent={cartItemCount}
                color='error'>
                <ShoppingCart />
              </Badge>
            </IconButton>

            {/* Login/User Menu */}
            {isAuthenticated ? (
              <>
                <button
                  onClick={handleUserMenuOpen}
                  className='text-gray-700 hover:text-gray-900 font-medium'>
                  {user?.first_name || user?.username || "Account"}
                </button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleUserMenuClose}>
                  <MenuItem
                    onClick={() => {
                      navigate("/profile");
                      handleUserMenuClose();
                    }}>
                    Dashboard
                  </MenuItem>
                  {user?.is_staff && (
                    <MenuItem
                      onClick={() => {
                        navigate("/admin");
                        handleUserMenuClose();
                      }}>
                      Admin Panel
                    </MenuItem>
                  )}
                  <Divider />
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className='text-gray-700 hover:text-gray-900 font-medium'>
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
