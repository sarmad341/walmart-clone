import { fetchProduct } from "@/lib/fetchProduct";
import { ProductDetail } from "@/typings/productTypings";
import Image from "next/image";
import { notFound } from "next/navigation";

interface ProductPageProps {
  searchParams: {
    url?: string;
    product_id?: string;
  };
}

export default async function ProductPage({ searchParams }: ProductPageProps) {
  const params = await Promise.resolve(searchParams);
  const productId = params.product_id || "";
  if (!productId) return notFound();

  const product: ProductDetail | null = await fetchProduct(productId);
  if (!product) return notFound();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Image */}
        <div className="flex-shrink-0 w-full md:w-1/2 flex items-center justify-center">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="object-contain rounded-lg max-h-96 w-full"
            width={400}
            height={400}
          />
        </div>
        {/* Product Info */}
        <div className="flex-1 flex flex-col gap-4">
          <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
          {product.rating && (
            <div className="flex items-center gap-2">
              <span className="text-yellow-500 font-bold">★</span>
              <span className="font-semibold">{product.rating}</span>
              {product.reviews && <span className="text-gray-500">({product.reviews} reviews)</span>}
            </div>
          )}
          <div className="text-3xl font-bold text-green-600">
            {product.currency || "$"}
            {product.extracted_price || product.price}
          </div>
          {product.old_price && (
            <div className="text-gray-400 line-through text-lg">{product.old_price}</div>
          )}
          {product.description && (
            <p className="text-gray-700 mt-4 whitespace-pre-line">{product.description}</p>
          )}
          {product.delivery && (
            <div className="mt-2 text-sm text-blue-600">{product.delivery}</div>
          )}
          {product.source && (
            <div className="mt-2 text-xs text-gray-400">Sold by: {product.source}</div>
          )}
        </div>
      </div>
      {/* Product Variants */}
      {product.variants && product.variants.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-bold mb-2">Variants</h2>
          <div className="flex flex-wrap gap-4">
            {product.variants.map((variant, idx) => (
              <div key={idx} className="border rounded p-2 min-w-[120px] text-center">
                {variant.thumbnail && (
                  <img
                    src={variant.thumbnail}
                    alt={variant.title}
                    className="object-contain mx-auto mb-2 rounded"
                    width={80}
                    height={80}
                  />
                )}
                <div className="font-semibold text-sm line-clamp-2">{variant.title}</div>
                <div className="text-green-600 font-bold text-sm">
                  {variant.price}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
