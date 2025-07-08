import ProductDetail from "./product-detail";

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  return <ProductDetail id={params.id} />;
}