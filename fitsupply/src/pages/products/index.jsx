import { useEffect, useState } from "react";
import {
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
} from "@mui/material";
import { Search, FilterList, Close } from "@mui/icons-material";
import { useProductsStore, useCategoriesStore } from "../../store";
import { ProductGallery } from "../../components/common";

function Products() {
  const {
    filteredProducts,
    isLoading,
    fetchProducts,
    filterByCategory,
    searchProducts,
    resetFilters,
    selectedCategory,
    searchQuery,
  } = useProductsStore();

  const { categories, fetchCategories } = useCategoriesStore();

  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    searchProducts(localSearchQuery);
  };

  const handleCategoryChange = (categoryId) => {
    filterByCategory(categoryId);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);

    let sorted = [...filteredProducts];
    switch (value) {
      case "price-asc":
        sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "price-desc":
        sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case "name-asc":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "newest":
        sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      default:
        break;
    }
  };

  const handleResetFilters = () => {
    resetFilters();
    setLocalSearchQuery("");
    setSortBy("");
  };

  const hasActiveFilters = selectedCategory || searchQuery || sortBy;

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-gray-900 mb-2'>
            Our Products
          </h1>
          <p className='text-lg text-gray-600'>
            Discover premium supplements for your fitness journey
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className='bg-white rounded-lg shadow-sm p-4 mb-6'>
          <div className='flex flex-col lg:flex-row gap-4'>
            {/* Search */}
            <form
              onSubmit={handleSearch}
              className='flex-1'>
              <TextField
                fullWidth
                placeholder='Search products...'
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Search />
                    </InputAdornment>
                  ),
                  endAdornment: localSearchQuery && (
                    <InputAdornment position='end'>
                      <button
                        type='button'
                        onClick={() => {
                          setLocalSearchQuery("");
                          searchProducts("");
                        }}
                        className='text-gray-400 hover:text-gray-600'>
                        <Close />
                      </button>
                    </InputAdornment>
                  ),
                }}
              />
            </form>

            {/* Category Filter */}
            <FormControl className='w-full lg:w-64'>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory || ""}
                label='Category'
                onChange={(e) => handleCategoryChange(e.target.value)}>
                <MenuItem value=''>All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem
                    key={category.id}
                    value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Sort */}
            <FormControl className='w-full lg:w-48'>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label='Sort By'
                onChange={handleSortChange}>
                <MenuItem value=''>Default</MenuItem>
                <MenuItem value='price-asc'>Price: Low to High</MenuItem>
                <MenuItem value='price-desc'>Price: High to Low</MenuItem>
                <MenuItem value='name-asc'>Name: A to Z</MenuItem>
                <MenuItem value='name-desc'>Name: Z to A</MenuItem>
                <MenuItem value='newest'>Newest First</MenuItem>
              </Select>
            </FormControl>

            {/* Toggle Filters Button (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className='lg:hidden flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'>
              <FilterList />
              Filters
            </button>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className='flex flex-wrap items-center gap-2 mt-4 pt-4 border-t'>
              <span className='text-sm text-gray-600'>Active filters:</span>

              {selectedCategory && (
                <Chip
                  label={
                    categories.find((c) => c.id === selectedCategory)?.name ||
                    "Category"
                  }
                  onDelete={() => handleCategoryChange(null)}
                  color='primary'
                  size='small'
                />
              )}

              {searchQuery && (
                <Chip
                  label={`Search: "${searchQuery}"`}
                  onDelete={() => {
                    setLocalSearchQuery("");
                    searchProducts("");
                  }}
                  color='primary'
                  size='small'
                />
              )}

              {sortBy && (
                <Chip
                  label={`Sort: ${sortBy}`}
                  onDelete={() => setSortBy("")}
                  color='primary'
                  size='small'
                />
              )}

              <Button
                size='small'
                onClick={handleResetFilters}
                className='ml-2'>
                Clear All
              </Button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className='mb-6'>
          <p className='text-gray-600'>
            Showing{" "}
            <span className='font-semibold'>{filteredProducts.length}</span>{" "}
            products
          </p>
        </div>

        {/* Product Gallery */}
        <ProductGallery
          products={filteredProducts}
          isLoading={isLoading}
          emptyMessage='No products match your filters'
        />
      </div>
    </div>
  );
}

export default Products;
