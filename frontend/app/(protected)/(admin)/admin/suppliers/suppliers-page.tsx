"use client"
import React from "react"
import TopSuppliers from "@/components/admin-dashboard/top-supplier-overview"
import AllSuppliersTable from "@/components/admin-dashboard/all-suppliers-table"

export default function SuppliersTab() {
  return (
    <div className="space-y-6">
      <TopSuppliers />
      <AllSuppliersTable />
    </div>
  )
}
