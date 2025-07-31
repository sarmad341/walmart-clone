'use client';

import { Organic } from "@/typings/searchTypings";
import Link from "next/link";
import { Badge } from "./ui/badge";

function Product({ product }: { product: Organic }) {
  // Helper to render stars
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill={i <= Math.round(rating) ? '#facc15' : '#e5e7eb'}
          className="w-4 h-4 inline-block"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z" />
        </svg>
      );
    }
    return stars;
  };

  return (
    <Link
      href={{
        pathname: "/product",
        query: { product_id: product.product_id },
      }}
      className="flex flex-col relative border rounded-md h-full p-5 hover:shadow-lg transition-shadow"
    >
      {/* Image Container */}
      <div className="relative w-full h-48 flex items-center justify-center mb-4">
        <img
          src={product.image}
          alt={product.title}
          width={200}
          height={200}
          className="mx-auto object-contain max-w-full max-h-full"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://via.placeholder.com/200x200?text=No+Image";
          }}
        />
      </div>

      {/* Product Title */}
      <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
        {product.title}
      </h3>

      {/* Rating */}
      {product.rating && product.rating.rating > 0 && (
        <div className="flex items-center gap-1 mb-2">
          {renderStars(product.rating.rating)}
          <span className="ml-1 text-xs text-gray-600 font-semibold">{product.rating.rating.toFixed(1)}</span>
          {product.rating.count > 0 && (
            <span className="ml-1 text-xs text-gray-400">({product.rating.count})</span>
          )}
        </div>
      )}

      {/* Price */}
      <p className="text-xl font-bold text-green-600 mt-auto">
        {product.price?.currency}
        {product.price.price}
      </p>

      {product.badge && (
        <Badge className="w-fit absolute top-2 right-2">
          {product.badge}
        </Badge>
      )}
    </Link>
  );
}

export default Product;
