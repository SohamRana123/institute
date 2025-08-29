"use client";

import { CartProvider } from "@/contexts/CartContext";

export default function BookStoreLayout({ children }) {
  return (
    <CartProvider>
      <div className="relative min-h-screen">{children}</div>
    </CartProvider>
  );
}
