"use client";

import { useSearchParams } from "next/navigation";
import React from "react";

const ClientPage = () => {
  const params = useSearchParams();
  const tab = params.get("tab") || "received";

  return <div>{tab}</div>;
};

export default ClientPage;
