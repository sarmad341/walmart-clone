'use client';

import { ProductDetail } from "@/typings/productTypings";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Minus, ShoppingCart } from "lucide-react";
import { addToCart, getItemQuantity, updateItemQuantity } from "@/lib/cartUtils";

export default function ProductPage() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('product_id') || "";
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [cartQuantity, setCartQuantity] = useState(0);
  const [isClient, setIsClient] = useState(false);
  
  console.log("Product page - productId:", productId);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!productId) {
      console.log("No product ID provided");
      setError(true);
      setLoading(false);
      return;
    }

    const loadProduct = async () => {
      try {
        const response = await fetch(`/api/product?product_id=${productId}`);
        
        if (!response.ok) {
          console.error("Failed to fetch product:", response.status);
          setError(true);
          setLoading(false);
          return;
        }
        
        const productData = await response.json();
        console.log("Product page - fetched product:", productData);
        console.log("Product page - thumbnail URL:", productData.thumbnail);
        console.log("Product page - images count:", productData.images?.length);
        
        if (productData.error) {
          console.log("Product not found:", productData.error);
          setError(true);
        } else {
          setProduct(productData);
        }
      } catch (err) {
        console.error("Error loading product:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  useEffect(() => {
    if (isClient && product) {
      const quantity = getItemQuantity(product.product_id);
      setCartQuantity(quantity);
    }
  }, [isClient, product]);

  const handleImageError = (imageUrl: string, imageType: string) => {
    console.log(`${imageType} failed to load:`, imageUrl);
  };

  const handleImageLoad = (imageUrl: string, imageType: string) => {
    console.log(`${imageType} loaded successfully:`, imageUrl);
  };

  const nextImage = () => {
    if (!product) return;
    const allImages = getAllImages();
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    if (!product) return;
    const allImages = getAllImages();
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const getAllImages = () => {
    if (!product) return [];
    const images = [];
    if (product.thumbnail) images.push(product.thumbnail);
    if (product.images) images.push(...product.images);
    return images.filter((img, index, arr) => arr.indexOf(img) === index); // Remove duplicates
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    const item = {
      product_id: product.product_id,
      title: product.title,
      price: product.extracted_price || parseFloat(product.price.replace(/[^0-9.]/g, '')) || 0,
      currency: product.currency || "$",
      thumbnail: product.thumbnail,
      source: product.source,
      rating: product.rating,
      reviews: product.reviews
    };

    addToCart(item);
    setCartQuantity(prev => prev + 1);
    
    // Dispatch custom event to update header
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (!product || newQuantity < 0) return;
    
    if (newQuantity === 0) {
      // Remove from cart
      updateItemQuantity(product.product_id, 0);
      setCartQuantity(0);
    } else {
      // Update quantity
      updateItemQuantity(product.product_id, newQuantity);
      setCartQuantity(newQuantity);
    }
    
    // Dispatch custom event to update header
    window.dispatchEvent(new Event('cartUpdated'));
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Product Not Found</h1>
        <p className="text-gray-600">The product you're looking for could not be found.</p>
      </div>
    );
  }

  const allImages = getAllImages();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Image with Carousel */}
        <div className="flex-shrink-0 w-full md:w-1/2">
          <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
            {/* Main Image Display */}
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={allImages[currentImageIndex]}
                alt={`${product.title} - Image ${currentImageIndex + 1}`}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  console.log("Main image error, setting fallback");
                  target.src = "https://via.placeholder.com/400x400?text=No+Image";
                  handleImageError(allImages[currentImageIndex], "Main Image");
                }}
                onLoad={() => handleImageLoad(allImages[currentImageIndex], "Main Image")}
              />
            </div>

            {/* Navigation Arrows */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            {/* Image Counter */}
            {allImages.length > 1 && (
              <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                {currentImageIndex + 1} of {allImages.length}
              </div>
            )}
          </div>

          {/* Thumbnail Navigation */}
          {allImages.length > 1 && (
            <div className="mt-4 flex gap-2 overflow-x-auto">
              {allImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 border-2 rounded overflow-hidden transition-all ${
                    index === currentImageIndex
                      ? 'border-blue-500 scale-110'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://via.placeholder.com/64x64?text=Thumb";
                    }}
                  />
                </button>
              ))}
            </div>
          )}
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

          {/* Cart Controls */}
          <div className="mt-6 space-y-4">
            {cartQuantity === 0 ? (
              <button
                onClick={handleAddToCart}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => handleQuantityChange(cartQuantity - 1)}
                    className="p-2 border rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="text-xl font-semibold min-w-[3rem] text-center">
                    {cartQuantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(cartQuantity + 1)}
                    className="p-2 border rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Total: {product.currency || "$"}{((product.extracted_price || parseFloat(product.price.replace(/[^0-9.]/g, '')) || 0) * cartQuantity).toFixed(2)}
                  </p>
                </div>
              </div>
            )}
          </div>
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
                  <div className="relative w-20 h-20 mx-auto mb-2 bg-gray-100 rounded flex items-center justify-center">
                    <img
                      src={variant.thumbnail}
                      alt={variant.title}
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/80x80?text=Variant";
                        handleImageError(variant.thumbnail || '', `Variant ${idx}`);
                      }}
                      onLoad={() => handleImageLoad(variant.thumbnail || '', `Variant ${idx}`)}
                    />
                  </div>
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
