'use client';

import { CartItem } from "@/typings/cartTypings";
import { getCart, updateItemQuantity, removeFromCart, clearCart } from "@/lib/cartUtils";
import { useEffect, useState } from "react";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const [cart, setCart] = useState(getCart());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setCart(getCart());
  }, []);

  // Listen for cart updates from other components
  useEffect(() => {
    const handleCartUpdate = () => {
      setCart(getCart());
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    const updatedCart = updateItemQuantity(productId, newQuantity);
    setCart(updatedCart);
  };

  const handleRemoveItem = (productId: string) => {
    const updatedCart = removeFromCart(productId);
    setCart(updatedCart);
  };

  const handleClearCart = () => {
    const updatedCart = clearCart();
    setCart(updatedCart);
  };

  if (!isClient) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <ShoppingCart size={64} className="mx-auto text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-600 mb-2">Your cart is empty</h1>
          <p className="text-gray-500 mb-6">Add some products to get started!</p>
          <Link 
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <button
          onClick={handleClearCart}
          className="text-red-600 hover:text-red-700 text-sm font-medium"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div key={item.product_id} className="border rounded-lg p-4 flex gap-4">
                {/* Product Image */}
                <div className="flex-shrink-0">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://via.placeholder.com/80x80?text=Product";
                    }}
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg line-clamp-2 mb-1">
                    {item.title}
                  </h3>
                  {item.source && (
                    <p className="text-sm text-gray-500 mb-2">Sold by: {item.source}</p>
                  )}
                  {item.rating && (
                    <div className="flex items-center gap-1 mb-2">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm">{item.rating}</span>
                      {item.reviews && (
                        <span className="text-sm text-gray-500">({item.reviews} reviews)</span>
                      )}
                    </div>
                  )}
                  <div className="text-lg font-bold text-green-600">
                    {item.currency || "$"}{item.price}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}
                      className="p-2 hover:bg-gray-100 transition-colors"
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-4 py-2 min-w-[3rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}
                      className="p-2 hover:bg-gray-100 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-bold text-lg">
                      {item.currency || "$"}{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveItem(item.product_id)}
                    className="text-red-600 hover:text-red-700 p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 bg-gray-50">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Items ({cart.totalItems}):</span>
                <span>{cart.currency || "$"}{cart.totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>{cart.currency || "$"}{cart.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Proceed to Checkout
            </button>
            
            <div className="mt-4 text-center">
              <Link 
                href="/"
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 