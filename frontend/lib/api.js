import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api",
});

export const getProducts = () => api.get("/products");
export const addProduct = (product) => api.post("/products", product);
export const processSale = (saleData) => api.post("/sales", saleData);
export const getSalesReport = (date) => api.get(`/sales/report?date=${date}`);

export default api;
