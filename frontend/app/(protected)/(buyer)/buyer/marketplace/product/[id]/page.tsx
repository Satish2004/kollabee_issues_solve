import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";
import ProductDetail from "./product-detail";

export default function ProjectSellersPage({
  params,
}: {
  params: { projectId: string };
}) {
  return (
   <ProductDetail id={params.id} />
  );
}
