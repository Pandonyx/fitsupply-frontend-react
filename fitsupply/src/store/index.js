import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  authAPI,
  productsAPI,
  categoriesAPI,
  cartAPI,
  ordersAPI,
} from "../services/api";

// Auth Store
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.login(credentials);
          const { access, refresh } = response.data;

          localStorage.setItem("access_token", access);
          localStorage.setItem("refresh_token", refresh);

          // Fetch user profile after login
          const profileResponse = await authAPI.getProfile();

          set({
            user: profileResponse.data,
            isAuthenticated: true,
            isLoading: false,
          });
          return { success: true };
        } catch (error) {
          set({
            error: error.response?.data?.detail || "Login failed",
            isLoading: false,
          });
          return { success: false, error: error.response?.data };
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.register(userData);

          // Check if registration was successful
          if (response.status === 201 || response.status === 200) {
            // Auto-login after registration
            const loginResult = await get().login({
              username: userData.username,
              password: userData.password,
            });

            return loginResult;
          }

          return { success: false, error: "Registration failed" };
        } catch (error) {
          const errorMessage =
            error.response?.data?.detail ||
            error.response?.data?.message ||
            "Registration failed";

          set({
            error: errorMessage,
            isLoading: false,
          });

          console.error("Registration error:", error.response?.data);
          return {
            success: false,
            error: error.response?.data || errorMessage,
          };
        }
      },

      logout: () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        set({ user: null, isAuthenticated: false });
      },

      fetchProfile: async () => {
        try {
          const response = await authAPI.getProfile();
          set({ user: response.data, isAuthenticated: true });
        } catch (error) {
          get().logout();
        }
      },

      updateProfile: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.updateProfile(data);
          set({ user: response.data, isLoading: false });
          return { success: true };
        } catch (error) {
          set({
            error: error.response?.data?.detail || "Update failed",
            isLoading: false,
          });
          return { success: false };
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Products Store
export const useProductsStore = create((set, get) => ({
  products: [],
  filteredProducts: [],
  currentProduct: null,
  selectedCategory: null,
  searchQuery: "",
  isLoading: false,
  error: null,

  fetchProducts: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productsAPI.getAll(params);
      const products = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      set({
        products,
        filteredProducts: products,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.detail || "Failed to fetch products",
        isLoading: false,
      });
      console.error("Error fetching products:", error);
    }
  },

  fetchProductById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productsAPI.getById(id);
      set({ currentProduct: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.detail || "Failed to fetch product",
        isLoading: false,
      });
      console.error("Error fetching product:", error);
    }
  },

  fetchProductBySlug: async (slug) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productsAPI.getBySlug(slug);
      set({ currentProduct: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.detail || "Failed to fetch product",
        isLoading: false,
      });
      console.error("Error fetching product by slug:", error);
    }
  },

  filterByCategory: (categoryId) => {
    set({ selectedCategory: categoryId });
    const { products } = get();

    if (!categoryId) {
      set({ filteredProducts: products });
    } else {
      const filtered = products.filter((p) => p.category === categoryId);
      set({ filteredProducts: filtered });
    }
  },

  searchProducts: async (query) => {
    set({ searchQuery: query, isLoading: true });
    try {
      if (!query.trim()) {
        get().fetchProducts();
        return;
      }
      const response = await productsAPI.search(query);
      set({
        filteredProducts: response.data.results || response.data,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  resetFilters: () => {
    const { products } = get();
    set({
      filteredProducts: products,
      selectedCategory: null,
      searchQuery: "",
    });
  },
}));

// Categories Store
export const useCategoriesStore = create((set) => ({
  categories: [],
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await categoriesAPI.getAll();
      set({
        categories: response.data.results || response.data,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.detail || "Failed to fetch categories",
        isLoading: false,
      });
    }
  },
}));

// Cart Store
export const useCartStore = create((set, get) => ({
  cart: null,
  items: [],
  isLoading: false,
  error: null,

  fetchCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await cartAPI.get();
      set({
        cart: response.data,
        items: response.data.items || [],
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.detail || "Failed to fetch cart",
        isLoading: false,
      });
    }
  },

  addItem: async (productId, quantity = 1) => {
    set({ isLoading: true, error: null });
    try {
      await cartAPI.addItem(productId, quantity);
      await get().fetchCart();
      return { success: true };
    } catch (error) {
      set({
        error: error.response?.data?.detail || "Failed to add item",
        isLoading: false,
      });
      return { success: false, error: error.response?.data };
    }
  },

  updateQuantity: async (itemId, quantity) => {
    if (quantity <= 0) {
      return get().removeItem(itemId);
    }

    set({ isLoading: true });
    try {
      await cartAPI.updateItem(itemId, quantity);
      await get().fetchCart();
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false };
    }
  },

  removeItem: async (itemId) => {
    set({ isLoading: true });
    try {
      await cartAPI.removeItem(itemId);
      await get().fetchCart();
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false };
    }
  },

  clearCart: async () => {
    set({ isLoading: true });
    try {
      await cartAPI.clear();
      set({ cart: null, items: [], isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false };
    }
  },

  getItemCount: () => {
    const { items } = get();
    return items.reduce((sum, item) => sum + item.quantity, 0);
  },

  getTotal: () => {
    const { items } = get();
    return items.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);
  },
}));

// Orders Store
export const useOrdersStore = create((set, get) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,

  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await ordersAPI.getAll();
      set({
        orders: response.data.results || response.data,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.detail || "Failed to fetch orders",
        isLoading: false,
      });
    }
  },

  fetchOrderById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await ordersAPI.getById(id);
      set({ currentOrder: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.detail || "Failed to fetch order",
        isLoading: false,
      });
    }
  },

  createOrder: async (orderData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await ordersAPI.create(orderData);
      set({ currentOrder: response.data, isLoading: false });
      return { success: true, order: response.data };
    } catch (error) {
      set({
        error: error.response?.data?.detail || "Failed to create order",
        isLoading: false,
      });
      return { success: false, error: error.response?.data };
    }
  },
}));
