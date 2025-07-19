import { Result } from "@/typings/searchTypings";

async function fetchSearch(searchTerm: string): Promise<Result | null> {
  const username = process.env.OXYLABS_USERNAME;
  const password = process.env.OXYLABS_PASSWORD;

  // console.log("Fetching search for:", searchTerm);
  // console.log("Has credentials:", {
  //   hasUsername: !!username,
  //   hasPassword: !!password,
  // });

  // if (!username || !password) {
  //   console.error("Missing Oxylabs credentials in environment variables");
  //   return null;
  // }

  const newUrl = new URL(
    `https://www.walmart.com/search?q=${encodeURIComponent(searchTerm)}`
  );

  const body = {
    source: "universal_ecommerce",
    url: newUrl.toString(),
    geo_location: "United States",
    parse: true,
  };

  try {
    const response = await fetch("https://realtime.oxylabs.io/v1/queries", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " + Buffer.from(`${username}:${password}`).toString("base64"),
      },
      next: {
        revalidate: 60 * 60,
      },
    });

    console.log("API Response Status:", response.status);

    // if (!response.ok) {
    //   console.error(
    //     "API Response not OK:",
    //     response.status,
    //     response.statusText
    //   );
    //   return null;
    // }

    const data = await response.json();

    // Log the full API response (this is what you see in terminal)
    console.log("API Response:", JSON.stringify(data, null, 2));

    // Check if results exists and is an array
    // if (!data.results || !Array.isArray(data.results)) {
    //   console.log("No results array found in response");
    //   return null;
    // }

    if (data.results.length === 0) {
      console.log("Results array is empty");
      return null;
    }

    const result: Result = data.results[0];

    // Log the actual structure to see what we're working with
    console.log("Content structure:", {
      hasOrganic: !!result.content?.organic,
      hasResults: !!result.content?.results,
      organicLength: result.content?.organic?.length || 0,
      resultsLength: result.content?.results?.length || 0,
    });

    return result;
  } catch (err) {
    console.error("Fetch error:", err);
    return null;
  }
}

export default fetchSearch;
