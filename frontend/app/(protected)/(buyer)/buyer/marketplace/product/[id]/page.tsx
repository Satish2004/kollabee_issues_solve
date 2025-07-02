import React from "react";
import ProductDetail, { ProductDetailData } from "./product-detail";
import { useMarketplaceProducts } from "../../hooks/use-marketplace";
import { productsApi } from "@/lib/api";

export default async function ProductPage({ params }: { params: { id: string } }) {
  const productId = params.id;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`, {
    cache: "no-store",
  });

  const productDetails = await productsApi.getProductDetails(productId);

  if (!res.ok) {
    return <div className="p-4 text-red-500">
      {
        JSON.stringify(await res.json(), null, 2)
      }
      Product not found.</div>;
  }

  const { product } = await res.json();

  const productData: ProductDetailData = {
    id: product.id,
    name: product.name,
    images: product.images.length ? product.images : ["/placeholder.png"],
    sellerName: product.seller.businessName,
    sellerCountry: product.seller.country,
    sellerYearsActive: new Date().getFullYear() - parseInt(product.seller.yearEstablished || "2020"),
    pricingTiers: [{ min: 1, price: product.price }],
    colors: [
      { name: "Red", value: "red", bg: "bg-red-500" },
      { name: "Blue", value: "blue", bg: "bg-blue-500" },
    ],
    sizes: ["S", "M", "L"],
    printingMethods: ["Screen Printing", "Digital Printing"],
  };

  return (
    <div>
      <ProductDetail product={productData} />
    </div>
  );
}
