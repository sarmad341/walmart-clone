export interface ProductDetail {
  product_id: string;
  title: string;
  price: string;
  extracted_price?: number;
  old_price?: string;
  extracted_old_price?: number;
  currency?: string;
  thumbnail: string;
  images?: string[];
  rating?: number;
  reviews?: number;
  description?: string;
  source?: string;
  source_icon?: string;
  delivery?: string;
  tag?: string;
  badges?: string[];
  variants?: Array<{
    title: string;
    price: string;
    extracted_price?: number;
    thumbnail?: string;
    product_id?: string;
  }>;
  [key: string]: any; // For any extra fields
}
