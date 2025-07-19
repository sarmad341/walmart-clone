import Product from "@/components/Product";
import fetchSearch from "@/lib/fetchSearch";

type Props = {
  searchParams:
    | Promise<{
        q: string;
      }>
    | {
        q: string;
      };
};

async function Searchpage({ searchParams }: Props) {
  // Handle both Promise and direct object for searchParams
  const params = await Promise.resolve(searchParams);
  const { q } = params;

  console.log("Searching for:", q);

  if (!q) {
    return (
      <div className="p-10">
        <h1 className="text-3xl font-bold mb-2">No search query provided</h1>
      </div>
    );
  }

  const results = await fetchSearch(q);

  console.log("Results in component:", results);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-2">Results for "{q}"</h1>

      {/* Check both organic and results arrays */}
      {results?.content?.organic || results?.content?.results ? (
        <>
          <h2 className="mb-5 text-gray-400">
            (
            {results.content.page_details?.total_results ||
              results.content.total_results ||
              results.content.organic?.length ||
              results.content.results?.length ||
              0}{" "}
            results)
          </h2>

          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {/* Use organic products if available, otherwise use results */}
            {(results.content.organic || results.content.results)?.map(
              (product, index) => (
                <li
                  key={product.product_id || index}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4"
                >
                  <Product product={product} />
                  {/* Display product title below the Product component */}
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {product.title}
                  </p>
                </li>
              )
            )}
          </ul>
        </>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl text-gray-500 mb-2">
            {results ? "No products found" : "Loading failed"}
          </h2>
          <p className="text-gray-400">
            {results
              ? "Try searching for something else"
              : "Check console for errors"}
          </p>
          {/* Debug info */}
          {/* {results && (
            <div className="mt-4 text-xs text-gray-500">
              <p>
                Debug: Found {Object.keys(results.content || {}).join(", ")} in
                content
              </p>
            </div>
          )} */}
        </div>
      )}
    </div>
  );
}

export default Searchpage;
