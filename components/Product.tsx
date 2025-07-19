import { Organic } from "@/typings/searchTypings";
import Link from "next/link";
import Image from "next/image";

function Product({ product }: { product: Organic }) {
  return (
    <Link
      href={{
        pathname: "/product",
        query: { url: product.url },
      }}
      className="flex flex-col relative border rounded-md h-full p-5"
    >
      <Image
        src={product.image}
        alt={product.title}
        width={200}
        height={200}
        className="mx-auto"
      />

      <p className="text-xl font-bold">
        {product.price?.currency}
        {product.price.price}
      </p>
    </Link>
  );
}

export default Product;
