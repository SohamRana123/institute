"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  // Initialize cart from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      if (cart.length > 0) {
        localStorage.setItem("cart", JSON.stringify(cart));
      }
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [cart]);

  const addToCart = (book) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === book.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...book, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (bookId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== bookId));
  };

  const updateQuantity = (bookId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === bookId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartOpen,
        setCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
