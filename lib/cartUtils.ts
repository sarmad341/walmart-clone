import { CartItem, CartState } from "@/typings/cartTypings";

// Cart storage key
const CART_STORAGE_KEY = 'walmart-cart';

// Dispatch cart update event
const dispatchCartUpdate = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('cartUpdated'));
  }
};

// Get cart from localStorage
export const getCart = (): CartState => {
  if (typeof window === 'undefined') {
    return { items: [], totalItems: 0, totalPrice: 0 };
  }
  
  const cartData = localStorage.getItem(CART_STORAGE_KEY);
  if (cartData) {
    return JSON.parse(cartData);
  }
  
  return { items: [], totalItems: 0, totalPrice: 0 };
};

// Save cart to localStorage
export const saveCart = (cart: CartState): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  dispatchCartUpdate();
};

// Add item to cart
export const addToCart = (item: Omit<CartItem, 'quantity'>): CartState => {
  const cart = getCart();
  const existingItemIndex = cart.items.findIndex(
    cartItem => cartItem.product_id === item.product_id
  );

  if (existingItemIndex >= 0) {
    // Item exists, increment quantity
    cart.items[existingItemIndex].quantity += 1;
  } else {
    // New item, add with quantity 1
    cart.items.push({ ...item, quantity: 1 });
  }

  // Recalculate totals
  cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  saveCart(cart);
  return cart;
};

// Remove item from cart
export const removeFromCart = (productId: string): CartState => {
  const cart = getCart();
  cart.items = cart.items.filter(item => item.product_id !== productId);
  
  // Recalculate totals
  cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  saveCart(cart);
  return cart;
};

// Update item quantity
export const updateItemQuantity = (productId: string, quantity: number): CartState => {
  const cart = getCart();
  const itemIndex = cart.items.findIndex(item => item.product_id === productId);
  
  if (itemIndex >= 0) {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      return removeFromCart(productId);
    } else {
      // Update quantity
      cart.items[itemIndex].quantity = quantity;
    }
  }

  // Recalculate totals
  cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  saveCart(cart);
  return cart;
};

// Clear cart
export const clearCart = (): CartState => {
  const emptyCart = { items: [], totalItems: 0, totalPrice: 0 };
  saveCart(emptyCart);
  return emptyCart;
};

// Get cart item quantity
export const getItemQuantity = (productId: string): number => {
  const cart = getCart();
  const item = cart.items.find(item => item.product_id === productId);
  return item ? item.quantity : 0;
}; 