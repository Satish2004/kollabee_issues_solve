"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { AdminApi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
    const [actionProduct, setActionProduct] = useState<Product | null>(null)
    const [actionType, setActionType] = useState<boolean | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)

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

    const handleAction = async () => {
        if (actionProduct === null || actionType === null) return

        setIsProcessing(true)
        try {
            await AdminApi.approveOrRejectSeller(actionProduct.sellerId, actionType)

            setProducts(prev =>
                prev.map(p =>
                    p.id === actionProduct.id
                        ? {
                            ...p,
                            status: actionType ? "ACTIVE" : "REJECTED",
                            isDraft: actionType ? false : p.isDraft,
                        }
                        : p
                )
            )
        } catch (error) {
            console.error(`Failed to ${actionType ? "approve" : "reject"} product:`, error)
        } finally {
            setIsProcessing(false)
            setActionProduct(null)
            setActionType(null)
        }
    }

    const productsWithStats = products.map(product => {
        const totalQuantitySold = product.orderItems.reduce((sum, item) => sum + item.quantity, 0)
        const totalRevenueGenerated = product.orderItems.reduce((sum, item) => sum + item.quantity * item.price, 0)
        return { ...product, totalQuantitySold, totalRevenueGenerated }
    })

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <AlertDialog
                open={!!actionProduct && actionType !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setActionProduct(null)
                        setActionType(null)
                    }
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {actionType ? "Approve Product" : "Reject Product"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {actionType
                                ? "Are you sure you want to approve this product? It will become visible to buyers."
                                : "Are you sure you want to reject this product? It will be hidden from buyers."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            disabled={isProcessing}
                            onClick={() => {
                                setActionProduct(null)
                                setActionType(null)
                            }}
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            disabled={isProcessing}
                            onClick={handleAction}
                            variant={actionType ? "default" : "destructive"}
                        >
                            {isProcessing ? (
                                <span className="flex items-center">
                                    <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                                    Processing...
                                </span>
                            ) : actionType ? "Approve" : "Reject"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

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
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Seller
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Price & Stock
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Sales
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Created
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {productsWithStats.map(product => (
                            <tr key={product.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            {product.thumbnail?.length > 0 ? (
                                                <Image
                                                    className="h-10 w-10 rounded-md object-cover"
                                                    src={product.thumbnail[0]}
                                                    alt={product.name}
                                                    width={40}
                                                    height={40}
                                                />
                                            ) : product.images?.length > 0 ? (
                                                <Image
                                                    className="h-10 w-10 rounded-md object-cover"
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    width={40}
                                                    height={40}
                                                />
                                            ) : (
                                                <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                                                    <span className="text-gray-500 text-xs">No image</span>
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
                                    <div className="text-xs text-gray-500 truncate max-w-xs">{product.seller.user.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900 font-medium">${product.price.toFixed(2)}</div>
                                    {product.discount && (
                                        <div className="text-xs text-green-600">{product.discount}% off</div>
                                    )}
                                    <div className="text-sm text-gray-500">Stock: {product.availableQuantity}</div>
                                    <div className="text-xs text-gray-500">Min order: {product.minOrderQuantity}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">Sold: {product.totalQuantitySold}</div>
                                    <div className="text-sm text-gray-900">
                                        Revenue: ${product.totalRevenueGenerated.toFixed(2)}
                                    </div>
                                    {product.rating > 0 && (
                                        <div className="flex items-center mt-1">
                                            <span className="text-xs text-yellow-500">★ {product.rating.toFixed(1)}</span>
                                            <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center flex-wrap gap-1">
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
                                        <Badge
                                            variant={product.stockStatus === "IN_STOCK" ? "default" : "destructive"}
                                        >
                                            {product.stockStatus === "IN_STOCK" ? "In Stock" : "Out of Stock"}
                                        </Badge>
                                        {product.isDraft && <Badge variant="secondary">Draft</Badge>}
                                    </div>
                                    {product.productCategories?.length > 0 && (
                                        <div className="mt-1 flex flex-wrap gap-1 max-w-xs">
                                            {product.productCategories.slice(0, 2).map(category => (
                                                <Badge key={category} variant="outline">
                                                    {category.split("_").join(" ")}
                                                </Badge>
                                            ))}
                                            {product.productCategories.length > 2 && (
                                                <Badge variant="outline">
                                                    +{product.productCategories.length - 2}
                                                </Badge>
                                            )}
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(product.createdAt)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            {product.status !== "ACTIVE" && (
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        setActionProduct(product)
                                                        setActionType(true)
                                                    }}
                                                >
                                                    Approve
                                                </DropdownMenuItem>
                                            )}
                                            {product.status !== "REJECTED" && (
                                                <DropdownMenuItem
                                                    className="text-red-600"
                                                    onClick={() => {
                                                        setActionProduct(product)
                                                        setActionType(false)
                                                    }}
                                                >
                                                    Reject
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    window.open(`/admin/products/${product.id}`, "_blank")
                                                }
                                            >
                                                View Details
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
