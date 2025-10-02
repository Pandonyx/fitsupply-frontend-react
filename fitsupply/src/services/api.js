import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - adds token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handles token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        localStorage.setItem("access_token", access);

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (userData) => api.post("/register/", userData),
  login: (credentials) => api.post("/token/", credentials),
  refreshToken: (refresh) => api.post("/token/refresh/", { refresh }),
  getProfile: () => api.get("/user/"),
  updateProfile: (data) => api.patch("/user/", data),
};

// Products endpoints
export const productsAPI = {
  getAll: (params) => api.get("/products/", { params }),
  getById: (id) => api.get(`/products/${id}/`),
  search: (query) => api.get("/products/", { params: { search: query } }),
};

// Categories endpoints
export const categoriesAPI = {
  getAll: () => api.get("/categories/"),
  getById: (id) => api.get(`/categories/${id}/`),
};

// Cart endpoints
export const cartAPI = {
  get: () => api.get("/cart/"),
  addItem: (productId, quantity) =>
    api.post("/cart/add/", { product_id: productId, quantity }),
  updateItem: (itemId, quantity) =>
    api.patch(`/cart/items/${itemId}/`, { quantity }),
  removeItem: (itemId) => api.delete(`/cart/items/${itemId}/`),
  clear: () => api.delete("/cart/clear/"),
};

// Orders endpoints
export const ordersAPI = {
  create: (orderData) => api.post("/orders/", orderData),
  getAll: () => api.get("/orders/"),
  getById: (id) => api.get(`/orders/${id}/`),
};

export default api;
