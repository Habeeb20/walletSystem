/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { format } from "date-fns";
import { formatNumbersWithDecimal } from "../../component/formtNumber";

function TransactionHistory({ allTransactions = [], currency = "₦" }) {
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const getStatusColor = (type) => {
    return type === "credit" ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50";
  };

  const getStatusIcon = (type) => {
    return type === "credit" ? "↑" : "↓";
  };

  const closeModal = () => setSelectedTransaction(null);

  // Filter out zero-amount transactions
  const filteredTransactions = allTransactions.filter(
    (transaction) => transaction.amount > 0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mt-5">Transaction History</h1>
          <p className="text-gray-600 mt-1">All your wallet activities in one place</p>
        </div>

        {/* Transaction List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {filteredTransactions.length === 0 ? (
            <div className="py-16 text-center">
              <div className="text-gray-400 text-lg">No transactions yet</div>
              <p className="text-gray-500 mt-2">Your transactions will appear here</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredTransactions
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .map((transaction) => (
                  <button
                    key={transaction.id || transaction.reference}
                    onClick={() => setSelectedTransaction(transaction)}
                    className="w-full text-left hover:bg-gray-50 transition-colors duration-200 px-6 py-5 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold ${getStatusColor(
                          transaction.type
                        )}`}
                      >
                        {getStatusIcon(transaction.type)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {transaction.details?.description ||
                            transaction.provider ||
                            transaction.reference ||
                            "Transaction"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {format(new Date(transaction.timestamp || Date.now()), "MMM d, yyyy • h:mm a")}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={`font-semibold text-lg ${
                          transaction.type === "credit" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {transaction.type === "credit" ? "+" : "-"}
                        {currency}
                        {formatNumbersWithDecimal(transaction.amount)}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">{transaction.type}</div>
                    </div>
                  </button>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={closeModal}>
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="text-sm text-gray-500">Transaction Details</div>
                <div className="text-xl font-bold text-gray-900 mt-1">
                  {selectedTransaction.details?.description ||
                    selectedTransaction.provider ||
                    selectedTransaction.reference ||
                    "Transaction"}
                </div>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                ✕
              </button>
            </div>

            {/* Amount */}
            <div className="text-center py-6 border-y border-gray-100">
              <div className="text-4xl font-bold">
                <span
                  className={
                    selectedTransaction.type === "credit" ? "text-green-600" : "text-red-600"
                  }
                >
                  {selectedTransaction.type === "credit" ? "+" : "-"}
                  {currency}
                  {formatNumbersWithDecimal(selectedTransaction.amount)}
                </span>
              </div>
              <div className="text-sm text-gray-600 mt-2 capitalize">
                {selectedTransaction.type === "credit" ? "Received" : "Sent"}
              </div>
            </div>

            {/* Details Grid */}
            <div className="mt-6 space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Date & Time</span>
                <span className="font-medium text-gray-900">
                  {format(new Date(selectedTransaction.timestamp || Date.now()), "EEEE, MMMM d, yyyy")}
                  <br />
                  {format(new Date(selectedTransaction.timestamp || Date.now()), "h:mm a")}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Reference ID</span>
                <span className="font-medium text-gray-900">
                  {selectedTransaction.reference || "N/A"}
                </span>
              </div>

              {selectedTransaction.provider && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Provider</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {selectedTransaction.provider}
                  </span>
                </div>
              )}

              {selectedTransaction.details?.phone && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Phone Number</span>
                  <span className="font-medium text-gray-900">
                    {selectedTransaction.details.phone}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    selectedTransaction.type === "credit"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {selectedTransaction.type === "credit" ? "Successful (Credit)" : "Successful (Debit)"}
                </span>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={closeModal}
              className="mt-8 w-full bg-gray-900 hover:bg-black text-white font-medium py-3 rounded-xl transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TransactionHistory;