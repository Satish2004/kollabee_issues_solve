import { CheckCircle, FileText, Package, Truck, Award } from "lucide-react";

export default function OrderStatusTracker() {
  // Hardcoded status data
  const orderStatus = {
    status: "packaging", // Options: "placed", "packaging", "shipping", "delivered"
    expectedDate: "23 Jan, 2021",
  };

  return (
    <div className="bg-white py-6 px-4 rounded-md">
      <div className="flex flex-row gap-2 mb-4 items-center justify-start">
        <p className="text-xs text-gray-600">Order expected arrival</p>
        <p className="text-bold">{orderStatus.expectedDate}</p>
      </div>

      <div className="bg-white px-48 mt-10 rounded-md">
        <div className="relative flex items-center justify-between mb-6">
          {/* Progress Bar Background - Full width */}
          <div className="h-[2px] bg-red-100 absolute w-full z-0"></div>

          {/* Active Progress Bar - Width based on status */}
          <div
            className="h-[2px] bg-red-500 absolute left-0 z-10 transition-all duration-500"
            style={{
              width:
                orderStatus.status === "placed"
                  ? "0%"
                  : orderStatus.status === "packaging"
                  ? "33%"
                  : orderStatus.status === "shipping"
                  ? "66%"
                  : "100%",
            }}
          ></div>

          {/* Status Dots with Checkmarks */}
          <div className="z-20 relative items-center flex">
            <div className="w-[10px] h-[10px] rounded-full border-2"></div>
            <CheckCircle className="absolute -top-2 -left-2 h-5 w-5 bg-red-50 text-green-500" />
          </div>

          <div className="z-20 relative">
            <div
              className={`w-[10px] h-[10px] rounded-full ${
                orderStatus.status === "packaging" ||
                orderStatus.status === "shipping" ||
                orderStatus.status === "delivered"
                  ? "bg-red-500 border-2 border-red-500"
                  : "bg-white border-2 border-red-100"
              }`}
            ></div>
            {(orderStatus.status === "packaging" ||
              orderStatus.status === "shipping" ||
              orderStatus.status === "delivered") && (
              <CheckCircle className="absolute -top-2 -left-2 h-5 w-5 bg-red-50 text-green-500" />
            )}
          </div>

          <div className="z-20 relative">
            <div
              className={`w-[10px] h-[10px] rounded-full ${
                orderStatus.status === "shipping" ||
                orderStatus.status === "delivered"
                  ? "bg-red-500 border-2 border-red-500"
                  : "bg-white border-2 border-red-100"
              }`}
            ></div>
            {(orderStatus.status === "shipping" ||
              orderStatus.status === "delivered") && (
              <CheckCircle className="absolute -top-2 -left-2 h-5 w-5 text-green-500" />
            )}
          </div>

          <div className="z-20 relative">
            <div
              className={`w-[10px] h-[10px] rounded-full ${
                orderStatus.status === "delivered"
                  ? "bg-red-500 border-2 border-red-500"
                  : "bg-white border-2 border-red-100"
              }`}
            ></div>
            {orderStatus.status === "delivered" && (
              <CheckCircle className="absolute -top-2 -left-2 h-5 w-5 text-green-500" />
            )}
          </div>
        </div>

        {/* Status Icons and Labels */}
        <div className="flex justify-between text-xs">
          <div className="text-center w-16 -ml-2">
            <div className="flex justify-center mb-2">
              <div className="w-8 h-8 rounded-md flex items-center justify-center">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <span className="font-medium">Order Placed</span>
          </div>

          <div className="text-center w-16 -ml-2">
            <div className="flex justify-center mb-2">
              <div className="w-8 h-8 rounded-md flex items-center justify-center">
                <Package className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <span className="font-medium">Packaging</span>
          </div>

          <div className="text-center w-16 -ml-2">
            <div className="flex justify-center mb-2">
              <div className="w-8 h-8  rounded-md flex items-center justify-center">
                <Truck className="w-5 h-5 text-red-200" />
              </div>
            </div>
            <span className="text-gray-400">On The Road</span>
          </div>

          <div className="text-center w-16 -ml-2">
            <div className="flex justify-center mb-2">
              <div className="w-8 h-8  rounded-md flex items-center justify-center">
                <Award className="w-5 h-5 text-red-200" />
              </div>
            </div>
            <span className="text-gray-400">Delivered</span>
          </div>
        </div>
      </div>
    </div>
  );
}
