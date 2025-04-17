import { useState } from "react";

export function useSales() {
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");

  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.product.id === product.id
      );
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.product.id !== productId)
    );
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const calculateTotal = () => {
    return cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const processSale = () => {
    const saleData = {
      customerName,
      items: cart,
      total: calculateTotal(),
      date: new Date().toISOString(),
    };
    // Reset cart setelah proses
    setCart([]);
    setCustomerName("");
    return saleData;
  };

  return {
    cart,
    customerName,
    setCustomerName,
    addToCart,
    removeFromCart,
    updateQuantity,
    calculateTotal,
    processSale,
  };
}
