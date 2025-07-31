import { Result } from "@/typings/searchTypings";

async function fetchSearch(searchTerm: string): Promise<Result | null> {
  const apiKey = process.env.SERPAPI_API_KEY;

  console.log("Fetching search for:", searchTerm);
  console.log("Has API key:", !!apiKey);

  if (!apiKey) {
    console.error("Missing SerpAPI key in environment variables");
    return null;
  }

  try {
    // Build SerpAPI URL with parameters for Google Shopping
    const baseUrl = "https://serpapi.com/search.json";
    const params = new URLSearchParams({
      engine: "google_shopping",
      q: searchTerm,
      api_key: apiKey,
      gl: "us", // United States
      hl: "en", // English
    });

    console.log("Making request to:", `${baseUrl}?${params.toString().replace(apiKey, '***')}`);

    const response = await fetch(`${baseUrl}?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        revalidate: 60 * 60,
      },
    });

    console.log("API Response Status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "API Response not OK:",
        response.status,
        response.statusText,
        "Error details:",
        errorText
      );
      return null;
    }

    const data = await response.json();

    // Log the full API response
    console.log("API Response:", JSON.stringify(data, null, 2));

    // Check if shopping_results exists and is an array
    if (!data.shopping_results || !Array.isArray(data.shopping_results)) {
      console.log("No shopping_results array found in response");
      return null;
    }

    if (data.shopping_results.length === 0) {
      console.log("shopping_results array is empty");
      return null;
    }

    // Transform SerpAPI response to match our existing structure
    const transformedResult: Result = {
      content: {
        organic: data.shopping_results.map((item: any) => ({
          url: item.product_link || "",
          image: item.thumbnail || "",
          price: {
            price: item.extracted_price || parseFloat(item.price?.replace(/[^0-9.]/g, "") || "0"),
            currency: item.price?.replace(/[0-9.]/g, "") || "$",
          },
          title: item.title || "",
          rating: {
            count: parseInt(item.reviews?.toString().replace(/[^0-9]/g, "") || "0"),
            rating: parseFloat(item.rating?.toString() || "0"),
          },
          seller: {
            name: item.source || "Google Shopping",
          },
          product_id: item.product_id || item.product_link || "",
        })),
        total_results: data.search_information?.total_results || data.shopping_results.length || 0,
        last_visible_page: data.pagination?.current_page || 1,
        parse_status_code: response.status,
        url: data.search_metadata?.status || "success",
        page_details: {
          total_results: data.search_information?.total_results || data.shopping_results.length || 0,
        },
        results: data.shopping_results,
      },
    };

    console.log("Transformed result structure:", {
      hasOrganic: !!transformedResult.content?.organic,
      organicLength: transformedResult.content?.organic?.length || 0,
    });

    return transformedResult;
  } catch (err) {
    console.error("Fetch error:", err);
    return null;
  }
}

export default fetchSearch;
