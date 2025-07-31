import { ProductDetail } from "@/typings/productTypings";

const apiKey = process.env.SERPAPI_API_KEY;

export async function fetchProduct(product_id: string): Promise<ProductDetail | null> {
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

    const response = await fetch(`${baseUrl}?${params.toString()}`);
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Product API Response not OK:", response.status, response.statusText, errorText);
      return null;
    }
    const data = await response.json();

    // Map SerpAPI product response to ProductDetail
    const product: ProductDetail = {
      product_id: data.product_id || product_id,
      title: data.title,
      price: data.price,
      extracted_price: data.extracted_price,
      old_price: data.old_price,
      extracted_old_price: data.extracted_old_price,
      currency: data.currency,
      thumbnail: data.thumbnail,
      images: data.images,
      rating: data.rating,
      reviews: data.reviews,
      description: data.description,
      source: data.source,
      source_icon: data.source_icon,
      delivery: data.delivery,
      tag: data.tag,
      badges: data.badges,
      variants: data.variants,
      ...data,
    };
    return product;
  } catch (err) {
    console.error("Fetch product error:", err);
    return null;
  }
}
