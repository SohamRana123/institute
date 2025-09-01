"use client";

import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import React, { useMemo } from "react";

const ShoppingCart = React.memo(({ onCheckout, orderLoading = false }) => {
  const {
    cart,
    cartOpen,
    setCartOpen,
    removeFromCart,
    updateQuantity,
    getCartTotal,
  } = useCart();

  // Memoize cart total to prevent unnecessary recalculations
  const cartTotal = useMemo(() => getCartTotal(), [getCartTotal]);

  // Memoize cart items to prevent unnecessary re-renders
  const cartItems = useMemo(() => cart, [cart]);

  return (
    <div
      className={`fixed inset-0 z-50 transform transition-all duration-300 ease-in-out ${
        cartOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          cartOpen ? "opacity-50" : "opacity-0"
        }`}
        onClick={() => setCartOpen(false)}
      />

      {/* Cart Panel */}
      <div
        className={`absolute right-0 top-0 h-full bg-white w-full max-w-md shadow-xl transform transition-transform duration-300 ease-in-out ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-orange-500 to-orange-600">
            <h2 className="text-lg font-semibold text-white">Shopping Cart</h2>
            <button
              onClick={() => setCartOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {cartItems.length === 0 ? (
              <p className="text-gray-500 text-center">Your cart is empty</p>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex space-x-4 border-b pb-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={80}
                        height={80}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        ${item.price.toFixed(2)}
                      </p>
                      <div className="flex items-center mt-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="text-gray-500 hover:text-gray-700"
                        >
                          -
                        </button>
                        <span className="mx-2 text-gray-600">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="text-gray-500 hover:text-gray-700"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t p-4 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium text-gray-900">Total</span>
              <span className="text-lg font-bold text-orange-600">
                ${cartTotal.toFixed(2)}
              </span>
            </div>
            <button
              className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 transform hover:scale-[1.02] transition-all duration-200 font-medium shadow-md hover:shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={onCheckout}
              disabled={orderLoading || cartItems.length === 0}
            >
              {orderLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                    />
                  </svg>
                  <span>Checkout</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

ShoppingCart.displayName = "ShoppingCart";

export default ShoppingCart;
