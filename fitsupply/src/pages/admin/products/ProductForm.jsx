import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Alert,
  Paper,
} from "@mui/material";
import { ArrowBack, Save } from "@mui/icons-material";
import { useAuthStore, useCategoriesStore } from "../../../store";
import { productsAPI } from "../../../services/api";

function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const { user } = useAuthStore();
  const { categories, fetchCategories } = useCategoriesStore();

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    short_description: "",
    category: "",
    price: "",
    compare_price: "",
    sku: "",
    stock_quantity: "",
    low_stock_threshold: 10,
    is_active: true,
    is_featured: false,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (!user?.is_staff) {
      navigate("/");
      return;
    }
    fetchCategories();

    if (isEditMode) {
      loadProduct();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadProduct = async () => {
    setIsLoading(true);
    try {
      // Use slug instead of ID since backend expects slugs
      const response = await productsAPI.getBySlug(id);
      const product = response.data;
      setFormData({
        name: product.name,
        slug: product.slug,
        description: product.description,
        short_description: product.short_description || "",
        category: product.category?.id || "",
        price: product.price,
        compare_price: product.compare_price || "",
        sku: product.sku,
        stock_quantity: product.stock_quantity,
        low_stock_threshold: product.low_stock_threshold,
        is_active: product.is_active,
        is_featured: product.is_featured,
      });
      if (product.image) {
        setImagePreview(product.image);
      }
    } catch (error) {
      setErrorMessage("Failed to load product");
      console.error("Load error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    setFieldErrors({ ...fieldErrors, [name]: "" });

    // Auto-generate slug from name
    if (name === "name" && !isEditMode) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name) errors.name = "Name is required";
    if (!formData.slug) errors.slug = "Slug is required";
    if (!formData.description) errors.description = "Description is required";
    if (!formData.category) errors.category = "Category is required";
    if (!formData.price) errors.price = "Price is required";
    if (!formData.sku) errors.sku = "SKU is required";
    if (formData.stock_quantity === "")
      errors.stock_quantity = "Stock quantity is required";

    if (formData.price && parseFloat(formData.price) <= 0) {
      errors.price = "Price must be greater than 0";
    }

    if (
      formData.compare_price &&
      parseFloat(formData.compare_price) <= parseFloat(formData.price)
    ) {
      errors.compare_price = "Compare price must be greater than price";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setFieldErrors({});

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);

    try {
      const submitData = new FormData();

      // Append required fields
      submitData.append("name", formData.name);
      submitData.append("slug", formData.slug);
      submitData.append("description", formData.description);
      submitData.append("category_id", formData.category); // FIXED: backend expects category_id
      submitData.append("price", formData.price);
      submitData.append("sku", formData.sku);
      submitData.append("stock_quantity", formData.stock_quantity);
      submitData.append("low_stock_threshold", formData.low_stock_threshold);
      submitData.append("is_active", formData.is_active);
      submitData.append("is_featured", formData.is_featured);

      // Append optional fields only if they have values
      if (formData.short_description) {
        submitData.append("short_description", formData.short_description);
      }

      if (formData.compare_price) {
        submitData.append("compare_price", formData.compare_price);
      }

      // Append image if new one selected
      if (imageFile) {
        submitData.append("image", imageFile);
      }

      // DEBUG: Log what we're sending
      console.log("=== FORM DATA BEING SENT ===");
      for (let pair of submitData.entries()) {
        console.log(pair[0] + ": ", pair[1]);
      }

      if (isEditMode) {
        await productsAPI.update(id, submitData);
      } else {
        await productsAPI.create(submitData);
      }

      navigate("/admin/products");
    } catch (error) {
      console.error("Submit error:", error);
      console.error("Error response:", error.response?.data);

      if (error.response?.data) {
        if (typeof error.response.data === "object") {
          setFieldErrors(error.response.data);
          // Show a general error message with field details
          const errorFields = Object.keys(error.response.data).join(", ");
          setErrorMessage(`Please fix the following fields: ${errorFields}`);
        } else {
          setErrorMessage(
            error.response.data.detail || "Failed to save product"
          );
        }
      } else {
        setErrorMessage("Failed to save product");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && isEditMode) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <CircularProgress size={60} />
      </div>
    );
  }

  return (
    <div className='min-h-screen py-8 bg-gray-50'>
      <div className='max-w-4xl px-4 mx-auto sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-6'>
          <button
            onClick={() => navigate("/admin/products")}
            className='flex items-center gap-2 mb-4 text-gray-600 transition-colors hover:text-gray-900'>
            <ArrowBack />
            <span>Back to Products</span>
          </button>
          <h1 className='mb-2 text-4xl font-bold text-gray-900'>
            {isEditMode ? "Edit Product" : "Add New Product"}
          </h1>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <Alert
            severity='error'
            className='mb-4'
            onClose={() => setErrorMessage("")}>
            {errorMessage}
          </Alert>
        )}

        {/* Field Errors Display */}
        {Object.keys(fieldErrors).length > 0 && (
          <Alert
            severity='error'
            className='mb-4'>
            <div>
              <strong>Please fix the following errors:</strong>
              <ul className='mt-2 ml-4 list-disc'>
                {Object.entries(fieldErrors).map(([field, error]) => (
                  <li key={field}>
                    <strong>{field}:</strong>{" "}
                    {Array.isArray(error) ? error.join(", ") : error}
                  </li>
                ))}
              </ul>
            </div>
          </Alert>
        )}

        {/* Form */}
        <Paper className='p-6'>
          <form
            onSubmit={handleSubmit}
            className='space-y-6'>
            {/* Product Name */}
            <TextField
              label='Product Name'
              name='name'
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
              error={!!fieldErrors.name}
              helperText={fieldErrors.name}
            />

            {/* Slug */}
            <TextField
              label='Slug'
              name='slug'
              value={formData.slug}
              onChange={handleChange}
              required
              fullWidth
              error={!!fieldErrors.slug}
              helperText={
                fieldErrors.slug || "URL-friendly version of the name"
              }
            />

            {/* Short Description */}
            <TextField
              label='Short Description'
              name='short_description'
              value={formData.short_description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={2}
              helperText='Brief description shown in product cards'
            />

            {/* Description */}
            <TextField
              label='Description'
              name='description'
              value={formData.description}
              onChange={handleChange}
              required
              fullWidth
              multiline
              rows={4}
              error={!!fieldErrors.description}
              helperText={fieldErrors.description}
            />

            {/* Category */}
            <FormControl
              fullWidth
              required
              error={!!fieldErrors.category}>
              <InputLabel>Category</InputLabel>
              <Select
                name='category'
                value={formData.category}
                onChange={handleChange}
                label='Category'>
                {categories.map((cat) => (
                  <MenuItem
                    key={cat.id}
                    value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
              {fieldErrors.category && (
                <span className='mt-1 text-xs text-red-600'>
                  {fieldErrors.category}
                </span>
              )}
            </FormControl>

            {/* Image Upload */}
            <div>
              <label className='block mb-2 text-sm font-semibold text-gray-700'>
                Product Image
              </label>
              <input
                type='file'
                accept='image/*'
                onChange={handleImageChange}
                className='mb-2'
              />
              {imagePreview && (
                <div className='mt-2'>
                  <img
                    src={imagePreview}
                    alt='Preview'
                    className='object-cover w-32 h-32 border rounded'
                  />
                </div>
              )}
            </div>

            {/* Price Fields */}
            <div className='grid grid-cols-2 gap-4'>
              <TextField
                label='Price'
                name='price'
                type='number'
                value={formData.price}
                onChange={handleChange}
                required
                fullWidth
                inputProps={{ step: "0.01", min: "0" }}
                error={!!fieldErrors.price}
                helperText={fieldErrors.price}
              />
              <TextField
                label='Compare Price'
                name='compare_price'
                type='number'
                value={formData.compare_price}
                onChange={handleChange}
                fullWidth
                inputProps={{ step: "0.01", min: "0" }}
                error={!!fieldErrors.compare_price}
                helperText={
                  fieldErrors.compare_price || "Original price (for sale items)"
                }
              />
            </div>

            {/* SKU and Stock */}
            <div className='grid grid-cols-3 gap-4'>
              <TextField
                label='SKU'
                name='sku'
                value={formData.sku}
                onChange={handleChange}
                required
                fullWidth
                error={!!fieldErrors.sku}
                helperText={fieldErrors.sku}
              />
              <TextField
                label='Stock Quantity'
                name='stock_quantity'
                type='number'
                value={formData.stock_quantity}
                onChange={handleChange}
                required
                fullWidth
                inputProps={{ min: "0" }}
                error={!!fieldErrors.stock_quantity}
                helperText={fieldErrors.stock_quantity}
              />
              <TextField
                label='Low Stock Threshold'
                name='low_stock_threshold'
                type='number'
                value={formData.low_stock_threshold}
                onChange={handleChange}
                fullWidth
                inputProps={{ min: "0" }}
              />
            </div>

            {/* Checkboxes */}
            <div className='space-y-2'>
              <FormControlLabel
                control={
                  <Checkbox
                    name='is_active'
                    checked={formData.is_active}
                    onChange={handleChange}
                  />
                }
                label='Active (visible to customers)'
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name='is_featured'
                    checked={formData.is_featured}
                    onChange={handleChange}
                  />
                }
                label='Featured Product'
              />
            </div>

            {/* Submit Buttons */}
            <div className='flex gap-4 pt-4'>
              <Button
                type='submit'
                variant='contained'
                size='large'
                disabled={isLoading}
                startIcon={
                  isLoading ? <CircularProgress size={20} /> : <Save />
                }>
                {isLoading
                  ? "Saving..."
                  : isEditMode
                  ? "Update Product"
                  : "Create Product"}
              </Button>
              <Button
                variant='outlined'
                size='large'
                onClick={() => navigate("/admin/products")}
                disabled={isLoading}>
                Cancel
              </Button>
            </div>
          </form>
        </Paper>
      </div>
    </div>
  );
}

export default ProductForm;
