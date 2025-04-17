import { useState, useEffect } from "react";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Simulasi fetch data
    const fetchProducts = async () => {
      setLoading(true);
      // Ini contoh data dummy, nanti diganti dengan API call
      const dummyProducts = [
        {
          id: 1,
          name: "Kaos Polos Hitam",
          code: "KSP-001",
          price: 120000,
          stock: 45,
        },
        {
          id: 2,
          name: "Celana Jeans",
          code: "CJ-101",
          price: 250000,
          stock: 30,
        },
      ];
      setProducts(dummyProducts);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addProduct = (newProduct) => {
    setProducts([...products, { ...newProduct, id: products.length + 1 }]);
  };

  const updateProduct = (id, updatedProduct) => {
    setProducts(
      products.map((p) => (p.id === id ? { ...p, ...updatedProduct } : p))
    );
  };

  const deleteProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  return {
    products: filteredProducts,
    loading,
    searchTerm,
    setSearchTerm,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}
