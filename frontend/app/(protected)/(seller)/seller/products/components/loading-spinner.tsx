export function LoadingSpinner({ isDraftView = false }) {
  // Create an array of 5 items to represent loading rows
  const skeletonRows = Array(5).fill(null);

  // Determine if we're in draft view based on the URL

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
              Products
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
              Price
            </th>
            {!isDraftView ? (
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                Stock
              </th>
            ) : null}
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
              Created
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
              Status
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {skeletonRows.map((_, index) => (
            <tr key={index} className="border-t animate-pulse">
              <td className="px-4 py-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </td>
              <td className="px-4 py-4">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </td>
              {!isDraftView && (
                <td className="px-4 py-4">
                  <div className="h-4 bg-gray-200 rounded w-12"></div>
                </td>
              )}
              <td className="px-4 py-4">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="flex space-x-2 w-full gap-3">
                  <div className="h-4 w-4 bg-gray-200 rounded"></div>
                  <div className="h-4 w-4 bg-gray-200 rounded"></div>
                  <div className="h-4 w-4 bg-gray-200 rounded"></div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
