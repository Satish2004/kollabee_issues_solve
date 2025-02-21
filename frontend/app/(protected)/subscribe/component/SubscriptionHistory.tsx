"use client";

import { Button } from "@/components/ui/button";
import { SubscriptionTransaction } from "@prisma/client";
import React, { useState } from "react";

const SubscriptionHistory = ({
  transactions,
}: {
  transactions: SubscriptionTransaction[];
}) => {
  const [showHistory, setShowHistory] = useState(false);

  const handleViewHistory = () => {
    setShowHistory((prevShowHistory) => !prevShowHistory);
  };

  return (
    <div className="mt-6">
      <Button className="w-full mb-4" variant="default" onClick={handleViewHistory}>
        {showHistory
          ? "Hide Subscription History"
          : "View Subscription History"}
      </Button>

      {showHistory && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Subscription History:</h2>
          <ul className="list-none space-y-4">
            {transactions.map((transaction: SubscriptionTransaction) => (
              <li key={transaction.id} className="flex justify-between items-center p-4 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                <span className="font-medium text-gray-700">{transaction.type}</span>
                <span className="text-gray-500">{transaction.amount}</span>
                <span className="text-gray-400">
                  {transaction.subscriptionExpiry
                    ? new Date(
                        transaction.subscriptionExpiry
                      ).toLocaleDateString()
                    : "N/A"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SubscriptionHistory;
