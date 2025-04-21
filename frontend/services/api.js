// services/api.js
import axios from "axios";
import { getAuthToken, setAuthToken } from "@/utils/auth";

const api = axios.create({
  baseURL: "http://localhost:3001/api", // Sesuaikan jika port berbeda
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 detik timeout
});

// Tambahkan interceptor untuk request
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Adding token to request:", token); // Debug log
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Tambahkan interceptor untuk response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      setAuthToken(null);
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

// Fungsi untuk mendapatkan semua produk
export const getProducts = async () => {
  try {
    const response = await api.get("/products");
    if (!response.data) {
      throw new Error("Tidak ada data produk yang diterima");
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    if (error.response) {
      throw new Error(
        error.response.data.error || "Gagal mengambil data produk"
      );
    }
    throw new Error("Tidak dapat terhubung ke server");
  }
};

// Fungsi untuk membuat produk baru
export const createProduct = async (product) => {
  try {
    // Validasi data sebelum dikirim
    if (!product.name || !product.price) {
      throw new Error("Nama dan harga produk wajib diisi");
    }

    const numericPrice = parseFloat(product.price);
    if (isNaN(numericPrice)) {
      throw new Error("Harga harus berupa angka");
    }

    // Pastikan size_prices adalah string JSON yang valid
    const sizePricesStr =
      typeof product.size_prices === "object"
        ? JSON.stringify(product.size_prices)
        : product.size_prices || "{}";

    const productData = {
      name: product.name,
      description: product.description || "",
      price: numericPrice,
      image_url: product.image_url || "",
      size_prices: sizePricesStr,
    };

    console.log("Sending product data:", productData);

    try {
      const response = await api.post("/products", productData);

      if (!response?.data) {
        throw new Error("Tidak ada data produk yang diterima");
      }

      return response.data;
    } catch (apiError) {
      console.error("API Error:", apiError);
      if (apiError.response) {
        throw new Error(
          apiError.response.data.error || "Gagal membuat produk baru"
        );
      } else if (apiError.request) {
        throw new Error(
          "Tidak dapat terhubung ke server. Pastikan server berjalan"
        );
      } else {
        throw apiError;
      }
    }
  } catch (error) {
    console.error("Error in createProduct:", error);
    throw error;
  }
};

// Fungsi untuk mengupdate produk
export const updateProduct = async (id, product) => {
  try {
    // Pastikan size_prices adalah string JSON yang valid
    const sizePricesStr =
      typeof product.size_prices === "object"
        ? JSON.stringify(product.size_prices)
        : product.size_prices || "{}";

    const response = await api.put(`/products/${id}`, {
      ...product,
      size_prices: sizePricesStr,
    });

    if (!response.data) {
      throw new Error("Tidak ada data produk yang diterima");
    }

    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    if (error.response) {
      throw new Error(error.response.data.error || "Gagal mengupdate produk");
    }
    throw error;
  }
};

// Fungsi untuk menghapus produk
export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

export default api;
