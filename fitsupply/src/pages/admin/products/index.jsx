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
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Edit,
  Delete,
  Add,
  Search,
  ArrowBack,
  Visibility,
} from "@mui/icons-material";
import { useAuthStore, useProductsStore } from "../../../store";
import { productsAPI } from "../../../services/api";

function ProductsManagement() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { products, fetchProducts, isLoading } = useProductsStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!user?.is_staff) {
      navigate("/");
      return;
    }
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (products) {
      handleSearch(searchQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.sku.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    setErrorMessage("");
    try {
      await productsAPI.delete(productToDelete.id);
      setSuccessMessage(
        `Product "${productToDelete.name}" deleted successfully`
      );
      setDeleteDialogOpen(false);
      setProductToDelete(null);
      fetchProducts();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrorMessage("Failed to delete product. It may be in active orders.");
      console.error("Delete error:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

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
            Products Management
          </h1>
          <p className='text-gray-600'>Manage your product catalog</p>
        </div>

        {/* Alerts */}
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

        {/* Actions Bar */}
        <div className='p-4 mb-6 bg-white rounded-lg shadow-sm'>
          <div className='flex flex-col items-center justify-between gap-4 md:flex-row'>
            {/* Search */}
            <TextField
              placeholder='Search products...'
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className='w-full md:w-96'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Search />
                  </InputAdornment>
                ),
              }}
            />

            {/* Add Product Button */}
            <Button
              variant='contained'
              startIcon={<Add />}
              onClick={() => navigate("/admin/products/new")}>
              Add Product
            </Button>
          </div>
        </div>

        {/* Products Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow className='bg-gray-50'>
                <TableCell>Image</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>SKU</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align='right'>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <TableRow
                    key={product.id}
                    hover>
                    <TableCell>
                      <div className='w-16 h-16 overflow-hidden bg-gray-100 rounded'>
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className='object-cover w-full h-full'
                          />
                        ) : (
                          <div className='flex items-center justify-center w-full h-full text-gray-400'>
                            📦
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className='font-semibold text-gray-900'>
                          {product.name}
                        </p>
                        {product.is_featured && (
                          <Chip
                            label='Featured'
                            size='small'
                            color='warning'
                            className='mt-1'
                          />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className='font-mono text-sm'>{product.sku}</span>
                    </TableCell>
                    <TableCell>{product.category?.name || "N/A"}</TableCell>
                    <TableCell>
                      <div>
                        <p className='font-semibold'>${product.price}</p>
                        {product.compare_price && (
                          <p className='text-sm text-gray-500 line-through'>
                            ${product.compare_price}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p
                          className={
                            product.stock_quantity <=
                            product.low_stock_threshold
                              ? "text-orange-600 font-semibold"
                              : ""
                          }>
                          {product.stock_quantity}
                        </p>
                        {product.stock_quantity <=
                          product.low_stock_threshold && (
                          <Chip
                            label='Low'
                            size='small'
                            color='warning'
                          />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={product.is_active ? "Active" : "Inactive"}
                        color={product.is_active ? "success" : "default"}
                        size='small'
                      />
                    </TableCell>
                    <TableCell align='right'>
                      <div className='flex justify-end gap-1'>
                        <IconButton
                          size='small'
                          onClick={() => navigate(`/products/${product.slug}`)}
                          title='View'>
                          <Visibility />
                        </IconButton>
                        <IconButton
                          size='small'
                          color='primary'
                          onClick={() =>
                            navigate(`/admin/products/edit/${product.slug}`)
                          }
                          title='Edit'>
                          <Edit />
                        </IconButton>
                        <IconButton
                          size='small'
                          color='error'
                          onClick={() => handleDeleteClick(product)}
                          title='Delete'>
                          <Delete />
                        </IconButton>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    align='center'
                    className='py-12'>
                    <div className='text-gray-500'>
                      <p className='mb-2 text-lg'>No products found</p>
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
          Showing {filteredProducts.length} of {products.length} products
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <p>Are you sure you want to delete "{productToDelete?.name}"?</p>
            <p className='mt-2 text-sm text-gray-600'>
              This action cannot be undone. The product will be permanently
              removed.
            </p>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleDeleteCancel}
              disabled={deleteLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              color='error'
              variant='contained'
              disabled={deleteLoading}>
              {deleteLoading ? <CircularProgress size={24} /> : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default ProductsManagement;
