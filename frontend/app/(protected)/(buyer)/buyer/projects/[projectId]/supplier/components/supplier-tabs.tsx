"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSuppliers } from "../context/supplier-context";

export function SupplierTabs() {
  const {
    activeTab,
    setActiveTab,
    savedSuppliers,
    requestedSuppliers,
    loading,
    hiredSuppliers,
  } = useSuppliers();

  return (
    <Tabs
      defaultValue="suggested"
      className="w-auto"
      value={activeTab}
      onValueChange={setActiveTab}
    >
      <TabsList>
        <TabsTrigger value="suggested">Suggested</TabsTrigger>
        <TabsTrigger value="saved">
          Saved ({loading ? "..." : savedSuppliers.length})
        </TabsTrigger>
        <TabsTrigger value="requested">
          Sent Requests ({loading ? "..." : requestedSuppliers.length})
        </TabsTrigger>
        <TabsTrigger value="hired">
          Hired ({loading ? "..." : hiredSuppliers.length})
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
