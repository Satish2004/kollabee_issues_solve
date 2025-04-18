import { Users, DollarSign, TrendingUp } from "lucide-react"

export default function SuppliersTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Suppliers Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">TOTAL SUPPLIERS</p>
              <p className="text-2xl font-bold mt-1">23,000</p>
              <div className="flex items-center mt-1">
                <span className="text-xs font-medium text-green-500 bg-green-50 px-2 py-0.5 rounded">+10.3%</span>
              </div>
            </div>
            <div className="bg-red-50 p-3 rounded-full">
              <Users className="w-6 h-6 text-red-500" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
            <span>+123 from last month</span>
            <span className="ml-1">→</span>
          </p>
        </div>

        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">SUPPLIERS SOLD WORTH</p>
              <p className="text-2xl font-bold mt-1">$23M</p>
              <div className="flex items-center mt-1">
                <span className="text-xs font-medium text-green-500 bg-green-50 px-2 py-0.5 rounded">+9.4%</span>
              </div>
            </div>
            <div className="bg-red-50 p-3 rounded-full">
              <DollarSign className="w-6 h-6 text-red-500" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
            <span>+$3M from last month</span>
            <span className="ml-1">→</span>
          </p>
        </div>
      </div>
    </div>
  )
}
