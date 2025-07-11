"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { AdminApi, productsApi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { formatDate } from "@/lib/utils"

interface Product {
    id: string
    name: string
    description: string
    price: number
    wholesalePrice: number
    minOrderQuantity: number
    availableQuantity: number
    images: string[]
    isDraft: boolean
    status: string
    stockStatus: string
    rating: number
    reviewCount: number
    attributes: Record<string, string>
    discount: number | null
    deliveryCost: number | null
    seller: {
        id: string
        user: {
            id: string
            name: string
            email: string
        }
    }
    productCategories: string[]
    orderItems: Array<{
        quantity: number
        price: number
    }>
    thumbnail: string[]
    createdAt: string
    updatedAt: string
}

export default function ProductsTab() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [selectedAction, setSelectedAction] = useState<"APPROVE" | "REJECT" | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true)
            try {
                const productsRes = await AdminApi.getAllProducts()
                setProducts(productsRes)
            } catch (error) {
                console.error("Failed to fetch products:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [])

    const handleAction = async (productId: string, isApprove: boolean) => {
        setIsProcessing(true)
        try {
            await productsApi.acceptOrRejectProduct(productId, isApprove ? "approve" : "reject")
            setProducts((prev) =>
                prev.map((p) =>
                    p.id === productId
                        ? {
                            ...p,
                            status: isApprove ? "ACTIVE" : "REJECTED",
                            isDraft: false,
                        }
                        : p,
                ),
            )
        } catch (error) {
            console.error(`Failed to ${isApprove ? "approve" : "reject"} product:`, error)
        } finally {
            setIsProcessing(false)
            setSelectedProduct(null)
            setSelectedAction(null)
            setDialogOpen(false)
        }
    }

    const openDialog = (product: Product, action: "APPROVE" | "REJECT") => {
        setSelectedProduct(product)
        setSelectedAction(action)
        setDialogOpen(true)
    }

    const closeDialog = () => {
        setSelectedProduct(null)
        setSelectedAction(null)
        setDialogOpen(false)
    }

    const productsWithStats = products.map((product) => {
        const totalQuantitySold = product.orderItems.reduce((sum, item) => sum + item.quantity, 0)
        const totalRevenueGenerated = product.orderItems.reduce((sum, item) => sum + item.quantity * item.price, 0)
        return { ...product, totalQuantitySold, totalRevenueGenerated }
    })

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Products</h2>
                <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">{products.length} products</span>
                </div>
            </div>
            <div className="overflow-hidden border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Product
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Price & Stock
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Created
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {productsWithStats.map((product) => (
                            <tr key={product.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0">
                                            {product.thumbnail?.[0] ? (
                                                <Image
                                                    src={product.thumbnail[0] || "/placeholder.svg"}
                                                    alt={product.name}
                                                    width={40}
                                                    height={40}
                                                    className="rounded-md object-cover"
                                                />
                                            ) : product.images?.[0] ? (
                                                <Image
                                                    src={product.images[0] || "/placeholder.svg"}
                                                    alt={product.name}
                                                    width={40}
                                                    height={40}
                                                    className="rounded-md object-cover"
                                                />
                                            ) : (
                                                <div className="h-10 w-10 bg-gray-200 flex items-center justify-center rounded-md">
                                                    <span className="text-xs text-gray-500">No image</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                            <div className="text-sm text-gray-500 truncate max-w-xs">
                                                {product.description || "No description"}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{product.seller.user.name}</div>
                                    <div className="text-xs text-gray-500 truncate">{product.seller.user.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">${product.price.toFixed(2)}</div>
                                    {product.discount && <div className="text-xs text-green-600">{product.discount}% off</div>}
                                    <div className="text-sm text-gray-500">Stock: {product.availableQuantity}</div>
                                    <div className="text-xs text-gray-500">Min order: {product.minOrderQuantity}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">Sold: {product.totalQuantitySold}</div>
                                    <div className="text-sm text-gray-900">Revenue: ${product.totalRevenueGenerated.toFixed(2)}</div>
                                    {product.rating > 0 && (
                                        <div className="flex items-center mt-1 text-xs text-yellow-500">
                                            ★ {product.rating.toFixed(1)}
                                            <span className="text-gray-500 ml-1">({product.reviewCount})</span>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-1">
                                        <Badge
                                            variant={
                                                product.status === "ACTIVE"
                                                    ? "default"
                                                    : product.status === "REJECTED"
                                                        ? "destructive"
                                                        : "secondary"
                                            }
                                        >
                                            {product.status}
                                        </Badge>
                                        <Badge variant={product.stockStatus === "IN_STOCK" ? "default" : "destructive"}>
                                            {product.stockStatus.replace("_", " ")}
                                        </Badge>
                                        {product.isDraft && <Badge variant="secondary">Draft</Badge>}
                                    </div>
                                    {product.productCategories.length > 0 && (
                                        <div className="mt-1 flex flex-wrap gap-1 max-w-xs">
                                            {product.productCategories.slice(0, 2).map((cat) => (
                                                <Badge key={cat} variant="outline">
                                                    {cat.replaceAll("_", " ")}
                                                </Badge>
                                            ))}
                                            {product.productCategories.length > 2 && (
                                                <Badge variant="outline">+{product.productCategories.length - 2}</Badge>
                                            )}
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(product.createdAt)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex gap-2">
                                        {product.isDraft || product.status === "REJECTED" ? (
                                            <Button
                                                variant="default"
                                                size="sm"
                                                onClick={() => openDialog(product, "APPROVE")}
                                                disabled={isProcessing}
                                            >
                                                {product.status === "REJECTED" ? "Approve" : "Approve"}
                                            </Button>
                                        ) : null}

                                        {product.status !== "REJECTED" && (
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => openDialog(product, "REJECT")}
                                                disabled={isProcessing}
                                            >
                                                Reject
                                            </Button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Single AlertDialog outside the table */}
            <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{selectedAction === "APPROVE" ? "Approve Product" : "Reject Product"}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {selectedAction === "APPROVE"
                                ? `Are you sure you want to approve "${selectedProduct?.name}"? This will make it visible to customers.`
                                : `Are you sure you want to reject "${selectedProduct?.name}"? This action can be reversed later.`}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={closeDialog} disabled={isProcessing}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            className={selectedAction === "REJECT" ? "bg-red-600 hover:bg-red-700" : ""}
                            onClick={() => selectedProduct && handleAction(selectedProduct.id, selectedAction === "APPROVE")}
                            disabled={isProcessing}
                        >
                            {isProcessing ? "Processing..." : selectedAction === "APPROVE" ? "Approve" : "Reject"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
