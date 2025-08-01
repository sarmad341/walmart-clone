import { ProductDetail } from "@/typings/productTypings";

const apiKey = process.env.SERPAPI_API_KEY;

export async function fetchProduct(product_id: string): Promise<ProductDetail | null> {
  console.log("fetchProduct called with product_id:", product_id);
  
  if (!apiKey) {
    console.error("Missing SerpAPI key in environment variables");
    return null;
  }

  try {
    const baseUrl = "https://serpapi.com/search.json";
    const params = new URLSearchParams({
      engine: "google_product",
      product_id,
      api_key: apiKey,
      gl: "us",
      hl: "en",
    });

    console.log("Making product API request to:", `${baseUrl}?${params.toString().replace(apiKey, '***')}`);

    const response = await fetch(`${baseUrl}?${params.toString()}`);
    
    console.log("Product API Response Status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Product API Response not OK:", response.status, response.statusText, errorText);
      return null;
    }
    
    const data = await response.json();
    console.log("Product API Response data:", JSON.stringify(data, null, 2));

    // Extract product data from the nested structure
    const productData = data.product_results;
    
    if (!productData) {
      console.error("No product_results found in API response");
      return null;
    }

    // Map SerpAPI product response to ProductDetail
    const product: ProductDetail = {
      product_id: productData.product_id || product_id,
      title: productData.title || "Product Title Not Available",
      price: productData.prices?.[0] || "$0",
      extracted_price: parseFloat(productData.prices?.[0]?.replace(/[^0-9.]/g, "") || "0"),
      old_price: productData.old_price,
      extracted_old_price: productData.extracted_old_price,
      currency: "$",
      thumbnail: productData.media?.[0]?.link || "https://via.placeholder.com/400x400?text=No+Image",
      images: productData.media?.map((m: any) => m.link) || [],
      rating: productData.rating,
      reviews: productData.reviews,
      description: productData.description,
      source: productData.source,
      source_icon: productData.source_icon,
      delivery: productData.delivery,
      tag: productData.tag,
      badges: productData.badges,
      variants: productData.variations?.color?.map((v: any) => ({
        title: v.title || "Variant",
        price: v.price || "$0",
        extracted_price: v.extracted_price,
        thumbnail: v.thumbnail,
        product_id: v.product_id,
      })) || [],
      ...productData,
    };
    
    console.log("Transformed product:", product);
    return product;
  } catch (err) {
    console.error("Fetch product error:", err);
    return null;
  }
}
