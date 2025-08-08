"use client";

import { Button } from "@/components/ui/button";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, AlertCircle, Package, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const AdminProductApproval = () => {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email");
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products/admin/${id}`
        );
        if (!response.ok) throw new Error("Failed to fetch product");
        const data = await response.json();
        setProduct(data.product);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAction = async (action: "approve" | "reject") => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/approve-or-reject/${id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action, email: emailParam }),
        }
      );
      if (!response.ok) throw new Error("Failed to process action");
      const message =
        action === "approve" ? "Product approved!" : "Product rejected!";
      alert(message);
      router.push("/");
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse text-lg font-medium text-muted-foreground">
          Loading...
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          Error: {error}
        </div>
      </div>
    );

  // Check if product is already approved (isDraft is false)
  const isAlreadyApproved = product && product.isDraft === false;

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-4xl mx-auto shadow-lg border-t-4 border-t-primary">
        <CardHeader className="bg-muted/50 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" />
              Product {isAlreadyApproved ? "Details" : "Approval"}
            </CardTitle>
            <Badge
              variant={product?.status === "DRAFT" ? "outline" : "secondary"}
              className="px-3 py-1 text-sm font-medium"
            >
              {product?.status || "PENDING"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {product && (
            <div className="space-y-8">
              {/* Already Approved Alert */}
              {isAlreadyApproved && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <AlertTitle className="text-green-800 font-medium">
                    Product Already Approved
                  </AlertTitle>
                  <AlertDescription className="text-green-700">
                    This product has already been approved.
                  </AlertDescription>
                </Alert>
              )}

              {/* Product Image and Basic Info */}
              <div className="grid gap-6 md:grid-cols-3">
                {product.images && product.images.length > 0 ? (
                  <div className="md:col-span-1 flex justify-center">
                    <div className="relative h-48 w-48 rounded-md overflow-hidden border">
                      <Image
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="md:col-span-1 flex justify-center">
                    <div className="h-48 w-48 rounded-md bg-muted/50 flex items-center justify-center">
                      <AlertCircle className="h-12 w-12 text-muted-foreground/50" />
                    </div>
                  </div>
                )}

                <div className="md:col-span-2 space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Product Name
                    </h3>
                    <p className="text-xl font-semibold mt-1">{product.name}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Price
                      </h3>
                      <p className="text-lg font-semibold mt-1 text-primary">
                        ${product.price}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Discount
                      </h3>
                      <Badge
                        variant="outline"
                        className="text-base font-normal mt-1 bg-green-50"
                      >
                        {product.discount}% Off
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Description
                    </h3>
                    <p className="text-base mt-1 text-muted-foreground">
                      {product.description || "No description provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Supplier Information */}
              <div className="bg-muted/20 p-4 rounded-lg border-l-4 border-l-blue-500">
                <h2 className="text-lg font-semibold mb-3">
                  Supplier Information
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Business Name
                    </h3>
                    <p className="text-base font-semibold mt-1">
                      {product.seller?.businessName || "N/A"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Seller Name
                    </h3>
                    <p className="text-base font-semibold mt-1">
                      {product.seller?.user?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Business Address
                    </h3>
                    <p className="text-base mt-1">
                      {product.seller?.businessAddress || "N/A"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Website
                    </h3>
                    <p className="text-base mt-1">
                      {product.seller?.websiteLink || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div>
                <h2 className="text-lg font-semibold mb-3">Product Details</h2>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="bg-muted/10 p-3 rounded-md">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Delivery Cost
                    </h3>
                    <p className="text-base font-medium mt-1">
                      ${product.deliveryCost}
                    </p>
                  </div>
                  <div className="bg-muted/10 p-3 rounded-md">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Wholesale Price
                    </h3>
                    <p className="text-base font-medium mt-1">
                      ${product.wholesalePrice}
                    </p>
                  </div>
                  <div className="bg-muted/10 p-3 rounded-md">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Minimum Order
                    </h3>
                    <p className="text-base font-medium mt-1">
                      {product.minOrderQuantity} units
                    </p>
                  </div>
                  <div className="bg-muted/10 p-3 rounded-md">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Available Quantity
                    </h3>
                    <p className="text-base font-medium mt-1">
                      {product.availableQuantity} units
                    </p>
                  </div>
                  <div className="bg-muted/10 p-3 rounded-md">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Stock Status
                    </h3>
                    <Badge
                      variant={
                        product.stockStatus === "IN_STOCK"
                          ? "default"
                          : "destructive"
                      }
                      className="mt-1"
                    >
                      {product.stockStatus}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Attributes */}
              {product.attributes &&
                Object.keys(product.attributes).length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold mb-3">
                      Product Attributes
                    </h2>
                    <div className="bg-muted/20 p-4 rounded-lg border">
                      <div className="grid gap-3 md:grid-cols-2">
                        {Object.entries(product.attributes).map(
                          ([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="font-medium">{key}:</span>
                              <span className="text-muted-foreground">
                                {typeof value === "string" || typeof value === "number" ? value : value ? String(value) : "N/A"}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )}

              {/* Action Buttons - Only show if not already approved */}
              {!isAlreadyApproved && (
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    className="flex-1 button-bg text-white py-6 text-base font-medium"
                    onClick={() => handleAction("approve")}
                  >
                    <Check className="mr-2 h-5 w-5" /> Approve Product
                  </Button>
                  <Button
                    className="flex-1 bg-destructive hover:bg-destructive/90 py-6 text-base font-medium"
                    onClick={() => handleAction("reject")}
                  >
                    <X className="mr-2 h-5 w-5" /> Reject Product
                  </Button>
                </div>
              )}

              {/* Back Button - Show only if already approved */}
              {isAlreadyApproved && (
                <div className="flex justify-center pt-4">
                  <Button
                    className="px-8 py-6 text-base font-medium gradient-border "
                    onClick={() => router.push("/")}
                  >
                    Back to home page
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProductApproval;
