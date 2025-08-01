export interface CartItem {
  product_id: string;
  title: string;
  price: number;
  currency: string;
  thumbnail: string;
  quantity: number;
  source?: string;
  rating?: number;
  reviews?: number;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
} 