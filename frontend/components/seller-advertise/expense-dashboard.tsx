import { OrderChart } from "./order-chart";
import { SpendingChart } from "./spending-chart";
import {
  orderData,
  spendingData,
  highlightedDate,
  highlightedAmount,
} from "./expense-data";

export function ExpenseDashboard() {
  return (
    <div className="p-6 bg-white rounded-lg">
      <h1 className="text-2xl font-semibold mb-6">Expense per products</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 border rounded-lg ">
          <OrderChart
            data={orderData}
            highlightedDate={highlightedDate}
            highlightedAmount={highlightedAmount}
          />
        </div>
        <div className="border rounded-lg ">
          <SpendingChart data={spendingData} />
        </div>
      </div>
    </div>
  );
}
