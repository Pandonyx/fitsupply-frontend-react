import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ShoppingCart,
  Person,
  Search,
  Close,
} from "@mui/icons-material";
import { useAuthStore, useCartStore } from "../../store";

function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { getItemCount } = useCartStore();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const cartItemCount = getItemCount();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Categories", path: "/categories" },
  ];

  // Mobile drawer content
  const drawer = (
    <Box
      onClick={handleDrawerToggle}
      className='w-64'>
      <div className='flex items-center justify-between p-4'>
        <h2 className='text-xl font-bold text-blue-600'>FitSupply</h2>
        <IconButton onClick={handleDrawerToggle}>
          <Close />
        </IconButton>
      </div>
      <Divider />
      <List>
        {navLinks.map((link) => (
          <ListItem
            key={link.name}
            disablePadding>
            <ListItemButton onClick={() => navigate(link.path)}>
              <ListItemText primary={link.name} />
            </ListItemButton>
          </ListItem>
        ))}
        <Divider className='my-2' />
        {isAuthenticated ? (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate("/dashboard")}>
                <ListItemText primary='Dashboard' />
              </ListItemButton>
            </ListItem>
            {user?.is_staff && (
              <ListItem disablePadding>
                <ListItemButton onClick={() => navigate("/admin")}>
                  <ListItemText primary='Admin' />
                </ListItemButton>
              </ListItem>
            )}
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemText primary='Logout' />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate("/login")}>
                <ListItemText primary='Login' />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate("/register")}>
                <ListItemText primary='Register' />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position='sticky'
        className='bg-white shadow-sm'>
        <Toolbar className='flex justify-between items-center py-2'>
          {/* Mobile Menu Button */}
          <IconButton
            color='inherit'
            aria-label='open drawer'
            edge='start'
            onClick={handleDrawerToggle}
            className='md:hidden text-gray-700'>
            <MenuIcon />
          </IconButton>

          {/* Logo */}
          <Link
            to='/'
            className='flex items-center'>
            <h1 className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
              FitSupply
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex items-center space-x-8'>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className='text-gray-700 hover:text-blue-600 font-medium transition-colors'>
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Side Icons */}
          <div className='flex items-center space-x-2 md:space-x-4'>
            {/* Search Icon */}
            <IconButton
              onClick={() => setSearchOpen(true)}
              className='text-gray-700'>
              <Search />
            </IconButton>

            {/* Cart Icon */}
            <IconButton
              onClick={() => navigate("/cart")}
              className='text-gray-700'>
              <Badge
                badgeContent={cartItemCount}
                color='primary'>
                <ShoppingCart />
              </Badge>
            </IconButton>

            {/* User Menu */}
            {isAuthenticated ? (
              <>
                <IconButton
                  onClick={handleUserMenuOpen}
                  className='text-gray-700'>
                  <Avatar className='bg-blue-600 w-8 h-8 text-sm'>
                    {user?.first_name?.[0] || user?.username?.[0] || "U"}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleUserMenuClose}
                  className='mt-2'>
                  <MenuItem
                    onClick={() => {
                      navigate("/dashboard");
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
                className='hidden md:flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'>
                <Person className='w-5 h-5' />
                <span>Login</span>
              </button>
            )}
          </div>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant='temporary'
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        className='md:hidden'>
        {drawer}
      </Drawer>
    </>
  );
}

export default Navbar;
