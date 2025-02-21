import type { TopSellingProduct } from "./analytics-data";

interface TopSellingTableProps {
  products: TopSellingProduct[];
}

export function TopSellingTable({ products }: TopSellingTableProps) {
  return (
    <div>
      <h2 className="text-xl mb-4">
        Top Selling Products through ads
      </h2>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left py-2 text-[#848484] font-normal">Name</th>
            <th className="text-left py-2 text-[#848484] font-normal">Price</th>
            <th className="text-left py-2 text-[#848484] font-normal">
              Quantity
            </th>
            <th className="text-left py-2 text-[#848484] font-normal">
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.name}>
              <td className="py-2 text-[#848484]">{product.name}</td>
              <td className="py-2 text-[#171A1F]">
                ${product.price.toFixed(2)}
              </td>
              <td className="py-2 text-[#171A1F]">{product.quantity}</td>
              <td className="py-2 text-[#171A1F]">
                ${product.amount.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
