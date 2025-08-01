import { NextRequest, NextResponse } from 'next/server';

const apiKey = process.env.SERPAPI_API_KEY;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('product_id');

  if (!productId) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
  }

  if (!apiKey) {
    return NextResponse.json({ error: 'Missing SerpAPI key' }, { status: 500 });
  }

  try {
    const baseUrl = "https://serpapi.com/search.json";
    const params = new URLSearchParams({
      engine: "google_product",
      product_id: productId,
      api_key: apiKey,
      gl: "us",
      hl: "en",
    });

    const response = await fetch(`${baseUrl}?${params.toString()}`);

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch product' }, { status: response.status });
    }

    const data = await response.json();

    // Extract product data from the nested structure
    const productData = data.product_results;
    
    if (!productData) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Get the best available thumbnail - prioritize SerpAPI thumbnail over Google encrypted ones
    let thumbnail = productData.serpapi_thumbnail;
    if (!thumbnail && productData.media && productData.media.length > 0) {
      // Try to find a non-encrypted thumbnail in media
      const nonEncryptedMedia = productData.media.find((m: any) => 
        m.link && !m.link.includes('encrypted-tbn')
      );
      if (nonEncryptedMedia) {
        thumbnail = nonEncryptedMedia.link;
      } else {
        // If all media are encrypted, use the first one anyway
        thumbnail = productData.media[0].link;
      }
    }
    if (!thumbnail && productData.thumbnail) {
      thumbnail = productData.thumbnail;
    }

    // Get all available images - include media images even if they're encrypted
    const images = [];
    
    // Add SerpAPI thumbnail if available
    if (productData.serpapi_thumbnail) {
      images.push(productData.serpapi_thumbnail);
    }
    
    // Add media images (include all, even encrypted ones)
    if (productData.media && productData.media.length > 0) {
      images.push(...productData.media.map((m: any) => m.link));
    }
    
    // Add original thumbnail if not already included
    if (productData.thumbnail && !images.includes(productData.thumbnail)) {
      images.push(productData.thumbnail);
    }

    // Remove duplicates but keep all image types
    const uniqueImages = images.filter((img, index, arr) => 
      img && arr.indexOf(img) === index
    );

    console.log("API Response - Product Images:", {
      thumbnail: thumbnail,
      imagesCount: uniqueImages.length,
      images: uniqueImages,
      originalThumbnail: productData.thumbnail,
      serpapiThumbnail: productData.serpapi_thumbnail,
      mediaCount: productData.media?.length || 0,
      mediaUrls: productData.media?.map((m: any) => m.link) || []
    });

    // Map SerpAPI product response to ProductDetail
    const product = {
      product_id: productData.product_id || productId,
      title: productData.title || "Product Title Not Available",
      price: productData.prices?.[0] || "$0",
      extracted_price: parseFloat(productData.prices?.[0]?.replace(/[^0-9.]/g, "") || "0"),
      old_price: productData.old_price,
      extracted_old_price: productData.extracted_old_price,
      currency: "$",
      thumbnail: thumbnail || "https://via.placeholder.com/400x400?text=Product+Image",
      images: uniqueImages,
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

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 